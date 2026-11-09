import { z } from 'zod';

export const BrandItemSchema = z.object({
  id: z.string().default('br-1'),
  name: z.string().default('هاکوپیان'),
  slug: z.string().default('hakopian'),
  logoUrl: z.string().optional(),
});

export const BrandStripSchema = z.object({
  title: z.string().default('برندهای برگزیده و رسمی در زیلاو'),
  subtitle: z.string().optional().default('همکاری با معتبرترین خانه‌های مد و تولیدکنندگان اصیل ایرانی'),
  autoFetch: z.boolean().default(true),
  brandIds: z.array(z.string()).default([]),
  items: z
    .array(BrandItemSchema)
    .default([
      { id: 'b-1', name: 'هاکوپیان', slug: 'hakopian' },
      { id: 'b-2', name: 'مارال چرم', slug: 'maral-charm' },
      { id: 'b-3', name: 'بادی اسپینر', slug: 'body-spinner' },
      { id: 'b-4', name: 'ال‌سی من', slug: 'lc-man' },
      { id: 'b-5', name: 'چرم مشهد', slug: 'mashhad-leather' },
    ]),
});

export type BrandStripProps = z.infer<typeof BrandStripSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: BrandStripProps = BrandStripSchema.parse({});
