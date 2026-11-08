import type { InventoryReservation } from '../../domain/entities/inventory-reservation.entity';

export interface InventoryReservationRepositoryPort {
  save(reservation: InventoryReservation): Promise<void>;
  findById(id: string): Promise<InventoryReservation | null>;
  getActiveReservationsCount(variantId: string): Promise<number>;
  releaseExpired(now?: Date): Promise<number>;
}
