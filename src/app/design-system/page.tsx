'use client';

import React, { useState } from 'react';
import { Wordmark } from '@/shared/ui/brand/wordmark';
import { Container } from '@/shared/ui/layout/container';
import { Section } from '@/shared/ui/layout/section';
import { Grid } from '@/shared/ui/layout/grid';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { Badge } from '@/shared/ui/primitives/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui/primitives/card';
import { Switch } from '@/shared/ui/primitives/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/primitives/tabs';
import { ProductCard } from '@/shared/ui/commerce/product-card';
import { PriceTag } from '@/shared/ui/commerce/price-tag';
import { RatingStars } from '@/shared/ui/commerce/rating-stars';
import { QuantityStepper } from '@/shared/ui/commerce/quantity-stepper';
import { StockBadge } from '@/shared/ui/commerce/stock-badge';
import { EmptyState } from '@/shared/ui/commerce/empty-state';
import { PageHeader } from '@/shared/ui/commerce/page-header';
import { Toaster, toast } from '@/shared/ui/primitives/toast';
import { Sun, Moon } from 'lucide-react';

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(true);
  const [stepperVal, setStepperVal] = useState(2);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div
      className={`min-h-screen ${isDark ? 'dark bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'} transition-colors duration-200`}
    >
      <Toaster />
      <header className="border-b border-neutral-800/80 sticky top-0 bg-neutral-900/60 backdrop-blur-md z-40">
        <Container size="xl" className="h-16 flex items-center justify-between">
          <Wordmark size="md" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-2"
              aria-label="تغییر تم"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              <span>{isDark ? 'حالت روشن' : 'حالت تاریک'}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => toast.success('پیام تستی با فونت وزیرمتن و راست‌چین فعال شد!')}
            >
              تست نوتیفیکیشن
            </Button>
          </div>
        </Container>
      </header>

      <main className="py-10">
        <Container size="xl" className="space-y-12">
          <PageHeader
            title="سیستم طراحی زیلاو (zeelove design system)"
            description="مجموعه کامل کامپوننت‌های پایه‌ای، استایل‌های راست‌چین (RTL)، تایپوگرافی فارسی و المان‌های تجارت الکترونیک بر پایه توکن‌های دیزاین."
            badge={<Badge variant="warning">فاز ۲ - فونداسیون دیزاین</Badge>}
          />

          <Tabs defaultValue="commerce">
            <TabsList>
              <TabsTrigger value="commerce">کامپوننت‌های فروشگاهی</TabsTrigger>
              <TabsTrigger value="primitives">المان‌های رابط کاربری</TabsTrigger>
              <TabsTrigger value="tokens">پالت رنگ و تایپوگرافی</TabsTrigger>
            </TabsList>

            <TabsContent value="commerce" className="space-y-8 pt-4">
              <Section spacing="none">
                <h3 className="text-xl font-bold mb-4 text-white">
                  کارت‌های محصول (۴ مدل متناسب با طراحی)
                </h3>
                <Grid cols={3} gap="lg">
                  <ProductCard
                    id="p1"
                    title="ساعت مچی کلاسیک نگین‌دار زیلاو مدل رویال"
                    category="اکسسوری و جواهرات"
                    price={2850000}
                    compareAtPrice={3500000}
                    stock={3}
                    variant="detailed"
                    onAddToCart={(id) => toast.success(`محصول ${id} به سبد افزوده شد`)}
                  />
                  <ProductCard
                    id="p2"
                    title="کیف چرم طبیعی دست‌دوز کالکشن پاییزه"
                    category="مد و پوشاک"
                    price={1420000}
                    stock={12}
                    variant="minimal"
                  />
                  <ProductCard
                    id="p3"
                    title="عطر اختصاصی زیلاو نایت الکسیر ۱۰۰ میل"
                    category="آرایشی و بهداشتی"
                    price={4900000}
                    compareAtPrice={5400000}
                    stock={0}
                    variant="overlay"
                  />
                </Grid>
              </Section>

              <Section spacing="none">
                <h3 className="text-xl font-bold mb-4 text-white">المان‌های قیمت و استپر تعداد</h3>
                <Card>
                  <CardContent className="p-6 flex flex-wrap items-center justify-between gap-6">
                    <PriceTag price={1890000} compareAtPrice={2300000} />
                    <QuantityStepper value={stepperVal} onChange={setStepperVal} />
                    <RatingStars rating={4.9} reviewCount={84} />
                    <StockBadge stock={2} />
                  </CardContent>
                </Card>
              </Section>

              <Section spacing="none">
                <EmptyState
                  title="سبد خرید شما خالی است"
                  description="برای مشاهده محصولات جذاب و پیشنهادهای ویژه به بخش کاتالوگ فروشگاه مراجعه فرمایید."
                  action={<Button variant="default">مشاهده کاتالوگ محصولات</Button>}
                />
              </Section>
            </TabsContent>

            <TabsContent value="primitives" className="space-y-8 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>دکمه‌ها و نشان‌ها</CardTitle>
                  <CardDescription>انواع استایل دکمه با جهت‌بندی صحیح راست‌چین</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="default">دکمه اصلی (Primary)</Button>
                  <Button variant="secondary">دکمه فرعی</Button>
                  <Button variant="outline">حاشیه‌دار (Outline)</Button>
                  <Button variant="destructive">حذف و اخطار</Button>
                  <Badge variant="default">پیش‌فرض</Badge>
                  <Badge variant="success">موفقیت‌آمیز</Badge>
                  <Badge variant="warning">هشدار</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>فیلدهای ورودی و سوئیچ</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="نام و نام خانوادگی..." />
                  <div className="flex items-center gap-3">
                    <Switch id="sw" defaultChecked />
                    <label htmlFor="sw" className="text-sm">
                      فعال‌سازی اطلاع‌رسانی پیامکی
                    </label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>پالت رنگی زعفرانی اختصاصی (Saffron Accent & Obsidian Base)</CardTitle>
                  <CardDescription>
                    هارمونی عمیق زغال‌سنگی با هایلایت طلایی-زعفرانی متناسب با برند لوکس ایرانی زیلاو
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-lg bg-amber-500 text-neutral-950 font-bold">
                      Accent Saffron (#f59e0b)
                    </div>
                    <div className="p-4 rounded-lg bg-neutral-900 text-white border border-neutral-800">
                      Obsidian 900
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Success (#10b981)
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                      Danger (#ef4444)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
    </div>
  );
}
