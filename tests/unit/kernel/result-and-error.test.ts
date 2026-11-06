import { describe, it, expect } from 'vitest';
import { ok, err } from '@/shared/kernel/result';
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  DomainRuleViolationError,
} from '@/shared/kernel/domain-error';

describe('Result & Either', () => {
  it('handles Ok cases with functional combinators', () => {
    const res = ok(10);
    expect(res.isOk).toBe(true);
    expect(res.isErr).toBe(false);
    expect(res.unwrap()).toBe(10);
    expect(res.unwrapOr(0)).toBe(10);

    const doubled = res.map((n) => n * 2);
    expect(doubled.unwrap()).toBe(20);

    const flat = res.flatMap((n) => ok(`num: ${n}`));
    expect(flat.unwrap()).toBe('num: 10');
  });

  it('handles Err cases and prevents unwrapping', () => {
    const res = err<number, ValidationError>(new ValidationError('invalid input'));
    expect(res.isOk).toBe(false);
    expect(res.isErr).toBe(true);
    expect(res.unwrapOr(99)).toBe(99);
    expect(() => res.unwrap()).toThrow('invalid input');

    const mappedErr = res.mapErr((e) => new ConflictError(e.message));
    expect(mappedErr.isErr).toBe(true);
    if (mappedErr.isErr) {
      expect(mappedErr.error.code).toBe('CONFLICT');
    }
  });
});

describe('DomainError Hierarchy', () => {
  it('instantiates all error types with proper codes and messages', () => {
    const notFound = new NotFoundError('Product', 'prod-1');
    expect(notFound.code).toBe('NOT_FOUND');
    expect(notFound.message).toContain('prod-1');

    const validation = new ValidationError('Phone invalid');
    expect(validation.code).toBe('VALIDATION_ERROR');

    const conflict = new ConflictError('Email already exists');
    expect(conflict.code).toBe('CONFLICT');

    const unauth = new UnauthorizedError();
    expect(unauth.code).toBe('UNAUTHORIZED');

    const forbidden = new ForbiddenError();
    expect(forbidden.code).toBe('FORBIDDEN');

    const rule = new DomainRuleViolationError('MAX_LIMIT', 'Exceeded limit');
    expect(rule.code).toBe('RULE_VIOLATION');
  });
});
