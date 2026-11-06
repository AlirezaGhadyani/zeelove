import type { Session } from '../../domain/session.entity';

export interface SessionRepositoryPort {
  create(session: Session): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  updateExpiry(sessionId: string, expiresAt: Date): Promise<void>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteById(sessionId: string): Promise<void>;
  listByUserId(userId: string): Promise<Session[]>;
  deleteAllByUserId(userId: string): Promise<void>;
}
