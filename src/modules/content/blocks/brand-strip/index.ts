import type { BlockDefinition } from '../common/product-block-props';
import { BrandStripSchema, DEFAULT_PROPS, SCHEMA_VERSION, type BrandStripProps } from './schema';
import { BRAND_STRIP_FIELDS } from './editor';
import { BrandStripRender } from './render';

export const BrandStripBlock: BlockDefinition<BrandStripProps> = {
  type: 'brand-strip',
  name: 'نوار برندهای معتبر',
  description: 'نمایش نشان‌ها و نام‌های برندهای تجاری و شرکای رسمی فروشگاه',
  schemaVersion: SCHEMA_VERSION,
  schema: BrandStripSchema,
  defaults: DEFAULT_PROPS,
  editorFields: BRAND_STRIP_FIELDS,
  Render: BrandStripRender,
  getDataNeeds: (props) => {
    if (!props.autoFetch) return [];
    return [
      {
        type: 'brands',
        ids: props.brandIds && props.brandIds.length > 0 ? props.brandIds : undefined,
      },
    ];
  },
};
