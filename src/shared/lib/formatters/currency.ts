import { toPersianDigits } from './persian-digits';

export function formatToman(amount: number, options: { showUnit?: boolean } = {}): string {
  const { showUnit = true } = options;
  const formattedNumber = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '،');

  const persianFormatted = toPersianDigits(formattedNumber);
  return showUnit ? `${persianFormatted} تومان` : persianFormatted;
}
