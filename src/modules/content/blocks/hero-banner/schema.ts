import { z } from 'zod';

export const HeroBannerSchema = z.object({
  title: z.string().default('تجربه خریدی اصیل، مدرن و متمایز'),
  subtitle: z.string().default('مجموعه‌ای برگزیده از برترین برندهای ایرانی و بین‌المللی با ضمانت اصالت'),
  kicker: z.string().optional().default('فروشگاه تخصصی مد و پوشاک زیلاو'),
  ctaText: z.string().default('مشاهده مجموعه جدید'),
  ctaLink: z.string().default('/products'),
  secondaryCtaText: z.string().optional().default('برندهای برتر'),
  secondaryCtaLink: z.string().optional().default('/products?sort=popular'),
  imageUrl: z.string().default('/assets/hero/hero-fashion.jpg'),
  align: z.enum(['right', 'center', 'left']).default('right'),
  height: z.enum(['sm', 'md', 'lg', 'full']).default('md'),
  overlayOpacity: z.number().min(0).max(100).default(40),
});

export type HeroBannerProps = z.infer<typeof HeroBannerSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: HeroBannerProps = HeroBannerSchema.parse({});
