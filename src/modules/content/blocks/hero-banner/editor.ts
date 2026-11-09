import type { EditorField } from '../common/product-block-props';

export const HERO_BANNER_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان اصلی', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان', type: 'textarea' },
  { name: 'kicker', label: 'کیکر / تیتر بالایی', type: 'text' },
  { name: 'ctaText', label: 'متن دکمه اصلی', type: 'text' },
  { name: 'ctaLink', label: 'لینک دکمه اصلی', type: 'text' },
  { name: 'secondaryCtaText', label: 'متن دکمه ثانویه', type: 'text' },
  { name: 'secondaryCtaLink', label: 'لینک دکمه ثانویه', type: 'text' },
  { name: 'imageUrl', label: 'تصویر پس‌زمینه', type: 'image' },
  {
    name: 'align',
    label: 'چینش محتوا',
    type: 'select',
    options: [
      { label: 'راست‌چین', value: 'right' },
      { label: 'وسط‌چین', value: 'center' },
      { label: 'چپ‌چین', value: 'left' },
    ],
  },
  {
    name: 'height',
    label: 'ارتفاع بنر',
    type: 'select',
    options: [
      { label: 'کوتاه', value: 'sm' },
      { label: 'متوسط', value: 'md' },
      { label: 'بلند', value: 'lg' },
      { label: 'تمام صفحه', value: 'full' },
    ],
  },
];
