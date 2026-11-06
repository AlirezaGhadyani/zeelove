import { ValueObject } from './value-object';
import { DomainRuleViolationError } from './domain-error';
import { formatToman } from '../lib/formatters/currency';

export type CurrencyCode = 'TOMAN' | 'IRR';

interface MoneyProps {
  amount: number;
  currency: CurrencyCode;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(amount: number, currency: CurrencyCode = 'TOMAN'): Money {
    if (!Number.isInteger(amount)) {
      throw new DomainRuleViolationError('INTEGER_MONEY', 'Money amount must be an integer');
    }
    if (amount < 0) {
      throw new DomainRuleViolationError('NON_NEGATIVE_MONEY', 'Money amount cannot be negative');
    }
    return new Money({ amount, currency });
  }

  public static zero(currency: CurrencyCode = 'TOMAN'): Money {
    return new Money({ amount: 0, currency });
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get currency(): CurrencyCode {
    return this.props.currency;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    if (this.amount < other.amount) {
      throw new DomainRuleViolationError('INSUFFICIENT_FUNDS', 'Cannot subtract larger amount');
    }
    return Money.create(this.amount - other.amount, this.currency);
  }

  public multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new DomainRuleViolationError('NEGATIVE_MULTIPLIER', 'Multiplier cannot be negative');
    }
    const rounded = Math.round(this.amount * multiplier);
    return Money.create(rounded, this.currency);
  }

  public isZero(): boolean {
    return this.amount === 0;
  }

  public isPositive(): boolean {
    return this.amount > 0;
  }

  public format(includeUnit = true): string {
    return formatToman(this.amount, { showUnit: includeUnit });
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainRuleViolationError(
        'CURRENCY_MISMATCH',
        `Cannot operate on differing currencies: ${this.currency} and ${other.currency}`,
      );
    }
  }
}
