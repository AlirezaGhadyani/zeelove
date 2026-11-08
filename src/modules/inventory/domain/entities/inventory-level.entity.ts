import { Entity } from '@/shared/kernel/entity';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';

export interface InventoryLevelProps {
  id: string;
  variantId: string;
  quantity: number;
  safetyStock?: number;
  updatedAt?: Date;
}

export class InventoryLevel extends Entity<string> {
  private _variantId: string;
  private _quantity: number;
  private _safetyStock: number;
  private _updatedAt: Date;

  constructor(props: InventoryLevelProps) {
    super(props.id);
    if (!Number.isInteger(props.quantity)) {
      throw new DomainRuleViolationError('INTEGER_STOCK', 'Stock quantity must be an integer');
    }
    if (props.quantity < 0) {
      throw new DomainRuleViolationError('NEGATIVE_STOCK', 'Stock quantity cannot be negative');
    }
    this._variantId = props.variantId;
    this._quantity = props.quantity;
    this._safetyStock = props.safetyStock ?? 0;
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get variantId(): string {
    return this._variantId;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public get safetyStock(): number {
    return this._safetyStock;
  }
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public availableQuantity(activeReservationsCount = 0): number {
    return Math.max(0, this._quantity - activeReservationsCount - this._safetyStock);
  }

  public isInStock(activeReservationsCount = 0): boolean {
    return this.availableQuantity(activeReservationsCount) > 0;
  }

  public adjust(delta: number): number {
    if (!Number.isInteger(delta)) {
      throw new DomainRuleViolationError('INTEGER_DELTA', 'Adjustment delta must be an integer');
    }
    const next = this._quantity + delta;
    if (next < 0) {
      throw new DomainRuleViolationError('INSUFFICIENT_STOCK', `Cannot decrease stock below zero: current ${this._quantity}, delta ${delta}`);
    }
    this._quantity = next;
    this._updatedAt = new Date();
    return this._quantity;
  }

  public setQuantity(newQuantity: number): void {
    if (!Number.isInteger(newQuantity) || newQuantity < 0) {
      throw new DomainRuleViolationError('INVALID_STOCK_QTY', 'Stock quantity must be a non-negative integer');
    }
    this._quantity = newQuantity;
    this._updatedAt = new Date();
  }

  public setSafetyStock(safety: number): void {
    if (!Number.isInteger(safety) || safety < 0) {
      throw new DomainRuleViolationError('INVALID_SAFETY_STOCK', 'Safety stock must be a non-negative integer');
    }
    this._safetyStock = safety;
    this._updatedAt = new Date();
  }
}
