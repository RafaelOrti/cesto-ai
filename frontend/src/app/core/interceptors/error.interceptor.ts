import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiError } from '../../../shared/types/common.types';

/**
 * Global error interceptor that handles HTTP errors consistently across the application
 * Provides user-friendly error messages, logging, and automatic redirects for auth errors
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = this.handleHttpError(error);
        
        // Log error for debugging
        console.error('HTTP Error:', {
          url: request.url,
          method: request.method,
          error: apiError,
          timestamp: new Date().toISOString()
        });

        // Show user-friendly error message
        this.showErrorMessage(apiError);

        // Handle specific error scenarios
        this.handleErrorScenarios(apiError);

        return throwError(() => apiError);
      })
    );
  }

  /**
   * Convert HTTP error to standardized API error
   */
  private handleHttpError(error: HttpErrorResponse): ApiError {
    let apiError: ApiError;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      apiError = {
        code: 'CLIENT_ERROR',
        message: 'Error de conexión. Verifique su conexión a internet.',
        timestamp: new Date().toISOString()
      };
    } else {
      // Server-side error
      const serverError = error.error;
      
      apiError = {
        code: serverError?.code || error.status.toString(),
        message: serverError?.message || this.getDefaultErrorMessage(error.status),
        details: serverError?.details,
        timestamp: new Date().toISOString()
      };
    }

    return apiError;
  }

  /**
   * Get default error message based on HTTP status
   */
  private getDefaultErrorMessage(status: number): string {
    const errorMessages: Record<number, string> = {
      400: 'Solicitud inválida. Verifique los datos enviados.',
      401: 'No autorizado. Por favor, inicie sesión nuevamente.',
      403: 'Acceso denegado. No tiene permisos para realizar esta acción.',
      404: 'Recurso no encontrado.',
      409: 'Conflicto. El recurso ya existe o está en uso.',
      422: 'Datos de entrada inválidos.',
      429: 'Demasiadas solicitudes. Intente nuevamente más tarde.',
      500: 'Error interno del servidor. Intente nuevamente más tarde.',
      502: 'Servidor no disponible temporalmente.',
      503: 'Servicio no disponible. Estamos trabajando para solucionarlo.',
      504: 'Tiempo de espera agotado. Intente nuevamente.'
    };

    return errorMessages[status] || 'Ha ocurrido un error inesperado.';
  }

  /**
   * Show error message to user
   */
  private showErrorMessage(error: ApiError): void {
    const message = this.getUserFriendlyMessage(error);
    const duration = this.getErrorDuration(error.code);

    this.snackBar.open(message, 'Cerrar', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: ApiError): string {
    // Handle specific error codes with custom messages
    const customMessages: Record<string, string> = {
      'VALIDATION_ERROR': 'Por favor, verifique los datos ingresados.',
      'DUPLICATE_EMAIL': 'Este correo electrónico ya está registrado.',
      'INVALID_CREDENTIALS': 'Credenciales inválidas. Verifique su email y contraseña.',
      'ACCOUNT_LOCKED': 'Su cuenta está bloqueada temporalmente.',
      'TOKEN_EXPIRED': 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
      'PERMISSION_DENIED': 'No tiene permisos para realizar esta acción.',
      'RESOURCE_NOT_FOUND': 'El recurso solicitado no existe.',
      'RATE_LIMIT_EXCEEDED': 'Demasiadas solicitudes. Espere un momento antes de intentar nuevamente.'
    };

    return customMessages[error.code] || error.message;
  }

  /**
   * Get error message duration based on error type
   */
  private getErrorDuration(errorCode: string): number {
    const criticalErrors = ['401', '403', 'ACCOUNT_LOCKED', 'TOKEN_EXPIRED'];
    return criticalErrors.includes(errorCode) ? 8000 : 5000;
  }

  /**
   * Handle specific error scenarios
   */
  private handleErrorScenarios(error: ApiError): void {
    switch (error.code) {
      case '401':
      case 'TOKEN_EXPIRED':
        this.handleUnauthorizedError();
        break;
      case '403':
        this.handleForbiddenError();
        break;
      case '429':
        this.handleRateLimitError();
        break;
      case '500':
      case '502':
      case '503':
      case '504':
        this.handleServerError();
        break;
    }
  }

  /**
   * Handle unauthorized errors
   */
  private handleUnauthorizedError(): void {
    // Clear authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to login
    this.router.navigate(['/login'], {
      queryParams: { reason: 'session_expired' }
    });
  }

  /**
   * Handle forbidden errors
   */
  private handleForbiddenError(): void {
    // Optionally redirect to dashboard or show access denied page
    this.router.navigate(['/dashboard'], {
      queryParams: { error: 'access_denied' }
    });
  }

  /**
   * Handle rate limit errors
   */
  private handleRateLimitError(): void {
    // Could implement exponential backoff or queue requests
    console.warn('Rate limit exceeded. Consider implementing request queuing.');
  }

  /**
   * Handle server errors
   */
  private handleServerError(): void {
    // Could implement retry logic or show maintenance page
    console.error('Server error occurred. Consider implementing retry logic.');
  }
}
