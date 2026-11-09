import type { BlockDefinition } from '../common/product-block-props';
import type { DataNeed } from '../common/data-needs';
import { ProductGridSchema, DEFAULT_PROPS, SCHEMA_VERSION, type ProductGridProps } from './schema';
import { PRODUCT_GRID_FIELDS } from './editor';
import { ProductGridRender } from './render';

export const ProductGridBlock: BlockDefinition<ProductGridProps> = {
  type: 'product-grid',
  name: 'شبکه محصولات',
  description: 'نمایش شبکه‌ای محصولات در ستون‌های واکنش‌گرا با فیلتر قانون و قیمت',
  schemaVersion: SCHEMA_VERSION,
  schema: ProductGridSchema,
  defaults: DEFAULT_PROPS,
  editorFields: PRODUCT_GRID_FIELDS,
  Render: ProductGridRender,
  getDataNeeds: (props) => [
    {
      type: 'collection',
      rule: props.rule,
      categoryId: props.categoryId,
      brandId: props.brandId,
      productIds: props.productIds,
      limit: props.limit,
    },
  ],
};
