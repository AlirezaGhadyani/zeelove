import { z } from 'zod';
import type { DataNeed, ResolvedBlockData } from './data-needs';

export const ProductBlockBaseSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().optional().default(''),
  viewAllUrl: z.string().optional().default(''),
  viewAllLabel: z.string().default('مشاهده همه'),
  cardVariant: z.enum(['default', 'compact', 'minimal']).default('default'),
  aspectRatio: z.enum(['1:1', '3:4', '4:3', '16:9']).default('3:4'),
  showPrice: z.boolean().default(true),
  showRating: z.boolean().default(true),
  showBadges: z.boolean().default(true),
  limit: z.number().int().min(1).max(24).default(8),
  itemsPerRow: z
    .object({
      mobile: z.number().min(1).max(3).default(2),
      tablet: z.number().min(2).max(4).default(3),
      desktop: z.number().min(2).max(6).default(4),
    })
    .default({
      mobile: 2,
      tablet: 3,
      desktop: 4,
    }),
});

export type ProductBlockBaseProps = z.infer<typeof ProductBlockBaseSchema>;

export interface EditorField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'number'
    | 'select'
    | 'boolean'
    | 'color'
    | 'image'
    | 'array';
  options?: Array<{ label: string; value: string | number }>;
  description?: string;
}

export interface BlockDefinition<TProps = Record<string, unknown>> {
  type: string;
  name: string;
  description: string;
  schemaVersion: number;
  schema: z.ZodType<TProps>;
  defaults: TProps;
  editorFields: EditorField[];
  Render: React.ComponentType<{ props: TProps; data?: ResolvedBlockData }>;
  getDataNeeds?: (props: TProps) => DataNeed[];
}
