import { z } from 'zod';

export const SpacerDividerSchema = z.object({
  height: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl']).default('md'),
  showDivider: z.boolean().default(false),
  dividerStyle: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
});

export type SpacerDividerProps = z.infer<typeof SpacerDividerSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: SpacerDividerProps = SpacerDividerSchema.parse({});
