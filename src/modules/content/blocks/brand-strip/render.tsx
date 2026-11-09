import Link from 'next/link';
import type { BrandStripProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';

interface BrandStripRenderProps {
  props: BrandStripProps;
  data?: ResolvedBlockData;
}

export function BrandStripRender({ props, data }: BrandStripRenderProps) {
  const displayBrands =
    data?.brands && data.brands.length > 0
      ? data.brands.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          logoUrl: b.logoUrl,
        }))
      : props.items;

  return (
    <div className="w-full">
      {(props.title || props.subtitle) && (
        <div className="mb-6 text-center">
          {props.title && (
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="mt-1 text-sm text-slate-500">{props.subtitle}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
        {displayBrands.map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="group flex h-16 min-w-[130px] items-center justify-center rounded-xl border border-slate-200/80 bg-white px-5 py-2 transition-all duration-200 hover:border-slate-400 hover:shadow-sm"
          >
            <span className="text-sm font-bold text-slate-700 transition-colors group-hover:text-primary">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
