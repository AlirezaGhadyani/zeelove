import type { BlockDefinition } from '../common/product-block-props';
import { FeaturesListSchema, DEFAULT_PROPS, SCHEMA_VERSION, type FeaturesListProps } from './schema';
import { FEATURES_LIST_FIELDS } from './editor';
import { FeaturesListRender } from './render';

export const FeaturesListBlock: BlockDefinition<FeaturesListProps> = {
  type: 'features-list',
  name: 'لیست مزایا و نمادهای اعتماد',
  description: 'نمایش ویژگی‌ها، نمادهای اعتماد، ضمانت اصالت و خدمات مشتریان با آیکون‌های متناسب',
  schemaVersion: SCHEMA_VERSION,
  schema: FeaturesListSchema,
  defaults: DEFAULT_PROPS,
  editorFields: FEATURES_LIST_FIELDS,
  Render: FeaturesListRender,
};
