import { z } from 'zod';

export const CategoryTileItemSchema = z.object({
  id: z.string().default('cat-1'),
  name: z.string().default('پوشاک مردانه'),
  slug: z.string().default('men'),
  imageUrl: z.string().default('/assets/categories/men.jpg'),
  count: z.number().optional().default(0),
});

export const CategoryTilesSchema = z.object({
  title: z.string().default('دسته‌بندی‌های برگزیده زیلاو'),
  subtitle: z.string().optional().default('محصولات متناسب با استایل مورد علاقه خود را انتخاب کنید'),
  style: z.enum(['rounded', 'square', 'minimal']).default('rounded'),
  columns: z.number().int().min(2).max(6).default(4),
  autoFetch: z.boolean().default(true),
  categoryIds: z.array(z.string()).default([]),
  items: z.array(CategoryTileItemSchema).default([
    { id: 'cat-women', name: 'پوشاک زنانه', slug: 'women', imageUrl: '/assets/categories/women.jpg' },
    { id: 'cat-men', name: 'پوشاک مردانه', slug: 'men', imageUrl: '/assets/categories/men.jpg' },
    { id: 'cat-shoes', name: 'کیف و کفش چرم', slug: 'shoes-and-bags', imageUrl: '/assets/categories/shoes.jpg' },
    { id: 'cat-acc', name: 'اکسسوری و ساعت', slug: 'accessories', imageUrl: '/assets/categories/accessories.jpg' },
  ]),
});

export type CategoryTilesProps = z.infer<typeof CategoryTilesSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: CategoryTilesProps = CategoryTilesSchema.parse({});
