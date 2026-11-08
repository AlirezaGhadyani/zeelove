import type { InventoryLevel } from '../../domain/entities/inventory-level.entity';

export interface InventoryQueryOptions {
  search?: string;
  lowStockOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface InventoryRepositoryPort {
  findByVariantId(variantId: string): Promise<InventoryLevel | null>;
  findByVariantIds(variantIds: string[]): Promise<Map<string, InventoryLevel>>;
  save(level: InventoryLevel): Promise<void>;
  saveMany(levels: InventoryLevel[]): Promise<void>;
  listAll(options?: InventoryQueryOptions): Promise<{ items: InventoryLevel[]; total: number }>;
}
