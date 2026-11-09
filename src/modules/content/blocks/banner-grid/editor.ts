import type { EditorField } from '../common/product-block-props';

export const BANNER_GRID_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  {
    name: 'columns',
    label: 'تعداد ستون در دسکتاپ',
    type: 'select',
    options: [
      { label: '۱ ستون', value: 1 },
      { label: '۲ ستون', value: 2 },
      { label: '۳ ستون', value: 3 },
      { label: '۴ ستون', value: 4 },
    ],
  },
  {
    name: 'gap',
    label: 'فاصله بنرها',
    type: 'select',
    options: [
      { label: 'کم', value: 'sm' },
      { label: 'متوسط', value: 'md' },
      { label: 'زیاد', value: 'lg' },
    ],
  },
  { name: 'items', label: 'آیتم‌های بنر', type: 'array' },
];
