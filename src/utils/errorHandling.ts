/**
 * Error handling utilities
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  API = 'API',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
}

/**
 * Create formatted error
 */
export const createError = (
  type: ErrorType,
  message: string,
  code?: string,
  details?: any
): AppError => {
  return {
    type,
    message,
    code,
    details,
    timestamp: Date.now(),
  };
};

/**
 * Parse error from various sources
 */
export const parseError = (error: any): AppError => {
  // Network errors
  if (error.message?.includes('Network') || error.message?.includes('fetch')) {
    return createError(
      ErrorType.NETWORK,
      'Network error. Please check your connection.',
      'NETWORK_ERROR',
      error
    );
  }

  // Auth errors
  if (error.message?.includes('auth') || error.message?.includes('token')) {
    return createError(
      ErrorType.AUTH,
      'Authentication error. Please log in again.',
      'AUTH_ERROR',
      error
    );
  }

  // Validation errors
  if (error.message?.includes('valid') || error.code === 'VALIDATION_ERROR') {
    return createError(
      ErrorType.VALIDATION,
      error.message || 'Validation error.',
      'VALIDATION_ERROR',
      error
    );
  }

  // API errors
  if (error.response || error.status) {
    return createError(
      ErrorType.API,
      error.message || 'API request failed.',
      `API_${error.status || 'ERROR'}`,
      error
    );
  }

  // Database errors
  if (error.message?.includes('database') || error.message?.includes('Supabase')) {
    return createError(
      ErrorType.DATABASE,
      'Database error. Please try again.',
      'DATABASE_ERROR',
      error
    );
  }

  // Unknown errors
  return createError(
    ErrorType.UNKNOWN,
    error.message || 'An unexpected error occurred.',
    'UNKNOWN_ERROR',
    error
  );
};

/**
 * Get user-friendly error message
 */
export const getUserMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Network connection issue. Please check your internet and try again.';
    case ErrorType.AUTH:
      return 'Authentication failed. Please log in again.';
    case ErrorType.VALIDATION:
      return error.message;
    case ErrorType.API:
      return 'Server error. Please try again later.';
    case ErrorType.DATABASE:
      return 'Data error. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

/**
 * Log error (can be extended to send to error tracking service)
 */
export const logError = (error: AppError, context?: string): void => {
  console.error(`[${error.type}] ${context || 'Error'}:`, {
    message: error.message,
    code: error.code,
    timestamp: new Date(error.timestamp).toISOString(),
    details: error.details,
  });

  // TODO: Send to error tracking service (e.g., Sentry)
};

/**
 * Retry async function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise<void>(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Safe async wrapper
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | undefined; error: AppError | null }> => {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    const appError = parseError(error);
    logError(appError, 'safeAsync');
    return { data: fallback, error: appError };
  }
};

/**
 * Handle async errors with callback
 */
export const handleAsync = async <T>(
  fn: () => Promise<T>,
  onError?: (error: AppError) => void
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    const appError = parseError(error);
    logError(appError, 'handleAsync');
    
    if (onError) {
      onError(appError);
    }
    
    return null;
  }
};

/**
 * Error boundary helper
 */
export const captureError = (error: Error, errorInfo?: any): AppError => {
  const appError = parseError(error);
  logError(appError, 'ErrorBoundary');
  
  // Additional error info from React Error Boundary
  if (errorInfo) {
    console.error('Component stack:', errorInfo.componentStack);
  }
  
  return appError;
};

/**
 * Validate and throw error
 */
export const validateOrThrow = (
  condition: boolean,
  message: string,
  code?: string
): void => {
  if (!condition) {
    throw createError(ErrorType.VALIDATION, message, code);
  }
};

/**
 * Check if error is recoverable
 */
export const isRecoverableError = (error: AppError): boolean => {
  return error.type === ErrorType.NETWORK || error.type === ErrorType.API;
};

/**
 * Get retry delay based on error type
 */
export const getRetryDelay = (error: AppError, attempt: number): number => {
  const baseDelay = 1000;
  
  switch (error.type) {
    case ErrorType.NETWORK:
      return baseDelay * Math.pow(2, attempt);
    case ErrorType.API:
      return baseDelay * 2;
    default:
      return baseDelay;
  }
};

export default {
  ErrorType,
  createError,
  parseError,
  getUserMessage,
  logError,
  retryWithBackoff,
  safeAsync,
  handleAsync,
  captureError,
  validateOrThrow,
  isRecoverableError,
  getRetryDelay,
};
