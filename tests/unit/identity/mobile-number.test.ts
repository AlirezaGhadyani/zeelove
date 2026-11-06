import { describe, it, expect } from 'vitest';
import { MobileNumber } from '@/modules/identity-access/domain/mobile-number.vo';
import { ValidationError } from '@/shared/kernel/domain-error';

describe('MobileNumber Value Object', () => {
  it('normalizes various valid Iranian formats to 09xxxxxxxxx', () => {
    expect(MobileNumber.normalize('09123456789')).toBe('09123456789');
    expect(MobileNumber.normalize('+989123456789')).toBe('09123456789');
    expect(MobileNumber.normalize('00989123456789')).toBe('09123456789');
    expect(MobileNumber.normalize('9123456789')).toBe('09123456789');
    expect(MobileNumber.normalize('  ۰۹۱۲۳۴۵۶۷۸۹  ')).toBe('09123456789');
    expect(MobileNumber.normalize('۰۹۱۲-۳۴۵-۶۷۸۹')).toBe('09123456789');
  });

  it('creates MobileNumber instance for valid input', () => {
    const mobile = MobileNumber.create('+98 912 345 6789');
    expect(mobile.value).toBe('09123456789');
    expect(mobile.format(true)).toBe('+989123456789');
    expect(mobile.toString()).toBe('09123456789');
  });

  it('rejects invalid numbers by throwing ValidationError', () => {
    expect(() => MobileNumber.create('02112345678')).toThrow(ValidationError);
    expect(() => MobileNumber.create('12345')).toThrow(ValidationError);
    expect(() => MobileNumber.create('')).toThrow(ValidationError);
    expect(() => MobileNumber.create('0912345678')).toThrow(ValidationError); // 10 digits
    expect(() => MobileNumber.create('091234567890')).toThrow(ValidationError); // 12 digits
  });
});
