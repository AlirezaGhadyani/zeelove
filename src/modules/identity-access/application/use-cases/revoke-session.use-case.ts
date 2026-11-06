import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok } from '@/shared/kernel/result';
import type { SessionRepositoryPort } from '../ports/session.repository.port';

export interface RevokeSessionInput {
  sessionId: string;
}

export class RevokeSessionUseCase implements UseCase<RevokeSessionInput, Result<boolean, never>> {
  constructor(private readonly sessionRepo: SessionRepositoryPort) {}

  public async execute(input: RevokeSessionInput): Promise<Result<boolean, never>> {
    await this.sessionRepo.deleteById(input.sessionId);
    return ok(true);
  }
}
