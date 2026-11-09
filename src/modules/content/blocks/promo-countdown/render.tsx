import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import type { PromoCountdownProps } from './schema';
import { CountdownClient } from './countdown-client';

export function PromoCountdownRender({ props }: { props: PromoCountdownProps }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12">
      {props.imageUrl && (
        <Image
          src={props.imageUrl}
          alt={props.title}
          fill
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-center opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-xl">
          {props.badge && (
            <span className="mb-3 inline-flex rounded bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300">
              {props.badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight [text-wrap:balance]">
            {props.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {props.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <CountdownClient targetEndDate={props.targetEndDate} />

          {props.ctaText && props.ctaLink && (
            <Link
              href={props.ctaLink}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 whitespace-nowrap"
            >
              <span>{props.ctaText}</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
