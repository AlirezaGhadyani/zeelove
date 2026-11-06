import React from 'react';
import { formatToman } from '@/shared/lib/formatters/currency';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { cn } from '@/shared/lib/utils';

export interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  showUnit?: boolean;
  className?: string;
}

export function PriceTag({
  price,
  compareAtPrice,
  showUnit = true,
  className = '',
}: PriceTagProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn('flex items-baseline gap-2 text-start', className)}>
      <span className="font-bold text-amber-400 text-base sm:text-lg">
        {formatToman(price, { showUnit })}
      </span>

      {hasDiscount && (
        <>
          <span className="text-xs text-neutral-500 line-through">
            {formatToman(compareAtPrice, { showUnit: false })}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
            ٪{toPersianDigits(discountPercent)}
          </span>
        </>
      )}
    </div>
  );
}
