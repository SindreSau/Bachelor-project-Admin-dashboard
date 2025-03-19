// lib/logger.server.ts
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
            // Customize format to put important info first
            messageFormat: '{msg} [id={requestId}]',
            // Remove noisy fields from pretty output
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  // Convert numeric time to ISO string
  formatters: {
    level(label) {
      return { level: label };
    },
    // Format time as a string
    log(object) {
      // Convert numeric timestamps to readable format
      if (object.time && typeof object.time === 'number') {
        object.time = new Date(object.time).toISOString();
      }
      return object;
    },
  },
});

// Export the default logger
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
    } catch (error: unknown) {
      const errorObject: ErrorObject = {
        message: error instanceof Error ? error.message : String(error),
      };

      // Add code if available (type guard for objects with code property)
      if (
        error !== null &&
        typeof error === 'object' &&
        'code' in error &&
        typeof error.code === 'string'
      ) {
        errorObject.code = error.code;
      }

      // Only add stack trace in development
      if (process.env.NODE_ENV !== 'production' && error instanceof Error && error.stack) {
        errorObject.stack = error.stack;
      }

      requestLogger.error({ error: errorObject }, 'Error in request handler');
      throw error;
    }
  };
}
