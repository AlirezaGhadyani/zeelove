import { Money, type CurrencyCode } from '@/shared/kernel/money';

export class MoneyBuilder {
  private amount = 100_000;
  private currency: CurrencyCode = 'TOMAN';

  public withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  public withCurrency(currency: CurrencyCode): this {
    this.currency = currency;
    return this;
  }

  public build(): Money {
    return Money.create(this.amount, this.currency);
  }
}
