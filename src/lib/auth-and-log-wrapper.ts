// lib/auth-and-log-wrapper.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { RequestLogger, withRequestLogger } from './logger.server';

// Error class for auth errors
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Function types for the withAuthAndLog wrapper
type AuthLoggerFunction<T, Args extends unknown[]> = (
  logger: RequestLogger,
  ...args: Args
) => Promise<T>;

/**
 * Combines authentication and logging for server actions
 *
 * @param fn The function to wrap with auth and logging
 * @returns A function that performs auth checks before executing the original function
 */
export function withAuthAndLog<T, Args extends unknown[]>(
  fn: AuthLoggerFunction<T, Args>
): (...args: Args) => Promise<T> | void {
  return withRequestLogger<T, Args>(async (logger: RequestLogger, ...args: Args): Promise<T> => {
    try {
      // Skip auth for tests
      if (process.env.NODE_ENV === 'test') {
        return await fn(logger, ...args);
      }

      // Get the Kinde session
      const { getUser, isAuthenticated } = getKindeServerSession();

      // Check if the user is authenticated
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        logger.warn({}, 'Unauthorized attempt to access resource');
        throw new AuthError('Unauthorized access');
      }

      // Get the user for additional context
      const user = await getUser();
      if (!user) {
        logger.warn({}, 'User authenticated but no user data found');
        throw new AuthError('User data not available');
      }

      // Execute the wrapped function with user context
      return await fn(logger, ...args);
    } catch (err) {
      // If it's already an AuthError, just rethrow it
      // (it would have already been logged by withRequestLogger)
      if (err instanceof AuthError) {
        throw err;
      }

      // For all other errors, let withRequestLogger handle logging
      throw err;
    }
  });
}
