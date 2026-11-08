import type { PrismaClient } from '@prisma/client';
import type { InventoryRepositoryPort, InventoryQueryOptions } from '../../application/ports/inventory.repository.port';
import { InventoryLevel } from '../../domain/entities/inventory-level.entity';

export class PrismaInventoryRepository implements InventoryRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByVariantId(variantId: string): Promise<InventoryLevel | null> {
    const record = await this.prisma.inventoryLevel.findUnique({
      where: { variantId },
    });
    return record ? this.toDomain(record) : null;
  }

  public async findByVariantIds(variantIds: string[]): Promise<Map<string, InventoryLevel>> {
    if (variantIds.length === 0) return new Map();
    const records = await this.prisma.inventoryLevel.findMany({
      where: { variantId: { in: variantIds } },
    });
    const map = new Map<string, InventoryLevel>();
    for (const r of records) {
      map.set(r.variantId, this.toDomain(r));
    }
    return map;
  }

  public async save(level: InventoryLevel): Promise<void> {
    await this.prisma.inventoryLevel.upsert({
      where: { variantId: level.variantId },
      create: {
        id: level.id,
        variantId: level.variantId,
        quantity: level.quantity,
        safetyStock: level.safetyStock,
        updatedAt: level.updatedAt,
      },
      update: {
        quantity: level.quantity,
        safetyStock: level.safetyStock,
        updatedAt: level.updatedAt,
      },
    });
  }

  public async saveMany(levels: InventoryLevel[]): Promise<void> {
    await this.prisma.$transaction(
      levels.map((level) =>
        this.prisma.inventoryLevel.upsert({
          where: { variantId: level.variantId },
          create: {
            id: level.id,
            variantId: level.variantId,
            quantity: level.quantity,
            safetyStock: level.safetyStock,
            updatedAt: level.updatedAt,
          },
          update: {
            quantity: level.quantity,
            safetyStock: level.safetyStock,
            updatedAt: level.updatedAt,
          },
        }),
      ),
    );
  }

  public async listAll(options: InventoryQueryOptions = {}): Promise<{ items: InventoryLevel[]; total: number }> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 25;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.prisma.inventoryLevel.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.inventoryLevel.count(),
    ]);

    return {
      items: records.map((r) => this.toDomain(r)),
      total,
    };
  }

  private toDomain(record: {
    id: string;
    variantId: string;
    quantity: number;
    safetyStock: number;
    updatedAt: Date;
  }): InventoryLevel {
    return new InventoryLevel({
      id: record.id,
      variantId: record.variantId,
      quantity: record.quantity,
      safetyStock: record.safetyStock,
      updatedAt: record.updatedAt,
    });
  }
}
