import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import type { FeaturesListProps } from './schema';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: ShieldCheck,
  truck: Truck,
  rotate: RotateCcw,
  headset: Headphones,
  'credit-card': CreditCard,
  sparkles: Sparkles,
};

export function FeaturesListRender({ props }: { props: FeaturesListProps }) {
  return (
    <div
      className={`w-full rounded-2xl ${
        props.bordered ? 'border border-slate-200/80 bg-white p-6 md:p-8' : ''
      }`}
    >
      {(props.title || props.subtitle) && (
        <div className="mb-6 text-center">
          {props.title && (
            <h2 className="text-xl font-bold text-slate-900">{props.title}</h2>
          )}
          {props.subtitle && (
            <p className="mt-1 text-sm text-slate-500">{props.subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {props.items.map((item) => {
          const IconComp = ICONS[item.icon] || ShieldCheck;
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 text-right transition-colors"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <IconComp className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
