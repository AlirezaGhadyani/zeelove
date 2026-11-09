import type { BlockDefinition } from '../common/product-block-props';
import { SpacerDividerSchema, DEFAULT_PROPS, SCHEMA_VERSION, type SpacerDividerProps } from './schema';
import { SPACER_DIVIDER_FIELDS } from './editor';
import { SpacerDividerRender } from './render';

export const SpacerDividerBlock: BlockDefinition<SpacerDividerProps> = {
  type: 'spacer-divider',
  name: 'فاصله‌انداز و جداکننده',
  description: 'تنظیم فاصله عمودی بین ردیف‌ها و خطوط جداکننده ساختار محتوا',
  schemaVersion: SCHEMA_VERSION,
  schema: SpacerDividerSchema,
  defaults: DEFAULT_PROPS,
  editorFields: SPACER_DIVIDER_FIELDS,
  Render: SpacerDividerRender,
};
