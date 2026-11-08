import type { InventoryAdjustment } from '../../domain/entities/inventory-adjustment.entity';

export interface InventoryAdjustmentRepositoryPort {
  save(adjustment: InventoryAdjustment): Promise<void>;
  listByVariantId(variantId: string, limit?: number): Promise<InventoryAdjustment[]>;
  listRecent(limit?: number): Promise<InventoryAdjustment[]>;
}
