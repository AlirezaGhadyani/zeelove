import type { Metadata } from 'next';
import { vazirmatn } from '@/shared/ui/tokens/font';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | زیلاو',
    default: 'زیلاو',
  },
  description: 'زیلاو - پلتفرم فروشگاهی و مدیریت محتوای اختصاصی با پشتیبانی کامل از زبان فارسی و راست‌چین',
  openGraph: {
    title: 'زیلاو',
    description: 'زیلاو - پلتفرم فروشگاهی و مدیریت محتوای اختصاصی با پشتیبانی کامل از زبان فارسی و راست‌چین',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} font-sans`}>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen antialiased selection:bg-amber-500 selection:text-neutral-950">
        {children}
      </body>
    </html>
  );
}
