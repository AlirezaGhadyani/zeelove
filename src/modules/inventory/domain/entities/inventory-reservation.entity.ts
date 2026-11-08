import { Entity } from '@/shared/kernel/entity';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';

export const ReservationStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  RELEASED: 'RELEASED',
} as const;

export type ReservationStatusType = (typeof ReservationStatus)[keyof typeof ReservationStatus];

export interface InventoryReservationProps {
  id: string;
  variantId: string;
  quantity: number;
  expiresAt: Date;
  status: ReservationStatusType;
  createdAt?: Date;
}

export class InventoryReservation extends Entity<string> {
  private _variantId: string;
  private _quantity: number;
  private _expiresAt: Date;
  private _status: ReservationStatusType;
  private _createdAt: Date;

  constructor(props: InventoryReservationProps) {
    super(props.id);
    if (props.quantity <= 0) {
      throw new DomainRuleViolationError('INVALID_RESERVATION_QTY', 'Reservation quantity must be greater than zero');
    }
    this._variantId = props.variantId;
    this._quantity = props.quantity;
    this._expiresAt = props.expiresAt;
    this._status = props.status;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get variantId(): string {
    return this._variantId;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public get expiresAt(): Date {
    return this._expiresAt;
  }
  public get status(): ReservationStatusType {
    return this._status;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  public isExpired(now: Date = new Date()): boolean {
    return this._status === ReservationStatus.PENDING && this._expiresAt.getTime() <= now.getTime();
  }

  public confirm(): void {
    if (this._status !== ReservationStatus.PENDING) {
      throw new DomainRuleViolationError('INVALID_TRANSITION', `Cannot confirm reservation in status ${this._status}`);
    }
    this._status = ReservationStatus.CONFIRMED;
  }

  public release(): void {
    if (this._status === ReservationStatus.CONFIRMED) {
      throw new DomainRuleViolationError('INVALID_TRANSITION', 'Cannot release already confirmed reservation');
    }
    this._status = ReservationStatus.RELEASED;
  }
}
