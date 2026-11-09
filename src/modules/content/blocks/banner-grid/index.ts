import type { BlockDefinition } from '../common/product-block-props';
import { BannerGridSchema, DEFAULT_PROPS, SCHEMA_VERSION, type BannerGridProps } from './schema';
import { BANNER_GRID_FIELDS } from './editor';
import { BannerGridRender } from './render';

export const BannerGridBlock: BlockDefinition<BannerGridProps> = {
  type: 'banner-grid',
  name: 'شبکه بنرهای تبلیغاتی',
  description: 'کارت‌های بنر تبلیغاتی یا دسته‌بندی با چیدمان شبکه‌ای',
  schemaVersion: SCHEMA_VERSION,
  schema: BannerGridSchema,
  defaults: DEFAULT_PROPS,
  editorFields: BANNER_GRID_FIELDS,
  Render: BannerGridRender,
};
