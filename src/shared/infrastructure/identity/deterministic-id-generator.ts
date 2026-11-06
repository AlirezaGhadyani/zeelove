import type { IdGenerator } from '@/shared/ports/id-generator.port';

export class DeterministicIdGenerator implements IdGenerator {
  private counter = 0;

  constructor(private readonly prefix = 'test-id') {}

  public generate(): string {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }

  public reset(): void {
    this.counter = 0;
  }
}
