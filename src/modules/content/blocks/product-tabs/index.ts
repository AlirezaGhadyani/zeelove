import type { BlockDefinition } from '../common/product-block-props';
import type { DataNeed } from '../common/data-needs';
import { ProductTabsSchema, DEFAULT_PROPS, SCHEMA_VERSION, type ProductTabsProps } from './schema';
import { PRODUCT_TABS_FIELDS } from './editor';
import { ProductTabsRender } from './render';

export const ProductTabsBlock: BlockDefinition<ProductTabsProps> = {
  type: 'product-tabs',
  name: 'تب‌های محصولات',
  description: 'تب‌های پویا برای دسته‌بندی و مقایسه محصولات پرفروش، جدید و تخفیف‌دار',
  schemaVersion: SCHEMA_VERSION,
  schema: ProductTabsSchema,
  defaults: DEFAULT_PROPS,
  editorFields: PRODUCT_TABS_FIELDS,
  Render: ProductTabsRender,
  getDataNeeds: (props) => [
    {
      type: 'collection',
      rule: 'newest',
      limit: props.limit * 2,
    },
  ],
};
