import type { EditorField } from '../common/product-block-props';

export const NEWSLETTER_SIGNUP_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش خبرنامه', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان انگیزشی', type: 'textarea' },
  { name: 'placeholder', label: 'متن پیش‌فرض ورودی', type: 'text' },
  { name: 'buttonText', label: 'متن دکمه ثبت‌نام', type: 'text' },
  { name: 'disclaimer', label: 'متن حفظ حریم خصوصی', type: 'text' },
];
