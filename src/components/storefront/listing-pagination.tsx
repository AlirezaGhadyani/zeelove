'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toPersianDigits } from '@/shared/lib/formatters/persian-digits';

export function ListingPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-neutral-800">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-xl text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-900 transition-colors"
        aria-label="صفحه قبلی"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
            currentPage === p
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800/80'
          }`}
        >
          {toPersianDigits(p)}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-xl text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-900 transition-colors"
        aria-label="صفحه بعدی"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
