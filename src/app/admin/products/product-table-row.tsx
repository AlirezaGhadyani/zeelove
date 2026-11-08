'use client';

import React from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/shared/ui/primitives/button';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { formatToman } from '@/shared/lib/formatters/currency';
import type { AdminProductListItem } from './product-types';

interface ProductTableRowProps {
  product: AdminProductListItem;
  onEdit: (product: AdminProductListItem) => void;
  onDelete: (id: string, title: string) => void;
}

export function ProductTableRow({ product, onEdit, onDelete }: ProductTableRowProps) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="py-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div>
          <span className="font-bold block text-foreground">{product.title}</span>
          <span className="text-xs font-mono text-muted-foreground">/{product.slug}</span>
        </div>
      </td>
      <td className="py-3 text-xs">
        <span className="block text-foreground">{product.categoryName || '-'}</span>
        <span className="text-muted-foreground">{product.brandName || '-'}</span>
      </td>
      <td className="py-3 text-xs font-semibold">
        {formatToman(product.priceToman)}
      </td>
      <td className="py-3 text-xs">
        <span className="block">{toPersianDigits(product.variantsCount)} تنوع</span>
        <span className={product.totalStock > 0 ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
          {product.totalStock > 0 ? `${toPersianDigits(product.totalStock)} عدد` : 'ناموجود'}
        </span>
      </td>
      <td className="py-3">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
          product.status === 'ACTIVE'
            ? 'bg-emerald-500/10 text-emerald-500'
            : product.status === 'DRAFT'
            ? 'bg-amber-500/10 text-amber-500'
            : 'bg-muted text-muted-foreground'
        }`}>
          {product.status === 'ACTIVE' ? 'فعال' : product.status === 'DRAFT' ? 'پیش‌نویس' : 'بایگانی'}
        </span>
      </td>
      <td className="py-3 text-left">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
            <Edit2 className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(product.id, product.title)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
