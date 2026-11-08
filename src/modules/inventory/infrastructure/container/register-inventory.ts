import type { Container } from '@/shared/infrastructure/container/container';
import { createToken, TOKENS } from '@/shared/infrastructure/container/tokens';
import type { InventoryRepositoryPort } from '../../application/ports/inventory.repository.port';
import type { InventoryAdjustmentRepositoryPort } from '../../application/ports/inventory-adjustment.repository.port';
import type { InventoryReservationRepositoryPort } from '../../application/ports/inventory-reservation.repository.port';
import { PrismaInventoryRepository } from '../adapters/prisma-inventory.repository';
import { PrismaInventoryAdjustmentRepository } from '../adapters/prisma-inventory-adjustment.repository';
import { PrismaInventoryReservationRepository } from '../adapters/prisma-inventory-reservation.repository';
import { AdjustInventoryUseCase } from '../../application/use-cases/adjust-inventory.use-case';
import { ReserveInventoryUseCase } from '../../application/use-cases/reserve-inventory.use-case';
import { BulkUpdateInventoryUseCase } from '../../application/use-cases/bulk-update-inventory.use-case';

export const INVENTORY_TOKENS = {
  InventoryRepository: createToken<InventoryRepositoryPort>('InventoryRepository'),
  AdjustmentRepository: createToken<InventoryAdjustmentRepositoryPort>('AdjustmentRepository'),
  ReservationRepository: createToken<InventoryReservationRepositoryPort>('ReservationRepository'),
  AdjustInventoryUseCase: createToken<AdjustInventoryUseCase>('AdjustInventoryUseCase'),
  ReserveInventoryUseCase: createToken<ReserveInventoryUseCase>('ReserveInventoryUseCase'),
  BulkUpdateInventoryUseCase: createToken<BulkUpdateInventoryUseCase>('BulkUpdateInventoryUseCase'),
} as const;

export function registerInventory(container: Container): void {
  container.register(
    INVENTORY_TOKENS.InventoryRepository,
    (c) => new PrismaInventoryRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    INVENTORY_TOKENS.AdjustmentRepository,
    (c) => new PrismaInventoryAdjustmentRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );
  container.register(
    INVENTORY_TOKENS.ReservationRepository,
    (c) => new PrismaInventoryReservationRepository(c.resolve(TOKENS.Prisma)),
    'singleton',
  );

  container.register(
    INVENTORY_TOKENS.AdjustInventoryUseCase,
    (c) =>
      new AdjustInventoryUseCase(
        c.resolve(INVENTORY_TOKENS.InventoryRepository),
        c.resolve(INVENTORY_TOKENS.AdjustmentRepository),
      ),
    'singleton',
  );
  container.register(
    INVENTORY_TOKENS.ReserveInventoryUseCase,
    (c) =>
      new ReserveInventoryUseCase(
        c.resolve(INVENTORY_TOKENS.InventoryRepository),
        c.resolve(INVENTORY_TOKENS.ReservationRepository),
      ),
    'singleton',
  );
  container.register(
    INVENTORY_TOKENS.BulkUpdateInventoryUseCase,
    (c) =>
      new BulkUpdateInventoryUseCase(
        c.resolve(INVENTORY_TOKENS.InventoryRepository),
        c.resolve(INVENTORY_TOKENS.AdjustmentRepository),
      ),
    'singleton',
  );
}
