import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAuditLog } from '../../admin/entities/admin-audit-log.entity';

/**
 * Advanced audit service for tracking all system activities
 * Provides comprehensive audit logging with different levels and contexts
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AdminAuditLog)
    private readonly auditLogRepository: Repository<AdminAuditLog>
  ) {}

  // ============================================================================
  // BASIC AUDIT LOGGING
  // ============================================================================

  /**
   * Log a basic audit event
   */
  async logEvent(
    adminId: string,
    entityType: string,
    entityId: string,
    action: string,
    details: any = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        admin_user_id: adminId,
        entity_type: entityType as any,
        entity_id: entityId,
        action: action as any,
        description: JSON.stringify(details),
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      await this.auditLogRepository.save(auditLog);
      this.logger.debug(`Audit log created: ${action} on ${entityType} ${entityId}`);
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
    }
  }

  /**
   * Log user authentication events
   */
  async logAuthEvent(
    userId: string,
    event: 'login' | 'logout' | 'password_change' | 'password_reset' | 'email_verification',
    details: any = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      userId,
      'user',
      userId,
      event,
      details,
      ipAddress,
      userAgent
    );
  }

  /**
   * Log data modification events
   */
  async logDataModification(
    adminId: string,
    entityType: string,
    entityId: string,
    action: 'create' | 'update' | 'delete',
    oldData?: any,
    newData?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const details: any = { action };

    if (oldData && newData) {
      details.changes = this.calculateChanges(oldData, newData);
    } else if (newData) {
      details.data = newData;
    }

    await this.logEvent(
      adminId,
      entityType,
      entityId,
      action,
      details,
      ipAddress,
      userAgent
    );
  }

  /**
   * Log system configuration changes
   */
  async logConfigChange(
    adminId: string,
    configKey: string,
    oldValue: any,
    newValue: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      adminId,
      'system_config',
      configKey,
      'update',
      {
        oldValue,
        newValue,
        changeType: 'configuration',
      },
      ipAddress,
      userAgent
    );
  }

  /**
   * Log security events
   */
  async logSecurityEvent(
    event: 'failed_login' | 'suspicious_activity' | 'permission_denied' | 'data_breach_attempt',
    details: any = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      'system',
      'security',
      'security_event',
      event,
      {
        ...details,
        severity: this.getSecuritySeverity(event),
        timestamp: new Date().toISOString(),
      },
      ipAddress,
      userAgent
    );
  }

  /**
   * Log business events
   */
  async logBusinessEvent(
    event: string,
    entityType: string,
    entityId: string,
    details: any = {},
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      userId || 'system',
      entityType,
      entityId,
      event,
      {
        ...details,
        eventType: 'business',
      },
      ipAddress,
      userAgent
    );
  }

  // ============================================================================
  // ADVANCED AUDIT FEATURES
  // ============================================================================

  /**
   * Log bulk operations
   */
  async logBulkOperation(
    adminId: string,
    operation: string,
    entityType: string,
    entityIds: string[],
    details: any = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      adminId,
      entityType,
      'bulk_operation',
      operation,
      {
        ...details,
        entityCount: entityIds.length,
        entityIds: entityIds.slice(0, 100), // Limit to first 100 IDs
        operationType: 'bulk',
      },
      ipAddress,
      userAgent
    );
  }

  /**
   * Log data export/import events
   */
  async logDataTransfer(
    adminId: string,
    operation: 'export' | 'import',
    entityType: string,
    recordCount: number,
    details: any = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      adminId,
      entityType,
      'data_transfer',
      operation,
      {
        ...details,
        recordCount,
        operationType: 'data_transfer',
      },
      ipAddress,
      userAgent
    );
  }

  /**
   * Log API access
   */
  async logApiAccess(
    userId: string,
    method: string,
    endpoint: string,
    statusCode: number,
    responseTime: number,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logEvent(
      userId,
      'api',
      endpoint,
      'access',
      {
        method,
        statusCode,
        responseTime,
        operationType: 'api_access',
      },
      ipAddress,
      userAgent
    );
  }

  // ============================================================================
  // AUDIT QUERY METHODS
  // ============================================================================

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditLogs(
    entityType: string,
    entityId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AdminAuditLog[]> {
    return await this.auditLogRepository.find({
      where: { entity_type: entityType as any, entity_id: entityId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditLogs(
    adminId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AdminAuditLog[]> {
    return await this.auditLogRepository.find({
      where: { admin_user_id: adminId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get audit logs by date range
   */
  async getAuditLogsByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<AdminAuditLog[]> {
    return await this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('audit.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  /**
   * Get audit logs by action
   */
  async getAuditLogsByAction(
    action: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AdminAuditLog[]> {
    return await this.auditLogRepository.find({
      where: { action: action as any },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Search audit logs
   */
  async searchAuditLogs(
    query: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<AdminAuditLog[]> {
    return await this.auditLogRepository
      .createQueryBuilder('audit')
      .where(
        'audit.entityType ILIKE :query OR audit.action ILIKE :query OR audit.details ILIKE :query',
        { query: `%${query}%` }
      )
      .orderBy('audit.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
  }

  // ============================================================================
  // AUDIT STATISTICS
  // ============================================================================

  /**
   * Get audit statistics
   */
  async getAuditStats(): Promise<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByEntityType: Record<string, number>;
    recentActivity: number;
  }> {
    const totalLogs = await this.auditLogRepository.count();

    const logsByAction = await this.auditLogRepository
      .createQueryBuilder('audit')
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.action')
      .getRawMany();

    const logsByEntityType = await this.auditLogRepository
      .createQueryBuilder('audit')
      .select('audit.entityType', 'entityType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('audit.entityType')
      .getRawMany();

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await this.auditLogRepository.count({
      where: { createdAt: { $gte: oneDayAgo } } as any,
    });

    return {
      totalLogs,
      logsByAction: logsByAction.reduce((acc, item) => {
        acc[item.action] = parseInt(item.count);
        return acc;
      }, {}),
      logsByEntityType: logsByEntityType.reduce((acc, item) => {
        acc[item.entityType] = parseInt(item.count);
        return acc;
      }, {}),
      recentActivity,
    };
  }

  // ============================================================================
  // AUDIT MAINTENANCE
  // ============================================================================

  /**
   * Clean old audit logs
   */
  async cleanOldLogs(daysToKeep: number = 365): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await this.auditLogRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Cleaned ${result.affected} old audit logs`);
    return result.affected || 0;
  }

  /**
   * Archive audit logs
   */
  async archiveAuditLogs(olderThanDays: number = 90): Promise<number> {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    // This would typically move logs to an archive table or file
    // For now, we'll just mark them as archived
    const result = await this.auditLogRepository
      .createQueryBuilder()
      .update()
      .set({ is_successful: false })
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    this.logger.log(`Archived ${result.affected} audit logs`);
    return result.affected || 0;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Calculate changes between old and new data
   */
  private calculateChanges(oldData: any, newData: any): any {
    const changes: any = {};

    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        changes[key] = {
          old: oldData[key],
          new: newData[key],
        };
      }
    }

    return changes;
  }

  /**
   * Get security severity level
   */
  private getSecuritySeverity(event: string): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap: Record<string, string> = {
      failed_login: 'low',
      suspicious_activity: 'high',
      permission_denied: 'medium',
      data_breach_attempt: 'critical',
    };

    return (severityMap[event] || 'medium') as any;
  }

  /**
   * Extract IP address from request
   */
  extractIpAddress(req: any): string | undefined {
    return (
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    );
  }

  /**
   * Extract user agent from request
   */
  extractUserAgent(req: any): string | undefined {
    return req.headers['user-agent'];
  }
}
