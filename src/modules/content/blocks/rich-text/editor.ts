import type { EditorField } from '../common/product-block-props';

export const RICH_TEXT_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'lead', label: 'پاراگراف پیش‌درآمد (Lead)', type: 'textarea' },
  { name: 'content', label: 'متن اصلی', type: 'textarea' },
  {
    name: 'align',
    label: 'چینش متن',
    type: 'select',
    options: [
      { label: 'راست‌چین', value: 'right' },
      { label: 'وسط‌چین', value: 'center' },
      { label: 'چپ‌چین', value: 'left' },
    ],
  },
  {
    name: 'maxWidth',
    label: 'حداکثر عرض محتوا',
    type: 'select',
    options: [
      { label: 'استاندارد مقاله (Prose)', value: 'prose' },
      { label: 'متوسط (Large)', value: 'lg' },
      { label: 'عریض (Extra Large)', value: 'xl' },
      { label: 'تمام عرض', value: 'full' },
    ],
  },
];
