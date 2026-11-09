import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import type { ImageTextProps } from './schema';

export function ImageTextRender({ props }: { props: ImageTextProps }) {
  const isImageRight = props.imagePosition === 'right';

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div
          className={`relative min-h-[320px] md:min-h-[420px] w-full overflow-hidden rounded-3xl bg-slate-100 ${
            isImageRight ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <Image
            src={props.imageUrl}
            alt={props.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            referrerPolicy="no-referrer"
            className="object-cover object-center"
          />
        </div>

        <div
          className={`flex flex-col items-start ${
            isImageRight ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          {props.badge && (
            <span className="mb-3 text-xs font-semibold text-primary">
              {props.badge}
            </span>
          )}

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug [text-wrap:balance]">
            {props.title}
          </h2>

          {props.subtitle && (
            <p className="mt-3 text-base md:text-lg font-medium text-slate-700">
              {props.subtitle}
            </p>
          )}

          <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
            {props.description}
          </p>

          {props.ctaText && props.ctaLink && (
            <div className="mt-6">
              <Link
                href={props.ctaLink}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <span>{props.ctaText}</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
