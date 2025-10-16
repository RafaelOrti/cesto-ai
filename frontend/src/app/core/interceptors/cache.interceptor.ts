import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

/**
 * Cache interceptor that automatically caches GET requests
 * Provides intelligent caching with TTL and cache invalidation
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private readonly CACHEABLE_METHODS = ['GET'];
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100;

  constructor(private cacheService: CacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (!this.CACHEABLE_METHODS.includes(request.method)) {
      return next.handle(request);
    }

    // Check if request should be cached
    if (!this.shouldCache(request)) {
      return next.handle(request);
    }

    const cacheKey = this.generateCacheKey(request);
    
    // Try to get from cache
    const cachedResponse = this.cacheService.get<HttpResponse<any>>(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // If not in cache, make request and cache response
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && this.isCacheableResponse(event)) {
          this.cacheService.set(cacheKey, event, this.CACHE_TTL);
        }
      })
    );
  }

  private shouldCache(request: HttpRequest<any>): boolean {
    // Don't cache requests with no-cache header
    if (request.headers.get('Cache-Control') === 'no-cache') {
      return false;
    }

    // Don't cache requests with custom no-cache header
    if (request.headers.get('X-No-Cache') === 'true') {
      return false;
    }

    // Only cache specific endpoints
    const cacheableEndpoints = [
      '/api/v1/products',
      '/api/v1/suppliers',
      '/api/v1/categories',
      '/api/v1/orders',
      '/api/v1/users'
    ];

    return cacheableEndpoints.some(endpoint => request.url.includes(endpoint));
  }

  private generateCacheKey(request: HttpRequest<any>): string {
    const url = request.url;
    const params = request.params.toString();
    const headers = this.getRelevantHeaders(request);
    
    return `cache:${url}:${params}:${headers}`;
  }

  private getRelevantHeaders(request: HttpRequest<any>): string {
    const relevantHeaders = ['Authorization', 'Accept', 'Content-Type'];
    const headerValues = relevantHeaders
      .map(header => request.headers.get(header))
      .filter(value => value !== null)
      .join('|');
    
    return headerValues;
  }

  private isCacheableResponse(response: HttpResponse<any>): boolean {
    // Only cache successful responses
    if (response.status < 200 || response.status >= 300) {
      return false;
    }

    // Don't cache responses with no-cache header
    if (response.headers.get('Cache-Control')?.includes('no-cache')) {
      return false;
    }

    // Don't cache responses with no-store header
    if (response.headers.get('Cache-Control')?.includes('no-store')) {
      return false;
    }

    return true;
  }
}
