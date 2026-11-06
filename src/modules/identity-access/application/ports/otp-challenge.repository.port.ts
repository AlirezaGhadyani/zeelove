import type { OtpChallenge } from '../../domain/otp-challenge.entity';
import type { MobileNumber } from '../../domain/mobile-number.vo';

export interface OtpChallengeRepositoryPort {
  create(challenge: OtpChallenge): Promise<void>;
  findLatestByMobile(mobile: MobileNumber): Promise<OtpChallenge | null>;
  update(challenge: OtpChallenge): Promise<void>;
  deleteByMobile(mobile: MobileNumber): Promise<void>;
}
