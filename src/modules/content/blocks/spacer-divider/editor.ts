import type { EditorField } from '../common/product-block-props';

export const SPACER_DIVIDER_FIELDS: EditorField[] = [
  {
    name: 'height',
    label: 'ارتفاع فاصله (Spacing)',
    type: 'select',
    options: [
      { label: 'بسیار کم (12px)', value: 'xs' },
      { label: 'کم (24px)', value: 'sm' },
      { label: 'متوسط (40px)', value: 'md' },
      { label: 'زیاد (64px)', value: 'lg' },
      { label: 'بسیار زیاد (96px)', value: 'xl' },
      { label: 'حداکثر (128px)', value: '2xl' },
    ],
  },
  { name: 'showDivider', label: 'نمایش خط جداکننده باریک', type: 'boolean' },
  {
    name: 'dividerStyle',
    label: 'سبک خط جداکننده',
    type: 'select',
    options: [
      { label: 'یکپارچه (Solid)', value: 'solid' },
      { label: 'خط‌چین (Dashed)', value: 'dashed' },
      { label: 'نقطه‌چین (Dotted)', value: 'dotted' },
    ],
  },
];
