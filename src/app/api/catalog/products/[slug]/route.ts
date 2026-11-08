import { NextRequest, NextResponse } from 'next/server';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';
import { INVENTORY_TOKENS } from '@/modules/inventory/infrastructure/container/register-inventory';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const container = createAppContainer();

  const getProduct = container.resolve(CATALOG_TOKENS.GetProductBySlugUseCase);
  const result = await getProduct.execute({ slug });

  if (result.isErr) {
    return NextResponse.json({ error: result.error.message }, { status: 404 });
  }

  const p = result.value;

  // Retrieve category and brand if present
  let category = null;
  if (p.categoryId) {
    const categoryRepo = container.resolve(CATALOG_TOKENS.CategoryRepository);
    const cat = await categoryRepo.findById(p.categoryId);
    if (cat) {
      category = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug.value,
      };
    }
  }

  let brand = null;
  if (p.brandId) {
    const brandRepo = container.resolve(CATALOG_TOKENS.BrandRepository);
    const b = await brandRepo.findById(p.brandId);
    if (b) {
      brand = {
        id: b.id,
        name: b.name,
        slug: b.slug.value,
        logo: b.logo,
      };
    }
  }

  // Retrieve inventory for all variants
  const inventoryRepo = container.resolve(INVENTORY_TOKENS.InventoryRepository);
  const variantIds = p.variants.map((v) => v.id);
  const inventoryMap = await inventoryRepo.findByVariantIds(variantIds);

  const variants = p.variants.map((v) => {
    const level = inventoryMap.get(v.id);
    const qty = level ? level.quantity : 0;
    const safety = level ? level.safetyStock : 0;

    return {
      id: v.id,
      sku: v.sku,
      priceToman: v.price.amount,
      formattedPrice: v.price.format(),
      compareAtPriceToman: v.compareAtPrice?.amount,
      formattedCompareAtPrice: v.compareAtPrice?.format(),
      hasDiscount: v.hasDiscount(),
      discountPercentage: v.discountPercentage(),
      barcode: v.barcode,
      weightGrams: v.weightGrams,
      isDefault: v.isDefault,
      options: v.options,
      stock: qty,
      safetyStock: safety,
      availableStock: Math.max(0, qty - safety),
      inStock: qty > safety,
    };
  });

  return NextResponse.json({
    id: p.id,
    title: p.title,
    slug: p.slug.value,
    description: p.description,
    shortDescription: p.shortDescription,
    status: p.status,
    category,
    brand,
    seo: p.seo.toJSON(),
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      isMain: img.isMain,
      displayOrder: img.displayOrder,
    })),
    attributes: p.attributeValues.map((attr) => ({
      attributeId: attr.attributeId,
      value: attr.value,
    })),
    variants,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });
}
