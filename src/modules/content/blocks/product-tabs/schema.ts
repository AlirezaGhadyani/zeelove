import { z } from 'zod';
import { ProductBlockBaseSchema } from '../common/product-block-props';

export const ProductTabItemSchema = z.object({
  id: z.string().default('tab-1'),
  label: z.string().default('جدیدترین‌ها'),
  rule: z
    .enum(['newest', 'discounted', 'best_selling', 'by_category', 'by_brand'])
    .default('newest'),
  categoryId: z.string().optional(),
});

export const ProductTabsSchema = ProductBlockBaseSchema.extend({
  title: z.string().default('مجموعه‌های برگزیده زیلاو'),
  subtitle: z.string().optional().default('بررسی محبوب‌ترین انتخاب‌های کاربران در دسته‌بندی‌های مختلف'),
  tabs: z
    .array(ProductTabItemSchema)
    .default([
      { id: 'tab-new', label: 'تازه‌ترین‌ها', rule: 'newest' },
      { id: 'tab-disc', label: 'تخفیف‌های ویژه', rule: 'discounted' },
      { id: 'tab-pop', label: 'محبوب‌ترین‌ها', rule: 'best_selling' },
    ]),
  columns: z.number().int().min(2).max(5).default(4),
});

export type ProductTabsProps = z.infer<typeof ProductTabsSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: ProductTabsProps = ProductTabsSchema.parse({});
