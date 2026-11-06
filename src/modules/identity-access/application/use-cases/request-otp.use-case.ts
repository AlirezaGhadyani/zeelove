import { randomInt, randomUUID, createHash } from 'node:crypto';
import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok, err } from '@/shared/kernel/result';
import { DomainError, ConflictError } from '@/shared/kernel/domain-error';
import type { Clock } from '@/shared/ports/clock.port';
import type { RateLimiterPort } from '@/shared/ports/rate-limiter.port';
import { MobileNumber } from '../../domain/mobile-number.vo';
import { OtpChallenge } from '../../domain/otp-challenge.entity';
import type { OtpSender } from '../ports/otp-sender.port';
import type { OtpChallengeRepositoryPort } from '../ports/otp-challenge.repository.port';

export interface RequestOtpInput {
  mobile: string;
  ipAddress?: string;
}

export interface RequestOtpOutput {
  success: boolean;
  resendInSeconds: number;
  devCode?: string;
}

export class RequestOtpUseCase implements UseCase<
  RequestOtpInput,
  Result<RequestOtpOutput, DomainError>
> {
  constructor(
    private readonly challengeRepo: OtpChallengeRepositoryPort,
    private readonly otpSender: OtpSender,
    private readonly rateLimiter: RateLimiterPort,
    private readonly clock: Clock,
    private readonly devMode: boolean = false,
  ) {}

  public async execute(input: RequestOtpInput): Promise<Result<RequestOtpOutput, DomainError>> {
    let mobileVo: MobileNumber;
    try {
      mobileVo = MobileNumber.create(input.mobile);
    } catch (error) {
      return err(error as DomainError);
    }

    const rateKey = `otp:req:${mobileVo.value}`;
    const rateCheck = await this.rateLimiter.limit(rateKey, 5, 600);
    if (!rateCheck.allowed) {
      return err(
        new ConflictError('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً دقایقی دیگر تلاش کنید.'),
      );
    }

    const existing = await this.challengeRepo.findLatestByMobile(mobileVo);
    const now = this.clock.now();
    if (existing && !existing.canResend(now) && !existing.isExpired(now)) {
      const waitSeconds = Math.ceil((existing.resendAllowedAt.getTime() - now.getTime()) / 1000);
      return err(new ConflictError(`لطفاً ${waitSeconds} ثانیه صبر کنید و مجدداً تلاش نمایید.`));
    }

    const plainCode = randomInt(100000, 1000000).toString();
    const codeHash = createHash('sha256').update(plainCode).digest('hex');

    const challenge = new OtpChallenge({
      id: randomUUID(),
      mobile: mobileVo,
      codeHash,
      attempts: 0,
      maxAttempts: 5,
      expiresAt: new Date(now.getTime() + 120 * 1000), // 2 minutes
      resendAllowedAt: new Date(now.getTime() + 60 * 1000), // 60s cooldown
      createdAt: now,
    });

    await this.challengeRepo.create(challenge);
    await this.otpSender.send(mobileVo, plainCode);

    return ok({
      success: true,
      resendInSeconds: 60,
      devCode: this.devMode ? plainCode : undefined,
    });
  }
}
