import type { Clock } from '@/shared/ports/clock.port';

export class FrozenClock implements Clock {
  private currentDate: Date;

  constructor(initialDate: Date = new Date()) {
    this.currentDate = new Date(initialDate.getTime());
  }

  public now(): Date {
    return new Date(this.currentDate.getTime());
  }

  public epochMs(): number {
    return this.currentDate.getTime();
  }

  public advanceMs(ms: number): void {
    this.currentDate = new Date(this.currentDate.getTime() + ms);
  }

  public setTime(date: Date): void {
    this.currentDate = new Date(date.getTime());
  }
}
