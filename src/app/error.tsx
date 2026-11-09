'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';
import { Wordmark } from '@/shared/ui/brand/wordmark';

export default function ErrorPage({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-neutral-950 text-neutral-100">
      <div className="max-w-md w-full p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl space-y-6">
        <Wordmark size="sm" />
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">خطایی در پردازش رخ داد</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            متأسفانه هنگام بارگذاری اطلاعات مشکلی پیش آمده است. لطفاً مجدداً تلاش فرمایید.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>تلاش مجدد</span>
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
