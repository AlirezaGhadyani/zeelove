import { Star, Quote } from 'lucide-react';
import type { TestimonialsProps } from './schema';

export function TestimonialsRender({ props }: { props: TestimonialsProps }) {
  return (
    <div className="w-full">
      {(props.title || props.subtitle) && (
        <div className="mb-8 text-center">
          {props.title && (
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="mt-1.5 text-sm text-slate-500">{props.subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-slate-300" />
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                «{item.quote}»
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col">
              <span className="text-sm font-bold text-slate-900">
                {item.author}
              </span>
              <span className="text-xs text-slate-500">{item.role}</span>
              {item.purchasedItem && (
                <span className="mt-1 text-[11px] text-slate-400">
                  خرید: {item.purchasedItem}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
