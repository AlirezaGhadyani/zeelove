import type { BlockDefinition } from '../common/product-block-props';
import type { DataNeed } from '../common/data-needs';
import { ProductCarouselSchema, DEFAULT_PROPS, SCHEMA_VERSION, type ProductCarouselProps } from './schema';
import { PRODUCT_CAROUSEL_FIELDS } from './editor';
import { ProductCarouselRender } from './render';

export const ProductCarouselBlock: BlockDefinition<ProductCarouselProps> = {
  type: 'product-carousel',
  name: 'گردونه محصولات',
  description: 'اسلایدر افقی محصولات با انتخاب خودکار یا دستی بر اساس قانون',
  schemaVersion: SCHEMA_VERSION,
  schema: ProductCarouselSchema,
  defaults: DEFAULT_PROPS,
  editorFields: PRODUCT_CAROUSEL_FIELDS,
  Render: ProductCarouselRender,
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
