import type { BlockDefinition } from '../common/product-block-props';
import { TestimonialsSchema, DEFAULT_PROPS, SCHEMA_VERSION, type TestimonialsProps } from './schema';
import { TESTIMONIALS_FIELDS } from './editor';
import { TestimonialsRender } from './render';

export const TestimonialsBlock: BlockDefinition<TestimonialsProps> = {
  type: 'testimonials',
  name: 'دیدگاه‌ها و رضایت مشتریان',
  description: 'کارت‌های ارزیابی و نقل قول خریداران با امتیاز ستاره‌ای و مشخصات خریدار',
  schemaVersion: SCHEMA_VERSION,
  schema: TestimonialsSchema,
  defaults: DEFAULT_PROPS,
  editorFields: TESTIMONIALS_FIELDS,
  Render: TestimonialsRender,
};
