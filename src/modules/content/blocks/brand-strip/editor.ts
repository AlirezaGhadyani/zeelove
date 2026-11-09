import type { EditorField } from '../common/product-block-props';

export const BRAND_STRIP_FIELDS: EditorField[] = [
  { name: 'title', label: 'عنوان بخش برندها', type: 'text' },
  { name: 'subtitle', label: 'زیرعنوان بخش', type: 'text' },
  { name: 'autoFetch', label: 'بارگذاری خودکار از پایگاه داده', type: 'boolean' },
];
