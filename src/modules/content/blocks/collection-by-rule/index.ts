import type { BlockDefinition } from '../common/product-block-props';
import { CollectionByRuleSchema, DEFAULT_PROPS, SCHEMA_VERSION, type CollectionByRuleProps } from './schema';
import { COLLECTION_BY_RULE_FIELDS } from './editor';
import { CollectionByRuleRender } from './render';

export const CollectionByRuleBlock: BlockDefinition<CollectionByRuleProps> = {
  type: 'collection-by-rule',
  name: 'مجموعه کالا با قانون خودکار',
  description: 'مجموعه محصولات بر اساس جدیدترین، تخفیف‌دارترین، دسته‌بندی یا برند',
  schemaVersion: SCHEMA_VERSION,
  schema: CollectionByRuleSchema,
  defaults: DEFAULT_PROPS,
  editorFields: COLLECTION_BY_RULE_FIELDS,
  Render: CollectionByRuleRender,
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
