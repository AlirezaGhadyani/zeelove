import type { EditorField } from '../common/product-block-props';

export const FEATURES_LIST_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  {
    name: 'columns',
    label: 'تعداد ستون',
    type: 'select',
    options: [
      { label: '۲ ستون', value: 2 },
      { label: '۳ ستون', value: 3 },
      { label: '۴ ستون', value: 4 },
    ],
  },
  { name: 'bordered', label: 'نمایش خطوط حاشیه ظریف', type: 'boolean' },
  { name: 'items', label: 'آیتم‌های مزیت‌ها', type: 'array' },
];
