import type { BlockDefinition } from '../common/product-block-props';
import { PromoCountdownSchema, DEFAULT_PROPS, SCHEMA_VERSION, type PromoCountdownProps } from './schema';
import { PROMO_COUNTDOWN_FIELDS } from './editor';
import { PromoCountdownRender } from './render';

export const PromoCountdownBlock: BlockDefinition<PromoCountdownProps> = {
  type: 'promo-countdown',
  name: 'شمارش معکوس حراج و جشنواره',
  description: 'بنر جشنواره با تایمر معکوس زنده، درصد تخفیف و دکمه مستقیم خرید',
  schemaVersion: SCHEMA_VERSION,
  schema: PromoCountdownSchema,
  defaults: DEFAULT_PROPS,
  editorFields: PROMO_COUNTDOWN_FIELDS,
  Render: PromoCountdownRender,
};
