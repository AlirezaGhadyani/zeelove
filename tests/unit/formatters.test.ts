import { describe, it, expect } from 'vitest';
import { toPersianDigits, parsePersianDigits } from '@/shared/lib/formatters/persian-digits';
import { formatToman } from '@/shared/lib/formatters/currency';
import { formatJalaliDate, formatRelativeTime } from '@/shared/lib/formatters/jalali-date';
import { normalizePersian } from '@/shared/lib/formatters/persian-normalize';

describe('Formatters & Persian Utilities', () => {
  it('converts Latin numbers to Persian digits correctly', () => {
    expect(toPersianDigits(1234567890)).toBe('۱۲۳۴۵۶۷۸۹۰');
    expect(toPersianDigits('قیمت: 45000')).toBe('قیمت: ۴۵۰۰۰');
  });

  it('parses Persian and Arabic digits back to Latin numbers', () => {
    expect(parsePersianDigits('۱۲۳۴۵')).toBe('12345');
    expect(parsePersianDigits('١٢٣٤٥')).toBe('12345');
  });

  it('formats currency in Toman with thousand separators and Persian digits', () => {
    expect(formatToman(1500000)).toBe('۱،۵۰۰،۰۰۰ تومان');
    expect(formatToman(250000, { showUnit: false })).toBe('۲۵۰،۰۰۰');
  });

  it('formats dates in Jalali calendar', () => {
    const date = new Date('2026-03-21T00:00:00Z');
    const jalali = formatJalaliDate(date);
    expect(jalali).toBeDefined();
    expect(jalali.length).toBeGreaterThan(0);
  });

  it('formats relative time in Persian', () => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinutesAgo, now)).toBe('۱۰ دقیقه پیش');
  });

  it('normalizes Arabic characters to Persian and preserves ZWNJ', () => {
    expect(normalizePersian('كتاب ياسمين')).toBe('کتاب یاسمین');
    expect(normalizePersian('می  ‌  شود')).toBe('می‌شود');
  });
});
