import { PrismaClient } from '@prisma/client';
import { env } from '@/shared/infrastructure/config/env';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

export function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma: PrismaClient = globalThis.__prismaClient ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
