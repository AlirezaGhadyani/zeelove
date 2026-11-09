import type { EditorField } from '../common/product-block-props';

export const PRODUCT_CAROUSEL_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  {
    name: 'rule',
    label: 'قانون انتخاب محصولات',
    type: 'select',
    options: [
      { label: 'دارای تخفیف', value: 'discounted' },
      { label: 'جدیدترین‌ها', value: 'newest' },
      { label: 'پرفروش‌ترین‌ها', value: 'best_selling' },
      { label: 'بر اساس دسته‌بندی', value: 'by_category' },
      { label: 'بر اساس برند', value: 'by_brand' },
      { label: 'انتخاب دستی', value: 'manual' },
    ],
  },
  { name: 'limit', label: 'حداکثر تعداد کالاها', type: 'number' },
  { name: 'viewAllUrl', label: 'آدرس مشاهده همه', type: 'text' },
  { name: 'viewAllLabel', label: 'متن پیوند مشاهده همه', type: 'text' },
  { name: 'showPrice', label: 'نمایش قیمت', type: 'boolean' },
  { name: 'showRating', label: 'نمایش امتیاز', type: 'boolean' },
  { name: 'showBadges', label: 'نمایش نشان تخفیف', type: 'boolean' },
];
