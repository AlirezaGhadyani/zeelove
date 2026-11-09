import type { EditorField } from '../common/product-block-props';

export const PRODUCT_GRID_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  {
    name: 'rule',
    label: 'قانون انتخاب محصولات',
    type: 'select',
    options: [
      { label: 'جدیدترین‌ها', value: 'newest' },
      { label: 'دارای تخفیف', value: 'discounted' },
      { label: 'پرفروش‌ترین‌ها', value: 'best_selling' },
      { label: 'بر اساس دسته‌بندی', value: 'by_category' },
      { label: 'بر اساس برند', value: 'by_brand' },
      { label: 'انتخاب دستی', value: 'manual' },
    ],
  },
  {
    name: 'columns',
    label: 'تعداد ستون در دسکتاپ',
    type: 'select',
    options: [
      { label: '۲ ستون', value: 2 },
      { label: '۳ ستون', value: 3 },
      { label: '۴ ستون', value: 4 },
      { label: '۵ ستون', value: 5 },
    ],
  },
  { name: 'limit', label: 'حداکثر تعداد کالاها', type: 'number' },
  { name: 'viewAllUrl', label: 'آدرس مشاهده همه', type: 'text' },
  { name: 'showPrice', label: 'نمایش قیمت', type: 'boolean' },
  { name: 'showRating', label: 'نمایش امتیاز', type: 'boolean' },
  { name: 'showBadges', label: 'نمایش نشان تخفیف', type: 'boolean' },
];
