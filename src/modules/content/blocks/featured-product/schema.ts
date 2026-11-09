import { z } from 'zod';

export const FeaturedProductSchema = z.object({
  title: z.string().default('محصول ویژه هفته: کت نیمه‌رسمی هاکوپیان'),
  subtitle: z.string().default('برش اختصاصی سه‌بعدی با الیاف ۱۰۰٪ طبیعی پشم مرینوس'),
  productId: z.string().optional().default('prod-1'),
  customImageUrl: z.string().optional().default('/assets/products/featured-jacket.jpg'),
  badgeText: z.string().default('پیشنهاد اختصاصی استایلیست'),
  bulletPoints: z.array(z.string()).default([
    'دوخت تمام صنعتی با استانداردهای بین‌المللی',
    'آستری تمام ابریشم ضدتعریق با قابلیت تنفس',
    'گارانتی تطابق سایز و تعویض رایگان تا ۷ روز',
  ]),
  ctaText: z.string().default('مشاهده جزئیات و خرید'),
  ctaLink: z.string().default('/products/hakopian-classic-shirt'),
  showPrice: z.boolean().default(true),
});

export type FeaturedProductProps = z.infer<typeof FeaturedProductSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: FeaturedProductProps = FeaturedProductSchema.parse({});
