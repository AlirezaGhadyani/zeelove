import { ValueObject } from '@/shared/kernel/value-object';
import { Result, ok, err } from '@/shared/kernel/result';
import { ValidationError } from '@/shared/kernel/domain-error';

export function normalizePersianText(text: string): string {
  return text
    // Replace Arabic Yeh with Persian Yeh
    .replace(/\u064A/g, '\u06CC')
    // Replace Arabic Kaf with Persian Keheh
    .replace(/\u0643/g, '\u06A9')
    // Replace Arabic Heh with Yeh / Teh Marbuta
    .replace(/\u0629/g, '\u062A')
    .replace(/\u06C0|\u06C2|\u06C3/g, '\u0647')
    // Remove diacritics / harakat
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Persian/Arabic digits to English digits
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 1632))
    // Replace ZWNJ (\u200c) with hyphen
    .replace(/\u200C/g, '-')
    // Replace spaces, underscores and punctuation with hyphens
    .replace(/[\s_/\\]+/g, '-');
}

export class Slug extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public static create(raw: string): Result<Slug, ValidationError> {
    if (!raw || typeof raw !== 'string') {
      return err(new ValidationError('Slug cannot be empty'));
    }

    const normalized = normalizePersianText(raw.trim().toLowerCase())
      // Keep only Persian letters (\u0600-\u06FF), English alphanumeric, and hyphens
      .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
      // Collapse multiple hyphens into one
      .replace(/-+/g, '-')
      // Trim hyphens from ends
      .replace(/^-+|-+$/g, '');

    if (normalized.length === 0) {
      return err(new ValidationError('Slug produced an empty result after normalization'));
    }
    if (normalized.length > 200) {
      return err(new ValidationError('Slug length cannot exceed 200 characters'));
    }

    return ok(new Slug(normalized));
  }

  public get value(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }
}
