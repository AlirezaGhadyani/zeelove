import { describe, it, expect } from 'vitest';
import { Money } from '@/shared/kernel/money';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';
import { MoneyBuilder } from '@/shared/testing/builders/money-builder';

describe('Money Value Object', () => {
  it('creates valid integer money in Toman', () => {
    const m = Money.create(50_000);
    expect(m.amount).toBe(50_000);
    expect(m.currency).toBe('TOMAN');
    expect(m.isZero()).toBe(false);
    expect(m.isPositive()).toBe(true);
  });

  it('rejects floating-point numbers', () => {
    expect(() => Money.create(12.34)).toThrow(DomainRuleViolationError);
  });

  it('rejects negative numbers', () => {
    expect(() => Money.create(-500)).toThrow(DomainRuleViolationError);
  });

  it('adds and subtracts money amounts correctly', () => {
    const m1 = Money.create(30_000);
    const m2 = Money.create(20_000);

    const sum = m1.add(m2);
    expect(sum.amount).toBe(50_000);

    const diff = m1.subtract(m2);
    expect(diff.amount).toBe(10_000);
  });

  it('prevents subtraction resulting in negative funds', () => {
    const m1 = Money.create(10_000);
    const m2 = Money.create(20_000);
    expect(() => m1.subtract(m2)).toThrow(DomainRuleViolationError);
  });

  it('multiplies and rounds cleanly', () => {
    const m = Money.create(10_000);
    const multiplied = m.multiply(1.5);
    expect(multiplied.amount).toBe(15_000);
  });

  it('formats amount in Persian Toman', () => {
    const m = Money.create(250_000);
    const formatted = m.format(true);
    expect(formatted).toContain('تومان');
    expect(formatted).toContain('۲۵۰،۰۰۰');
  });

  it('builds via MoneyBuilder test data factory', () => {
    const m = new MoneyBuilder().withAmount(75_000).build();
    expect(m.amount).toBe(75_000);
  });
});
