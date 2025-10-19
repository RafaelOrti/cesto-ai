import { Injectable, Logger } from '@nestjs/common';

/**
 * Simplified caching service without Redis
 * Provides basic caching functionality for development
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 300; // 5 minutes
  private readonly MAX_TTL = 86400; // 24 hours
  private cache = new Map<string, { value: any; expires: number }>();

  constructor() {}

  // ============================================================================
  // BASIC CACHE OPERATIONS
  // ============================================================================

  /**
   * Set a value in cache
   */
  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const expires = Date.now() + (ttl * 1000);
      this.cache.set(key, { value, expires });
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
      const item = this.cache.get(key);
      if (!item) {
        return null;
      }
      
      if (Date.now() > item.expires) {
        this.cache.delete(key);
        return null;
      }
      
      return item.value as T;
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
      const result = this.cache.delete(key);
      this.logger.debug(`Deleted cache key: ${key}`);
      return result;
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
      const item = this.cache.get(key);
      if (!item) {
        return false;
      }
      
      if (Date.now() > item.expires) {
        this.cache.delete(key);
        return false;
      }
      
      return true;
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
      const item = this.cache.get(key);
      if (!item) {
        return false;
      }
      
      item.expires = Date.now() + (ttl * 1000);
      return true;
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
      const item = this.cache.get(key);
      if (!item) {
        return -1;
      }
      
      const ttl = Math.ceil((item.expires - Date.now()) / 1000);
      return ttl > 0 ? ttl : -1;
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
      for (const [key, value] of Object.entries(keyValuePairs)) {
        await this.set(key, value, ttl);
      }
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
      const results = await Promise.all(keys.map(key => this.get<T>(key)));
      return results;
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
      let deleted = 0;
      for (const key of keys) {
        if (await this.delete(key)) {
          deleted++;
        }
      }
      this.logger.debug(`Deleted ${deleted} cache keys`);
      return deleted;
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
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return Array.from(this.cache.keys()).filter(key => regex.test(key));
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
      for (const tag of tags) {
        await this.set(`tag:${tag}:${key}`, true, this.MAX_TTL);
      }
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
      const totalKeys = this.cache.size;
      const memoryUsage = `${Math.round(JSON.stringify(this.cache).length / 1024)}KB`;
      
      return {
        totalKeys,
        memoryUsage,
        hitRate: 0, // Not implemented in memory cache
        connectedClients: 1
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
      return true; // Memory cache is always healthy
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
      this.cache.clear();
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