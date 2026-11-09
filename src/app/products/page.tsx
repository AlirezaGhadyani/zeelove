import React from 'react';
import type { Metadata } from 'next';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { ProductsListingView, type ListingProductItem } from '@/components/storefront/products-listing-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'همه محصولات',
  description: 'خرید اینترنتی انواع پوشاک مردانه، زنانه، کیف، کفش و اکسسوری اورجینال در زیلاو',
  openGraph: {
    title: 'همه محصولات | زیلاو',
    description: 'خرید اینترنتی انواع پوشاک مردانه، زنانه، کیف، کفش و اکسسوری اورجینال در زیلاو',
  },
};

interface ProductsPageProps {
  searchParams: Promise<{
    categoryId?: string;
    brandId?: string;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const container = createAppContainer();
  const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);
  const prisma = container.resolve(TOKENS.Prisma);

  const categoryId = params.categoryId;
  const brandId = params.brandId;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const inStockOnly = params.inStockOnly === 'true';
  const sort = (params.sort as 'newest' | 'price_asc' | 'price_desc' | 'title') || 'newest';
  const page = params.page ? Number(params.page) : 1;
  const limit = 12;

  const [productsRes, categoriesData, brandsData] = await Promise.all([
    listProducts.execute({
      status: 'ACTIVE',
      categoryId,
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
      inStock: true,
    };
  });

  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">فروشگاه و محصولات زیلاو</h1>
          <p className="text-xs text-neutral-400 mt-1">
            مجموعه برترین کالاهای مد و پوشاک با تضمین اصالت و بهترین قیمت
          </p>
        </div>

        <ProductsListingView
          products={listingItems}
          total={output.total}
          currentPage={output.page}
          totalPages={output.totalPages}
          categories={categoriesData}
          brands={brandsData}
          currentCategoryId={categoryId}
          currentBrandId={brandId}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentInStockOnly={inStockOnly}
          currentSort={sort}
        />
      </div>
    </StorefrontShell>
  );
}
