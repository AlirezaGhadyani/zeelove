import type { Clock } from '@/shared/ports/clock.port';

export class SystemClock implements Clock {
  public now(): Date {
    return new Date();
  }

  public epochMs(): number {
    return Date.now();
  }
}
