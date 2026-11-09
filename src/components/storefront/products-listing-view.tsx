'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Filter, X, Package } from 'lucide-react';
import { ProductCard } from '@/shared/ui/commerce/product-card';
import { ProductFilters } from './product-filters';
import { ProductSort } from './product-sort';
import { ListingPagination } from './listing-pagination';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';

export interface ListingProductItem {
  id: string;
  title: string;
  slug: string;
  priceToman: number;
  compareAtPriceToman?: number;
  imageUrl?: string;
  categoryName?: string;
  brandName?: string;
  inStock: boolean;
}

interface ProductsListingViewProps {
  products: ListingProductItem[];
  total: number;
  currentPage: number;
  totalPages: number;
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string }>;
  currentCategoryId?: string;
  currentBrandId?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentInStockOnly?: boolean;
  currentSort?: string;
}

export function ProductsListingView({
  products,
  total,
  currentPage,
  totalPages,
  categories,
  brands,
  currentCategoryId,
  currentBrandId,
  currentMinPrice,
  currentMaxPrice,
  currentInStockOnly,
  currentSort = 'newest',
}: ProductsListingViewProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block lg:col-span-1 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sticky top-24">
        <ProductFilters
          categories={categories}
          brands={brands}
          currentCategoryId={currentCategoryId}
          currentBrandId={currentBrandId}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
          currentInStockOnly={currentInStockOnly}
        />
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Top Control Bar: Total Count + Mobile Filter Trigger + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <span className="text-xs text-neutral-400">
              نمایش <span className="text-white font-bold">{toPersianDigits(total)}</span> کالا
            </span>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-xs font-semibold text-white border border-neutral-700"
            >
              <Filter className="w-3.5 h-3.5 text-amber-500" />
              <span>فیلترها</span>
            </button>
          </div>

          <ProductSort currentSort={currentSort} />
        </div>

        {/* Product Cards Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="block">
                <ProductCard
                  id={p.id}
                  title={p.title}
                  category={p.categoryName}
                  price={p.priceToman}
                  compareAtPrice={p.compareAtPriceToman}
                  imageUrl={p.imageUrl}
                  stock={p.inStock ? 10 : 0}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 space-y-3">
            <Package className="w-10 h-10 mx-auto text-neutral-600" />
            <h3 className="text-base font-bold text-white">محصولی با این مشخصات یافت نشد</h3>
            <p className="text-xs text-neutral-400">
              لطفاً فیلترهای انتخابی یا عبارت جستجوی خود را تغییر دهید.
            </p>
          </div>
        )}

        {/* Pagination */}
        <ListingPagination currentPage={currentPage} totalPages={totalPages} />
      </div>

      {/* Mobile Filters Slide-over Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative mr-auto w-4/5 max-w-sm bg-neutral-950 border-s border-neutral-800 h-full p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <span className="font-bold text-sm text-white">فیلترهای کالا</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters
                categories={categories}
                brands={brands}
                currentCategoryId={currentCategoryId}
                currentBrandId={currentBrandId}
                currentMinPrice={currentMinPrice}
                currentMaxPrice={currentMaxPrice}
                currentInStockOnly={currentInStockOnly}
                onApplyMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
