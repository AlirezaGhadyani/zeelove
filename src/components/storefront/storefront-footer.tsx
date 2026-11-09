'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, ShieldCheck, Headphones, MapPin, Phone, Mail } from 'lucide-react';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import type { MenuItem } from '@/modules/content';

interface StorefrontFooterProps {
  categoryItems?: MenuItem[];
  supportItems?: MenuItem[];
}

export function StorefrontFooter({ categoryItems = [], supportItems = [] }: StorefrontFooterProps) {
  const trustFeatures = [
    { title: 'تحویل سریع و مطمئن', desc: 'ارسال با پست پیشتاز به تمام نقاط کشور', icon: Truck },
    { title: '۷ روز ضمانت بازگشت', desc: 'امکان مرجوعی کالا در صورت عدم رضایت', icon: RotateCcw },
    { title: 'تضمین اصالت کالا', desc: 'ضمانت ۱۰۰٪ اصالت و کیفیت برتر محصولات', icon: ShieldCheck },
    { title: 'پشتیبانی ۲۴ ساعته', desc: 'پاسخگویی به سوالات شما در تمام روزهای هفته', icon: Headphones },
  ];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 mt-16">
      {/* Trust Badges Bar */}
      <div className="border-b border-neutral-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {trustFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2 p-3">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-500 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-neutral-200">{f.title}</h4>
                <p className="text-xs text-neutral-500 max-w-[200px]">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* About */}
        <div className="space-y-4">
          <Wordmark size="sm" />
          <p className="leading-relaxed text-neutral-400">
            زیلاو، فروشگاه آنلاین مد و استایل؛ پیشرو در ارائه جدیدترین و باکیفیت‌ترین پوشاک، کفش و اکسسوری از معتبرترین برندها با استانداردهای جهانی و تجربه خریدی لذت‌بخش.
          </p>
          <div className="flex items-center gap-2 pt-2 text-neutral-300">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>تهران، خیابان ولیعصر، برج فناوری زیلاو</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-white">دسته‌بندی‌های برگزیده</h5>
          <ul className="space-y-2">
            {categoryItems.length > 0 ? (
              categoryItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="hover:text-amber-400 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/category/men-shirts" className="hover:text-amber-400">پیراهن مردانه</Link></li>
                <li><Link href="/category/women-blouses" className="hover:text-amber-400">شومیز و پوشاک زنانه</Link></li>
                <li><Link href="/category/shoes-and-bags" className="hover:text-amber-400">کفش چرم طبیعی</Link></li>
                <li><Link href="/category/accessories" className="hover:text-amber-400">اکسسوری و زیورآلات</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-white">خدمات مشتریان</h5>
          <ul className="space-y-2">
            {supportItems.length > 0 ? (
              supportItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="hover:text-amber-400 transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/page/faq" className="hover:text-amber-400">پرسش‌های متداول</Link></li>
                <li><Link href="/page/returns" className="hover:text-amber-400">رویه‌های بازگرداندن کالا</Link></li>
                <li><Link href="/page/guide" className="hover:text-amber-400">راهنمای سایزبندی و ثبت سفارش</Link></li>
                <li><Link href="/page/terms" className="hover:text-amber-400">شرایط و قوانین استفاده</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Contact & Enamad */}
        <div className="space-y-4">
          <h5 className="font-bold text-sm text-white">ارتباط با زیلاو</h5>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span dir="ltr">۰۲۱ - ۹۱۰۰ ۰۰۰۰</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>support@zeelove.ir</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="inline-flex items-center gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60">
              <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-amber-500 text-xs">
                اینماد
              </div>
              <div className="text-[10px] text-neutral-400">
                <span className="block font-bold text-neutral-200">نماد اعتماد الکترونیکی</span>
                <span>مرکز توسعه تجارت الکترونیکی</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-neutral-800/80 py-4 text-center text-xs text-neutral-500">
        <p>تمامی حقوق مادی و معنوی این وب‌سایت متعلق به فروشگاه آنلاین زیلاو (zeelove) می‌باشد.</p>
      </div>
    </footer>
  );
}
