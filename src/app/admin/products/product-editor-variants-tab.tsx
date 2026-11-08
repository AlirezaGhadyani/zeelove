'use client';

import React from 'react';
import { Button } from '@/shared/ui/primitives/button';
import type { ProductVariantData } from './product-editor-modal';

export function VariantsTab({
  variants, setVariants,
}: {
  variants: ProductVariantData[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantData[]>>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">لیست تنوع‌های رنگ و سایز</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const idx = variants.length + 1;
            setVariants((prev) => [
              ...prev,
              {
                sku: `SKU-${Date.now().toString().slice(-5)}-${idx}`,
                priceToman: prev[0]?.priceToman || 250000,
                initialStock: 10,
                options: { رنگ: 'مشکی', سایز: 'L' },
              },
            ]);
          }}
        >
          + افزودن تنوع
        </Button>
      </div>
      <div className="space-y-3">
        {variants.map((v, i) => (
          <div key={i} className="border border-border/60 rounded-lg p-3 bg-muted/20 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px]">کد SKU</span>
              <input
                type="text"
                value={v.sku}
                onChange={(e) => {
                  const val = e.target.value;
                  setVariants((prev) => {
                    const c = [...prev];
                    c[i]!.sku = val;
                    return c;
                  });
                }}
                className="w-full px-2 py-1 border border-border rounded bg-background font-mono"
              />
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">قیمت (تومان)</span>
              <input
                type="number"
                value={v.priceToman}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setVariants((prev) => {
                    const c = [...prev];
                    c[i]!.priceToman = val;
                    return c;
                  });
                }}
                className="w-full px-2 py-1 border border-border rounded bg-background"
              />
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">موجودی اولیه</span>
              <input
                type="number"
                value={v.initialStock ?? 10}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setVariants((prev) => {
                    const c = [...prev];
                    c[i]!.initialStock = val;
                    return c;
                  });
                }}
                className="w-full px-2 py-1 border border-border rounded bg-background"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="defaultVariant"
                  checked={v.isDefault ?? i === 0}
                  onChange={() => {
                    setVariants((prev) => prev.map((item, idx) => ({ ...item, isDefault: idx === i })));
                  }}
                />
                <span>پیش‌فرض</span>
              </label>
              {variants.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 h-7 px-2"
                  onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  حذف
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
