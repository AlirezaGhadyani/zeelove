import type { EditorField } from '../common/product-block-props';

export const COLLECTION_BY_RULE_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان مجموعه', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان مجموعه', type: 'text' },
  {
    name: 'rule',
    label: 'قانون انتخاب کالا',
    type: 'select',
    options: [
      { label: 'پرفروش‌ترین‌ها', value: 'best_selling' },
      { label: 'جدیدترین‌ها', value: 'newest' },
      { label: 'دارای تخفیف ویژه', value: 'discounted' },
      { label: 'بر اساس دسته‌بندی مشخص', value: 'by_category' },
      { label: 'بر اساس برند مشخص', value: 'by_brand' },
      { label: 'انتخاب دستی کالاها', value: 'manual' },
    ],
  },
  {
    name: 'displayType',
    label: 'نوع نمایش',
    type: 'select',
    options: [
      { label: 'شبکه‌ای (Grid)', value: 'grid' },
      { label: 'گردونه‌ای (Carousel)', value: 'carousel' },
    ],
  },
  { name: 'limit', label: 'حداکثر تعداد کالاها', type: 'number' },
  { name: 'viewAllUrl', label: 'لینک مشاهده همه', type: 'text' },
  { name: 'showPrice', label: 'نمایش قیمت', type: 'boolean' },
];
