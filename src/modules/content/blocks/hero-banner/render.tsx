import Link from 'next/link';
import Image from 'next/image';
import type { HeroBannerProps } from './schema';

const HEIGHT_CLASSES: Record<string, string> = {
  sm: 'min-h-[360px] py-12',
  md: 'min-h-[480px] py-16',
  lg: 'min-h-[620px] py-24',
  full: 'min-h-[85vh] py-28',
};

export function HeroBannerRender({ props }: { props: HeroBannerProps }) {
  const heightClass = HEIGHT_CLASSES[props.height] || HEIGHT_CLASSES.md;
  const isCenter = props.align === 'center';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-slate-900 text-white flex items-center ${heightClass}`}
    >
      {props.imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={props.imageUrl}
            alt={props.title}
            fill
            sizes="100vw"
            priority
            referrerPolicy="no-referrer"
            className="object-cover object-center opacity-60"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"
            style={{ opacity: props.overlayOpacity / 100 }}
          />
        </div>
      )}

      <div
        className={`relative z-10 mx-auto w-full max-w-5xl px-6 md:px-12 flex flex-col ${
          isCenter ? 'items-center text-center' : 'items-start text-right'
        }`}
      >
        {props.kicker && (
          <p className="mb-3 text-xs md:text-sm font-medium tracking-wide text-amber-300/90">
            {props.kicker}
          </p>
        )}

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white max-w-3xl [text-wrap:balance]">
          {props.title}
        </h1>

        {props.subtitle && (
          <p className="mt-4 text-sm md:text-base lg:text-lg text-slate-200/90 max-w-2xl leading-relaxed">
            {props.subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {props.ctaText && props.ctaLink && (
            <Link
              href={props.ctaLink}
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              {props.ctaText}
            </Link>
          )}

          {props.secondaryCtaText && props.secondaryCtaLink && (
            <Link
              href={props.secondaryCtaLink}
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {props.secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
