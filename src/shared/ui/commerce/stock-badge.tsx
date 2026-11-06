import React from 'react';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { Badge } from '@/shared/ui/primitives/badge';

export interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockBadge({ stock, lowStockThreshold = 5, className = '' }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className={className}>
        ناموجود
      </Badge>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="warning" className={className}>
        تنها {toPersianDigits(stock)} عدد در انبار
      </Badge>
    );
  }

  return (
    <Badge variant="success" className={className}>
      موجود در انبار
    </Badge>
  );
}
