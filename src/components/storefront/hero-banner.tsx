import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="space-y-6 max-w-xl text-center md:text-start">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>کالکشن جدید پاییزه و بهاره ۱۴۰۵</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          استایل متمایز، <br />
          <span className="text-amber-400">کیفیت بی‌انتها</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          منتخبی از برترین پوشاک مردانه، زنانه و اکسسوری از معتبرترین برندهای ایرانی و بین‌المللی با ضمانت اصالت کالا در فروشگاه آنلاین زیلاو.
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <span>مشاهده محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/category/men-clothing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-sm font-semibold transition-colors"
          >
            <span>کالکشن مردانه</span>
          </Link>
        </div>
      </div>

      <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-950 border border-neutral-800 flex items-center justify-center p-8">
        <div className="w-full h-full rounded-xl bg-neutral-900/80 border border-neutral-800/80 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl">
            💎
          </div>
          <span className="font-bold text-lg text-white">فروشگاه آنلاین زیلاو</span>
          <span className="text-xs text-neutral-400">تضمین بالاترین کیفیت دوخت و متریال</span>
        </div>
      </div>
    </section>
  );
}
