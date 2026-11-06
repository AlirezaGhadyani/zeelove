import { ValueObject } from '@/shared/kernel/value-object';
import { ValidationError } from '@/shared/kernel/domain-error';
import { parsePersianDigits } from '@/shared/lib/formatters/persian-digits';

interface MobileNumberProps {
  value: string;
}

export class MobileNumber extends ValueObject<MobileNumberProps> {
  private constructor(props: MobileNumberProps) {
    super(props);
  }

  public static create(raw: string): MobileNumber {
    const normalized = MobileNumber.normalize(raw);
    if (!MobileNumber.isValid(normalized)) {
      throw new ValidationError('شماره موبایل وارد شده معتبر نمی‌باشد', {
        raw,
        normalized,
      });
    }
    return new MobileNumber({ value: normalized });
  }

  public static normalize(raw: string): string {
    if (!raw) return '';

    // Convert Persian and Arabic digits to Latin
    let val = parsePersianDigits(raw.trim());
    // Remove spaces, dashes, parentheses
    val = val.replace(/[\s\-()]/g, '');

    // Handle +98, 0098, 98 prefixes
    if (val.startsWith('+98')) {
      val = '0' + val.slice(3);
    } else if (val.startsWith('0098')) {
      val = '0' + val.slice(4);
    } else if (val.startsWith('98') && val.length === 12) {
      val = '0' + val.slice(2);
    } else if (val.startsWith('9') && val.length === 10) {
      val = '0' + val;
    }

    return val;
  }

  public static isValid(value: string): boolean {
    return /^09\d{9}$/.test(value);
  }

  public get value(): string {
    return this.props.value;
  }

  public format(intl = false): string {
    if (intl) {
      return '+98' + this.props.value.slice(1);
    }
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }
}
