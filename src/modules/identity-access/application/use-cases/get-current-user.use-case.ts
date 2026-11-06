import { createHash } from 'node:crypto';
import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok } from '@/shared/kernel/result';
import type { Clock } from '@/shared/ports/clock.port';
import type { User } from '../../domain/user.entity';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { SessionRepositoryPort } from '../ports/session.repository.port';

export interface GetCurrentUserInput {
  sessionToken?: string | null;
}

export class GetCurrentUserUseCase implements UseCase<
  GetCurrentUserInput,
  Result<User | null, never>
> {
  constructor(
    private readonly sessionRepo: SessionRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
    private readonly clock: Clock,
  ) {}

  public async execute(input: GetCurrentUserInput): Promise<Result<User | null, never>> {
    if (!input.sessionToken) {
      return ok(null);
    }

    const tokenHash = createHash('sha256').update(input.sessionToken).digest('hex');
    const session = await this.sessionRepo.findByTokenHash(tokenHash);
    if (!session) {
      return ok(null);
    }

    const now = this.clock.now();
    if (session.isExpired(now)) {
      await this.sessionRepo.deleteByTokenHash(tokenHash);
      return ok(null);
    }

    // Sliding expiry: if within 7 days of expiry, extend to 14 days
    const remainingMs = session.expiresAt.getTime() - now.getTime();
    if (remainingMs < 7 * 24 * 3600 * 1000) {
      const newExpiry = new Date(now.getTime() + 14 * 24 * 3600 * 1000);
      await this.sessionRepo.updateExpiry(session.id, newExpiry);
    }

    const user = await this.userRepo.findById(session.userId);
    return ok(user);
  }
}
