import type { PrismaClient } from '@prisma/client';
import type { SessionRepositoryPort } from '../../application/ports/session.repository.port';
import { Session } from '../../domain/session.entity';

export class PrismaSessionRepository implements SessionRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(session: Session): Promise<void> {
    await this.prisma.session.create({
      data: {
        id: session.id,
        userId: session.userId,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  public async findByTokenHash(tokenHash: string): Promise<Session | null> {
    const record = await this.prisma.session.findUnique({
      where: { tokenHash },
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  public async updateExpiry(sessionId: string, expiresAt: Date): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt, updatedAt: new Date() },
    });
  }

  public async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  public async deleteById(sessionId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { id: sessionId },
    });
  }

  public async listByUserId(userId: string): Promise<Session[]> {
    const records = await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDomain(r));
  }

  public async deleteAllByUserId(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  private toDomain(record: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Session {
    return new Session({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
