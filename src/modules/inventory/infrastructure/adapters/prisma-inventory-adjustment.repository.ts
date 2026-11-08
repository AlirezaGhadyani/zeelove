import type { PrismaClient } from '@prisma/client';
import type { InventoryAdjustmentRepositoryPort } from '../../application/ports/inventory-adjustment.repository.port';
import { InventoryAdjustment } from '../../domain/entities/inventory-adjustment.entity';

export class PrismaInventoryAdjustmentRepository implements InventoryAdjustmentRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(adjustment: InventoryAdjustment): Promise<void> {
    await this.prisma.inventoryAdjustment.create({
      data: {
        id: adjustment.id,
        variantId: adjustment.variantId,
        deltaQuantity: adjustment.deltaQuantity,
        newQuantity: adjustment.newQuantity,
        reason: adjustment.reason,
        note: adjustment.note,
        adminId: adjustment.adminId,
        createdAt: adjustment.createdAt,
      },
    });
  }

  public async listByVariantId(variantId: string, limit = 50): Promise<InventoryAdjustment[]> {
    const records = await this.prisma.inventoryAdjustment.findMany({
      where: { variantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return records.map((r) => this.toDomain(r));
  }

  public async listRecent(limit = 50): Promise<InventoryAdjustment[]> {
    const records = await this.prisma.inventoryAdjustment.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return records.map((r) => this.toDomain(r));
  }

  private toDomain(record: {
    id: string;
    variantId: string;
    deltaQuantity: number;
    newQuantity: number;
    reason: string;
    note: string | null;
    adminId: string | null;
    createdAt: Date;
  }): InventoryAdjustment {
    return new InventoryAdjustment({
      id: record.id,
      variantId: record.variantId,
      deltaQuantity: record.deltaQuantity,
      newQuantity: record.newQuantity,
      reason: record.reason,
      note: record.note ?? undefined,
      adminId: record.adminId ?? undefined,
      createdAt: record.createdAt,
    });
  }
}
