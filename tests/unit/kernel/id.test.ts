import { describe, it, expect } from 'vitest';
import { UniqueId, AggregateId } from '@/shared/kernel/id';
import { DomainRuleViolationError } from '@/shared/kernel/domain-error';

describe('Id Value Objects', () => {
  it('creates valid UniqueId', () => {
    const id = UniqueId.create('  abc-123  ');
    expect(id.value).toBe('abc-123');
    expect(id.toString()).toBe('abc-123');
  });

  it('rejects empty ID strings', () => {
    expect(() => UniqueId.create('')).toThrow(DomainRuleViolationError);
    expect(() => UniqueId.create('   ')).toThrow(DomainRuleViolationError);
  });

  it('creates AggregateId with entity namespace', () => {
    const aggId = AggregateId.create('user-99', 'User');
    expect(aggId.value).toBe('user-99');
    expect(aggId.entityName).toBe('User');
  });
});
