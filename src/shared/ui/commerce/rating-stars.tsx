import React from 'react';
import { Star } from 'lucide-react';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';
import { cn } from '@/shared/lib/utils';

export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  className?: string;
}

export function RatingStars({
  rating,
  maxRating = 5,
  reviewCount,
  className = '',
}: RatingStarsProps) {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div
        className="flex items-center gap-0.5"
        aria-label={`امتیاز ${toPersianDigits(roundedRating)} از ${toPersianDigits(maxRating)}`}
      >
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-neutral-800 text-neutral-700',
            )}
          />
        ))}
      </div>

      <span className="text-xs font-semibold text-neutral-300">
        {toPersianDigits(roundedRating)}
      </span>

      {reviewCount !== undefined && (
        <span className="text-[11px] text-neutral-500">({toPersianDigits(reviewCount)})</span>
      )}
    </div>
  );
}
