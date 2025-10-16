import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, FindOptionsWhere, FindManyOptions, UpdateResult, DeleteResult, DeepPartial } from 'typeorm';
import { 
  BaseEntity, 
  PaginatedResponse, 
  PaginationParams,
  ApiResponse,
  ApiError
} from '../types/common.types';

/**
 * Base CRUD service that provides common functionality for all entity services
 * Simplified version to avoid TypeScript compilation issues
 */
@Injectable()
export abstract class BaseCrudService<T extends BaseEntity> {
  protected readonly logger = new Logger(this.constructor.name);
  protected abstract readonly entityName: string;

  constructor(
    protected readonly repository: Repository<T>,
  ) {}

  /**
   * Find entities with pagination
   */
  async findWithPagination(
    params: PaginationParams,
    filters: Record<string, any> = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const { page = 1, pageSize = 10, sortBy = 'createdAt', sortDirection = 'desc' } = params;
      const skip = (page - 1) * pageSize;
      
      const [entities, total] = await this.repository.findAndCount({
        where: filters as FindOptionsWhere<T>,
        skip,
        take: pageSize,
        order: { [sortBy]: sortDirection.toUpperCase() as 'ASC' | 'DESC' } as any
      });

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: entities,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        }
      };
    } catch (error) {
      this.logger.error(`Error finding ${this.entityName} with pagination:`, error);
      throw new BadRequestException(`Failed to fetch ${this.entityName} data`);
    }
  }

  /**
   * Find entity by ID
   */
  async findById(id: string): Promise<T> {
    try {
      const entity = await this.repository.findOne({
        where: { id } as FindOptionsWhere<T>
      });

      if (!entity) {
        throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
      }

      return entity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error finding ${this.entityName} by ID ${id}:`, error);
      throw new BadRequestException(`Failed to fetch ${this.entityName}`);
    }
  }

  /**
   * Create new entity
   */
  async create(entityData: DeepPartial<T>, userId?: string): Promise<T> {
    try {
      const entity = this.repository.create(entityData as any);
      const savedEntity = await this.repository.save(entity as any);
      
      this.logger.log(`Created ${this.entityName} with ID: ${(savedEntity as any).id}`);
      
      return savedEntity as T;
    } catch (error) {
      this.logger.error(`Error creating ${this.entityName}:`, error);
      throw new BadRequestException(`Failed to create ${this.entityName}`);
    }
  }

  /**
   * Update entity
   */
  async update(id: string, updateData: DeepPartial<T>, userId?: string): Promise<T> {
    try {
      const existingEntity = await this.findById(id);
      
      await this.repository.update(id, updateData as any);
      
      const updatedEntity = await this.findById(id);
      
      this.logger.log(`Updated ${this.entityName} with ID: ${id}`);
      
      return updatedEntity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating ${this.entityName} with ID ${id}:`, error);
      throw new BadRequestException(`Failed to update ${this.entityName}`);
    }
  }

  /**
   * Soft delete entity
   */
  async softDelete(id: string, userId?: string): Promise<void> {
    try {
      const existingEntity = await this.findById(id);
      
      await this.repository.update(id, {
        isDeleted: true,
        deletedAt: new Date(),
        ...(userId && { updatedBy: userId })
      } as any);
      
      this.logger.log(`Soft deleted ${this.entityName} with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error soft deleting ${this.entityName} with ID ${id}:`, error);
      throw new BadRequestException(`Failed to delete ${this.entityName}`);
    }
  }

  /**
   * Hard delete entity
   */
  async delete(id: string): Promise<void> {
    try {
      const result = await this.repository.delete(id);
      
      if (result.affected === 0) {
        throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
      }
      
      this.logger.log(`Deleted ${this.entityName} with ID: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting ${this.entityName} with ID ${id}:`, error);
      throw new BadRequestException(`Failed to delete ${this.entityName}`);
    }
  }

  /**
   * Find all entities
   */
  async findAll(filters: Record<string, any> = {}): Promise<T[]> {
    try {
      return await this.repository.find({
        where: filters as FindOptionsWhere<T>
      });
    } catch (error) {
      this.logger.error(`Error finding all ${this.entityName}:`, error);
      throw new BadRequestException(`Failed to fetch ${this.entityName} list`);
    }
  }

  /**
   * Count entities
   */
  async count(filters: Record<string, any> = {}): Promise<number> {
    try {
      return await this.repository.count({
        where: filters as FindOptionsWhere<T>
      });
    } catch (error) {
      this.logger.error(`Error counting ${this.entityName}:`, error);
      throw new BadRequestException(`Failed to count ${this.entityName}`);
    }
  }

  /**
   * Check if entity exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.repository.count({
        where: { id } as FindOptionsWhere<T>
      });
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking if ${this.entityName} exists with ID ${id}:`, error);
      return false;
    }
  }
}