'use client';

import React from 'react';
import Link from 'next/link';
import { X, ChevronDown, Package, ShieldCheck, PhoneCall } from 'lucide-react';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import type { MenuItem } from '@/modules/content';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export function MobileDrawer({ isOpen, onClose, menuItems }: MobileDrawerProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-neutral-950 border-e border-neutral-800 h-full p-5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
            <Wordmark size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedId === item.id;

              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between rounded-lg hover:bg-neutral-900 transition-colors">
                    <Link
                      href={item.url}
                      onClick={onClose}
                      className="flex-1 px-3 py-2.5 text-sm font-semibold text-neutral-200 hover:text-amber-400"
                    >
                      {item.title}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-2 text-neutral-400 hover:text-white"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <div className="mr-4 pe-2 border-r-2 border-amber-500/40 space-y-1 py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          onClick={onClose}
                          className="block px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900/50 rounded-md"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-6 border-t border-neutral-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ضمانت اصالت و سلامت کالا</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span dir="ltr">۰۲۱-۹۱۰۰۰۰۰۰</span>
          </div>
          <Link
            href="/products"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>مشاهده همه محصولات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
