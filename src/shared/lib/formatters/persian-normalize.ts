export function normalizePersian(input: string): string {
  if (!input) return '';

  return input
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '') // remove Arabic diacritics
    .replace(/\s*\u200c\s*/g, '\u200c') // clean spaces around ZWNJ
    .replace(/\u200c{2,}/g, '\u200c') // deduplicate ZWNJ
    .trim();
}
