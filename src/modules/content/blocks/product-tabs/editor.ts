import type { EditorField } from '../common/product-block-props';

export const PRODUCT_TABS_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  { name: 'tabs', label: 'تب‌های محصولات', type: 'array' },
  { name: 'limit', label: 'تعداد محصولات هر تب', type: 'number' },
  { name: 'showPrice', label: 'نمایش قیمت', type: 'boolean' },
  { name: 'showRating', label: 'نمایش امتیاز', type: 'boolean' },
  { name: 'showBadges', label: 'نمایش نشان تخفیف', type: 'boolean' },
];
