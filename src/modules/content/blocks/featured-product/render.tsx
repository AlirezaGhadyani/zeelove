import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowLeft } from 'lucide-react';
import type { FeaturedProductProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';

interface FeaturedProductRenderProps {
  props: FeaturedProductProps;
  data?: ResolvedBlockData;
}

export function FeaturedProductRender({ props, data }: FeaturedProductRenderProps) {
  const product = data?.products?.[0];
  const imageUrl =
    product?.imageUrl || props.customImageUrl || '/assets/products/featured-jacket.jpg';
  const targetLink = product ? `/products/${product.slug}` : props.ctaLink;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[460px]">
        <div className="relative min-h-[300px] lg:min-h-full w-full overflow-hidden bg-slate-800">
          <Image
            src={imageUrl}
            alt={props.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            referrerPolicy="no-referrer"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          {props.badgeText && (
            <span className="mb-3 inline-flex self-start rounded-md bg-amber-400/20 px-2.5 py-1 text-xs font-semibold text-amber-300">
              {props.badgeText}
            </span>
          )}

          <h2 className="text-2xl md:text-3xl font-extrabold leading-snug text-white [text-wrap:balance]">
            {props.title}
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-300 leading-relaxed">
            {props.subtitle}
          </p>

          {props.bulletPoints.length > 0 && (
            <ul className="mt-6 space-y-2.5 text-xs md:text-sm text-slate-200">
              {props.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {props.showPrice && product && (
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tabular-nums">
                {product.price.toLocaleString('fa-IR')}
              </span>
              <span className="text-sm text-slate-300">تومان</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-slate-400 line-through tabular-nums mr-2">
                  {product.compareAtPrice.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <Link
              href={targetLink}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              <span>{props.ctaText}</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
