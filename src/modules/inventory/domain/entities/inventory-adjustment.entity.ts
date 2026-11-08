import { Entity } from '@/shared/kernel/entity';

export const AdjustmentReason = {
  MANUAL: 'MANUAL',
  CORRECTION: 'CORRECTION',
  DAMAGE: 'DAMAGE',
  RECEIPT: 'RECEIPT',
  AUDIT: 'AUDIT',
} as const;

export type AdjustmentReasonType = (typeof AdjustmentReason)[keyof typeof AdjustmentReason];

export interface InventoryAdjustmentProps {
  id: string;
  variantId: string;
  deltaQuantity: number;
  newQuantity: number;
  reason: AdjustmentReasonType | string;
  note?: string;
  adminId?: string;
  createdAt?: Date;
}

export class InventoryAdjustment extends Entity<string> {
  private _variantId: string;
  private _deltaQuantity: number;
  private _newQuantity: number;
  private _reason: string;
  private _note?: string;
  private _adminId?: string;
  private _createdAt: Date;

  constructor(props: InventoryAdjustmentProps) {
    super(props.id);
    this._variantId = props.variantId;
    this._deltaQuantity = props.deltaQuantity;
    this._newQuantity = props.newQuantity;
    this._reason = props.reason;
    this._note = props.note;
    this._adminId = props.adminId;
    this._createdAt = props.createdAt ?? new Date();
  }

  public get variantId(): string {
    return this._variantId;
  }
  public get deltaQuantity(): number {
    return this._deltaQuantity;
  }
  public get newQuantity(): number {
    return this._newQuantity;
  }
  public get reason(): string {
    return this._reason;
  }
  public get note(): string | undefined {
    return this._note;
  }
  public get adminId(): string | undefined {
    return this._adminId;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }
}
