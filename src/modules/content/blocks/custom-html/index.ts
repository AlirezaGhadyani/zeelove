import type { BlockDefinition } from '../common/product-block-props';
import { CustomHtmlSchema, DEFAULT_PROPS, SCHEMA_VERSION, type CustomHtmlProps } from './schema';
import { CUSTOM_HTML_FIELDS } from './editor';
import { CustomHtmlRender } from './render';

export const CustomHtmlBlock: BlockDefinition<CustomHtmlProps> = {
  type: 'custom-html',
  name: 'کد سفارشی HTML',
  description: 'درج قطعه کد HTML سفارشی با ایمن‌سازی خودکار و سطح دسترسی ادمین کل',
  schemaVersion: SCHEMA_VERSION,
  schema: CustomHtmlSchema,
  defaults: DEFAULT_PROPS,
  editorFields: CUSTOM_HTML_FIELDS,
  Render: CustomHtmlRender,
};
