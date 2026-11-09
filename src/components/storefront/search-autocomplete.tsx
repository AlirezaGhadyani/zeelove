'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2, ArrowLeft } from 'lucide-react';
import { formatToman } from '@/shared/lib/formatters/currency';

interface SuggestionItem {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  defaultVariant?: {
    priceToman: number;
    formattedPrice: string;
  } | null;
}

export function SearchAutocomplete({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/catalog/products?search=${encodeURIComponent(query.trim())}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.items || []);
          setIsOpen(true);
        }
      } catch {
        // quiet error in autocomplete
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <Search className="w-4 h-4 absolute right-3.5 top-3 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="جستجو در زیلاو (پیراهن، شومیز، کفش...)"
          className="w-full pr-10 pl-9 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute left-3 top-3 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {loading && (
          <Loader2 className="w-4 h-4 absolute left-3 top-3 text-amber-500 animate-spin" />
        )}
      </form>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-neutral-800/60">
          {suggestions.length > 0 ? (
            <>
              <div className="p-2 space-y-1">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800/70 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm">💎</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-bold text-white truncate">{p.title}</span>
                      {p.defaultVariant && (
                        <span className="text-[11px] text-amber-400">
                          {formatToman(p.defaultVariant.priceToman)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-3 text-xs text-amber-400 hover:bg-neutral-800/80 font-semibold"
              >
                <span>مشاهده همه نتایج برای «{query}»</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <div className="p-4 text-center text-xs text-neutral-400">
              موردی برای «{query}» یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
