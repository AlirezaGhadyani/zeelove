import { PrismaClient } from '@prisma/client';
import { env } from '@/shared/infrastructure/config/env';
import { createModelFallback } from './prisma-in-memory-fallback';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

let isDatabaseAvailable = false;
let hasCheckedDatabase = false;

export function createPrismaClient(): PrismaClient {
  let realClient: PrismaClient | null = null;
  try {
    realClient = new PrismaClient({
      log: [],
    });
  } catch {
    hasCheckedDatabase = true;
    isDatabaseAvailable = false;
  }

  if ((process.env.VITEST || env.NODE_ENV === 'test') && realClient) {
    return realClient;
  }

  const targetObj = (realClient ?? {}) as PrismaClient;

  return new Proxy(targetObj, {
    get(target, prop, receiver) {
      if (prop === '$transaction') {
        return async function (arg: unknown) {
          if (hasCheckedDatabase && !isDatabaseAvailable) {
            if (typeof arg === 'function') {
              return (arg as (client: unknown) => Promise<unknown>)(receiver);
            }
            return [];
          }
          try {
            if (target.$transaction) {
              return await (target.$transaction as (a: unknown) => Promise<unknown>)(arg);
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            if (message.includes('ROLLBACK_TRANSACTION_FOR_TEST')) {
              throw err;
            }
            hasCheckedDatabase = true;
            isDatabaseAvailable = false;
          }
          if (typeof arg === 'function') {
            return (arg as (client: unknown) => Promise<unknown>)(receiver);
          }
          return [];
        };
      }

      const orig = Reflect.get(target, prop, receiver);

      if (typeof orig === 'function') {
        return (orig as (...args: unknown[]) => unknown).bind(target);
      }
      if (prop === '$disconnect' || prop === '$connect') {
        return async () => {};
      }

      const modelFallback = createModelFallback(String(prop));

      if (typeof orig === 'object' && orig !== null) {
        return new Proxy(orig as Record<string, unknown>, {
          get(modelTarget, modelProp, modelReceiver) {
            const modelOrig = Reflect.get(modelTarget, modelProp, modelReceiver);
            if (typeof modelOrig === 'function') {
              return function (...args: unknown[]) {
                if (hasCheckedDatabase && !isDatabaseAvailable) {
                  const fallbackFn = modelFallback[String(modelProp)] ?? (async () => null);
                  return fallbackFn(...args);
                }

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
                      hasCheckedDatabase = true;
                      isDatabaseAvailable = false;
                      const fallbackFn = modelFallback[String(modelProp)] ?? (async () => null);
                      return fallbackFn(...args);
                    });
                  }
                  return result;
                } catch {
                  hasCheckedDatabase = true;
                  isDatabaseAvailable = false;
                  const fallbackFn = modelFallback[String(modelProp)] ?? (async () => null);
                  return fallbackFn(...args);
                }
              };
            }
            return modelOrig ?? modelFallback[String(modelProp)];
          },
        });
      }

      return modelFallback;
    },
  });
}

export const prisma: PrismaClient = globalThis.__prismaClient ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
