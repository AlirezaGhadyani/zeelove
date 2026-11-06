import type { UnitOfWork, AfterCommitHook } from '@/shared/ports/unit-of-work.port';

export class FakeUnitOfWork implements UnitOfWork {
  private readonly stagedHooks: AfterCommitHook[] = [];
  public committed = false;
  public rolledBack = false;

  public registerAfterCommit(hook: AfterCommitHook): void {
    this.stagedHooks.push(hook);
  }

  public async execute<T>(work: () => Promise<T>): Promise<T> {
    try {
      const result = await work();
      this.committed = true;
      for (const hook of this.stagedHooks) {
        await hook();
      }
      this.stagedHooks.length = 0;
      return result;
    } catch (error) {
      this.rolledBack = true;
      this.stagedHooks.length = 0;
      throw error;
    }
  }

  public clear(): void {
    this.stagedHooks.length = 0;
    this.committed = false;
    this.rolledBack = false;
  }
}
