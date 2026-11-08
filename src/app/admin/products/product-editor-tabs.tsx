'use client';

import React from 'react';
import type { CategoryItem } from '../categories/categories-client';
import type { BrandItem } from '../brands/brands-client';
import type { ProductVariantData } from './product-editor-modal';

export function GeneralTab({
  title, setTitle,
  slug, setSlug,
  status, setStatus,
  categoryId, setCategoryId,
  brandId, setBrandId,
  shortDescription, setShortDescription,
  description, setDescription,
  categories, brands,
}: {
  title: string; setTitle: (v: string) => void;
  slug: string; setSlug: (v: string) => void;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'; setStatus: (v: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') => void;
  categoryId: string; setCategoryId: (v: string) => void;
  brandId: string; setBrandId: (v: string) => void;
  shortDescription: string; setShortDescription: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  categories: CategoryItem[];
  brands: BrandItem[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold block mb-1">عنوان کالا *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          placeholder="مثال: پیراهن لینن نخی مردانه زیلاو"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold block mb-1">اسلاگ (شناسه انگلیسی/فارسی URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm font-mono text-left"
            dir="ltr"
            placeholder="men-linen-shirt"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">وضعیت انتشار</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            <option value="DRAFT">پیش‌نویس (DRAFT)</option>
            <option value="ACTIVE">فعال و در دسترس (ACTIVE)</option>
            <option value="ARCHIVED">بایگانی شده (ARCHIVED)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold block mb-1">دسته‌بندی</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">برند</label>
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            <option value="">بدون برند</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold block mb-1">خلاصه کوتاه کالا</label>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          placeholder="توضیح کوتاه ۱ خطی در کارت محصول"
        />
      </div>
      <div>
        <label className="text-xs font-semibold block mb-1">توضیحات تکمیلی</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
        />
      </div>
    </div>
  );
}

export function PricingTab({
  variants, setVariants,
}: {
  variants: ProductVariantData[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantData[]>>;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">قیمت تنوع پیش‌فرض کالا (به تومان)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">قیمت فروش (تومان) *</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={variants[0]?.priceToman || 0}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 0;
              setVariants((prev) => {
                const copy = [...prev];
                if (copy[0]) copy[0].priceToman = val;
                return copy;
              });
            }}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">قیمت خط‌خورده / قبل از تخفیف (تومان)</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={variants[0]?.compareAtPriceToman || ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
              setVariants((prev) => {
                const copy = [...prev];
                if (copy[0]) copy[0].compareAtPriceToman = val;
                return copy;
              });
            }}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
          />
        </div>
      </div>
    </div>
  );
}
