import { z } from 'zod';

export const TestimonialItemSchema = z.object({
  id: z.string().default('t-1'),
  author: z.string().default('امیرحسین رضایی'),
  role: z.string().default('معمار و خریدار وفادار'),
  quote: z.string().default(
    'کیفیت دوخت کت هاکوپیان و بسته‌بندی زیلاو فوق‌العاده بود. ارسال دقیقاً در بازه مقرر انجام شد و سایزبندی بی‌نقص بود.'
  ),
  rating: z.number().min(1).max(5).default(5),
  purchasedItem: z.string().optional().default('کت تک هاکوپیان'),
  avatarUrl: z.string().optional(),
});

export const TestimonialsSchema = z.object({
  title: z.string().default('نظرات و تجربیات خریداران زیلاو'),
  subtitle: z.string().optional().default('رضایت و اعتماد همراهان وفادار، بزرگ‌ترین افتخار ماست'),
  columns: z.number().int().min(1).max(3).default(3),
  items: z
    .array(TestimonialItemSchema)
    .default([
      {
        id: 't-1',
        author: 'امیرحسین رضایی',
        role: 'معمار، تهران',
        quote: 'کیفیت پارچه و برش پیراهن هاکوپیان کم‌نظیر بود. پشتیبانی زیلاو برای انتخاب دقیق سایز واقعاً صبورانه و حرفه‌ای راهنمایی کردند.',
        rating: 5,
        purchasedItem: 'پیراهن رسمی کلاسیک هاکوپیان',
      },
      {
        id: 't-2',
        author: 'سارا تهرانی',
        role: 'طراح گرافیک، شیراز',
        quote: 'بسته‌بندی بسیار شکیل و پاکیزه بود. تحویل اکسپرس به موقع انجام شد و جنس شومیز دقیقاً با توضیحات تطابق داشت.',
        rating: 5,
        purchasedItem: 'شومیز ابریشم زنانه',
      },
      {
        id: 't-3',
        author: 'نیما کمالی',
        role: 'مهندس نرم‌افزار، اصفهان',
        quote: 'کفش چرم طبیعی مارال چرم اصالت و بوی خوش چرم اصیل را به همراه دارد. از خرید خود از زیلاو بسیار خرسندم.',
        rating: 5,
        purchasedItem: 'کفش چرم کلاسیک قهوه‌ای',
      },
    ]),
});

export type TestimonialsProps = z.infer<typeof TestimonialsSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: TestimonialsProps = TestimonialsSchema.parse({});
