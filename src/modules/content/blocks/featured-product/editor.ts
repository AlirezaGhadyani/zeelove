import type { EditorField } from '../common/product-block-props';

export const FEATURED_PRODUCT_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان اسپات‌لایت', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان توضیحی', type: 'textarea' },
  { name: 'productId', label: 'شناسه محصول هدف', type: 'text' },
  { name: 'badgeText', label: 'متن برچسب اختصاصی', type: 'text' },
  { name: 'customImageUrl', label: 'تصویر سفارشی کالا', type: 'image' },
  { name: 'bulletPoints', label: 'ویژگی‌های برجسته کالا', type: 'array' },
  { name: 'ctaText', label: 'متن دکمه خرید', type: 'text' },
  { name: 'ctaLink', label: 'لینک دکمه خرید', type: 'text' },
  { name: 'showPrice', label: 'نمایش قیمت محصول', type: 'boolean' },
];
