import type { EditorField } from '../common/product-block-props';

export const CUSTOM_HTML_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش (اختیاری)', type: 'text' },
  {
    name: 'html',
    label: 'کد HTML (فقط مدیر کل / ایمن‌شده)',
    type: 'textarea',
    description: 'کدهای نامعتبر یا اسکریپت‌های مخرب فیلتر می‌شوند.',
  },
];
