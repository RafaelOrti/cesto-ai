import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer, of } from 'rxjs';
import { map, tap, catchError, switchMap, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, ApiResponse } from '../../../shared/types/common.types';
import { StateService } from './state.service';
import { NotificationService } from './notification.service';

/**
 * Advanced authentication service with JWT token management, refresh tokens, and session handling
 * Provides comprehensive authentication functionality with automatic token refresh
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  
  private readonly tokenRefreshSubject = new BehaviorSubject<boolean>(false);
  public readonly isRefreshing$ = this.tokenRefreshSubject.asObservable();

  // Observable properties for compatibility with existing components
  public readonly currentUser$ = this.stateService.currentUser$;
  public readonly isAuthenticated$ = this.stateService.isAuthenticated$;

  private refreshTimer?: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private stateService: StateService,
    private notificationService: NotificationService,
    @Inject('API_BASE_URL') private apiBaseUrl: string
  ) {
    this.initializeAuth();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.stateService.setCurrentUser(user);
      this.startTokenRefreshTimer();
    }
  }

  // ============================================================================
  // LOGIN/LOGOUT
  // ============================================================================

  /**
   * Login with email and password
   */
  login(email: string, password: string, rememberMe: boolean = false): Observable<User> {
    return this.http.post<{ access_token: string; refresh_token: string; user: User }>(
      `${this.apiBaseUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(({ access_token, refresh_token, user }) => {
        this.setTokens(access_token, refresh_token);
        this.stateService.setCurrentUser(user);
        this.startTokenRefreshTimer();
        this.notificationService.success(`Bienvenido, ${user.firstName}!`);
      }),
      map(({ user }) => user),
      catchError(error => {
        this.notificationService.error('Error al iniciar sesión. Verifica tus credenciales.');
        return throwError(error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      return this.http.post<void>(`${this.apiBaseUrl}/auth/logout`, { refreshToken }).pipe(
        tap(() => {
          this.clearAuthData();
          this.notificationService.info('Sesión cerrada correctamente');
        }),
        catchError(() => {
          // Even if logout fails on server, clear local data
          this.clearAuthData();
          return of(void 0);
        })
      );
    } else {
      this.clearAuthData();
      return of(void 0);
    }
  }

  /**
   * Register new user
   */
  register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'supplier' | 'client';
  }): Observable<User> {
    return this.http.post<{ user: User }>(`${this.apiBaseUrl}/auth/register`, userData).pipe(
      map(response => response.user),
      tap(user => {
        this.notificationService.success('Cuenta creada correctamente. Por favor, inicia sesión.');
      }),
      catchError(error => {
        this.notificationService.error('Error al crear la cuenta. Inténtalo de nuevo.');
        return throwError(error);
      })
    );
  }

  // ============================================================================
  // PASSWORD MANAGEMENT
  // ============================================================================

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      tap(() => {
        this.notificationService.success('Contraseña cambiada correctamente');
      }),
      catchError(error => {
        this.notificationService.error('Error al cambiar la contraseña');
        return throwError(error);
      })
    );
  }

  /**
   * Request password reset
   */
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/forgot-password`, { email }).pipe(
      tap(() => {
        this.notificationService.info('Se ha enviado un email con instrucciones para restablecer tu contraseña');
      }),
      catchError(error => {
        this.notificationService.error('Error al solicitar el restablecimiento de contraseña');
        return throwError(error);
      })
    );
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/reset-password`, {
      token,
      newPassword
    }).pipe(
      tap(() => {
        this.notificationService.success('Contraseña restablecida correctamente');
      }),
      catchError(error => {
        this.notificationService.error('Error al restablecer la contraseña');
        return throwError(error);
      })
    );
  }

  // ============================================================================
  // EMAIL VERIFICATION
  // ============================================================================

  /**
   * Send email verification
   */
  sendEmailVerification(): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/send-verification`, {}).pipe(
      tap(() => {
        this.notificationService.info('Email de verificación enviado');
      }),
      catchError(error => {
        this.notificationService.error('Error al enviar el email de verificación');
        return throwError(error);
      })
    );
  }

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/verify-email`, { token }).pipe(
      tap(() => {
        this.notificationService.success('Email verificado correctamente');
        this.updateUserEmailVerified(true);
      }),
      catchError(error => {
        this.notificationService.error('Error al verificar el email');
        return throwError(error);
      })
    );
  }

  // ============================================================================
  // TOKEN MANAGEMENT
  // ============================================================================

  /**
   * Refresh access token
   */
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }

    this.tokenRefreshSubject.next(true);

    return this.http.post<ApiResponse<{ accessToken: string }>>(
      `${this.apiBaseUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      map(response => response.data.accessToken),
      tap(newToken => {
        this.setToken(newToken);
        this.tokenRefreshSubject.next(false);
        this.startTokenRefreshTimer();
      }),
      catchError(error => {
        this.tokenRefreshSubject.next(false);
        this.logout();
        return throwError(error);
      })
    );
  }

  /**
   * Check if token is valid
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.parseJwt(token);
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = this.parseJwt(token);
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.stateService.getCurrentUser();
  }

  /**
   * Update user profile
   */
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiBaseUrl}/auth/profile`, profileData).pipe(
      map(response => response.data),
      tap(updatedUser => {
        this.stateService.setCurrentUser(updatedUser);
        this.setStoredUser(updatedUser);
        this.notificationService.success('Perfil actualizado correctamente');
      }),
      catchError(error => {
        this.notificationService.error('Error al actualizar el perfil');
        return throwError(error);
      })
    );
  }

  /**
   * Update user profile (alias for compatibility)
   */
  updateUserProfile(profileData: any): Observable<User> {
    return this.updateProfile(profileData);
  }

  /**
   * Delete user account
   */
  deleteAccount(password: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/auth/account`, {
      body: { password }
    }).pipe(
      tap(() => {
        this.clearAuthData();
        this.notificationService.success('Cuenta eliminada correctamente');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this.notificationService.error('Error al eliminar la cuenta');
        return throwError(error);
      })
    );
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.stateService.isAuthenticated() && this.isTokenValid();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'admin' | 'supplier' | 'client'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: ('admin' | 'supplier' | 'client')[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Require authentication for route
   */
  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  /**
   * Require specific role for route
   */
  requireRole(role: 'admin' | 'supplier' | 'client'): boolean {
    if (!this.hasRole(role)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setToken(accessToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private setStoredUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.stateService.logout();
    this.stopTokenRefreshTimer();
  }

  private startTokenRefreshTimer(): void {
    this.stopTokenRefreshTimer();
    
    const tokenExpiration = this.getTokenExpiration();
    if (!tokenExpiration) return;

    const refreshTime = tokenExpiration.getTime() - Date.now() - 60000; // Refresh 1 minute before expiry
    
    if (refreshTime > 0) {
      this.refreshTimer = timer(refreshTime).subscribe(() => {
        this.refreshToken().subscribe();
      });
    }
  }

  private stopTokenRefreshTimer(): void {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
      this.refreshTimer = null;
    }
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    
    return JSON.parse(jsonPayload);
  }

  private updateUserEmailVerified(verified: boolean): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, emailVerified: verified };
      this.stateService.setCurrentUser(updatedUser);
      this.setStoredUser(updatedUser);
    }
  }

  // ============================================================================
  // INTERCEPTOR SUPPORT
  // ============================================================================

  /**
   * Get authorization header
   */
  getAuthHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Handle token refresh for interceptors
   */
  handleTokenRefresh(): Observable<string> {
    if (this.tokenRefreshSubject.value) {
      // Already refreshing, wait for it to complete
      return this.isRefreshing$.pipe(
        switchMap(isRefreshing => 
          isRefreshing ? timer(100).pipe(switchMap(() => this.handleTokenRefresh())) : of(this.getToken()!)
        )
      );
    } else {
      return this.refreshToken();
    }
  }
}