import { Result, ok, err } from '@/shared/kernel/result';
import { DomainRuleViolationError, NotFoundError, type DomainError } from '@/shared/kernel/domain-error';
import type { InventoryRepositoryPort } from '../ports/inventory.repository.port';
import type { InventoryReservationRepositoryPort } from '../ports/inventory-reservation.repository.port';
import { InventoryReservation, ReservationStatus } from '../../domain/entities/inventory-reservation.entity';

export interface ReserveInventoryInput {
  variantId: string;
  quantity: number;
  ttlMinutes?: number;
}

export class ReserveInventoryUseCase {
  constructor(
    private readonly inventoryRepo: InventoryRepositoryPort,
    private readonly reservationRepo: InventoryReservationRepositoryPort,
  ) {}

  public async execute(input: ReserveInventoryInput): Promise<Result<InventoryReservation, DomainError>> {
    const level = await this.inventoryRepo.findByVariantId(input.variantId);
    if (!level) {
      return err(new NotFoundError('InventoryLevel', input.variantId));
    }

    const activeReservations = await this.reservationRepo.getActiveReservationsCount(input.variantId);
    const available = level.availableQuantity(activeReservations);

    if (available < input.quantity) {
      return err(
        new DomainRuleViolationError(
          'INSUFFICIENT_AVAILABLE_STOCK',
          `Cannot reserve ${input.quantity} units. Only ${available} available.`,
        ),
      );
    }

    const ttl = input.ttlMinutes ?? 15;
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

    const reservation = new InventoryReservation({
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      variantId: input.variantId,
      quantity: input.quantity,
      expiresAt,
      status: ReservationStatus.PENDING,
    });

    await this.reservationRepo.save(reservation);
    return ok(reservation);
  }

  public async confirm(reservationId: string): Promise<Result<boolean, DomainError>> {
    const res = await this.reservationRepo.findById(reservationId);
    if (!res) return err(new NotFoundError('InventoryReservation', reservationId));
    res.confirm();
    await this.reservationRepo.save(res);
    return ok(true);
  }

  public async release(reservationId: string): Promise<Result<boolean, DomainError>> {
    const res = await this.reservationRepo.findById(reservationId);
    if (!res) return err(new NotFoundError('InventoryReservation', reservationId));
    res.release();
    await this.reservationRepo.save(res);
    return ok(true);
  }
}
