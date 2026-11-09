import type { BlockDefinition } from '../common/product-block-props';
import { ImageTextSchema, DEFAULT_PROPS, SCHEMA_VERSION, type ImageTextProps } from './schema';
import { IMAGE_TEXT_FIELDS } from './editor';
import { ImageTextRender } from './render';

export const ImageTextBlock: BlockDefinition<ImageTextProps> = {
  type: 'image-text',
  name: 'تصویر و متن ترکیبی',
  description: 'ترکیب دوتایی تصویر و متن با دکمه اقدام جهت داستان‌سرایی و معرفی محصول یا برند',
  schemaVersion: SCHEMA_VERSION,
  schema: ImageTextSchema,
  defaults: DEFAULT_PROPS,
  editorFields: IMAGE_TEXT_FIELDS,
  Render: ImageTextRender,
};
