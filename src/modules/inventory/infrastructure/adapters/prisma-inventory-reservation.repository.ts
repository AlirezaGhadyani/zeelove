import type { PrismaClient } from '@prisma/client';
import type { InventoryReservationRepositoryPort } from '../../application/ports/inventory-reservation.repository.port';
import { InventoryReservation, type ReservationStatusType } from '../../domain/entities/inventory-reservation.entity';

export class PrismaInventoryReservationRepository implements InventoryReservationRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(reservation: InventoryReservation): Promise<void> {
    await this.prisma.inventoryReservation.upsert({
      where: { id: reservation.id },
      create: {
        id: reservation.id,
        variantId: reservation.variantId,
        quantity: reservation.quantity,
        expiresAt: reservation.expiresAt,
        status: reservation.status,
        createdAt: reservation.createdAt,
      },
      update: {
        status: reservation.status,
      },
    });
  }

  public async findById(id: string): Promise<InventoryReservation | null> {
    const record = await this.prisma.inventoryReservation.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  public async getActiveReservationsCount(variantId: string): Promise<number> {
    const now = new Date();
    const result = await this.prisma.inventoryReservation.aggregate({
      where: {
        variantId,
        status: 'PENDING',
        expiresAt: { gt: now },
      },
      _sum: {
        quantity: true,
      },
    });
    return result._sum.quantity ?? 0;
  }

  public async releaseExpired(now = new Date()): Promise<number> {
    const result = await this.prisma.inventoryReservation.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: { lte: now },
      },
      data: {
        status: 'RELEASED',
      },
    });
    return result.count;
  }

  private toDomain(record: {
    id: string;
    variantId: string;
    quantity: number;
    expiresAt: Date;
    status: string;
    createdAt: Date;
  }): InventoryReservation {
    return new InventoryReservation({
      id: record.id,
      variantId: record.variantId,
      quantity: record.quantity,
      expiresAt: record.expiresAt,
      status: (record.status as ReservationStatusType) || 'PENDING',
      createdAt: record.createdAt,
    });
  }
}
