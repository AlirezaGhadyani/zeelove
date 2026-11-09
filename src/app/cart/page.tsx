import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { StorefrontShell } from '@/components/storefront/storefront-shell';

export const metadata: Metadata = {
  title: 'سبد خرید',
  description: 'مشاهده و تکمیل سفارش در فروشگاه زیلاو',
};

export default function CartPage() {
  return (
    <StorefrontShell>
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 text-amber-500 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">سبد خرید شما در حال حاضر خالی است</h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            می‌توانید برای مشاهده محصولات و افزودن کالاهای مورد نظر به فروشگاه زیلاو مراجعه کنید.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>شروع خرید و مشاهده کاتالوگ</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </StorefrontShell>
  );
}
