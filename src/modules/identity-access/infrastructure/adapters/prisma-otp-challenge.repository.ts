import type { PrismaClient } from '@prisma/client';
import type { OtpChallengeRepositoryPort } from '../../application/ports/otp-challenge.repository.port';
import { OtpChallenge } from '../../domain/otp-challenge.entity';
import { MobileNumber } from '../../domain/mobile-number.vo';

export class PrismaOtpChallengeRepository implements OtpChallengeRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(challenge: OtpChallenge): Promise<void> {
    await this.prisma.otpChallenge.create({
      data: {
        id: challenge.id,
        mobile: challenge.mobile.value,
        codeHash: challenge.codeHash,
        attempts: challenge.attempts,
        maxAttempts: challenge.maxAttempts,
        expiresAt: challenge.expiresAt,
        resendAllowedAt: challenge.resendAllowedAt,
      },
    });
  }

  public async findLatestByMobile(mobile: MobileNumber): Promise<OtpChallenge | null> {
    const record = await this.prisma.otpChallenge.findFirst({
      where: { mobile: mobile.value },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  public async update(challenge: OtpChallenge): Promise<void> {
    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: {
        attempts: challenge.attempts,
      },
    });
  }

  public async deleteByMobile(mobile: MobileNumber): Promise<void> {
    await this.prisma.otpChallenge.deleteMany({
      where: { mobile: mobile.value },
    });
  }

  private toDomain(record: {
    id: string;
    mobile: string;
    codeHash: string;
    attempts: number;
    maxAttempts: number;
    expiresAt: Date;
    resendAllowedAt: Date;
    createdAt: Date;
  }): OtpChallenge {
    return new OtpChallenge({
      id: record.id,
      mobile: MobileNumber.create(record.mobile),
      codeHash: record.codeHash,
      attempts: record.attempts,
      maxAttempts: record.maxAttempts,
      expiresAt: record.expiresAt,
      resendAllowedAt: record.resendAllowedAt,
      createdAt: record.createdAt,
    });
  }
}
