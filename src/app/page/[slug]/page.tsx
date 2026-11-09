import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { StorefrontShell } from '@/components/storefront/storefront-shell';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PAGES_CONTENT: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
  about: {
    title: 'درباره زیلاو (zeelove)',
    subtitle: 'داستان شکل‌گیری زیلاو و تعهد ما به کیفیت برتر پوشاک و مد',
    content: (
      <div className="space-y-4">
        <p>
          فروشگاه آنلاین زیلاو (zeelove) با هدف ارائه تجربه‌ای لوکس، مطمئن و در دسترس از خرید پوشاک و اکسسوری تاسیس گردید. ما باور داریم که مد و پوشش بازتابی از شخصیت، اعتماد به نفس و اصالت هر فرد است.
        </p>
        <p>
          زیلاو با همکاری مستقیم با معتبرترین برندهای ایرانی و بین‌المللی، تمامی اجناس خود را با ضمانت صد در صد اصالت کالا و متریال درجه یک عرضه می‌نماید. تیم کنترل کیفیت زیلاو پیش از بسته‌بندی، سلامت و دقت دوخت هر سفارش را بررسی می‌نماید.
        </p>
      </div>
    ),
  },
  faq: {
    title: 'پرسش‌های متداول',
    subtitle: 'پاسخ به سوالات رایج شما درباره سفارش، پرداخت و ارسال',
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <h4 className="font-bold text-white text-sm">چگونه می‌توانم سفارش خود را ثبت کنم؟</h4>
          <p className="text-neutral-400 text-xs">کالای مورد نظر خود را انتخاب کرده، سایز و رنگ را برگزینید و با شماره موبایل خود وارد شوید تا سفارش شما ثبت گردد.</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <h4 className="font-bold text-white text-sm">سفارش من چند روزه تحویل داده می‌شود؟</h4>
          <p className="text-neutral-400 text-xs">سفارشات تهران ظرف ۲۴ ساعت و سفارشات شهرستان با پست پیشتاز ظرف ۲ الی ۳ روز کاری تحویل می‌گردند.</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
          <h4 className="font-bold text-white text-sm">آیا امکان بازگرداندن کالا وجود دارد؟</h4>
          <p className="text-neutral-400 text-xs">بله، تمامی سفارشات دارای ۷ روز ضمانت بازگشت رایگان در صورت عدم تطابق سایز یا نقص فنی می‌باشند.</p>
        </div>
      </div>
    ),
  },
  returns: {
    title: 'رویه‌های بازگرداندن کالا',
    subtitle: 'شرایط و مراحل استفاده از ضمانت ۷ روزه بازگشت وجه',
    content: (
      <div className="space-y-4">
        <p>
          رضایت شما اولویت اول زیلاو است. اگر به هر دلیلی از سایز، رنگ یا کیفیت محصول دریافتی رضایت ندارید، تا ۷ روز پس از دریافت بسته می‌توانید کالا را مرجوع نمایید.
        </p>
        <ul className="list-disc pr-5 space-y-2 text-xs">
          <li>کالا در شرایط اولیه، بدون بو و دارای تگ و بسته‌بندی اصلی باشد.</li>
          <li>اقلام بهداشتی و زیورآلات شخصی شامل رویه مرجوعی نمی‌باشند.</li>
          <li>مبلغ سفارش پس از دریافت کالا ظرف ۲۴ ساعت کاری به حساب شما عودت داده می‌شود.</li>
        </ul>
      </div>
    ),
  },
  guide: {
    title: 'راهنمای سایزبندی و خرید',
    subtitle: 'نکات کاربردی برای انتخاب دقیق سایز لباس و کفش',
    content: (
      <div className="space-y-4">
        <p>
          برای انتخاب دقیق سایز، راهنمای جدول سایز در صفحه هر محصول را مطالعه فرمایید و دور سینه، کمر و قد آستین خود را با متر اندازه بگیرید.
        </p>
      </div>
    ),
  },
  terms: {
    title: 'شرایط و قوانین استفاده',
    subtitle: 'قوانین و حریم خصوصی کاربران در فروشگاه زیلاو',
    content: (
      <div className="space-y-4">
        <p>
          استفاده از خدمات زیلاو به معنای پذیرش کلیه شرایط، ضوابط حفظ حریم خصوصی و قوانین تجارت الکترونیک جمهوری اسلامی ایران است.
        </p>
      </div>
    ),
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES_CONTENT[slug];
  if (!page) return { title: 'صفحه' };
  return {
    title: page.title,
    description: page.subtitle,
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const page = PAGES_CONTENT[slug];

  if (!page) notFound();

  return (
    <StorefrontShell>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">خانه</Link>
          <ChevronLeft className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-amber-400 font-bold">{page.title}</span>
        </nav>

        <div className="space-y-2 pb-6 border-b border-neutral-800">
          <h1 className="text-3xl font-black text-white">{page.title}</h1>
          <p className="text-sm text-neutral-400">{page.subtitle}</p>
        </div>

        <div className="text-sm text-neutral-300 leading-relaxed">
          {page.content}
        </div>
      </div>
    </StorefrontShell>
  );
}
