import { z } from 'zod';

export const RichTextSchema = z.object({
  title: z.string().optional().default('درباره استانداردهای کیفی زیلاو'),
  lead: z.string().optional().default('ما باور داریم خرید پوشاک اصیل، یک سرمایه‌گذاری برای استایل و اعتمادبه‌نفس شماست.'),
  content: z.string().default(
    'در زیلاو تمامی اجناس پیش از درج در وب‌سایت، توسط کارشناسان خبره نساجی و طراحی مد از نظر کیفیت بافت، دوخت و ماندگاری الیاف بررسی می‌شوند. ما با تولیدکنندگان معتبر و برندهای دارای هویت همکاری می‌کنیم تا آسودگی خاطر شما را تضمین کنیم.'
  ),
  align: z.enum(['right', 'center', 'left']).default('right'),
  maxWidth: z.enum(['prose', 'lg', 'xl', 'full']).default('prose'),
});

export type RichTextProps = z.infer<typeof RichTextSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: RichTextProps = RichTextSchema.parse({});
