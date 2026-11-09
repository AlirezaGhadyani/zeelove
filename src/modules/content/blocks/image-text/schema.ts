import { z } from 'zod';

export const ImageTextSchema = z.object({
  title: z.string().default('هویت طراحی و هنر خیاطی زیلاو'),
  subtitle: z.string().default('ترکیب اصالت صنایع دستی ایرانی با خطوط دوخت معاصر'),
  description: z.string().default(
    'هر قطعه از پوشاک موجود در زیلاو از متریال‌های پایدار و طبیعی ساخته شده است. ما مفتخریم که در کنار تولیدکنندگان متعهد، تجربه‌ای از ماندگاری و وقار را برای شما به ارمغان می‌آوریم.'
  ),
  imageUrl: z.string().default('/assets/story/craftsmanship.jpg'),
  imagePosition: z.enum(['right', 'left']).default('right'),
  badge: z.string().optional().default('اصالت و ماندگاری'),
  ctaText: z.string().optional().default('داستان برند ما'),
  ctaLink: z.string().optional().default('/page/about'),
});

export type ImageTextProps = z.infer<typeof ImageTextSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: ImageTextProps = ImageTextSchema.parse({});
