// packages/core/src/utils/logger.ts

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4,
};

interface LoggerConfig {
  level: LogLevel;
  prefix: string;
  enabled: boolean;
}

class Logger {
  private config: LoggerConfig = {
    level: 'info',
    prefix: '[QG]',
    enabled: true,
  };

  configure(options: Partial<LoggerConfig>): void {
    Object.assign(this.config, options);
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private format(level: string, ...args: unknown[]): unknown[] {
    return [`${this.config.prefix} [${level.toUpperCase()}]`, ...args];
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...this.format('debug', ...args));
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(...this.format('info', ...args));
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...this.format('warn', ...args));
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...this.format('error', ...args));
    }
  }

  /** Create a child logger with a sub-prefix */
  child(subPrefix: string): Logger {
    const child = new Logger();
    child.configure({
      ...this.config,
      prefix: `${this.config.prefix}:${subPrefix}`,
    });
    return child;
  }
}

export const logger = new Logger();

// Auto-configure based on environment
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
  logger.configure({ level: 'warn' });
} else if (typeof import.meta !== 'undefined' && !(import.meta as any).env?.DEV) {
  logger.configure({ level: 'warn' });
}

export default logger;
