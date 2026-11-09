import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { ResolvedBlockData } from './data-needs';

type ProductItem = NonNullable<ResolvedBlockData['products']>[number];

interface ProductCardProps {
  product: ProductItem;
  variant?: 'default' | 'compact' | 'minimal';
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9';
  showPrice?: boolean;
  showRating?: boolean;
  showBadges?: boolean;
}

const ASPECT_RATIOS: Record<string, string> = {
  '1:1': 'aspect-square',
  '3:4': 'aspect-[3/4]',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-[16/9]',
};

export function ProductCard({
  product,
  variant: _variant = 'default',
  aspectRatio = '3:4',
  showPrice = true,
  showRating = true,
  showBadges = true,
}: ProductCardProps) {
  const aspectClass = ASPECT_RATIOS[aspectRatio] || 'aspect-[3/4]';
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200/80 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-slate-50`}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            referrerPolicy="no-referrer"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            <span className="text-xs">بدون تصویر</span>
          </div>
        )}

        {showBadges && hasDiscount && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded">
              {product.discountPercent ??
                Math.round(
                  ((product.compareAtPrice! - product.price) /
                    product.compareAtPrice!) *
                    100,
                )}
              ٪ تخفیف
            </span>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px]">
            <span className="rounded bg-slate-900/90 px-3 py-1 text-xs font-medium text-white">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.brandName && (
          <div className="text-[11px] font-medium text-slate-500 mb-1">
            {product.brandName}
          </div>
        )}

        <h3 className="line-clamp-2 text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {showRating && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums font-medium text-slate-700">
              {(product.rating ?? 4.8).toFixed(1)}
            </span>
          </div>
        )}

        {showPrice && (
          <div className="mt-auto pt-3 flex flex-col gap-0.5">
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {product.compareAtPrice!.toLocaleString('fa-IR')}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {product.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-xs text-slate-500">تومان</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
