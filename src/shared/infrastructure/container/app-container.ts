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

export type ModuleRegistration = (container: Container) => void;

export const registeredModules: ModuleRegistration[] = [registerIdentityAccess];

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
  container.register(TOKENS.Cache, () => new InMemoryCacheAdapter(), 'singleton');
  container.register(TOKENS.RateLimiter, () => new InMemoryRateLimiter(), 'singleton');
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
