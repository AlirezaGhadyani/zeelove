import { randomBytes, randomUUID, createHash } from 'node:crypto';
import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok, err } from '@/shared/kernel/result';
import { DomainError, ValidationError } from '@/shared/kernel/domain-error';
import type { Clock } from '@/shared/ports/clock.port';
import { MobileNumber } from '../../domain/mobile-number.vo';
import { User } from '../../domain/user.entity';
import { Session } from '../../domain/session.entity';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { SessionRepositoryPort } from '../ports/session.repository.port';
import type { OtpChallengeRepositoryPort } from '../ports/otp-challenge.repository.port';

export interface VerifyOtpInput {
  mobile: string;
  code: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface VerifyOtpOutput {
  user: User;
  sessionToken: string;
  expiresAt: Date;
}

export class VerifyOtpUseCase implements UseCase<
  VerifyOtpInput,
  Result<VerifyOtpOutput, DomainError>
> {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly sessionRepo: SessionRepositoryPort,
    private readonly challengeRepo: OtpChallengeRepositoryPort,
    private readonly clock: Clock,
    private readonly seedSuperAdminMobile: string,
  ) {}

  public async execute(input: VerifyOtpInput): Promise<Result<VerifyOtpOutput, DomainError>> {
    let mobileVo: MobileNumber;
    try {
      mobileVo = MobileNumber.create(input.mobile);
    } catch (error) {
      return err(error as DomainError);
    }

    const challenge = await this.challengeRepo.findLatestByMobile(mobileVo);
    const now = this.clock.now();
    if (!challenge || challenge.isExpired(now)) {
      return err(new ValidationError('کد تایید منقضی شده است. لطفاً مجدداً درخواست دهید.'));
    }

    if (challenge.isLocked()) {
      return err(
        new ValidationError('تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً کد جدید دریافت کنید.'),
      );
    }

    const isValid = challenge.verify(input.code);
    await this.challengeRepo.update(challenge);

    if (!isValid) {
      const remainingAttempts = Math.max(0, challenge.maxAttempts - challenge.attempts);
      return err(
        new ValidationError(`کد وارد شده صحیح نمی‌باشد. (${remainingAttempts} تلاش باقی مانده)`),
      );
    }

    await this.challengeRepo.deleteByMobile(mobileVo);

    let user = await this.userRepo.findByMobile(mobileVo);
    if (!user) {
      const isSuperAdmin = mobileVo.value === MobileNumber.normalize(this.seedSuperAdminMobile);
      user = new User({
        id: randomUUID(),
        mobile: mobileVo,
        role: isSuperAdmin ? 'SUPER_ADMIN' : 'CUSTOMER',
        name: isSuperAdmin ? 'مدیر کل زیلاو' : null,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      });
      await this.userRepo.create(user);
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const sessionExpiry = new Date(now.getTime() + 14 * 24 * 3600 * 1000); // 14 days

    const session = new Session({
      id: randomUUID(),
      userId: user.id,
      tokenHash,
      expiresAt: sessionExpiry,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      createdAt: now,
      updatedAt: now,
    });

    await this.sessionRepo.create(session);

    return ok({
      user,
      sessionToken: rawToken,
      expiresAt: sessionExpiry,
    });
  }
}
