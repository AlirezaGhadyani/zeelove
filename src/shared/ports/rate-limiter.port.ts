export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly limit: number;
  readonly resetAt: Date;
}

export interface RateLimiterPort {
  limit(key: string, maxRequests: number, windowSeconds: number): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}
