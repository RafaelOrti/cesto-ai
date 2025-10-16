import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StateService } from '../services/state.service';

/**
 * Loading interceptor that manages global loading state
 * Automatically shows/hides loading indicators for HTTP requests
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private readonly LOADING_DELAY = 200; // Delay before showing loading (ms)
  private loadingTimeout?: any;

  constructor(private stateService: StateService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading for certain requests
    if (this.shouldSkipLoading(request)) {
      return next.handle(request);
    }

    this.startLoading();

    return next.handle(request).pipe(
      finalize(() => {
        this.stopLoading();
      })
    );
  }

  private shouldSkipLoading(request: HttpRequest<any>): boolean {
    // Skip loading for background requests
    if (request.headers.get('X-Background-Request') === 'true') {
      return true;
    }

    // Skip loading for cache requests
    if (request.headers.get('X-Cache-Request') === 'true') {
      return true;
    }

    // Skip loading for specific endpoints
    const skipEndpoints = [
      '/api/v1/health',
      '/api/v1/ping',
      '/api/v1/analytics'
    ];

    return skipEndpoints.some(endpoint => request.url.includes(endpoint));
  }

  private startLoading(): void {
    this.activeRequests++;

    // Only show loading if this is the first request
    if (this.activeRequests === 1) {
      // Delay showing loading to avoid flickering for fast requests
      this.loadingTimeout = setTimeout(() => {
        this.stateService.setLoading(true);
      }, this.LOADING_DELAY);
    }
  }

  private stopLoading(): void {
    this.activeRequests--;

    // Clear timeout if loading hasn't been shown yet
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = undefined;
    }

    // Hide loading when all requests are complete
    if (this.activeRequests === 0) {
      this.stateService.setLoading(false);
    }

    // Ensure activeRequests doesn't go negative
    if (this.activeRequests < 0) {
      this.activeRequests = 0;
    }
  }
}
