/**
 * Custom Error Types for Arcade App
 * Provides type-safe error handling across the application
 */

/**
 * Base error class for all application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

/**
 * Database-related errors (Supabase operations)
 */
export class DatabaseError extends AppError {
  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, code, 500, context);
  }
}

/**
 * API-related errors (Riot API, Henrik Dev API)
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, code, statusCode, context);
  }
}

/**
 * Data processing errors (stats generation, merging)
 */
export class ProcessingError extends AppError {
  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, code, 500, context);
  }
}

/**
 * Validation errors (invalid inputs)
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, code, 400, context);
  }
}

/**
 * Authentication/Authorization errors
 */
export class AuthError extends AppError {
  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, code, 401, context);
  }
}

/**
 * Network/connectivity errors
 */
export class NetworkError extends AppError {
  constructor(
    message: string,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message, code, 503, context);
  }
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if error is a specific error type
 */
export function isErrorType<T extends AppError>(
  error: unknown,
  ErrorClass: new (...args: any[]) => T
): error is T {
  return error instanceof ErrorClass;
}

/**
 * Extract user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Error codes for common scenarios
 */
export const ErrorCodes = {
  // Database
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  DB_INSERT_FAILED: 'DB_INSERT_FAILED',
  DB_UPDATE_FAILED: 'DB_UPDATE_FAILED',
  DB_DELETE_FAILED: 'DB_DELETE_FAILED',
  
  // API
  API_REQUEST_FAILED: 'API_REQUEST_FAILED',
  API_RATE_LIMITED: 'API_RATE_LIMITED',
  API_UNAUTHORIZED: 'API_UNAUTHORIZED',
  API_NOT_FOUND: 'API_NOT_FOUND',
  API_TIMEOUT: 'API_TIMEOUT',
  
  // Validation
  INVALID_PUUID: 'INVALID_PUUID',
  INVALID_REGION: 'INVALID_REGION',
  INVALID_MATCH_ID: 'INVALID_MATCH_ID',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Processing
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  MERGE_FAILED: 'MERGE_FAILED',
  GENERATION_FAILED: 'GENERATION_FAILED',
  
  // Auth
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  NO_CONNECTION: 'NO_CONNECTION',
} as const;

/**
 * Retry utility with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = (error) => {
      // Retry on network errors and rate limits by default
      if (isErrorType(error, NetworkError)) return true;
      if (isErrorType(error, ApiError) && error.code === ErrorCodes.API_RATE_LIMITED) return true;
      return false;
    },
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Don't retry if the error type shouldn't be retried
      if (!shouldRetry(error)) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Increase delay for next retry
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Log error to console (can be extended to log to monitoring service)
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', {
      error: isAppError(error) ? error.toJSON() : error,
      context,
      timestamp: new Date().toISOString(),
    });
  }
  
  // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  // Example:
  // Sentry.captureException(error, { extra: context });
}
