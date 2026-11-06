import { describe, it, expect } from 'vitest';
import { Container } from '@/shared/infrastructure/container/container';
import { createToken, TOKENS } from '@/shared/infrastructure/container/tokens';
import { createAppContainer } from '@/shared/infrastructure/container/app-container';

describe('DI Container', () => {
  it('registers and resolves singletons and transients', () => {
    const container = new Container();
    const token = createToken<{ id: number }>('Service');

    let counter = 0;
    container.register(token, () => ({ id: ++counter }), 'singleton');

    const s1 = container.resolve(token);
    const s2 = container.resolve(token);
    expect(s1.id).toBe(1);
    expect(s2.id).toBe(1);

    const transientToken = createToken<{ id: number }>('Transient');
    let tCounter = 0;
    container.register(transientToken, () => ({ id: ++tCounter }), 'transient');

    const t1 = container.resolve(transientToken);
    const t2 = container.resolve(transientToken);
    expect(t1.id).toBe(1);
    expect(t2.id).toBe(2);
  });

  it('resolves parent container bindings from child', () => {
    const parent = new Container();
    const token = createToken<string>('AppName');
    parent.registerInstance(token, 'zeelove');

    const child = parent.createChild();
    expect(child.resolve(token)).toBe('zeelove');
  });

  it('creates app container with all default ports registered', () => {
    const container = createAppContainer();

    expect(container.has(TOKENS.Clock)).toBe(true);
    expect(container.has(TOKENS.IdGenerator)).toBe(true);
    expect(container.has(TOKENS.Logger)).toBe(true);
    expect(container.has(TOKENS.EventBus)).toBe(true);
    expect(container.has(TOKENS.Cache)).toBe(true);
    expect(container.has(TOKENS.RateLimiter)).toBe(true);
    expect(container.has(TOKENS.Prisma)).toBe(true);
    expect(container.has(TOKENS.UnitOfWork)).toBe(true);
  });
});
