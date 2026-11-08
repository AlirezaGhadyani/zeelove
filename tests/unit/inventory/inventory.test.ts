import { describe, it, expect } from 'vitest';
import { InventoryLevel } from '@/modules/inventory/domain/entities/inventory-level.entity';
import { InventoryAdjustment, AdjustmentReason } from '@/modules/inventory/domain/entities/inventory-adjustment.entity';
import { InventoryReservation, ReservationStatus } from '@/modules/inventory/domain/entities/inventory-reservation.entity';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';

describe('Inventory Domain Entities', () => {
  describe('InventoryLevel', () => {
    it('calculates available quantity considering safety stock and active reservations', () => {
      const level = new InventoryLevel({
        id: 'inv-1',
        variantId: 'var-1',
        quantity: 50,
        safetyStock: 5,
      });

      // Total 50, safetyStock 5, active reservations 10 -> available 35
      expect(level.availableQuantity(10)).toBe(35);
      expect(level.isInStock(10)).toBe(true);
    });

    it('returns zero available quantity if reservations and safety exceed total', () => {
      const level = new InventoryLevel({
        id: 'inv-2',
        variantId: 'var-2',
        quantity: 10,
        safetyStock: 5,
      });

      expect(level.availableQuantity(8)).toBe(0);
      expect(level.isInStock(8)).toBe(false);
    });

    it('adjusts quantity by positive or negative delta safely', () => {
      const level = new InventoryLevel({
        id: 'inv-3',
        variantId: 'var-3',
        quantity: 20,
      });

      level.adjust(15);
      expect(level.quantity).toBe(35);

      level.adjust(-10);
      expect(level.quantity).toBe(25);
    });

    it('throws error when adjustment would drop quantity below zero', () => {
      const level = new InventoryLevel({
        id: 'inv-4',
        variantId: 'var-4',
        quantity: 5,
      });

      expect(() => {
        level.adjust(-10);
      }).toThrow(DomainRuleViolationError);
    });
  });

  describe('InventoryAdjustment', () => {
    it('creates adjustment audit record with reasons and notes', () => {
      const adj = new InventoryAdjustment({
        id: 'adj-1',
        variantId: 'var-1',
        deltaQuantity: 20,
        newQuantity: 70,
        reason: AdjustmentReason.RECEIPT,
        note: 'فاکتور شماره ۱۲۳۴',
        adminId: 'admin-1',
      });

      expect(adj.deltaQuantity).toBe(20);
      expect(adj.newQuantity).toBe(70);
      expect(adj.reason).toBe(AdjustmentReason.RECEIPT);
      expect(adj.note).toBe('فاکتور شماره ۱۲۳۴');
    });
  });

  describe('InventoryReservation', () => {
    it('handles reservation lifecycle from pending to confirmed or released', () => {
      const futureDate = new Date(Date.now() + 15 * 60 * 1000);
      const res = new InventoryReservation({
        id: 'res-1',
        variantId: 'var-1',
        quantity: 2,
        expiresAt: futureDate,
        status: ReservationStatus.PENDING,
      });

      expect(res.isExpired(new Date())).toBe(false);
      res.confirm();
      expect(res.status).toBe(ReservationStatus.CONFIRMED);

      // Cannot release confirmed reservation
      expect(() => res.release()).toThrow(DomainRuleViolationError);
    });

    it('correctly detects expired reservations', () => {
      const pastDate = new Date(Date.now() - 1000);
      const res = new InventoryReservation({
        id: 'res-expired',
        variantId: 'var-1',
        quantity: 1,
        expiresAt: pastDate,
        status: ReservationStatus.PENDING,
      });

      expect(res.isExpired(new Date())).toBe(true);
      res.release();
      expect(res.status).toBe(ReservationStatus.RELEASED);
    });
  });
});
