'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
  userRole?: string | null;
}

export function MobileBottomNav({ onOpenMenu, userRole }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'خانه', icon: Home, exact: true },
    { href: '/products', label: 'دسته‌ها', icon: Grid, isAction: Boolean(onOpenMenu) },
    { href: '/search', label: 'جستجو', icon: Search },
    { href: '/cart', label: 'سبد خرید', icon: ShoppingBag, badge: 0 },
    { href: userRole ? '/admin' : '/auth/login', label: userRole ? 'مدیریت' : 'حساب', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 md:hidden px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : item.href !== '#categories' && pathname.startsWith(item.href);

          if (item.isAction && onOpenMenu) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={onOpenMenu}
                className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors py-1"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-1 py-1 transition-colors',
                isActive ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute -top-0.5 end-2 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center">
                  ۰
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
