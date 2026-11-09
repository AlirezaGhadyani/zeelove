import { z } from 'zod';

export const FaqItemSchema = z.object({
  id: z.string().default('faq-1'),
  question: z.string().default('چگونه می‌توانم از اصالت پوشاک و کالاهای زیلاو مطمئن شوم؟'),
  answer: z.string().default(
    'تمام برندهای همکار در زیلاو، دارای نمایندگی رسمی و گواهی اصالت کالا هستند. کالاها با برچسب اصالت و در بسته‌بندی پلمپ شده اختصاصی برای شما ارسال می‌گردند.'
  ),
});

export const FaqAccordionSchema = z.object({
  title: z.string().default('پرسش‌های متداول مشتریان زیلاو'),
  subtitle: z.string().optional().default('پاسخ به سوالات پرتکرار درباره ارسال، گارانتی و شیوه سفارش'),
  items: z
    .array(FaqItemSchema)
    .default([
      {
        id: 'faq-1',
        question: 'چگونه می‌توانم از اصالت پوشاک و کالاهای زیلاو مطمئن شوم؟',
        answer: 'تمامی برندهای همکار در زیلاو، دارای نمایندگی رسمی و گواهی اصالت کالا هستند. کالاها با برچسب اصالت و در بسته‌بندی پلمپ شده اختصاصی برای شما ارسال می‌گردند.',
      },
      {
        id: 'faq-2',
        question: 'شرایط تعویض سایز و مرجوعی کالا چگونه است؟',
        answer: 'در صورت عدم تطابق سایز یا هرگونه نارضایتی، تا ۷ روز پس از دریافت سفارش می‌توانید بدون کسر هزینه، کالا را با هماهنگی پشتیبانی تعویض یا مرجوع کنید.',
      },
      {
        id: 'faq-3',
        question: 'زمان تحویل سفارش‌ها در تهران و شهرستان‌ها چقدر است؟',
        answer: 'سفارش‌های شهر تهران در همان روز یا روز کاری بعد به صورت اکسپرس تحویل داده می‌شوند و سفارش‌های سایر استان‌ها بین ۲ الی ۳ روز کاری از طریق پست پیشتاز به دست شما می‌رسد.',
      },
    ]),
});

export type FaqAccordionProps = z.infer<typeof FaqAccordionSchema>;
export const SCHEMA_VERSION = 1;
export const DEFAULT_PROPS: FaqAccordionProps = FaqAccordionSchema.parse({});
