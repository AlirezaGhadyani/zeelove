import type { BlockDefinition } from '../common/product-block-props';
import { CategoryTilesSchema, DEFAULT_PROPS, SCHEMA_VERSION, type CategoryTilesProps } from './schema';
import { CATEGORY_TILES_FIELDS } from './editor';
import { CategoryTilesRender } from './render';

export const CategoryTilesBlock: BlockDefinition<CategoryTilesProps> = {
  type: 'category-tiles',
  name: 'تایل‌های دسته‌بندی',
  description: 'نمایش آیکونیک یا تصویری دسته‌بندی‌های کالاها با پیوند مستقیم',
  schemaVersion: SCHEMA_VERSION,
  schema: CategoryTilesSchema,
  defaults: DEFAULT_PROPS,
  editorFields: CATEGORY_TILES_FIELDS,
  Render: CategoryTilesRender,
  getDataNeeds: (props) => {
    if (!props.autoFetch) return [];
    return [
      {
        type: 'categories',
        ids: props.categoryIds && props.categoryIds.length > 0 ? props.categoryIds : undefined,
        limit: (props.columns || 4) * 2,
      },
    ];
  },
};
