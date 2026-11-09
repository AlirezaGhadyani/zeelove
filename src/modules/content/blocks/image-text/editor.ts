import type { EditorField } from '../common/product-block-props';

export const IMAGE_TEXT_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان', type: 'text' },
  { name: 'description', label: 'متن توضیحات', type: 'textarea' },
  { name: 'imageUrl', label: 'تصویر', type: 'image' },
  {
    name: 'imagePosition',
    label: 'موقعیت تصویر نسبت به متن',
    type: 'select',
    options: [
      { label: 'تصویر در راست (در RTL)', value: 'right' },
      { label: 'تصویر در چپ (در RTL)', value: 'left' },
    ],
  },
  { name: 'badge', label: 'نشانک متنی', type: 'text' },
  { name: 'ctaText', label: 'متن دکمه اقدام', type: 'text' },
  { name: 'ctaLink', label: 'لینک دکمه اقدام', type: 'text' },
];
