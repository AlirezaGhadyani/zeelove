import { Result, ok } from '@/shared/kernel/result';
import type { InventoryRepositoryPort } from '../ports/inventory.repository.port';
import type { InventoryAdjustmentRepositoryPort } from '../ports/inventory-adjustment.repository.port';
import { InventoryLevel } from '../../domain/entities/inventory-level.entity';
import { InventoryAdjustment } from '../../domain/entities/inventory-adjustment.entity';

export interface BulkInventoryItem {
  variantId: string;
  quantity: number;
  safetyStock?: number;
}

export interface BulkUpdateInventoryInput {
  items: BulkInventoryItem[];
  reason?: string;
  note?: string;
  adminId?: string;
}

export class BulkUpdateInventoryUseCase {
  constructor(
    private readonly inventoryRepo: InventoryRepositoryPort,
    private readonly adjustmentRepo: InventoryAdjustmentRepositoryPort,
  ) {}

  public async execute(input: BulkUpdateInventoryInput): Promise<Result<{ updatedCount: number }, never>> {
    const variantIds = input.items.map((i) => i.variantId);
    const existingMap = await this.inventoryRepo.findByVariantIds(variantIds);

    const levelsToSave: InventoryLevel[] = [];

    for (const item of input.items) {
      let level = existingMap.get(item.variantId);
      const prevQty = level ? level.quantity : 0;
      if (!level) {
        level = new InventoryLevel({
          id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          variantId: item.variantId,
          quantity: Math.max(0, item.quantity),
          safetyStock: item.safetyStock ?? 0,
        });
      } else {
        level.setQuantity(Math.max(0, item.quantity));
        if (item.safetyStock !== undefined) {
          level.setSafetyStock(item.safetyStock);
        }
      }
      levelsToSave.push(level);

      const delta = level.quantity - prevQty;
      if (delta !== 0) {
        const adjustment = new InventoryAdjustment({
          id: `adj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          variantId: item.variantId,
          deltaQuantity: delta,
          newQuantity: level.quantity,
          reason: input.reason ?? 'BULK_UPDATE',
          note: input.note ?? 'بروزرسانی دسته‌ای موجودی',
          adminId: input.adminId,
        });
        await this.adjustmentRepo.save(adjustment);
      }
    }

    await this.inventoryRepo.saveMany(levelsToSave);

    return ok({ updatedCount: levelsToSave.length });
  }
}
