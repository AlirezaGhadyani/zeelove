export type AfterCommitHook = () => Promise<void> | void;

export interface UnitOfWork {
  execute<T>(work: () => Promise<T>): Promise<T>;
  registerAfterCommit(hook: AfterCommitHook): void;
}
