import type { EditorField } from '../common/product-block-props';

export const FAQ_ACCORDION_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش پرسش‌ها', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان توضیحی', type: 'text' },
  { name: 'items', label: 'لیست پرسش‌ها و پاسخ‌ها', type: 'array' },
];
