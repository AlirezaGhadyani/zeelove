import { z } from 'zod';

export const PromoCountdownSchema = z.object({
  title: z.string().default('فروش ویژه پایان فصل زیلاو'),
  subtitle: z.string().default('تا ۴۰٪ تخفیف روی منتخب البسه رسمی و راحتی'),
  badge: z.string().default('فرصت محدود'),
  targetEndDate: z
    .string()
    .default(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()),
  ctaText: z.string().default('مشاهده تخفیف‌های ویژه'),
  ctaLink: z.string().default('/products?filter=discounted'),
  imageUrl: z.string().optional().default('/assets/banners/promo-countdown.jpg'),
});

export type PromoCountdownProps = z.infer<typeof PromoCountdownSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: PromoCountdownProps = PromoCountdownSchema.parse({});
