import type { BlockDefinition } from '../common/product-block-props';
import { RichTextSchema, DEFAULT_PROPS, SCHEMA_VERSION, type RichTextProps } from './schema';
import { RICH_TEXT_FIELDS } from './editor';
import { RichTextRender } from './render';

export const RichTextBlock: BlockDefinition<RichTextProps> = {
  type: 'rich-text',
  name: 'متن روان / مقاله',
  description: 'بخش متنی تحریریه برای مقالات، بیانیه‌ها یا معرفی برند با تایپوگرافی خوانا',
  schemaVersion: SCHEMA_VERSION,
  schema: RichTextSchema,
  defaults: DEFAULT_PROPS,
  editorFields: RICH_TEXT_FIELDS,
  Render: RichTextRender,
};
