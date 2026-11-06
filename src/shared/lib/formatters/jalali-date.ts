import { toPersianDigits } from './persian-digits';

export function formatJalaliDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatRelativeTime(
  targetDate: Date | string | number,
  baseDate: Date = new Date(),
): string {
  const target = new Date(targetDate).getTime();
  const base = baseDate.getTime();
  const diffSec = Math.floor((base - target) / 1000);

  if (diffSec < 60) return 'چند لحظه پیش';
  if (diffSec < 3600) return `${toPersianDigits(Math.floor(diffSec / 60))} دقیقه پیش`;
  if (diffSec < 86400) return `${toPersianDigits(Math.floor(diffSec / 3600))} ساعت پیش`;
  if (diffSec < 604800) return `${toPersianDigits(Math.floor(diffSec / 86400))} روز پیش`;

  return formatJalaliDate(targetDate);
}
