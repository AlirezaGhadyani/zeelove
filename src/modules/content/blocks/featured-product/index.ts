import type { BlockDefinition } from '../common/product-block-props';
import { FeaturedProductSchema, DEFAULT_PROPS, SCHEMA_VERSION, type FeaturedProductProps } from './schema';
import { FEATURED_PRODUCT_FIELDS } from './editor';
import { FeaturedProductRender } from './render';

export const FeaturedProductBlock: BlockDefinition<FeaturedProductProps> = {
  type: 'featured-product',
  name: 'اسپات‌لایت محصول شاخص',
  description: 'معرفی اختصاصی و برجسته یک محصول با جزئیات، نقاط قوت و دکمه مستقیم خرید',
  schemaVersion: SCHEMA_VERSION,
  schema: FeaturedProductSchema,
  defaults: DEFAULT_PROPS,
  editorFields: FEATURED_PRODUCT_FIELDS,
  Render: FeaturedProductRender,
  getDataNeeds: (props) =>
    props.productId ? [{ type: 'products', ids: [props.productId] }] : [],
};
