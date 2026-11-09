import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import type { BannerGridProps } from './schema';

const GAP_CLASSES: Record<string, string> = {
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-8',
};

const COL_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function BannerGridRender({ props }: { props: BannerGridProps }) {
  const gapClass = GAP_CLASSES[props.gap] || GAP_CLASSES.md;
  const colClass = COL_CLASSES[props.columns] || COL_CLASSES[2];

  return (
    <div className="w-full">
      {(props.title || props.subtitle) && (
        <div className="mb-6 flex flex-col items-start">
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

      <div className={`grid ${colClass} ${gapClass}`}>
        {props.items.map((item) => (
          <Link
            key={item.id}
            href={item.linkUrl}
            className={`group relative flex min-h-[220px] md:min-h-[280px] overflow-hidden rounded-2xl bg-slate-900 text-white transition-all duration-300 hover:shadow-lg ${
              item.span === '2' ? 'md:col-span-2' : ''
            }`}
          >
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                referrerPolicy="no-referrer"
                className="object-cover object-center opacity-70 transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="relative z-10 flex h-full w-full flex-col justify-end p-6">
              {item.badge && (
                <span className="mb-2 inline-flex self-start rounded bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  {item.badge}
                </span>
              )}

              <h3 className="text-lg md:text-xl font-bold text-white transition-colors group-hover:text-amber-300">
                {item.title}
              </h3>

              {item.subtitle && (
                <p className="mt-1 line-clamp-2 text-xs md:text-sm text-slate-200">
                  {item.subtitle}
                </p>
              )}

              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:text-white">
                <span>مشاهده و خرید</span>
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
