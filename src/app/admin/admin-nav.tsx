'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  FolderTree,
  Tag,
  Sliders,
  Warehouse,
  Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { href: '/admin', label: 'داشبورد و کاربران', icon: Users, exact: true },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { href: '/admin/brands', label: 'برندها', icon: Tag },
  { href: '/admin/attributes', label: 'ویژگی‌ها', icon: Sliders },
  { href: '/admin/inventory', label: 'موجودی انبار', icon: Warehouse },
  { href: '/admin/navigation', label: 'منوهای ناوبری', icon: FolderTree },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-border/60 overflow-x-auto py-2 mb-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              isActive
                ? 'bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
