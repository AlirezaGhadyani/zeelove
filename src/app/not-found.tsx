import React from 'react';
import Link from 'next/link';
import { Home, Package } from 'lucide-react';
import { Wordmark } from '@/shared/ui/brand/wordmark';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-neutral-950 text-neutral-100">
      <div className="max-w-md w-full p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl space-y-6">
        <Wordmark size="md" />
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-amber-500 font-mono">۴۰۴</h1>
          <h2 className="text-xl font-bold text-white">صفحه مورد نظر یافت نشد</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            متأسفانه آدرسی که وارد کرده‌اید وجود ندارد یا ممکن است منتقل یا حذف شده باشد.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>صفحه اصلی</span>
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>فهرست کالاها</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
