import type { PrismaClient } from '@prisma/client';
import type { UnitOfWork, AfterCommitHook } from '@/shared/ports/unit-of-work.port';
import type { LoggerPort } from '@/shared/ports/logger.port';

export class PrismaUnitOfWork implements UnitOfWork {
  private readonly afterCommitHooks: AfterCommitHook[] = [];

  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger?: LoggerPort,
  ) {}

  public registerAfterCommit(hook: AfterCommitHook): void {
    this.afterCommitHooks.push(hook);
  }

  public async execute<T>(work: () => Promise<T>): Promise<T> {
    const hooksToRun: AfterCommitHook[] = [];

    const result = await this.prisma.$transaction(async () => {
      const output = await work();
      hooksToRun.push(...this.afterCommitHooks);
      this.afterCommitHooks.length = 0;
      return output;
    });

    for (const hook of hooksToRun) {
      try {
        await hook();
      } catch (error) {
        this.logger?.error('Error executing after-commit hook', error);
      }
    }

    return result;
  }
}
