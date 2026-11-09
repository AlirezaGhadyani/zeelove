import type { EditorField } from '../common/product-block-props';

export const TESTIMONIALS_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  {
    name: 'columns',
    label: 'تعداد ستون',
    type: 'select',
    options: [
      { label: '۲ ستون', value: 2 },
      { label: '۳ ستون', value: 3 },
    ],
  },
  { name: 'items', label: 'لیست دیدگاه‌ها', type: 'array' },
];
