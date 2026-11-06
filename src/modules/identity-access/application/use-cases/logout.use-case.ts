import { createHash } from 'node:crypto';
import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok } from '@/shared/kernel/result';
import type { SessionRepositoryPort } from '../ports/session.repository.port';

export interface LogoutInput {
  sessionToken: string;
}

export class LogoutUseCase implements UseCase<LogoutInput, Result<boolean, never>> {
  constructor(private readonly sessionRepo: SessionRepositoryPort) {}

  public async execute(input: LogoutInput): Promise<Result<boolean, never>> {
    if (input.sessionToken) {
      const tokenHash = createHash('sha256').update(input.sessionToken).digest('hex');
      await this.sessionRepo.deleteByTokenHash(tokenHash);
    }
    return ok(true);
  }
}
