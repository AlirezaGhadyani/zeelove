import { logger } from './logger';
import type { LoggerPort, LogContext } from '@/shared/ports/logger.port';

export class PinoLoggerAdapter implements LoggerPort {
  public debug(message: string, context?: LogContext): void {
    logger.debug(context ?? {}, message);
  }

  public info(message: string, context?: LogContext): void {
    logger.info(context ?? {}, message);
  }

  public warn(message: string, context?: LogContext): void {
    logger.warn(context ?? {}, message);
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    const errorDetails =
      error instanceof Error
        ? { err: { message: error.message, stack: error.stack } }
        : { rawError: error };
    logger.error({ ...context, ...errorDetails }, message);
  }
}
