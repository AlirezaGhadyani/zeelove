import type { BlockDefinition } from '../common/product-block-props';
import { NewsletterSignupSchema, DEFAULT_PROPS, SCHEMA_VERSION, type NewsletterSignupProps } from './schema';
import { NEWSLETTER_SIGNUP_FIELDS } from './editor';
import { NewsletterSignupRender } from './render';

export const NewsletterSignupBlock: BlockDefinition<NewsletterSignupProps> = {
  type: 'newsletter-signup',
  name: 'عضویت در خبرنامه',
  description: 'فرم دریافت شماره یا ایمیل مشتریان برای خبرنامه و اطلاع‌رسانی تخفیف‌ها',
  schemaVersion: SCHEMA_VERSION,
  schema: NewsletterSignupSchema,
  defaults: DEFAULT_PROPS,
  editorFields: NEWSLETTER_SIGNUP_FIELDS,
  Render: NewsletterSignupRender,
};
