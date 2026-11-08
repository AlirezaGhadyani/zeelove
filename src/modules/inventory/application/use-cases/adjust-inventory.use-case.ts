import { Result, ok, err } from '@/shared/kernel/result';
import { DomainRuleViolationError, type DomainError } from '@/shared/kernel/domain-error';
import type { InventoryRepositoryPort } from '../ports/inventory.repository.port';
import type { InventoryAdjustmentRepositoryPort } from '../ports/inventory-adjustment.repository.port';
import { InventoryLevel } from '../../domain/entities/inventory-level.entity';
import { InventoryAdjustment, type AdjustmentReasonType } from '../../domain/entities/inventory-adjustment.entity';

export interface AdjustInventoryInput {
  variantId: string;
  deltaQuantity?: number;
  newQuantity?: number;
  reason: AdjustmentReasonType | string;
  note?: string;
  adminId?: string;
}

export class AdjustInventoryUseCase {
  constructor(
    private readonly inventoryRepo: InventoryRepositoryPort,
    private readonly adjustmentRepo: InventoryAdjustmentRepositoryPort,
  ) {}

  public async execute(input: AdjustInventoryInput): Promise<Result<InventoryLevel, DomainError>> {
    let level = await this.inventoryRepo.findByVariantId(input.variantId);
    if (!level) {
      level = new InventoryLevel({
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        variantId: input.variantId,
        quantity: 0,
        safetyStock: 0,
      });
    }

    const currentQty = level.quantity;
    let delta = 0;
    let nextQty = currentQty;

    if (input.newQuantity !== undefined) {
      nextQty = input.newQuantity;
      delta = nextQty - currentQty;
      try {
        level.setQuantity(nextQty);
      } catch (errRule) {
        return err(errRule instanceof DomainRuleViolationError ? errRule : new DomainRuleViolationError('INVALID_QTY', String(errRule)));
      }
    } else if (input.deltaQuantity !== undefined) {
      delta = input.deltaQuantity;
      try {
        nextQty = level.adjust(delta);
      } catch (errRule) {
        return err(errRule instanceof DomainRuleViolationError ? errRule : new DomainRuleViolationError('INVALID_DELTA', String(errRule)));
      }
    } else {
      return err(new DomainRuleViolationError('MISSING_ADJUSTMENT', 'Either newQuantity or deltaQuantity must be provided'));
    }

    await this.inventoryRepo.save(level);

    const adjustment = new InventoryAdjustment({
      id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      variantId: input.variantId,
      deltaQuantity: delta,
      newQuantity: nextQty,
      reason: input.reason,
      note: input.note,
      adminId: input.adminId,
    });

    await this.adjustmentRepo.save(adjustment);

    return ok(level);
  }
}
