import { timingSafeEqual, createHash } from 'node:crypto';
import { Entity } from '@/shared/kernel/entity';
import { MobileNumber } from './mobile-number.vo';

export interface OtpChallengeProps {
  id: string;
  mobile: MobileNumber;
  codeHash: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  resendAllowedAt: Date;
  createdAt: Date;
}

export class OtpChallenge extends Entity<string> {
  private readonly _mobile: MobileNumber;
  private readonly _codeHash: string;
  private _attempts: number;
  private readonly _maxAttempts: number;
  private readonly _expiresAt: Date;
  private readonly _resendAllowedAt: Date;
  private readonly _createdAt: Date;

  constructor(props: OtpChallengeProps) {
    super(props.id);
    this._mobile = props.mobile;
    this._codeHash = props.codeHash;
    this._attempts = props.attempts;
    this._maxAttempts = props.maxAttempts;
    this._expiresAt = props.expiresAt;
    this._resendAllowedAt = props.resendAllowedAt;
    this._createdAt = props.createdAt;
  }

  public get mobile(): MobileNumber {
    return this._mobile;
  }

  public get codeHash(): string {
    return this._codeHash;
  }

  public get attempts(): number {
    return this._attempts;
  }

  public get maxAttempts(): number {
    return this._maxAttempts;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public get resendAllowedAt(): Date {
    return this._resendAllowedAt;
  }

  public isExpired(now: Date = new Date()): boolean {
    return now.getTime() > this._expiresAt.getTime();
  }

  public isLocked(): boolean {
    return this._attempts >= this._maxAttempts;
  }

  public canResend(now: Date = new Date()): boolean {
    return now.getTime() >= this._resendAllowedAt.getTime();
  }

  public verify(plainCode: string): boolean {
    this._attempts += 1;
    if (this.isExpired() || this.isLocked()) {
      return false;
    }

    const hashedInput = createHash('sha256').update(plainCode.trim()).digest('hex');
    const a = Buffer.from(this._codeHash, 'utf8');
    const b = Buffer.from(hashedInput, 'utf8');

    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }
}
