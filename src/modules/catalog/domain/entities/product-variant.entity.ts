import { Entity } from '@/shared/kernel/entity';
import type { Money } from '@/shared/kernel/money';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';

export interface ProductVariantProps {
  id: string;
  productId: string;
  sku: string;
  price: Money;
  compareAtPrice?: Money;
  barcode?: string;
  weightGrams?: number;
  isDefault: boolean;
  options?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductVariant extends Entity<string> {
  private _productId: string;
  private _sku: string;
  private _price: Money;
  private _compareAtPrice?: Money;
  private _barcode?: string;
  private _weightGrams?: number;
  private _isDefault: boolean;
  private _options: Record<string, string>;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductVariantProps) {
    super(props.id);
    if (!props.sku || props.sku.trim().length === 0) {
      throw new DomainRuleViolationError('INVALID_SKU', 'SKU cannot be empty');
    }
    if (props.compareAtPrice && props.compareAtPrice.amount <= props.price.amount) {
      throw new DomainRuleViolationError(
        'INVALID_COMPARE_AT_PRICE',
        'Compare-at price must be greater than current price',
      );
    }
    this._productId = props.productId;
    this._sku = props.sku.trim();
    this._price = props.price;
    this._compareAtPrice = props.compareAtPrice;
    this._barcode = props.barcode?.trim() || undefined;
    this._weightGrams = props.weightGrams;
    this._isDefault = props.isDefault;
    this._options = props.options ? { ...props.options } : {};
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get productId(): string {
    return this._productId;
  }
  public get sku(): string {
    return this._sku;
  }
  public get price(): Money {
    return this._price;
  }
  public get compareAtPrice(): Money | undefined {
    return this._compareAtPrice;
  }
  public get barcode(): string | undefined {
    return this._barcode;
  }
  public get weightGrams(): number | undefined {
    return this._weightGrams;
  }
  public get isDefault(): boolean {
    return this._isDefault;
  }
  public get options(): Record<string, string> {
    return { ...this._options };
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public updatePricing(price: Money, compareAtPrice?: Money): void {
    if (compareAtPrice && compareAtPrice.amount <= price.amount) {
      throw new DomainRuleViolationError(
        'INVALID_COMPARE_AT_PRICE',
        'Compare-at price must be greater than current price',
      );
    }
    this._price = price;
    this._compareAtPrice = compareAtPrice;
    this._updatedAt = new Date();
  }

  public setDefault(isDefault: boolean): void {
    this._isDefault = isDefault;
    this._updatedAt = new Date();
  }

  public hasDiscount(): boolean {
    return !!this._compareAtPrice && this._compareAtPrice.amount > this._price.amount;
  }

  public discountPercentage(): number {
    if (!this.hasDiscount() || !this._compareAtPrice) return 0;
    const diff = this._compareAtPrice.amount - this._price.amount;
    return Math.round((diff / this._compareAtPrice.amount) * 100);
  }
}
