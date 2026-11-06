import { Entity } from '@/shared/kernel/entity';

export interface SessionProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Session extends Entity<string> {
  private readonly _userId: string;
  private readonly _tokenHash: string;
  private _expiresAt: Date;
  private readonly _ipAddress?: string | null;
  private readonly _userAgent?: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: SessionProps) {
    super(props.id);
    this._userId = props.userId;
    this._tokenHash = props.tokenHash;
    this._expiresAt = props.expiresAt;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public get userId(): string {
    return this._userId;
  }

  public get tokenHash(): string {
    return this._tokenHash;
  }

  public get expiresAt(): Date {
    return this._expiresAt;
  }

  public get ipAddress(): string | null | undefined {
    return this._ipAddress;
  }

  public get userAgent(): string | null | undefined {
    return this._userAgent;
  }

  public isExpired(now: Date = new Date()): boolean {
    return now.getTime() > this._expiresAt.getTime();
  }

  public slide(durationSeconds: number, now: Date = new Date()): void {
    this._expiresAt = new Date(now.getTime() + durationSeconds * 1000);
    this._updatedAt = new Date();
  }
}
