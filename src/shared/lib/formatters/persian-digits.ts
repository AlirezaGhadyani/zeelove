const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;

export function toPersianDigits(input: string | number): string {
  const str = String(input);
  return str.replace(/[0-9]/g, (digit) => {
    const num = Number(digit);
    return PERSIAN_DIGITS[num] ?? digit;
  });
}

export function parsePersianDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - 1632));
}
