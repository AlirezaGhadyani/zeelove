import { NextRequest, NextResponse } from 'next/server';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog/infrastructure/container/register-catalog';
import { INVENTORY_TOKENS } from '@/modules/inventory/infrastructure/container/register-inventory';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const container = createAppContainer();

  const search = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const brandId = searchParams.get('brandId') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const inStockOnly = searchParams.get('inStockOnly') === 'true';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;
  const sortBy = (searchParams.get('sortBy') as 'newest' | 'price_asc' | 'price_desc' | 'title') || 'newest';

  let products;
  let total = 0;

  if (search && search.trim().length > 0) {
    const searchPort = container.resolve(CATALOG_TOKENS.SearchPort);
    const searchResult = await searchPort.search(search, {
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      page,
      limit,
    });
    products = searchResult.items;
    total = searchResult.total;
  } else {
    const listUseCase = container.resolve(CATALOG_TOKENS.ListProductsUseCase);
    const result = await listUseCase.execute({
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      status: 'ACTIVE',
      inStockOnly,
      sortBy,
      page,
      limit,
    });
    if (result.isErr) {
      return NextResponse.json({ error: 'Failed to list products' }, { status: 500 });
    }
    products = result.value.products;
    total = result.value.total;
  }

  // Fetch stock levels for all product variants
  const inventoryRepo = container.resolve(INVENTORY_TOKENS.InventoryRepository);
  const allVariantIds = products.flatMap((p) => p.variants.map((v) => v.id));
  const inventoryMap = await inventoryRepo.findByVariantIds(allVariantIds);

  const items = products.map((p) => {
    const defaultVariant = p.defaultVariant;
    const defaultVariantStock = defaultVariant ? inventoryMap.get(defaultVariant.id)?.quantity ?? 0 : 0;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug.value,
      description: p.description,
      shortDescription: p.shortDescription,
      status: p.status,
      categoryId: p.categoryId,
      brandId: p.brandId,
      seo: p.seo.toJSON(),
      images: p.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        isMain: img.isMain,
        displayOrder: img.displayOrder,
      })),
      defaultVariant: defaultVariant
        ? {
            id: defaultVariant.id,
            sku: defaultVariant.sku,
            priceToman: defaultVariant.price.amount,
            formattedPrice: defaultVariant.price.format(),
            compareAtPriceToman: defaultVariant.compareAtPrice?.amount,
            formattedCompareAtPrice: defaultVariant.compareAtPrice?.format(),
            hasDiscount: defaultVariant.hasDiscount(),
            discountPercentage: defaultVariant.discountPercentage(),
            options: defaultVariant.options,
            stock: defaultVariantStock,
            inStock: defaultVariantStock > 0,
          }
        : null,
      variantsCount: p.variants.length,
      createdAt: p.createdAt.toISOString(),
    };
  });

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  });
}
