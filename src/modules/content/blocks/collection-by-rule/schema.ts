import { z } from 'zod';
import { ProductBlockBaseSchema } from '../common/product-block-props';

export const CollectionByRuleSchema = ProductBlockBaseSchema.extend({
  title: z.string().default('مجموعه مد و استایل برگزیده'),
  subtitle: z.string().optional().default('انتخاب هوشمند متناسب با سلیقه شما'),
  rule: z
    .enum(['newest', 'discounted', 'best_selling', 'by_category', 'by_brand', 'manual'])
    .default('best_selling'),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  productIds: z.array(z.string()).default([]),
  displayType: z.enum(['grid', 'carousel']).default('grid'),
  columns: z.number().int().min(2).max(5).default(4),
});

export type CollectionByRuleProps = z.infer<typeof CollectionByRuleSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: CollectionByRuleProps = CollectionByRuleSchema.parse({});
