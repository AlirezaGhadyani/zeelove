'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/primitives/button';
import { PriceTag } from '@/shared/ui/commerce/price-tag';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';

export interface DetailVariantData {
  id: string;
  sku: string;
  priceToman: number;
  compareAtPriceToman?: number;
  isDefault?: boolean;
  options?: Record<string, string>;
  stock: number;
}

interface ProductVariantPickerProps {
  productId: string;
  productTitle: string;
  variants: DetailVariantData[];
}

export function ProductVariantPicker({
  productTitle,
  variants,
}: ProductVariantPickerProps) {
  const initialVariant = variants.find((v) => v.isDefault) || variants[0]!;
  const [selectedVariant, setSelectedVariant] = useState<DetailVariantData>(initialVariant);
  const [adding, setAdding] = useState(false);

  const optionsMap: Record<string, Set<string>> = {};
  variants.forEach((v) => {
    if (v.options) {
      Object.entries(v.options).forEach(([k, val]) => {
        if (!optionsMap[k]) optionsMap[k] = new Set();
        optionsMap[k].add(val);
      });
    }
  });

  const handleSelectOption = (key: string, val: string) => {
    const matched = variants.find(
      (v) => v.options && v.options[key] === val,
    );
    if (matched) {
      setSelectedVariant(matched);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      toast.success(`«${productTitle}» به سبد خرید اضافه شد`);
    }, 400);
  };

  const isAvailable = selectedVariant.stock > 0;

  return (
    <div className="space-y-6">
      {/* Price & SKU */}
      <div className="space-y-2 pb-4 border-b border-neutral-800">
        <PriceTag
          price={selectedVariant.priceToman}
          compareAtPrice={selectedVariant.compareAtPriceToman}
        />
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>کد کالا (SKU):</span>
          <span className="font-mono text-neutral-400">{selectedVariant.sku}</span>
        </div>
      </div>

      {/* Options Selection (Color, Size, etc.) */}
      {Object.entries(optionsMap).map(([optName, optValues]) => (
        <div key={optName} className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-300">انتخاب {optName}:</span>
            <span className="text-amber-400 font-semibold">
              {selectedVariant.options?.[optName] || ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(optValues).map((val) => {
              const isSelected = selectedVariant.options?.[optName] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectOption(optName, val)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-sm'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{val}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock Status Indicator */}
      <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs flex items-center justify-between">
        <span className="text-neutral-400">وضعیت موجودی در انبار:</span>
        {isAvailable ? (
          selectedVariant.stock <= 5 ? (
            <span className="text-amber-400 font-bold">
              تنها {toPersianDigits(selectedVariant.stock)} عدد در انبار باقی مانده!
            </span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              موجود در انبار زیلاو
            </span>
          )
        ) : (
          <span className="text-red-400 font-bold">ناموجود در انبار</span>
        )}
      </div>

      {/* Add To Cart CTA */}
      <div className="pt-2">
        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!isAvailable || adding}
          className="w-full h-12 text-sm font-bold gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isAvailable ? (adding ? 'در حال افزودن...' : 'افزودن به سبد خرید') : 'موجود شد به من اطلاع بده'}</span>
        </Button>
      </div>

      {/* Trust Mini Features */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400 text-center">
        <div className="p-2 rounded-lg bg-neutral-900/30 flex flex-col items-center gap-1">
          <Truck className="w-4 h-4 text-amber-500" />
          <span>ارسال سریع</span>
        </div>
        <div className="p-2 rounded-lg bg-neutral-900/30 flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>ضمانت اصالت</span>
        </div>
        <div className="p-2 rounded-lg bg-neutral-900/30 flex flex-col items-center gap-1">
          <RefreshCw className="w-4 h-4 text-blue-500" />
          <span>۷ روز مرجوعی</span>
        </div>
      </div>
    </div>
  );
}
