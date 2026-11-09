import { z } from 'zod';
import { ProductBlockBaseSchema } from '../common/product-block-props';

export const ProductGridSchema = ProductBlockBaseSchema.extend({
  title: z.string().default('جدیدترین محصولات زیلاو'),
  subtitle: z.string().optional().default('جدیدترین مدل‌های پوشاک و استایل اضافه شده به فروشگاه'),
  rule: z
    .enum(['newest', 'discounted', 'best_selling', 'by_category', 'by_brand', 'manual'])
    .default('newest'),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  productIds: z.array(z.string()).default([]),
  columns: z.number().int().min(2).max(5).default(4),
  viewAllUrl: z.string().optional().default('/products'),
});

export type ProductGridProps = z.infer<typeof ProductGridSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: ProductGridProps = ProductGridSchema.parse({});
