import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseEntity } from '../types/common.types';

/**
 * Enhanced base service with advanced patterns
 * Provides common functionality for all services
 */
@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string
  ) {}

  // ============================================================================
  // BASIC CRUD OPERATIONS
  // ============================================================================

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.logger.error(`Error finding all ${this.entityName}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { id } as any });
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} by ID ${id}:`, error);
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      const result = await this.repository.save(entity);
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      this.logger.error(`Error creating ${this.entityName}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      await this.repository.update(id, data as any);
      return await this.findById(id);
    } catch (error) {
      this.logger.error(`Error updating ${this.entityName} with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(id);
      return result.affected > 0;
    } catch (error) {
      this.logger.error(`Error deleting ${this.entityName} with ID ${id}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // ADVANCED QUERY METHODS
  // ============================================================================

  async findByField(field: keyof T, value: any): Promise<T[]> {
    try {
      return await this.repository.find({ where: { [field]: value } as any });
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} by ${String(field)}:`, error);
      throw error;
    }
  }

  async findOneByField(field: keyof T, value: any): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { [field]: value } as any });
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} by ${String(field)}:`, error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      return await this.repository.count();
    } catch (error) {
      this.logger.error(`Error counting ${this.entityName}:`, error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.repository.count({ where: { id } as any });
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking if ${this.entityName} exists:`, error);
      throw error;
    }
  }

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  async createMany(dataArray: Partial<T>[]): Promise<T[]> {
    try {
      const entities = this.repository.create(dataArray as any[]);
      return await this.repository.save(entities);
    } catch (error) {
      this.logger.error(`Error creating multiple ${this.entityName}:`, error);
      throw error;
    }
  }

  async updateMany(updates: { id: string; data: Partial<T> }[]): Promise<T[]> {
    try {
      const results: T[] = [];
      for (const { id, data } of updates) {
        const updated = await this.update(id, data);
        if (updated) results.push(updated);
      }
      return results;
    } catch (error) {
      this.logger.error(`Error updating multiple ${this.entityName}:`, error);
      throw error;
    }
  }

  async deleteMany(ids: string[]): Promise<number> {
    try {
      const result = await this.repository.delete(ids);
      return result.affected || 0;
    } catch (error) {
      this.logger.error(`Error deleting multiple ${this.entityName}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  protected validateEntity(data: Partial<T>): void {
    // Override in subclasses for specific validation
  }

  protected sanitizeData(data: Partial<T>): Partial<T> {
    // Override in subclasses for specific sanitization
    return data;
  }

  protected logOperation(operation: string, entityId?: string, details?: any): void {
    this.logger.log(`${operation} ${this.entityName}${entityId ? ` (ID: ${entityId})` : ''}`, details);
  }
}
