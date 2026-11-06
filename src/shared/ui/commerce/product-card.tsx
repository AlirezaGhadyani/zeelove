import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { PriceTag } from './price-tag';
import { RatingStars } from './rating-stars';
import { StockBadge } from './stock-badge';
import { Button } from '@/shared/ui/primitives/button';
import { cn } from '@/shared/lib/utils';

export interface ProductCardProps {
  id: string;
  title: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  variant?: 'minimal' | 'detailed' | 'overlay' | 'horizontal';
  onAddToCart?: (id: string) => void;
  className?: string;
}

export function ProductCard({
  id,
  title,
  category,
  price,
  compareAtPrice,
  stock = 10,
  rating = 4.8,
  reviewCount = 12,
  imageUrl,
  variant = 'detailed',
  onAddToCart,
  className = '',
}: ProductCardProps) {
  if (variant === 'horizontal') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 shadow-sm text-start',
          className,
        )}
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-800 flex items-center justify-center text-3xl">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            '💎'
          )}
        </div>
        <div className="flex-1 space-y-1">
          {category && <span className="text-[11px] font-semibold text-amber-500">{category}</span>}
          <h4 className="font-bold text-sm text-white line-clamp-1">{title}</h4>
          <PriceTag price={price} compareAtPrice={compareAtPrice} />
        </div>
        {onAddToCart && (
          <Button size="sm" onClick={() => onAddToCart(id)} className="gap-1 shrink-0">
            <ShoppingBag className="h-3.5 w-3.5" />
            افزودن
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'group flex flex-col rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3 shadow-sm hover:border-neutral-700 transition-all text-start',
          className,
        )}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800 flex items-center justify-center text-4xl mb-3">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            '💎'
          )}
        </div>
        <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">{title}</h4>
        <PriceTag price={price} compareAtPrice={compareAtPrice} />
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-md text-start',
          className,
        )}
      >
        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-5xl">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
          ) : (
            '💎'
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-4 flex flex-col justify-end">
          <StockBadge stock={stock} className="self-start mb-2" />
          <h4 className="font-bold text-base text-white mb-1">{title}</h4>
          <PriceTag price={price} compareAtPrice={compareAtPrice} />
        </div>
      </div>
    );
  }

  // Detailed (Default)
  return (
    <div
      className={cn(
        'group flex flex-col rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 shadow-sm hover:border-amber-500/30 transition-all text-start',
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800 flex items-center justify-center text-4xl mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          '💎'
        )}
        <div className="absolute top-2 end-2">
          <StockBadge stock={stock} />
        </div>
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {category && <span className="text-[11px] font-semibold text-amber-500">{category}</span>}
          <h4 className="font-bold text-sm text-white line-clamp-2 leading-relaxed">{title}</h4>
          <RatingStars rating={rating} reviewCount={reviewCount} />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-neutral-800/60">
          <PriceTag price={price} compareAtPrice={compareAtPrice} />
          {onAddToCart && (
            <Button
              size="sm"
              onClick={() => onAddToCart(id)}
              className="gap-1.5"
              aria-label={`افزودن ${title} به سبد خرید`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              خرید
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
