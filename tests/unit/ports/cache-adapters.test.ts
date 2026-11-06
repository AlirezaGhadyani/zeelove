import { describe, it, expect } from 'vitest';
import { InMemoryCacheAdapter } from '@/shared/infrastructure/cache/in-memory-cache.adapter';

describe('InMemoryCacheAdapter', () => {
  it('stores, retrieves, and deletes values', async () => {
    const cache = new InMemoryCacheAdapter();

    await cache.set('user:1', { name: 'Ali' });
    const cached = await cache.get<{ name: string }>('user:1');
    expect(cached).toEqual({ name: 'Ali' });

    await cache.delete('user:1');
    const afterDelete = await cache.get('user:1');
    expect(afterDelete).toBeNull();
  });

  it('respects TTL expiration', async () => {
    const cache = new InMemoryCacheAdapter();

    // Set item with 0.05 second TTL (50ms)
    await cache.set('temp:1', 'secret', 0.05);
    expect(await cache.get('temp:1')).toBe('secret');

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(await cache.get('temp:1')).toBeNull();
  });

  it('clears keys matching a prefix', async () => {
    const cache = new InMemoryCacheAdapter();
    await cache.set('auth:session:1', 'token1');
    await cache.set('auth:session:2', 'token2');
    await cache.set('catalog:product:1', 'prod1');

    await cache.clear('auth:');
    expect(await cache.get('auth:session:1')).toBeNull();
    expect(await cache.get('auth:session:2')).toBeNull();
    expect(await cache.get('catalog:product:1')).toBe('prod1');
  });
});
