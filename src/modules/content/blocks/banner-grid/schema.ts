import { z } from 'zod';

export const BannerItemSchema = z.object({
  id: z.string().default('b-1'),
  title: z.string().default('مجموعه پاییزه هاکوپیان'),
  subtitle: z.string().optional().default('طراحی اصیل با دوخت تمام صنعتی'),
  badge: z.string().optional().default('برگزیده فصل'),
  imageUrl: z.string().default('/assets/banners/men-banner.jpg'),
  linkUrl: z.string().default('/category/men'),
  span: z.enum(['1', '2']).default('1'),
});

export const BannerGridSchema = z.object({
  title: z.string().optional().default(''),
  subtitle: z.string().optional().default(''),
  columns: z.number().int().min(1).max(4).default(2),
  gap: z.enum(['sm', 'md', 'lg']).default('md'),
  items: z
    .array(BannerItemSchema)
    .default([
      {
        id: 'b-1',
        title: 'کت و شلوار و پوشاک رسمی',
        subtitle: 'ظرافت دوخت و اصالت پارچه',
        badge: 'مجموعه مردانه',
        imageUrl: '/assets/banners/men-banner.jpg',
        linkUrl: '/category/men',
        span: '1',
      },
      {
        id: 'b-2',
        title: 'شومیز و مانتوهای مجلسی',
        subtitle: 'استایلی آرام، مینیمال و متین',
        badge: 'مجموعه زنانه',
        imageUrl: '/assets/banners/women-banner.jpg',
        linkUrl: '/category/women',
        span: '1',
      },
    ]),
});

export type BannerGridProps = z.infer<typeof BannerGridSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: BannerGridProps = BannerGridSchema.parse({});
