import { z } from 'zod';
import { ProductBlockBaseSchema } from '../common/product-block-props';

export const ProductCarouselSchema = ProductBlockBaseSchema.extend({
  title: z.string().default('پیشنهادات شگفت‌انگیز زیلاو'),
  subtitle: z.string().optional().default('تخفیف‌های ویژه روی برترین برندهای منتخب این هفته'),
  rule: z
    .enum(['newest', 'discounted', 'best_selling', 'by_category', 'by_brand', 'manual'])
    .default('discounted'),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  productIds: z.array(z.string()).default([]),
  viewAllUrl: z.string().optional().default('/products?filter=discounted'),
});

export type ProductCarouselProps = z.infer<typeof ProductCarouselSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: ProductCarouselProps = ProductCarouselSchema.parse({});
