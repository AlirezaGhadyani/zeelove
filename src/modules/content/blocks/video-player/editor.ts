import type { EditorField } from '../common/product-block-props';

export const VIDEO_PLAYER_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان ویدیو', type: 'text' },
  { name: 'videoUrl', label: 'آدرس فایل ویدیو', type: 'text' },
  { name: 'posterUrl', label: 'تصویر پوستر ویدیو', type: 'image' },
  {
    name: 'aspectRatio',
    label: 'نسبت ابعاد ویدیو',
    type: 'select',
    options: [
      { label: '۱۶:۹ سینمایی استاندارد', value: '16:9' },
      { label: '۴:۳ سنتی', value: '4:3' },
      { label: '۲۱:۹ فوق عریض', value: '21:9' },
    ],
  },
  { name: 'controls', label: 'نمایش کنترل‌های پخش', type: 'boolean' },
];
