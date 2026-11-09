'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter, Check } from 'lucide-react';
import { Button } from '@/shared/ui/primitives/button';

interface FilterCategory {
  id: string;
  name: string;
  slug: string;
}

interface FilterBrand {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: FilterCategory[];
  brands: FilterBrand[];
  currentCategoryId?: string;
  currentBrandId?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentInStockOnly?: boolean;
  onApplyMobile?: () => void;
}

export function ProductFilters({
  categories,
  brands,
  currentCategoryId,
  currentBrandId,
  currentMinPrice,
  currentMaxPrice,
  currentInStockOnly,
  onApplyMobile,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categoryId, setCategoryId] = useState(currentCategoryId || '');
  const [brandId, setBrandId] = useState(currentBrandId || '');
  const [minPrice, setMinPrice] = useState(currentMinPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice?.toString() || '');
  const [inStockOnly, setInStockOnly] = useState(currentInStockOnly || false);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (categoryId) params.set('categoryId', categoryId);
    else params.delete('categoryId');

    if (brandId) params.set('brandId', brandId);
    else params.delete('brandId');

    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    if (inStockOnly) params.set('inStockOnly', 'true');
    else params.delete('inStockOnly');

    router.push(`${pathname}?${params.toString()}`);
    if (onApplyMobile) onApplyMobile();
  };

  const clearFilters = () => {
    setCategoryId('');
    setBrandId('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    router.push(pathname);
    if (onApplyMobile) onApplyMobile();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>فیلترها</span>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
        >
          حذف فیلترها
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-neutral-300 block">دسته‌بندی</span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white cursor-pointer">
            <input
              type="radio"
              name="filterCategory"
              checked={!categoryId}
              onChange={() => setCategoryId('')}
              className="rounded-full text-amber-500 bg-neutral-900 border-neutral-800"
            />
            <span>همه دسته‌ها</span>
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white cursor-pointer">
              <input
                type="radio"
                name="filterCategory"
                checked={categoryId === c.id}
                onChange={() => setCategoryId(c.id)}
                className="rounded-full text-amber-500 bg-neutral-900 border-neutral-800"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-neutral-300 block">برند</span>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white cursor-pointer">
            <input
              type="radio"
              name="filterBrand"
              checked={!brandId}
              onChange={() => setBrandId('')}
              className="rounded-full text-amber-500 bg-neutral-900 border-neutral-800"
            />
            <span>همه برندها</span>
          </label>
          {brands.map((b) => (
            <label key={b.id} className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white cursor-pointer">
              <input
                type="radio"
                name="filterBrand"
                checked={brandId === b.id}
                onChange={() => setBrandId(b.id)}
                className="rounded-full text-amber-500 bg-neutral-900 border-neutral-800"
              />
              <span>{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t border-neutral-800">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-semibold text-neutral-300">فقط کالاهای موجود</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded text-amber-500 bg-neutral-900 border-neutral-800 focus:ring-0"
          />
        </label>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-neutral-800">
        <span className="text-xs font-bold text-neutral-300 block">محدوده قیمت (تومان)</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="از (حداقل)"
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 font-mono"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="تا (حداکثر)"
            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 font-mono"
          />
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full flex items-center justify-center gap-2">
        <Check className="w-4 h-4" />
        <span>اعمال فیلترها</span>
      </Button>
    </div>
  );
}
