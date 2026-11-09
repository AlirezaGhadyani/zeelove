import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ProductGridProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';
import { ProductCard } from '../common/product-card';

interface ProductGridRenderProps {
  props: ProductGridProps;
  data?: ResolvedBlockData;
}

const COL_MAP: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
};

export function ProductGridRender({ props, data }: ProductGridRenderProps) {
  const products = data?.products ?? [];

  if (products.length === 0) {
    return null;
  }

  const colClass = COL_MAP[props.columns] || COL_MAP[4];

  return (
    <div className="w-full">
      <div className="mb-6 flex items-end justify-between border-b border-slate-100 pb-4">
        <div>
          {props.title && (
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="mt-1 text-sm text-slate-500">{props.subtitle}</p>
          )}
        </div>

        {props.viewAllUrl && (
          <Link
            href={props.viewAllUrl}
            className="flex items-center gap-1 text-xs md:text-sm font-semibold text-primary hover:underline whitespace-nowrap"
          >
            <span>{props.viewAllLabel}</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className={`grid ${colClass} gap-4 md:gap-6`}>
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            variant={props.cardVariant}
            aspectRatio={props.aspectRatio}
            showPrice={props.showPrice}
            showRating={props.showRating}
            showBadges={props.showBadges}
          />
        ))}
      </div>
    </div>
  );
}
