import React from 'react';
import type { Metadata } from 'next';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';
import { CATALOG_TOKENS } from '@/modules/catalog';
import { TOKENS } from '@/shared/infrastructure/container/tokens';
import { StorefrontShell } from '@/components/storefront/storefront-shell';
import { ProductsListingView, type ListingProductItem } from '@/components/storefront/products-listing-view';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `نتایج جستجو برای «${q}»` : 'جستجوی محصولات',
    description: `جستجو در بین هزاران کالای باکیفیت و اصل در فروشگاه زیلاو`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams;
  const query = search.q?.trim() || '';

  const container = createAppContainer();
  const searchPort = container.resolve(CATALOG_TOKENS.SearchPort);
  const listProducts = container.resolve(CATALOG_TOKENS.ListProductsUseCase);
  const prisma = container.resolve(TOKENS.Prisma);

  const categoryId = search.categoryId;
  const brandId = search.brandId;
  const minPrice = search.minPrice ? Number(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? Number(search.maxPrice) : undefined;
  const page = search.page ? Number(search.page) : 1;
  const limit = 12;

  let products: ListingProductItem[] = [];
  let total = 0;

  if (query) {
    const searchRes = await searchPort.search(query, {
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      page,
      limit,
    });
    total = searchRes.total;
    products = searchRes.items.map((p) => {
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
  } else {
    const listRes = await listProducts.execute({
      status: 'ACTIVE',
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      page,
      limit,
    });
    if (listRes.isOk) {
      total = listRes.value.total;
      products = listRes.value.products.map((p) => {
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
    }
  }

  const [categoriesData, brandsData] = await Promise.all([
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

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">
            {query ? (
              <>
                نتایج جستجو برای <span className="text-amber-400">«{query}»</span>
              </>
            ) : (
              'جستجوی پیشرفته در کاتالوگ زیلاو'
            )}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            تعداد {toPersianDigits(total)} کالا یافت شد
          </p>
        </div>

        <ProductsListingView
          products={products}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          categories={categoriesData}
          brands={brandsData}
          currentCategoryId={categoryId}
          currentBrandId={brandId}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentSort="newest"
        />
      </div>
    </StorefrontShell>
  );
}
