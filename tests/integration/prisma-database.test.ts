import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/shared/infrastructure/database/prisma';
import { TestDbHarness } from '@/shared/testing/test-db-harness';

describe('Prisma Integration Test against PostgreSQL', () => {
  const harness = new TestDbHarness(prisma);
  let isDbAvailable = false;

  beforeAll(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      isDbAvailable = true;
      await harness.cleanDatabase();
    } catch {
      isDbAvailable = false;
      console.warn(
        `\n⚠️  [integration] PostgreSQL is not reachable at ${process.env.DATABASE_URL || 'localhost:5432'}.\n   Skipping live database tests. To run integration tests against PostgreSQL, ensure .env contains a valid DATABASE_URL.\n`,
      );
    }
  });

  afterAll(async () => {
    if (isDbAvailable) {
      try {
        await harness.cleanDatabase();
        await prisma.$disconnect();
      } catch {
        // Safe cleanup
      }
    }
  });

  it('persists and retrieves an outbox event in the real database', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const created = await prisma.outboxEvent.create({
      data: {
        eventId: 'test-event-1',
        eventName: 'system.initialized',
        aggregateId: 'sys-1',
        payload: { ready: true },
        occurredOn: new Date(),
        status: 'PENDING',
      },
    });

    expect(created.id).toBeDefined();
    expect(created.eventId).toBe('test-event-1');

    const found = await prisma.outboxEvent.findUnique({
      where: { eventId: 'test-event-1' },
    });
    expect(found).not.toBeNull();
    expect(found?.eventName).toBe('system.initialized');
  });

  it('rolls back transaction changes cleanly using withRollback', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    await harness.withRollback(async (tx) => {
      await tx.outboxEvent.create({
        data: {
          eventId: 'rollback-event-99',
          eventName: 'temp.event',
          aggregateId: 'temp-1',
          payload: { temporary: true },
          occurredOn: new Date(),
        },
      });

      const inTx = await tx.outboxEvent.findUnique({
        where: { eventId: 'rollback-event-99' },
      });
      expect(inTx).not.toBeNull();
    });

    // Outside the rolled-back transaction, it must not exist!
    const outside = await prisma.outboxEvent.findUnique({
      where: { eventId: 'rollback-event-99' },
    });
    expect(outside).toBeNull();
  });
});
