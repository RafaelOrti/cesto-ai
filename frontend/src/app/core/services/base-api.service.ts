import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, tap, finalize } from 'rxjs/operators';
import { 
  PaginatedResponse, 
  ApiResponse, 
  ApiError, 
  PaginationParams,
  BaseEntity 
} from '../../../shared/types/common.types';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T extends BaseEntity> {
  protected readonly baseUrl: string;
  protected readonly cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  protected readonly loadingStates = new Map<string, BehaviorSubject<boolean>>();

  constructor(
    protected http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string,
    protected endpoint: string
  ) {
    this.baseUrl = `${apiBaseUrl}${endpoint}`;
  }

  // CRUD OPERATIONS
  getAll(params?: PaginationParams & Record<string, any>): Observable<PaginatedResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const cacheKey = `getAll_${this.serializeParams(httpParams)}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    this.setLoading('getAll', true);
    
    return this.http.get<PaginatedResponse<T>>(this.baseUrl, { params: httpParams })
      .pipe(
        tap(data => this.setCache(cacheKey, data)),
        catchError(error => this.handleError('getAll', error)),
        finalize(() => this.setLoading('getAll', false))
      );
  }

  getById(id: string): Observable<T> {
    const cacheKey = `getById_${id}`;
    
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    this.setLoading(`getById_${id}`, true);
    
    return this.http.get<T>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(data => this.setCache(cacheKey, data)),
        catchError(error => this.handleError(`getById_${id}`, error)),
        finalize(() => this.setLoading(`getById_${id}`, false))
      );
  }

  /**
   * Create new entity
   */
  create(data: Partial<T>): Observable<T> {
    this.setLoading('create', true);
    
    return this.http.post<ApiResponse<T>>(this.baseUrl, data)
      .pipe(
        map(response => response.data),
        tap(newEntity => {
          this.invalidateCache();
          this.notifyEntityChange('created', newEntity);
        }),
        catchError(error => this.handleError('create', error)),
        finalize(() => this.setLoading('create', false))
      );
  }

  /**
   * Update existing entity
   */
  update(id: string, data: Partial<T>): Observable<T> {
    this.setLoading(`update_${id}`, true);
    
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${id}`, data)
      .pipe(
        map(response => response.data),
        tap(updatedEntity => {
          this.invalidateCache();
          this.setCache(`getById_${id}`, updatedEntity);
          this.notifyEntityChange('updated', updatedEntity);
        }),
        catchError(error => this.handleError(`update_${id}`, error)),
        finalize(() => this.setLoading(`update_${id}`, false))
      );
  }

  /**
   * Delete entity
   */
  delete(id: string): Observable<void> {
    this.setLoading(`delete_${id}`, true);
    
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(() => void 0),
        tap(() => {
          this.invalidateCache();
          this.removeFromCache(`getById_${id}`);
          this.notifyEntityChange('deleted', { id } as T);
        }),
        catchError(error => this.handleError(`delete_${id}`, error)),
        finalize(() => this.setLoading(`delete_${id}`, false))
      );
  }

  // SEARCH & FILTERING
  search(query: string, filters?: Record<string, any>): Observable<PaginatedResponse<T>> {
    const params = { page: 1, limit: 10, ...filters, search: query };
    return this.getAll({ page: 1, limit: 10, ...params });
  }

  /**
   * Get entities by category
   */
  getByCategory(categoryId: string, params?: PaginationParams): Observable<PaginatedResponse<T>> {
    return this.getAll({ ...params, category: categoryId });
  }

  /**
   * Get entities by supplier
   */
  getBySupplier(supplierId: string, params?: PaginationParams): Observable<PaginatedResponse<T>> {
    return this.getAll({ ...params, supplierId });
  }

  // BULK OPERATIONS
  createMany(data: Partial<T>[]): Observable<T[]> {
    this.setLoading('createMany', true);
    
    return this.http.post<ApiResponse<T[]>>(`${this.baseUrl}/bulk`, { items: data })
      .pipe(
        map(response => response.data),
        tap(newEntities => {
          this.invalidateCache();
          newEntities.forEach(entity => this.notifyEntityChange('created', entity));
        }),
        catchError(error => this.handleError('createMany', error)),
        finalize(() => this.setLoading('createMany', false))
      );
  }

  /**
   * Update multiple entities
   */
  updateMany(updates: { id: string; data: Partial<T> }[]): Observable<T[]> {
    this.setLoading('updateMany', true);
    
    return this.http.put<ApiResponse<T[]>>(`${this.baseUrl}/bulk`, { updates })
      .pipe(
        map(response => response.data),
        tap(updatedEntities => {
          this.invalidateCache();
          updatedEntities.forEach(entity => {
            this.setCache(`getById_${entity.id}`, entity);
            this.notifyEntityChange('updated', entity);
          });
        }),
        catchError(error => this.handleError('updateMany', error)),
        finalize(() => this.setLoading('updateMany', false))
      );
  }

  /**
   * Delete multiple entities
   */
  deleteMany(ids: string[]): Observable<void> {
    this.setLoading('deleteMany', true);
    
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/bulk`, { body: { ids } })
      .pipe(
        map(() => void 0),
        tap(() => {
          this.invalidateCache();
          ids.forEach(id => {
            this.removeFromCache(`getById_${id}`);
            this.notifyEntityChange('deleted', { id } as T);
          });
        }),
        catchError(error => this.handleError('deleteMany', error)),
        finalize(() => this.setLoading('deleteMany', false))
      );
  }

  // EXPORT/IMPORT
  export(format: 'csv' | 'xlsx' | 'json', filters?: Record<string, any>): Observable<Blob> {
    const params = this.buildHttpParams({ ...filters, format });
    
    return this.http.get(`${this.baseUrl}/export`, { 
      params, 
      responseType: 'blob' 
    }).pipe(
      catchError(error => this.handleError('export', error))
    );
  }

  /**
   * Import entities from file
   */
  import(file: File): Observable<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    this.setLoading('import', true);
    
    return this.http.post<ApiResponse<{ imported: number; errors: string[] }>>(
      `${this.baseUrl}/import`, 
      formData
    ).pipe(
      map(response => response.data),
      tap(() => this.invalidateCache()),
      catchError(error => this.handleError('import', error)),
      finalize(() => this.setLoading('import', false))
    );
  }

  // CACHE MANAGEMENT
  protected getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Set data in cache
   */
  protected setCache(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Remove data from cache
   */
  protected removeFromCache(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  protected invalidateCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache by pattern
   */
  protected clearCacheByPattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // LOADING STATES
  protected setLoading(key: string, loading: boolean): void {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject(false));
    }
    this.loadingStates.get(key)!.next(loading);
  }

  /**
   * Get loading state
   */
  isLoading(key: string): Observable<boolean> {
    if (!this.loadingStates.has(key)) {
      this.loadingStates.set(key, new BehaviorSubject(false));
    }
    return this.loadingStates.get(key)!.asObservable();
  }

  /**
   * Check if any operation is loading
   */
  get isAnyLoading(): Observable<boolean> {
    const loadingStates = Array.from(this.loadingStates.values());
    if (loadingStates.length === 0) {
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    // Combine all loading states
    return new Observable(observer => {
      const subscriptions = loadingStates.map(state => 
        state.subscribe(loading => {
          const anyLoading = loadingStates.some(s => s.value);
          observer.next(anyLoading);
        })
      );

      return () => subscriptions.forEach(sub => sub.unsubscribe());
    });
  }

  // ERROR HANDLING
  protected handleError(operation: string, error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    let errorCode = 'UNKNOWN_ERROR';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
      errorCode = 'CLIENT_ERROR';
    } else {
      // Server-side error
      errorCode = error.error?.code || error.status.toString();
      errorMessage = error.error?.message || error.message;
    }

    console.error(`${this.constructor.name} - ${operation} failed:`, {
      error,
      operation,
      endpoint: this.endpoint,
      timestamp: new Date().toISOString()
    });

    const apiError: ApiError = {
      code: errorCode,
      message: errorMessage,
      details: error.error?.details,
      timestamp: new Date().toISOString()
    };

    return throwError(() => apiError);
  }

  // UTILITY METHODS
  protected buildHttpParams(params: Record<string, any> = {}): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => httpParams = httpParams.append(key, item.toString()));
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });
    
    return httpParams;
  }

  /**
   * Serialize parameters for cache key
   */
  protected serializeParams(params: HttpParams): string {
    return params.toString();
  }

  /**
   * Notify about entity changes (can be overridden by subclasses)
   */
  protected notifyEntityChange(action: 'created' | 'updated' | 'deleted', entity: T): void {
    // Override in subclasses to handle entity changes
    console.log(`Entity ${action}:`, entity);
  }

  // SIMPLE HTTP METHODS
  protected get<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Simple POST request
   */
  protected post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Simple PUT request
   */
  protected put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Simple DELETE request
   */
  protected deleteEndpoint<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Simple PATCH request
   */
  protected patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Get paginated data
   */
  protected getPaginated<T>(endpoint: string, page: number, limit: number, params?: any): Observable<PaginatedResponse<T>> {
    const queryParams = {
      page,
      limit,
      ...params
    };
    const httpParams = this.buildHttpParams(queryParams);
    return this.http.get<ApiResponse<PaginatedResponse<T>>>(`${this.baseUrl}${endpoint}`, { params: httpParams })
      .pipe(map(response => response.data));
  }

  // ABSTRACT METHODS
  protected abstract getEntityName(): string;

  /**
   * Validate entity data before sending to API
   */
  protected abstract validateEntity(data: Partial<T>): boolean;
}