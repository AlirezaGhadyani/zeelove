import { faDictionary, TranslationKey } from './fa';

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const [namespace, item] = key.split('.') as [keyof typeof faDictionary, string];
  const dict = faDictionary[namespace];

  if (!dict) return key;

  // @ts-expect-error dynamic indexing on typed namespace dictionary
  let text = dict[item] as string | undefined;

  if (!text) return key;

  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text?.replace(new RegExp(`{${paramKey}}`, 'g'), String(val));
    });
  }

  return text;
}
