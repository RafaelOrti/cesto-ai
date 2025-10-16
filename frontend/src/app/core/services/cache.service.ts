import { Injectable } from '@angular/core';
import { Observable, of, timer, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

/**
 * Advanced caching service with TTL, LRU eviction, and namespace support
 * Provides Redis-like functionality for client-side caching
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly cache = new Map<string, CacheItem>();
  private readonly accessTimes = new Map<string, number>();
  private readonly maxSize: number;
  private readonly defaultTTL: number;

  constructor() {
    this.maxSize = 1000; // Maximum number of items in cache
    this.defaultTTL = 300000; // 5 minutes default TTL
  }

  // ============================================================================
  // BASIC CACHE OPERATIONS
  // ============================================================================

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const cacheTTL = ttl || this.defaultTTL;

    // Remove old entry if it exists
    this.delete(key);

    // Add new entry
    this.cache.set(key, {
      value,
      expiresAt: now + cacheTTL,
      createdAt: now,
      accessCount: 0,
      lastAccessed: now
    });

    this.accessTimes.set(key, now);

    // Check if we need to evict items
    this.evictIfNeeded();
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    // Update access information
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.accessTimes.set(key, Date.now());

    return item.value as T;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.accessTimes.delete(key);
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessTimes.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const now = Date.now();
    let expiredCount = 0;
    let totalAccessCount = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expiredCount++;
      }
      totalAccessCount += item.accessCount;
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expiredCount,
      totalAccessCount,
      hitRate: this.calculateHitRate()
    };
  }

  // ============================================================================
  // ADVANCED CACHE OPERATIONS
  // ============================================================================

  /**
   * Get or set pattern - if key doesn't exist, call factory function and cache result
   */
  getOrSet<T>(key: string, factory: () => Observable<T>, ttl?: number): Observable<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return of(cached);
    }

    return factory().pipe(
      tap(value => this.set(key, value, ttl)),
      catchError(error => {
        console.error(`Cache factory error for key ${key}:`, error);
        return throwError(error);
      })
    );
  }

  /**
   * Get multiple keys at once
   */
  getMany<T>(keys: string[]): Map<string, T> {
    const result = new Map<string, T>();
    
    for (const key of keys) {
      const value = this.get<T>(key);
      if (value !== null) {
        result.set(key, value);
      }
    }

    return result;
  }

  /**
   * Set multiple key-value pairs
   */
  setMany<T>(items: Array<{key: string; value: T}>, ttl?: number): void {
    for (const item of items) {
      this.set(item.key, item.value, ttl);
    }
  }

  /**
   * Delete multiple keys
   */
  deleteMany(keys: string[]): number {
    let deletedCount = 0;
    for (const key of keys) {
      if (this.delete(key)) {
        deletedCount++;
      }
    }
    return deletedCount;
  }

  /**
   * Get all keys matching pattern
   */
  keys(pattern?: string): string[] {
    const allKeys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return allKeys;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return allKeys.filter(key => regex.test(key));
  }

  /**
   * Get all values matching pattern
   */
  values<T>(pattern?: string): T[] {
    const matchingKeys = this.keys(pattern);
    const values: T[] = [];
    
    for (const key of matchingKeys) {
      const value = this.get<T>(key);
      if (value !== null) {
        values.push(value);
      }
    }

    return values;
  }

  // ============================================================================
  // NAMESPACE OPERATIONS
  // ============================================================================

  /**
   * Set with namespace
   */
  setInNamespace<T>(namespace: string, key: string, value: T, ttl?: number): void {
    this.set(`${namespace}:${key}`, value, ttl);
  }

  /**
   * Get from namespace
   */
  getFromNamespace<T>(namespace: string, key: string): T | null {
    return this.get<T>(`${namespace}:${key}`);
  }

  /**
   * Delete from namespace
   */
  deleteFromNamespace(namespace: string, key: string): boolean {
    return this.delete(`${namespace}:${key}`);
  }

  /**
   * Clear entire namespace
   */
  clearNamespace(namespace: string): number {
    const keys = this.keys(`${namespace}:*`);
    return this.deleteMany(keys);
  }

  /**
   * Get all keys in namespace
   */
  getNamespaceKeys(namespace: string): string[] {
    const keys = this.keys(`${namespace}:*`);
    return keys.map(key => key.replace(`${namespace}:`, ''));
  }

  // ============================================================================
  // TTL OPERATIONS
  // ============================================================================

  /**
   * Set TTL for existing key
   */
  expire(key: string, ttl: number): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    item.expiresAt = Date.now() + ttl;
    return true;
  }

  /**
   * Get TTL for key
   */
  getTTL(key: string): number {
    const item = this.cache.get(key);
    if (!item) {
      return -2; // Key doesn't exist
    }

    const ttl = item.expiresAt - Date.now();
    return ttl < 0 ? -1 : ttl; // -1 if expired, otherwise remaining TTL
  }

  /**
   * Check if key will expire soon
   */
  willExpireSoon(key: string, threshold: number = 60000): boolean {
    const ttl = this.getTTL(key);
    return ttl > 0 && ttl < threshold;
  }

  // ============================================================================
  // CACHE MAINTENANCE
  // ============================================================================

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        expiredKeys.push(key);
      }
    }

    return this.deleteMany(expiredKeys);
  }

  /**
   * Start automatic cleanup
   */
  startAutoCleanup(interval: number = 60000): void {
    timer(0, interval).subscribe(() => {
      const cleaned = this.cleanExpired();
      if (cleaned > 0) {
        console.log(`Cache cleanup: removed ${cleaned} expired entries`);
      }
    });
  }

  /**
   * Evict least recently used items if cache is full
   */
  private evictIfNeeded(): void {
    if (this.cache.size <= this.maxSize) {
      return;
    }

    // Sort by last accessed time (LRU)
    const sortedEntries = Array.from(this.accessTimes.entries())
      .sort((a, b) => a[1] - b[1]);

    // Remove oldest entries until we're under the limit
    const toRemove = sortedEntries.slice(0, this.cache.size - this.maxSize + 10);
    
    for (const [key] of toRemove) {
      this.delete(key);
    }
  }

  /**
   * Calculate cache hit rate
   */
  private calculateHitRate(): number {
    let totalRequests = 0;
    let hits = 0;

    for (const item of this.cache.values()) {
      totalRequests += item.accessCount;
      hits += item.accessCount; // All accesses are hits since expired items are removed
    }

    return totalRequests > 0 ? hits / totalRequests : 0;
  }

  // ============================================================================
  // SERIALIZATION
  // ============================================================================

  /**
   * Export cache to JSON
   */
  export(): string {
    const exportData: CacheExport = {
      items: Array.from(this.cache.entries()),
      accessTimes: Array.from(this.accessTimes.entries()),
      timestamp: Date.now()
    };

    return JSON.stringify(exportData);
  }

  /**
   * Import cache from JSON
   */
  import(json: string): boolean {
    try {
      const importData: CacheExport = JSON.parse(json);
      const now = Date.now();

      // Clear existing cache
      this.clear();

      // Import items (only non-expired ones)
      for (const [key, item] of importData.items) {
        if (item.expiresAt > now) {
          this.cache.set(key, item);
        }
      }

      // Import access times
      for (const [key, time] of importData.accessTimes) {
        if (this.cache.has(key)) {
          this.accessTimes.set(key, time);
        }
      }

      return true;
    } catch (error) {
      console.error('Error importing cache:', error);
      return false;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Create cache key from parts
   */
  createKey(...parts: string[]): string {
    return parts.join(':');
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSizeInBytes(): number {
    let size = 0;
    
    for (const [key, item] of this.cache.entries()) {
      size += key.length * 2; // UTF-16 encoding
      size += JSON.stringify(item.value).length * 2;
      size += 32; // Approximate overhead for CacheItem
    }

    return size;
  }

  /**
   * Check if cache is healthy
   */
  isHealthy(): boolean {
    const stats = this.getStats();
    return stats.size < this.maxSize * 0.9 && stats.hitRate > 0.1;
  }
}

// ============================================================================
// INTERFACES
// ============================================================================

interface CacheItem {
  value: any;
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  size: number;
  maxSize: number;
  expiredCount: number;
  totalAccessCount: number;
  hitRate: number;
}

interface CacheExport {
  items: Array<[string, CacheItem]>;
  accessTimes: Array<[string, number]>;
  timestamp: number;
}
