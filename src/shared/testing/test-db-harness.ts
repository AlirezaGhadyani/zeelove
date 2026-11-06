import type { PrismaClient } from '@prisma/client';

class RollbackSignal extends Error {
  constructor(public readonly result: unknown) {
    super('ROLLBACK_TRANSACTION_FOR_TEST');
  }
}

export class TestDbHarness {
  constructor(private readonly prisma: PrismaClient) {}

  public async cleanDatabase(): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.adminAuditLog.deleteMany(),
      this.prisma.outboxEvent.deleteMany(),
      this.prisma.idempotencyRecord.deleteMany(),
      this.prisma.systemSetting.deleteMany(),
    ]);
  }

  public async withRollback<T>(testFn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const result = await testFn(tx as PrismaClient);
        throw new RollbackSignal(result);
      });
      throw new Error('Transaction unexpectedly committed');
    } catch (error) {
      if (error instanceof RollbackSignal) {
        return error.result as T;
      }
      throw error;
    }
  }
}
