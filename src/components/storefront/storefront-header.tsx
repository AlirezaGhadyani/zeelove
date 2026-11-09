'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu as MenuIcon, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { SearchAutocomplete } from './search-autocomplete';
import { MobileDrawer } from './mobile-drawer';
import type { MenuItem } from '@/modules/content';

interface StorefrontHeaderProps {
  menuItems: MenuItem[];
  userRole?: string | null;
}

export function StorefrontHeader({ menuItems, userRole }: StorefrontHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);

  return (
    <>
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        {/* Top Ticker */}
        <div className="bg-neutral-900 border-b border-neutral-800/60 py-1.5 px-4 text-center">
          <p className="text-[11px] text-neutral-400 font-medium">
            ارسال رایگان سفارش‌های بالای ۱ میلیون تومان · ۷ روز ضمانت بازگشت وجه · تضمین اصالت کالا
          </p>
        </div>

        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 md:hidden"
              aria-label="باز کردن منو"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Wordmark size="sm" />
            </Link>
          </div>

          {/* Search Bar on Desktop */}
          <div className="flex-1 max-w-lg hidden md:block">
            <SearchAutocomplete />
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={userRole ? '/admin' : '/auth/login'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800/80 transition-colors"
            >
              <User className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">{userRole ? 'پنل مدیریت' : 'ورود / ثبت‌نام'}</span>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800/80 transition-colors flex items-center gap-1.5"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">سبد خرید</span>
              <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                ۰
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar below logo */}
        <div className="px-4 pb-3 md:hidden">
          <SearchAutocomplete />
        </div>

        {/* Desktop Mega Menu Bar */}
        <div className="hidden md:block border-t border-neutral-800/60 bg-neutral-950/60">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 relative">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isHovered = hoveredMenuId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative group py-2.5"
                  onMouseEnter={() => setHoveredMenuId(item.id)}
                  onMouseLeave={() => setHoveredMenuId(null)}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-neutral-300 hover:text-amber-400 transition-colors rounded-lg hover:bg-neutral-900/60"
                  >
                    <span>{item.title}</span>
                    {hasChildren && <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-amber-400" />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {hasChildren && isHovered && (
                    <div className="absolute top-full right-0 min-w-[220px] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 divide-y divide-neutral-800/40">
                      <div className="p-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block px-3 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
}
