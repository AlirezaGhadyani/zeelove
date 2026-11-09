import { z } from 'zod';

export const NewsletterSignupSchema = z.object({
  title: z.string().default('عضویت در خبرنامه و باشگاه مشتریان زیلاو'),
  subtitle: z.string().default('از آخرین تخفیف‌های فصلی و محصولات تازه زودتر از دیگران باخبر شوید'),
  placeholder: z.string().default('شماره همراه یا ایمیل خود را وارد کنید...'),
  buttonText: z.string().default('عضویت در خبرنامه'),
  disclaimer: z.string().default('اطلاعات شما نزد زیلاو محفوظ است و هیچ‌گونه پیامک تبلیغاتی نامرتبط ارسال نخواهد شد.'),
});

export type NewsletterSignupProps = z.infer<typeof NewsletterSignupSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: NewsletterSignupProps = NewsletterSignupSchema.parse({});
