import type { EditorField } from '../common/product-block-props';

export const PROMO_COUNTDOWN_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان جشنواره / حراج', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان توضیحی', type: 'text' },
  { name: 'badge', label: 'متن نشانک', type: 'text' },
  { name: 'targetEndDate', label: 'تاریخ و ساعت اتمام (ISO)', type: 'text' },
  { name: 'ctaText', label: 'متن دکمه اقدام', type: 'text' },
  { name: 'ctaLink', label: 'لینک دکمه اقدام', type: 'text' },
  { name: 'imageUrl', label: 'تصویر پس‌زمینه', type: 'image' },
];
