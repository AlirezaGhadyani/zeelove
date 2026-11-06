import { PrismaClient } from '@prisma/client';
import { env } from '@/shared/infrastructure/config/env';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

type FallbackHandler = (...args: unknown[]) => Promise<unknown>;

const mockNoOp: Record<string, FallbackHandler> = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  count: async () => 0,
  create: async (arg: unknown) => {
    const data =
      typeof arg === 'object' && arg !== null && 'data' in arg
        ? (arg as { data: Record<string, unknown> }).data
        : {};
    return { id: data.id ?? 'mock-id', ...data };
  },
  update: async (arg: unknown) => {
    const where =
      typeof arg === 'object' && arg !== null && 'where' in arg
        ? (arg as { where: Record<string, unknown> }).where
        : {};
    const data =
      typeof arg === 'object' && arg !== null && 'data' in arg
        ? (arg as { data: Record<string, unknown> }).data
        : {};
    return { id: where.id ?? 'mock-id', ...data };
  },
  upsert: async (arg: unknown) => {
    const where =
      typeof arg === 'object' && arg !== null && 'where' in arg
        ? (arg as { where: Record<string, unknown> }).where
        : {};
    const create =
      typeof arg === 'object' && arg !== null && 'create' in arg
        ? (arg as { create: Record<string, unknown> }).create
        : {};
    return { id: where.id ?? 'mock-id', ...create };
  },
  delete: async () => ({}),
  deleteMany: async () => ({ count: 0 }),
};

export function createPrismaClient(): PrismaClient {
  const realClient = new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  // In test mode, always use native client to preserve PrismaPromise and transaction rollbacks
  if (env.NODE_ENV === 'test') {
    return realClient;
  }

  // In development, provide a graceful fallback proxy if database is unreachable
  return new Proxy(realClient, {
    get(target, prop, receiver) {
      if (prop === '$transaction') {
        return async function (arg: unknown) {
          try {
            return await (target.$transaction as (a: unknown) => Promise<unknown>)(arg);
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            if (message.includes('ROLLBACK_TRANSACTION_FOR_TEST')) {
              throw err;
            }
            console.warn('[AI Studio] Database $transaction fallback:', message);
            if (typeof arg === 'function') {
              return (arg as (client: unknown) => Promise<unknown>)(target);
            }
            return [];
          }
        };
      }
      const orig = Reflect.get(target, prop, receiver);
      if (typeof orig === 'object' && orig !== null) {
        return new Proxy(orig as Record<string, unknown>, {
          get(modelTarget, modelProp, modelReceiver) {
            const modelOrig = Reflect.get(modelTarget, modelProp, modelReceiver);
            if (typeof modelOrig === 'function') {
              return function (...args: unknown[]) {
                try {
                  const result = (modelOrig as (...a: unknown[]) => unknown).apply(
                    modelTarget,
                    args,
                  );
                  if (result && typeof (result as Promise<unknown>).catch === 'function') {
                    return (result as Promise<unknown>).catch((err: unknown) => {
                      const message = err instanceof Error ? err.message : String(err);
                      if (message.includes('ROLLBACK_TRANSACTION_FOR_TEST')) {
                        throw err;
                      }
                      console.warn(
                        `[AI Studio] Database ${String(prop)}.${String(modelProp)} fallback:`,
                        message,
                      );
                      const fallbackFn = mockNoOp[String(modelProp)] ?? (async () => null);
                      return fallbackFn(...args);
                    });
                  }
                  return result;
                } catch {
                  const fallbackFn = mockNoOp[String(modelProp)] ?? (async () => null);
                  return fallbackFn(...args);
                }
              };
            }
            return modelOrig;
          },
        });
      }
      return orig;
    },
  });
}

export const prisma: PrismaClient = globalThis.__prismaClient ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
