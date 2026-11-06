import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok } from '@/shared/kernel/result';
import type { Session } from '../../domain/session.entity';
import type { SessionRepositoryPort } from '../ports/session.repository.port';

export interface ListSessionsInput {
  userId: string;
}

export class ListSessionsUseCase implements UseCase<ListSessionsInput, Result<Session[], never>> {
  constructor(private readonly sessionRepo: SessionRepositoryPort) {}

  public async execute(input: ListSessionsInput): Promise<Result<Session[], never>> {
    const sessions = await this.sessionRepo.listByUserId(input.userId);
    return ok(sessions);
  }
}
