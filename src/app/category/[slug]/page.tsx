import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { ProductsListingView, type ListingProductItem } from '@/components/storefront/products-listing-view';
import { CONTENT_TOKENS } from '@/modules/content/infrastructure/container/register-content';
import { PageRenderer } from '@/modules/content/rendering/page-renderer';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    brandId?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const container = createAppContainer();
  const prisma = container.resolve(TOKENS.Prisma);
  const category = await prisma.category.findUnique({ where: { slug: decodedSlug } });

  if (!category) {
    return { title: 'دسته‌بندی' };
  }

  return {
    title: category.name,
    description: category.description || `خرید اینترنتی انواع ${category.name} در فروشگاه آنلاین زیلاو`,
    openGraph: {
      title: `${category.name} | زیلاو`,
      description: category.description || `خرید اینترنتی انواع ${category.name} در فروشگاه آنلاین زیلاو`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const search = await searchParams;

  const container = createAppContainer();
  const prisma = container.resolve(TOKENS.Prisma);
  const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);

  const category = await prisma.category.findUnique({
    where: { slug: decodedSlug },
    include: { parent: true, children: true },
  });

  if (!category) {
    notFound();
  }

  const brandId = search.brandId;
  const minPrice = search.minPrice ? Number(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? Number(search.maxPrice) : undefined;
  const inStockOnly = search.inStockOnly === 'true';
  const sort = (search.sort as 'newest' | 'price_asc' | 'price_desc' | 'title') || 'newest';
  const page = search.page ? Number(search.page) : 1;
  const limit = 12;

  const [productsRes, categoriesData, brandsData] = await Promise.all([
    listProducts.execute({
      status: 'ACTIVE',
      categoryId: category.id,
      brandId,
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
    const mainImg = p.mainImage ?? p.images[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug.value,
      priceToman: defaultV?.price.amount ?? 0,
      compareAtPriceToman: defaultV?.compareAtPrice?.amount,
      imageUrl: mainImg?.url,
      categoryName: category.name,
      inStock: true,
    };
  });

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: process.env.APP_URL || 'https://zeelove.ir' },
      { '@type': 'ListItem', position: 2, name: category.name, item: `${process.env.APP_URL || 'https://zeelove.ir'}/category/${category.slug}` },
    ],
  };

  const [topCms, bottomCms] = await Promise.all([
    container.resolve(CONTENT_TOKENS.GetPageUseCase).execute({ slug: `cat-${decodedSlug}-top` }),
    container.resolve(CONTENT_TOKENS.GetPageUseCase).execute({ slug: `cat-${decodedSlug}-bottom` }),
  ]);

  return (
    <StorefrontShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">خانه</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <Link href="/products" className="hover:text-white transition-colors">محصولات</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-amber-400 font-bold">{category.name}</span>
        </nav>

        {topCms.isOk && topCms.value.rows.length > 0 && (
          <PageRenderer rows={topCms.value.rows} />
        )}

        <div>
          <h1 className="text-2xl font-black text-white">{category.name}</h1>
          {category.description && (
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{category.description}</p>
          )}
        </div>

        <ProductsListingView
          products={listingItems}
          total={output.total}
          currentPage={output.page}
          totalPages={output.totalPages}
          categories={categoriesData}
          brands={brandsData}
          currentCategoryId={category.id}
          currentBrandId={brandId}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentInStockOnly={inStockOnly}
          currentSort={sort}
        />

        {bottomCms.isOk && bottomCms.value.rows.length > 0 && (
          <PageRenderer rows={bottomCms.value.rows} />
        )}
      </div>
    </StorefrontShell>
  );
}
