import { z } from 'zod';

export const CustomHtmlSchema = z.object({
  title: z.string().optional().default(''),
  html: z
    .string()
    .default(
      '<div class="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">محتوای سفارشی HTML زیلاو</div>'
    ),
});

export type CustomHtmlProps = z.infer<typeof CustomHtmlSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: CustomHtmlProps = CustomHtmlSchema.parse({});
