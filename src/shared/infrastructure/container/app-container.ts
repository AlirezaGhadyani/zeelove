import { Container } from './container';
import { TOKENS } from './tokens';
import { SystemClock } from '../clock/system-clock';
import { UuidGenerator } from '../identity/uuid-generator';
import { PinoLoggerAdapter } from '../logging/pino-logger.adapter';
import { InProcessEventBus } from '../events/in-process-event-bus';
import { InMemoryCacheAdapter } from '../cache/in-memory-cache.adapter';
import { InMemoryRateLimiter } from '../rate-limiter/in-memory-rate-limiter.adapter';
import { prisma } from '../database/prisma';
import { PrismaUnitOfWork } from '../database/prisma-unit-of-work';

import { registerIdentityAccess } from '@/modules/identity-access';
import { registerCatalog } from '@/modules/catalog';
import { registerInventory } from '@/modules/inventory';

import Redis from 'ioredis';
import { env } from '../config/env';
import { RedisCacheAdapter } from '../cache/redis-cache.adapter';
import { RedisRateLimiter } from '../rate-limiter/redis-rate-limiter.adapter';

declare global {
  var __redisClient: Redis | null | undefined;
}

function getRedisClient(): Redis | null {
  if (globalThis.__redisClient !== undefined) {
    return globalThis.__redisClient;
  }
  if (!env.REDIS_URL || (env.REDIS_URL.includes('localhost:6379') && env.NODE_ENV === 'test')) {
    globalThis.__redisClient = null;
    return null;
  }
  try {
    const client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 2000,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 100, 1000);
      },
    });
    client.on('error', (err) => {
      console.warn('[Redis] Connection warning:', err.message);
    });
    globalThis.__redisClient = client;
    return client;
  } catch (err) {
    console.warn('[Redis] Failed to initialize client:', err);
    globalThis.__redisClient = null;
    return null;
  }
}
export type ModuleRegistration = (container: Container) => void;

export const registeredModules: ModuleRegistration[] = [
  registerIdentityAccess,
  registerCatalog,
  registerInventory,
];

export function createAppContainer(moduleRegistrars = registeredModules): Container {
  const container = new Container();

  container.register(TOKENS.Clock, () => new SystemClock(), 'singleton');
  container.register(TOKENS.IdGenerator, () => new UuidGenerator(), 'singleton');
  container.register(TOKENS.Logger, () => new PinoLoggerAdapter(), 'singleton');
  container.register(
    TOKENS.EventBus,
    (c) => new InProcessEventBus(c.resolve(TOKENS.Logger)),
    'singleton',
  );

  const redis = getRedisClient();
  container.registerInstance(TOKENS.Redis, redis);

  if (redis) {
    container.register(TOKENS.Cache, () => new RedisCacheAdapter(redis), 'singleton');
    container.register(TOKENS.RateLimiter, () => new RedisRateLimiter(redis), 'singleton');
  } else {
    container.register(TOKENS.Cache, () => new InMemoryCacheAdapter(), 'singleton');
    container.register(TOKENS.RateLimiter, () => new InMemoryRateLimiter(), 'singleton');
  }

  container.registerInstance(TOKENS.Prisma, prisma);
  container.register(
    TOKENS.UnitOfWork,
    (c) => new PrismaUnitOfWork(c.resolve(TOKENS.Prisma), c.resolve(TOKENS.Logger)),
    'singleton',
  );

  for (const register of moduleRegistrars) {
    register(container);
  }

  return container;
}
