'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
  { value: 'title', label: 'نام کالا' },
];

export function ProductSort({ currentSort = 'newest' }: { currentSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
        <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">مرتب‌سازی:</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSortChange(opt.value)}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              currentSort === opt.value
                ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
