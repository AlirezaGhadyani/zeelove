import { z } from 'zod';

export const FeatureItemSchema = z.object({
  id: z.string().default('f-1'),
  title: z.string().default('ضمانت ۱۰۰٪ اصالت کالا'),
  description: z.string().default('تضمین اصالت کالا از مراجع رسمی و برندها'),
  icon: z
    .enum(['shield', 'truck', 'rotate', 'headset', 'credit-card', 'sparkles'])
    .default('shield'),
});

export const FeaturesListSchema = z.object({
  title: z.string().optional().default(''),
  subtitle: z.string().optional().default(''),
  columns: z.number().int().min(2).max(4).default(4),
  bordered: z.boolean().default(true),
  items: z
    .array(FeatureItemSchema)
    .default([
      {
        id: 'f-1',
        title: 'ضمانت ۱۰۰٪ اصالت کالا',
        description: 'تضمین اصالت از نمایندگی‌های رسمی برندها',
        icon: 'shield',
      },
      {
        id: 'f-2',
        title: 'ارسال سریع و مطمئن',
        description: 'تحویل اکسپرس در تهران و ارسال سراسری پیشتاز',
        icon: 'truck',
      },
      {
        id: 'f-3',
        title: '۷ روز ضمانت بازگشت',
        description: 'امکان مرجوعی کالا در صورت عدم رضایت یا عدم تطابق سایز',
        icon: 'rotate',
      },
      {
        id: 'f-4',
        title: 'پشتیبانی اختصاصی',
        description: 'مشاوره استایل و پاسخگویی به سوالات شما',
        icon: 'headset',
      },
    ]),
});

export type FeaturesListProps = z.infer<typeof FeaturesListSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: FeaturesListProps = FeaturesListSchema.parse({});
