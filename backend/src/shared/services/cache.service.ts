import { Injectable, Logger, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Advanced caching service using Redis
 * Provides intelligent caching with TTL, invalidation, and patterns
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 300; // 5 minutes
  private readonly MAX_TTL = 86400; // 24 hours

  constructor(@Inject('Redis') private readonly redis: Redis) {}

  // ============================================================================
  // BASIC CACHE OPERATIONS
  // ============================================================================

  /**
   * Set a value in cache
   */
  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
      this.logger.debug(`Cached key: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Get or set pattern
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Delete a key from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      this.logger.debug(`Deleted cache key: ${key}`);
      return result > 0;
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set TTL for existing key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.redis.expire(key, ttl);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error setting TTL for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL for key
   */
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      return -1;
    }
  }

  // ============================================================================
  // ADVANCED CACHE OPERATIONS
  // ============================================================================

  /**
   * Set multiple key-value pairs
   */
  async mset(keyValuePairs: Record<string, any>, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = JSON.stringify(value);
        pipeline.setex(key, ttl, serializedValue);
      }
      
      await pipeline.exec();
      this.logger.debug(`Cached ${Object.keys(keyValuePairs).length} keys`);
    } catch (error) {
      this.logger.error(`Error setting multiple cache keys:`, error);
      throw error;
    }
  }

  /**
   * Get multiple keys
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.redis.mget(...keys);
      return values.map(value => value ? JSON.parse(value) as T : null);
    } catch (error) {
      this.logger.error(`Error getting multiple cache keys:`, error);
      return keys.map(() => null);
    }
  }

  /**
   * Delete multiple keys
   */
  async mdel(keys: string[]): Promise<number> {
    try {
      if (keys.length === 0) return 0;
      const result = await this.redis.del(...keys);
      this.logger.debug(`Deleted ${result} cache keys`);
      return result;
    } catch (error) {
      this.logger.error(`Error deleting multiple cache keys:`, error);
      return 0;
    }
  }

  /**
   * Find keys by pattern
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      this.logger.error(`Error finding keys with pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Delete keys by pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.mdel(keys);
    } catch (error) {
      this.logger.error(`Error deleting keys with pattern ${pattern}:`, error);
      return 0;
    }
  }

  // ============================================================================
  // CACHE INVALIDATION
  // ============================================================================

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    return await this.deletePattern(pattern);
  }

  /**
   * Invalidate cache by tags
   */
  async invalidateByTags(tags: string[]): Promise<number> {
    let totalDeleted = 0;
    for (const tag of tags) {
      const deleted = await this.deletePattern(`tag:${tag}:*`);
      totalDeleted += deleted;
    }
    return totalDeleted;
  }

  /**
   * Tag a key for later invalidation
   */
  async tagKey(key: string, tags: string[]): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      
      for (const tag of tags) {
        pipeline.sadd(`tag:${tag}`, key);
        pipeline.expire(`tag:${tag}`, this.MAX_TTL);
      }
      
      await pipeline.exec();
    } catch (error) {
      this.logger.error(`Error tagging key ${key}:`, error);
    }
  }

  // ============================================================================
  // CACHE STATISTICS
  // ============================================================================

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    hitRate: number;
    connectedClients: number;
  }> {
    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      const stats = await this.redis.info('stats');
      
      // Parse memory usage
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1] : 'Unknown';
      
      // Parse total keys
      const keysMatch = keyspace.match(/keys=(\d+)/);
      const totalKeys = keysMatch ? parseInt(keysMatch[1]) : 0;
      
      // Parse hit rate
      const hitsMatch = stats.match(/keyspace_hits:(\d+)/);
      const missesMatch = stats.match(/keyspace_misses:(\d+)/);
      const hits = hitsMatch ? parseInt(hitsMatch[1]) : 0;
      const misses = missesMatch ? parseInt(missesMatch[1]) : 0;
      const hitRate = hits + misses > 0 ? hits / (hits + misses) : 0;
      
      // Parse connected clients
      const clientsMatch = stats.match(/connected_clients:(\d+)/);
      const connectedClients = clientsMatch ? parseInt(clientsMatch[1]) : 0;
      
      return {
        totalKeys,
        memoryUsage,
        hitRate: Math.round(hitRate * 100) / 100,
        connectedClients
      };
    } catch (error) {
      this.logger.error('Error getting cache statistics:', error);
      return {
        totalKeys: 0,
        memoryUsage: 'Unknown',
        hitRate: 0,
        connectedClients: 0
      };
    }
  }

  // ============================================================================
  // CACHE HEALTH
  // ============================================================================

  /**
   * Check if cache is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      this.logger.error('Cache health check failed:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      await this.redis.flushall();
      this.logger.log('All cache cleared');
    } catch (error) {
      this.logger.error('Error clearing all cache:', error);
      throw error;
    }
  }

  // ============================================================================
  // CACHE DECORATORS
  // ============================================================================

  /**
   * Cache decorator for methods
   */
  static Cache(ttl: number = 300, keyGenerator?: (...args: any[]) => string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const method = descriptor.value;
      
      descriptor.value = async function (...args: any[]) {
        const cacheService = this.cacheService as CacheService;
        if (!cacheService) {
          return method.apply(this, args);
        }
        
        const key = keyGenerator ? keyGenerator(...args) : `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
        
        return await cacheService.getOrSet(key, () => method.apply(this, args), ttl);
      };
    };
  }

  /**
   * Cache invalidation decorator
   */
  static InvalidateCache(pattern: string) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
      const method = descriptor.value;
      
      descriptor.value = async function (...args: any[]) {
        const result = await method.apply(this, args);
        
        const cacheService = this.cacheService as CacheService;
        if (cacheService) {
          await cacheService.invalidatePattern(pattern);
        }
        
        return result;
      };
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate cache key
   */
  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }

  /**
   * Generate cache key for entity
   */
  generateEntityKey(entityName: string, id: string, ...suffixes: string[]): string {
    return this.generateKey('entity', entityName, id, ...suffixes);
  }

  /**
   * Generate cache key for list
   */
  generateListKey(entityName: string, ...filters: (string | number)[]): string {
    return this.generateKey('list', entityName, ...filters);
  }

  /**
   * Generate cache key for search
   */
  generateSearchKey(entityName: string, query: string, ...filters: (string | number)[]): string {
    return this.generateKey('search', entityName, query, ...filters);
  }
}
