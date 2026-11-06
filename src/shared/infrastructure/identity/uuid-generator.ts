import { randomUUID } from 'node:crypto';
import type { IdGenerator } from '@/shared/ports/id-generator.port';

export class UuidGenerator implements IdGenerator {
  public generate(): string {
    return randomUUID();
  }
}
