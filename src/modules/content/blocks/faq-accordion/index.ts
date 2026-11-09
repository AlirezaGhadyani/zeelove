import type { BlockDefinition } from '../common/product-block-props';
import { FaqAccordionSchema, DEFAULT_PROPS, SCHEMA_VERSION, type FaqAccordionProps } from './schema';
import { FAQ_ACCORDION_FIELDS } from './editor';
import { FaqAccordionRender } from './render';

export const FaqAccordionBlock: BlockDefinition<FaqAccordionProps> = {
  type: 'faq-accordion',
  name: 'آکاردئون پرسش‌های متداول',
  description: 'لیست بازشونده پرسش‌های پرتکرار کاربران با دسترسی‌پذیری کامل',
  schemaVersion: SCHEMA_VERSION,
  schema: FaqAccordionSchema,
  defaults: DEFAULT_PROPS,
  editorFields: FAQ_ACCORDION_FIELDS,
  Render: FaqAccordionRender,
};
