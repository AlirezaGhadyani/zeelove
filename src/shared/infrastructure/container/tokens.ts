import type { Clock } from '@/shared/ports/clock.port';
import type { IdGenerator } from '@/shared/ports/id-generator.port';
import type { EventBus } from '@/shared/ports/event-bus.port';
import type { UnitOfWork } from '@/shared/ports/unit-of-work.port';
import type { LoggerPort } from '@/shared/ports/logger.port';
import type { CachePort } from '@/shared/ports/cache.port';
import type { RateLimiterPort } from '@/shared/ports/rate-limiter.port';
import type { PrismaClient } from '@prisma/client';
import type Redis from 'ioredis';

export interface InjectionToken<T> {
  readonly name: string;
  readonly _phantom?: T;
}

export function createToken<T>(name: string): InjectionToken<T> {
  return { name };
}

export const TOKENS = {
  Clock: createToken<Clock>('Clock'),
  IdGenerator: createToken<IdGenerator>('IdGenerator'),
  EventBus: createToken<EventBus>('EventBus'),
  UnitOfWork: createToken<UnitOfWork>('UnitOfWork'),
  Logger: createToken<LoggerPort>('Logger'),
  Cache: createToken<CachePort>('Cache'),
  RateLimiter: createToken<RateLimiterPort>('RateLimiter'),
  Prisma: createToken<PrismaClient>('PrismaClient'),
  Redis: createToken<Redis | null>('Redis'),
} as const;
