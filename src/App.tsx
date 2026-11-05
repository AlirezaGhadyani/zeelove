import React, { useState } from 'react';
import { Store, ShieldCheck, CheckCircle2, Server, Terminal, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'status' | 'architecture' | 'checklist'>('status');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
              <Store className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">زیلاو</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  zeelove core
                </span>
              </div>
              <p className="text-xs text-neutral-400">پلتفرم تجارت الکترونیک بومی و CMS تحریریه گاد مود</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              سرور توسعه فعال (پورت ۳۰۰۰)
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-neutral-950 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              آماده‌سازی پلتفرم و هسته اصلی سیستم
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              سرور توسعه با موفقیت راه‌اندازی و تثبیت شد
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              هسته پروژه زیلاو بر اساس معماری دامنه-محور (DDD) و ماژولار مونولیت، سازگاری کامل راست‌چین (RTL)، ساختار فونت وزیرمتن و پالت اختصاصی پایه‌گذاری شده است.
            </p>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 gap-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'status'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            وضعیت سرویس‌ها
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'architecture'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            معماری و دامنه‌ها
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'checklist'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            چک‌لیست استانداردهای سخت‌گیرانه
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">سرور توسعه (Dev Server)</span>
                <Server className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">۳۰۰۰ :پورت</div>
              <p className="text-xs text-emerald-400 font-medium">سرویس آماده به کار، بدون خطا</p>
            </div>

            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">پیکربندی فونت و جهت</span>
                <Terminal className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">RTL + وزیرمتن</div>
              <p className="text-xs text-neutral-400">فواصل منطقی (ms-*, me-*, ps-*, pe-*)</p>
            </div>

            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-300">مدیریت محیط و پکیج</span>
                <Layers className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">TypeScript Strict</div>
              <p className="text-xs text-neutral-400">فاقد وابستگی ابری شخص ثالث</p>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">کانتکست‌های ماژولار زیلاو (Bounded Contexts)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'identity-access', fa: 'هویت و دسترسی (OTP موبایل)' },
                { name: 'catalog', fa: 'کاتالوگ و دسته‌بندی محصولات' },
                { name: 'inventory', fa: 'انبارداری و موجودی' },
                { name: 'pricing-promotions', fa: 'قیمت‌گذاری و تخفیفات (تومان)' },
                { name: 'cart', fa: 'سبد خرید' },
                { name: 'ordering', fa: 'ثبت و مدیریت سفارش‌ها' },
                { name: 'shipping', fa: 'حمل و نقل و ارسال' },
                { name: 'content', fa: 'مدیریت محتوا و صفحات گاد مود' },
                { name: 'settings-theme', fa: 'تنظیمات برند و توکن‌های استایل' },
              ].map((ctx) => (
                <div key={ctx.name} className="p-3 rounded-lg border border-neutral-800/60 bg-neutral-950/60 flex items-center justify-between">
                  <span className="font-mono text-neutral-300">{ctx.name}</span>
                  <span className="text-neutral-400">{ctx.fa}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">انطباق با قوانین و محدودیت‌های سخت‌گیرانه</h3>
            <div className="space-y-3 text-sm">
              {[
                'هاستینگ مستقل: فاقد وابستگی به سرورهای کلود ابری خارجی یا Firebase.',
                'واسط کاربری کاملاً راست‌چین و تمام فارسی با استفاده انحصاری از توکن‌های منطقی (ms/me/ps/pe/start/end).',
                'قوانین کدنویسی تمیز: متدهای کوتاه، بدون فایلهای بزرگتر از ۱۲۰ الی ۲۰۰ خط، نامگذاری منظم کباب‌کیس.',
                'پشتیبانی ارقام و تاریخ‌ها و قیمتها با ساختار بومی (تومان و اعداد فارسی).',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-neutral-300 leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-500">
        <p>© ۱۴۰۵ پلتفرم زیلاو (zeelove). تمامی حقوق محفوظ است.</p>
      </footer>
    </div>
  );
}
