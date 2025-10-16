import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || `Error Code: ${error.status}`;
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // GET request
  protected get<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      ...options
    } as any).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // POST request
  protected post<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
      ...options
    } as any).pipe(
      catchError(this.handleError)
    );
  }

  // PUT request
  protected put<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
      ...options
    } as any).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE request
  protected delete<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      ...options
    } as any).pipe(
      catchError(this.handleError)
    );
  }

  // PATCH request
  protected patch<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders(),
      ...options
    } as any).pipe(
      catchError(this.handleError)
    );
  }

  // Paginated GET request
  protected getPaginated<T>(
    endpoint: string, 
    page: number = 1, 
    limit: number = 10,
    filters?: any
  ): Observable<PaginatedResponse<T>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}?${params}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
