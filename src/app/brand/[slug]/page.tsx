import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Globe, ChevronLeft } from 'lucide-react';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { ProductsListingView, type ListingProductItem } from '@/components/storefront/products-listing-view';

export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const container = createAppContainer();
  const prisma = container.resolve(TOKENS.Prisma);
  const brand = await prisma.brand.findUnique({ where: { slug: decodedSlug } });

  if (!brand) return { title: 'برند' };

  return {
    title: brand.name,
    description: brand.description || `خرید محصولات اصل برند ${brand.name} در فروشگاه زیلاو`,
    openGraph: {
      title: `${brand.name} | زیلاو`,
      description: brand.description || `خرید محصولات اصل برند ${brand.name} در فروشگاه زیلاو`,
    },
  };
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const search = await searchParams;

  const container = createAppContainer();
  const prisma = container.resolve(TOKENS.Prisma);
  const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);

  const brand = await prisma.brand.findUnique({ where: { slug: decodedSlug } });
  if (!brand) notFound();

  const categoryId = search.categoryId;
  const minPrice = search.minPrice ? Number(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? Number(search.maxPrice) : undefined;
  const inStockOnly = search.inStockOnly === 'true';
  const sort = (search.sort as 'newest' | 'price_asc' | 'price_desc' | 'title') || 'newest';
  const page = search.page ? Number(search.page) : 1;
  const limit = 12;

  const [productsRes, categoriesData, brandsData] = await Promise.all([
    listProducts.execute({
      status: 'ACTIVE',
      brandId: brand.id,
      categoryId,
      minPrice,
      maxPrice,
      inStockOnly,
      sortBy: sort,
      page,
      limit,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const output = productsRes.isOk
    ? productsRes.value
    : { products: [], total: 0, page: 1, limit, totalPages: 1 };

  const listingItems: ListingProductItem[] = output.products.map((p) => {
    const defaultV = p.defaultVariant;
    const mainImg = p.images.find((img) => img.isMain) ?? p.images[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug.value,
      priceToman: defaultV?.price.amount ?? 0,
      compareAtPriceToman: defaultV?.compareAtPrice?.amount,
      imageUrl: mainImg?.url,
      brandName: brand.name,
      inStock: true,
    };
  });

  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">خانه</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <Link href="/products" className="hover:text-white transition-colors">برندها</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-amber-400 font-bold">{brand.name}</span>
        </nav>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">{brand.name}</h1>
            {brand.description && (
              <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">{brand.description}</p>
            )}
          </div>
          {brand.websiteUrl && (
            <a
              href={brand.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-xs text-amber-400 hover:text-white border border-neutral-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>وب‌سایت رسمی برند</span>
            </a>
          )}
        </div>

        <ProductsListingView
          products={listingItems}
          total={output.total}
          currentPage={output.page}
          totalPages={output.totalPages}
          categories={categoriesData}
          brands={brandsData}
          currentCategoryId={categoryId}
          currentBrandId={brand.id}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentInStockOnly={inStockOnly}
          currentSort={sort}
        />
      </div>
    </StorefrontShell>
  );
}
