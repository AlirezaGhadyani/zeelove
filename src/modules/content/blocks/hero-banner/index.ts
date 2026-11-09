import type { BlockDefinition } from '../common/product-block-props';
import { HeroBannerSchema, DEFAULT_PROPS, SCHEMA_VERSION, type HeroBannerProps } from './schema';
import { HERO_BANNER_FIELDS } from './editor';
import { HeroBannerRender } from './render';

export const HeroBannerBlock: BlockDefinition<HeroBannerProps> = {
  type: 'hero-banner',
  name: 'بنر اصلی (Hero)',
  description: 'بنر تصویر بزرگ با عنوان شاخص، زیرعنوان و دکمه‌های اقدام',
  schemaVersion: SCHEMA_VERSION,
  schema: HeroBannerSchema,
  defaults: DEFAULT_PROPS,
  editorFields: HERO_BANNER_FIELDS,
  Render: HeroBannerRender,
};
