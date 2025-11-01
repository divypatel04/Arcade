/**
 * Centralized Logging Utility
 * 
 * Provides a consistent logging interface across the application.
 * - Debug/info logs are disabled in production
 * - Warning/error logs are always enabled
 * - Can be extended to integrate with error monitoring services (Sentry, LogRocket, etc.)
 * 
 * @example
 * ```ts
 * import { logger } from '@/utils/logger';
 * 
 * // Development only - won't appear in production
 * logger.debug('User data:', userData);
 * logger.info('Processing started');
 * 
 * // Always logged (production and development)
 * logger.warn('API rate limit approaching');
 * logger.error('Failed to fetch data', error);
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  /**
   * Enable debug and info logs
   * Automatically set based on __DEV__ but can be overridden
   */
  enableDebugLogs: boolean;
  
  /**
   * Prefix to add to all log messages
   * Helps identify app logs in mixed environments
   */
  logPrefix: string;
  
  /**
   * Whether to include timestamps in logs
   */
  includeTimestamp: boolean;
}

class Logger {
  private config: LoggerConfig = {
    enableDebugLogs: __DEV__,
    logPrefix: '[Arcade]',
    includeTimestamp: true
  };

  /**
   * Configure the logger
   * @param config - Partial configuration to override defaults
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Format log message with prefix and timestamp
   */
  private formatMessage(level: LogLevel, ...args: any[]): any[] {
    const parts: any[] = [];
    
    if (this.config.includeTimestamp) {
      const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
      parts.push(`[${timestamp}]`);
    }
    
    parts.push(this.config.logPrefix);
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(...args);
    
    return parts;
  }

  /**
   * Debug level logging
   * Only outputs in development mode
   * Use for detailed debugging information
   * 
   * @param args - Values to log
   */
  debug(...args: any[]): void {
    if (this.config.enableDebugLogs) {
      console.log(...this.formatMessage('debug', ...args));
    }
  }

  /**
   * Info level logging
   * Only outputs in development mode
   * Use for general information about app flow
   * 
   * @param args - Values to log
   */
  info(...args: any[]): void {
    if (this.config.enableDebugLogs) {
      console.info(...this.formatMessage('info', ...args));
    }
  }

  /**
   * Warning level logging
   * Always outputs (development and production)
   * Use for non-critical issues that should be investigated
   * 
   * @param args - Values to log
   */
  warn(...args: any[]): void {
    console.warn(...this.formatMessage('warn', ...args));
  }

  /**
   * Error level logging
   * Always outputs (development and production)
   * Use for errors and exceptions
   * 
   * @param args - Values to log
   */
  error(...args: any[]): void {
    console.error(...this.formatMessage('error', ...args));
    
    // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    // Example:
    // if (!__DEV__ && this.sentryEnabled) {
    //   Sentry.captureException(args[1] || new Error(args[0]));
    // }
  }

  /**
   * Log function entry (useful for debugging)
   * Only outputs in development mode
   * 
   * @param functionName - Name of the function being entered
   * @param params - Optional parameters to log
   */
  enter(functionName: string, params?: any): void {
    if (this.config.enableDebugLogs) {
      const message = params 
        ? `→ Entering ${functionName} with params:`
        : `→ Entering ${functionName}`;
      console.log(...this.formatMessage('debug', message, params || ''));
    }
  }

  /**
   * Log function exit (useful for debugging)
   * Only outputs in development mode
   * 
   * @param functionName - Name of the function being exited
   * @param returnValue - Optional return value to log
   */
  exit(functionName: string, returnValue?: any): void {
    if (this.config.enableDebugLogs) {
      const message = returnValue !== undefined
        ? `← Exiting ${functionName} with result:`
        : `← Exiting ${functionName}`;
      console.log(...this.formatMessage('debug', message, returnValue !== undefined ? returnValue : ''));
    }
  }

  /**
   * Group related logs together
   * Only works in development mode
   * 
   * @param label - Group label
   * @param callback - Function containing logs to group
   */
  group(label: string, callback: () => void): void {
    if (this.config.enableDebugLogs) {
      console.group(...this.formatMessage('debug', label));
      callback();
      console.groupEnd();
    }
  }

  /**
   * Create a scoped logger with a specific context
   * Useful for module-specific logging
   * 
   * @param context - Context/module name
   * @returns Logger instance with context prefix
   * 
   * @example
   * ```ts
   * const log = logger.scope('DataContext');
   * log.info('Fetching user data'); // [Arcade] [DataContext] [INFO] Fetching user data
   * ```
   */
  scope(context: string): Pick<Logger, 'debug' | 'info' | 'warn' | 'error'> {
    const scopedPrefix = `${this.config.logPrefix} [${context}]`;
    
    return {
      debug: (...args: any[]) => {
        if (this.config.enableDebugLogs) {
          console.log(scopedPrefix, '[DEBUG]', ...args);
        }
      },
      info: (...args: any[]) => {
        if (this.config.enableDebugLogs) {
          console.info(scopedPrefix, '[INFO]', ...args);
        }
      },
      warn: (...args: any[]) => {
        console.warn(scopedPrefix, '[WARN]', ...args);
      },
      error: (...args: any[]) => {
        console.error(scopedPrefix, '[ERROR]', ...args);
      }
    };
  }
}

/**
 * Global logger instance
 * Import and use throughout the application
 */
export const logger = new Logger();

/**
 * Default export for convenience
 */
export default logger;
