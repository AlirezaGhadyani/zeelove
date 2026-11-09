import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { CollectionByRuleProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';
import { ProductCard } from '../common/product-card';

interface CollectionByRuleRenderProps {
  props: CollectionByRuleProps;
  data?: ResolvedBlockData;
}

export function CollectionByRuleRender({ props, data }: CollectionByRuleRenderProps) {
  const products = data?.products ?? [];

  if (products.length === 0) {
    return null;
  }

  const isCarousel = props.displayType === 'carousel';

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

      {isCarousel ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="w-[200px] sm:w-[230px] md:w-[260px] shrink-0 snap-start"
            >
              <ProductCard
                product={prod}
                variant={props.cardVariant}
                aspectRatio={props.aspectRatio}
                showPrice={props.showPrice}
                showRating={props.showRating}
                showBadges={props.showBadges}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
      )}
    </div>
  );
}
