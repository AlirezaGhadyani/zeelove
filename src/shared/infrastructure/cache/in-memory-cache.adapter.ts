import type { CachePort } from '@/shared/ports/cache.port';

interface CacheItem {
  value: unknown;
  expiresAt: number | null;
}

export class InMemoryCacheAdapter implements CachePort {
  private readonly store = new Map<string, CacheItem>();

  public async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) {
      return null;
    }
    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return structuredClone(item.value) as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, {
      value: structuredClone(value),
      expiresAt,
    });
  }

  public async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  public async clear(prefix?: string): Promise<void> {
    if (!prefix) {
      this.store.clear();
      return;
    }
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  public size(): number {
    return this.store.size;
  }
}
