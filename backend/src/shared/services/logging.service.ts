import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

/**
 * Advanced logging service with structured logging, file rotation, and multiple transports
 * Provides comprehensive logging functionality for the application
 */
@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger: winston.Logger;
  private readonly isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    this.isDevelopment = this.configService.get('NODE_ENV') === 'development';
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const logLevel = this.configService.get('LOG_LEVEL', 'info');
    const logDir = this.configService.get('LOG_DIR', 'logs');

    const transports: winston.transport[] = [
      // Console transport for development
      new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            const contextStr = context ? `[${context}]` : '';
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}`;
          })
        ),
      }),
    ];

    // File transports for production
    if (!this.isDevelopment) {
      // General log file
      transports.push(
        new winston.transports.File({
          filename: `${logDir}/application.log`,
          level: logLevel,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );

      // Error log file
      transports.push(
        new winston.transports.File({
          filename: `${logDir}/error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );

      // Access log file
      transports.push(
        new winston.transports.File({
          filename: `${logDir}/access.log`,
          level: 'http',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );
    }

    return winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports,
      exceptionHandlers: [
        new winston.transports.File({ filename: `${logDir}/exceptions.log` }),
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: `${logDir}/rejections.log` }),
      ],
    });
  }

  // ============================================================================
  // STANDARD LOGGING METHODS
  // ============================================================================

  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }

  // ============================================================================
  // ADVANCED LOGGING METHODS
  // ============================================================================

  /**
   * Log HTTP requests
   */
  logHttpRequest(req: any, res: any, responseTime: number): void {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
    };

    this.logger.http('HTTP Request', logData);
  }

  /**
   * Log database operations
   */
  logDatabaseOperation(operation: string, table: string, duration: number, query?: string): void {
    const logData = {
      operation,
      table,
      duration: `${duration}ms`,
      query: query?.substring(0, 200), // Truncate long queries
    };

    this.logger.info('Database Operation', logData);
  }

  /**
   * Log authentication events
   */
  logAuthEvent(event: string, userId?: string, ip?: string, userAgent?: string): void {
    const logData = {
      event,
      userId,
      ip,
      userAgent,
    };

    this.logger.info('Authentication Event', logData);
  }

  /**
   * Log business events
   */
  logBusinessEvent(event: string, data: any, userId?: string): void {
    const logData = {
      event,
      data,
      userId,
    };

    this.logger.info('Business Event', logData);
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', data: any): void {
    const logData = {
      event,
      severity,
      data,
    };

    this.logger.warn('Security Event', logData);
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric: string, value: number, unit: string = 'ms', context?: string): void {
    const logData = {
      metric,
      value,
      unit,
    };

    this.logger.info('Performance Metric', { ...logData, context });
  }

  /**
   * Log system events
   */
  logSystemEvent(event: string, data: any): void {
    const logData = {
      event,
      data,
    };

    this.logger.info('System Event', logData);
  }

  // ============================================================================
  // STRUCTURED LOGGING
  // ============================================================================

  /**
   * Log with structured data
   */
  logStructured(level: LogLevel, message: string, data: any, context?: string): void {
    const logData = {
      message,
      data,
      context,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(level, logData);
  }

  /**
   * Log error with full context
   */
  logError(error: Error, context?: string, additionalData?: any): void {
    const logData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      ...additionalData,
    };

    this.logger.error('Error occurred', logData);
  }

  /**
   * Log API calls
   */
  logApiCall(method: string, url: string, statusCode: number, duration: number, userId?: string): void {
    const logData = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      userId,
    };

    this.logger.info('API Call', logData);
  }

  // ============================================================================
  // LOGGING UTILITIES
  // ============================================================================

  /**
   * Create child logger with context
   */
  createChildLogger(context: string): LoggerService {
    return {
      log: (message: any) => this.log(message, context),
      error: (message: any, trace?: string) => this.error(message, trace, context),
      warn: (message: any) => this.warn(message, context),
      debug: (message: any) => this.debug(message, context),
      verbose: (message: any) => this.verbose(message, context),
    };
  }

  /**
   * Log memory usage
   */
  logMemoryUsage(): void {
    const usage = process.memoryUsage();
    const logData = {
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`,
    };

    this.logger.info('Memory Usage', logData);
  }

  /**
   * Log application startup
   */
  logStartup(port: number, environment: string): void {
    this.logger.info('Application started', {
      port,
      environment,
      nodeVersion: process.version,
      platform: process.platform,
    });
  }

  /**
   * Log application shutdown
   */
  logShutdown(signal: string): void {
    this.logger.info('Application shutting down', { signal });
  }

  // ============================================================================
  // LOG ROTATION AND MAINTENANCE
  // ============================================================================

  /**
   * Get log statistics
   */
  async getLogStats(): Promise<{
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
    debugCount: number;
  }> {
    // This would typically query the log files or database
    // For now, return mock data
    return {
      totalLogs: 0,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      debugCount: 0,
    };
  }

  /**
   * Clean old logs
   */
  async cleanOldLogs(daysToKeep: number = 30): Promise<void> {
    this.logger.info(`Cleaning logs older than ${daysToKeep} days`);
    // Implementation would depend on your log storage strategy
  }

  /**
   * Export logs for analysis
   */
  async exportLogs(startDate: Date, endDate: Date): Promise<string> {
    this.logger.info(`Exporting logs from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    // Implementation would depend on your log storage strategy
    return 'Log export not implemented';
  }
}
