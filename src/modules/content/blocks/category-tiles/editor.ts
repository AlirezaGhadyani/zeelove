import type { EditorField } from '../common/product-block-props';

export const CATEGORY_TILES_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  {
    name: 'style',
    label: 'سبک نمایش تایل‌ها',
    type: 'select',
    options: [
      { label: 'دایره‌ای / کپسولی', value: 'rounded' },
      { label: 'مربعی با حاشیه نرم', value: 'square' },
      { label: 'مینیمال متنی', value: 'minimal' },
    ],
  },
  {
    name: 'columns',
    label: 'تعداد ستون',
    type: 'select',
    options: [
      { label: '۳ ستون', value: 3 },
      { label: '۴ ستون', value: 4 },
      { label: '۵ ستون', value: 5 },
      { label: '۶ ستون', value: 6 },
    ],
  },
  { name: 'autoFetch', label: 'بارگذاری خودکار از دیتابیس', type: 'boolean' },
];
