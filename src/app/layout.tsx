import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | زیلاو',
    default: 'زیلاو',
  },
  description: 'زیلاو - پلتفرم تجارت الکترونیک بومی و سیستم مدیریت محتوای اختصاصی',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen antialiased selection:bg-amber-500 selection:text-neutral-950">
        {children}
      </body>
    </html>
  );
}
