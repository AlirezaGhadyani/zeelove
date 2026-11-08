/**
 * Normalizes Persian and Arabic text for robust search and indexing.
 * Replaces Arabic letters with standard Persian letters, removes diacritics,
 * normalizes ZWNJ and digit representations.
 */
export function normalizeForSearch(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Normalize Arabic Yeh / Alef Maksura to Persian Yeh
    .replace(/[\u0649\u064A\u06D2\u06D3]/g, '\u06CC')
    // Normalize Arabic Kaf to Persian Keheh
    .replace(/[\u0643\u06AC\u06AD\u06AE]/g, '\u06A9')
    // Normalize Teh Marbuta and Heh variants
    .replace(/\u0629/g, '\u062A')
    .replace(/[\u06C0\u06C1\u06C2\u06C3]/g, '\u0647')
    // Normalize Alef variants (آ, أ, إ, ٱ) to standard Alef
    .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')
    // Normalize Vav variants (ؤ) to Vav
    .replace(/\u0624/g, '\u0648')
    // Remove Arabic diacritics (harakat, tanween, tashdeed, sukun)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Persian/Arabic digits to English digits
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 1632))
    // Replace ZWNJ (\u200c) with standard space for tokenization
    .replace(/\u200C/g, ' ')
    // Collapse punctuation and whitespace
    .replace(/[\s\t\r\n]+/g, ' ')
    .trim()
    .toLowerCase();
}
