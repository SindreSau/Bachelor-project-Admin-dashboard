// lib/logger.ts
import pino, { Logger } from 'pino';
import { RequestContext } from '../utils/request-context';

// Define error object type
interface ErrorObject {
  message: string;
  code?: string;
  stack?: string;
}

// Define log method types that can be passed around
export interface RequestLogger extends Logger {
  info: <T extends object>(obj: T, msg?: string) => void;
  error: <T extends object>(obj: T & { error?: ErrorObject }, msg?: string) => void;
  warn: <T extends object>(obj: T, msg?: string) => void;
  debug: <T extends object>(obj: T, msg?: string) => void;
}

// Create the base logger
const baseLogger: Logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: 'bachelor-admin' },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});

// Export the default logger for non-request contexts
export const logger: RequestLogger = baseLogger as RequestLogger;

// Function types for the withRequestLogger wrapper
type LoggerFunction<T, Args extends unknown[]> = (
  logger: RequestLogger,
  ...args: Args
) => Promise<T>;

// Create a middleware or wrapper to attach context
export function withRequestLogger<T, Args extends unknown[]>(
  fn: LoggerFunction<T, Args>
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    // Dynamic import to avoid server/client mismatch issues
    const { getRequestContext } = await import('../utils/request-context');
    const requestContext: RequestContext = await getRequestContext();

    // Create a contextualized logger for this request
    const requestLogger: RequestLogger = baseLogger.child(requestContext) as RequestLogger;

    try {
      return await fn(requestLogger, ...args);
    } catch (error) {
      const errorObject: ErrorObject = {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };

      requestLogger.error({ error: errorObject }, 'Error in request handler');
      throw error;
    }
  };
}
