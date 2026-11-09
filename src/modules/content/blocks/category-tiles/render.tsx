import Link from 'next/link';
import Image from 'next/image';
import type { CategoryTilesProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';

interface CategoryTilesRenderProps {
  props: CategoryTilesProps;
  data?: ResolvedBlockData;
}

export function CategoryTilesRender({ props, data }: CategoryTilesRenderProps) {
  const displayItems =
    data?.categories && data.categories.length > 0
      ? data.categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          imageUrl: c.imageUrl || '/assets/categories/default.jpg',
          count: c.productCount,
        }))
      : props.items;

  return (
    <div className="w-full">
      {(props.title || props.subtitle) && (
        <div className="mb-6 flex flex-col items-center text-center">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {displayItems.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative mb-3 h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50 shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                sizes="120px"
                referrerPolicy="no-referrer"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-primary">
              {cat.name}
            </span>
            {cat.count !== undefined && cat.count > 0 && (
              <span className="mt-0.5 text-xs text-slate-400 tabular-nums">
                {cat.count.toLocaleString('fa-IR')} کالا
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
