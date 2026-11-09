import { ChevronDown } from 'lucide-react';
import type { FaqAccordionProps } from './schema';

export function FaqAccordionRender({ props }: { props: FaqAccordionProps }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
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

      <div className="space-y-3">
        {props.items.map((item) => (
          <details
            key={item.id}
            className="group rounded-xl border border-slate-200/90 bg-white transition-all [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 sm:p-5 font-semibold text-slate-900 hover:text-primary transition-colors">
              <span className="text-sm md:text-base leading-snug">
                {item.question}
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-t border-slate-100 px-4 pb-5 pt-3 sm:px-5">
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
