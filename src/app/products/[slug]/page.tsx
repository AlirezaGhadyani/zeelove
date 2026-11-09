import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog';
import { INVENTORY_TOKENS } from '@/modules/inventory';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { ProductGallery } from '@/components/storefront/product-gallery';
import { ProductVariantPicker } from '@/components/storefront/product-variant-picker';
import { ProductDetailTabs } from '@/components/storefront/product-detail-tabs';
import { ProductCard } from '@/shared/ui/commerce/product-card';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const container = createAppContainer();
  const getProduct = container.resolve(CATALOG_TOKENS.GetProductBySlugUseCase);
  const res = await getProduct.execute({ slug: decodeURIComponent(slug) });
  if (res.isErr || !res.value) return { title: 'محصول' };

  const p = res.value;
  const metaTitle = p.seo.metaTitle || p.title;
  const metaDesc = p.seo.metaDescription || p.shortDescription || p.description;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: `${metaTitle} | زیلاو`,
      description: metaDesc,
      images: p.images.map((img) => img.url),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const container = createAppContainer();
  const getProduct = container.resolve(CATALOG_TOKENS.GetProductBySlugUseCase);
  const prisma = container.resolve(TOKENS.Prisma);
  const inventoryRepo = container.resolve(INVENTORY_TOKENS.InventoryRepository);

  const res = await getProduct.execute({ slug: decodeURIComponent(slug) });
  if (res.isErr || !res.value) notFound();
  const product = res.value;

  const [categoryData, brandData, attributesMeta, relatedProductsRes] = await Promise.all([
    product.categoryId ? prisma.category.findUnique({ where: { id: product.categoryId } }) : null,
    product.brandId ? prisma.brand.findUnique({ where: { id: product.brandId } }) : null,
    prisma.attribute.findMany(),
    product.categoryId
      ? prisma.product.findMany({
          where: { categoryId: product.categoryId, id: { not: product.id }, status: 'ACTIVE' },
          include: { variants: true, images: { orderBy: { displayOrder: 'asc' } } },
          take: 4,
        })
      : [],
  ]);

  const inventoryMap = await inventoryRepo.findByVariantIds(product.variants.map((v) => v.id));
  const variantsData = product.variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    priceToman: v.price.amount,
    compareAtPriceToman: v.compareAtPrice?.amount,
    isDefault: v.isDefault,
    options: v.options,
    stock: inventoryMap.get(v.id)?.quantity ?? 10,
  }));

  const attrMap = new Map(attributesMeta.map((a) => [a.id, a.name]));
  const formattedAttributes = product.attributeValues.map((a) => ({
    name: attrMap.get(a.attributeId) || a.attributeId,
    value: a.value,
  }));

  const galleryImages = product.images.map((img) => ({
    url: img.url,
    altText: img.altText ?? undefined,
    isMain: img.isMain,
  }));

  const defaultV = product.defaultVariant || product.variants[0];
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description || product.shortDescription,
    sku: defaultV?.sku,
    offers: {
      '@type': 'Offer',
      price: defaultV?.price.amount,
      priceCurrency: 'IRR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <StorefrontShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">خانه</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <Link href="/products" className="hover:text-white transition-colors">محصولات</Link>
          {categoryData && (
            <>
              <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
              <Link href={`/category/${categoryData.slug}`} className="hover:text-white transition-colors">
                {categoryData.name}
              </Link>
            </>
          )}
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-amber-400 font-bold truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <ProductGallery images={galleryImages} title={product.title} />

          <div className="space-y-6">
            <div>
              {brandData && (
                <Link
                  href={`/brand/${brandData.slug}`}
                  className="text-xs font-semibold text-amber-500 hover:underline mb-1 inline-block"
                >
                  {brandData.name}
                </Link>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                {product.title}
              </h1>
              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            <ProductVariantPicker
              productId={product.id}
              productTitle={product.title}
              variants={variantsData}
            />
          </div>
        </div>

        <ProductDetailTabs
          description={product.description}
          attributes={formattedAttributes}
        />

        {relatedProductsRes.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-neutral-800">
            <h3 className="text-xl font-bold text-white">کالاهای مرتبط و پیشنهادی</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProductsRes.map((p) => {
                const defVar = p.variants?.find((v: { isDefault: boolean }) => v.isDefault) || p.variants?.[0];
                const img = p.images?.[0]?.url;
                return (
                  <Link key={p.id} href={`/products/${p.slug}`} className="block">
                    <ProductCard
                      id={p.id}
                      title={p.title}
                      price={defVar?.price ?? 0}
                      compareAtPrice={defVar?.compareAtPrice ?? undefined}
                      imageUrl={img}
                      stock={10}
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </StorefrontShell>
  );
}
