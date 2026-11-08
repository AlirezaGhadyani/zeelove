// Public API of inventory bounded context
export * from './domain/entities/inventory-level.entity';
export * from './domain/entities/inventory-adjustment.entity';
export * from './domain/entities/inventory-reservation.entity';

export * from './application/ports/inventory.repository.port';
export * from './application/ports/inventory-adjustment.repository.port';
export * from './application/ports/inventory-reservation.repository.port';

export * from './application/use-cases/adjust-inventory.use-case';
export * from './application/use-cases/reserve-inventory.use-case';
export * from './application/use-cases/bulk-update-inventory.use-case';

export * from './infrastructure/container/register-inventory';
