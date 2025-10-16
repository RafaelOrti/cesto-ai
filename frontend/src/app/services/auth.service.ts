import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'supplier' | 'admin';
  companyName: string;
  supplier?: any;
  buyer?: any;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  role: 'buyer' | 'supplier';
  termsAccepted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3400/api/v1';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = localStorage.getItem('access_token');
    if (token && this.isTokenValid(token)) {
      this.loadUserProfile();
    } else {
      this.logout();
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('token_expires', (Date.now() + response.expires_in * 1000).toString());
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  register(userData: RegisterData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('token_expires', (Date.now() + response.expires_in * 1000).toString());
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    // Call logout endpoint if refresh token exists
    if (refreshToken) {
      this.http.post(`${this.API_URL}/auth/logout`, { refresh_token: refreshToken })
        .subscribe({
          next: () => console.log('Logged out successfully'),
          error: (error) => console.error('Logout error:', error)
        });
    }

    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private loadUserProfile() {
    this.http.get<User>(`${this.API_URL}/auth/profile`)
      .subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        },
        error: () => {
          this.logout();
        }
      });
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isBuyer(): boolean {
    return this.hasRole('buyer');
  }

  isSupplier(): boolean {
    return this.hasRole('supplier');
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return false;
    }

    try {
      const response = await this.http.post<any>(`${this.API_URL}/auth/refresh`, { refresh_token: refreshToken }).toPromise();
      if (response && response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('token_expires', (Date.now() + (response.expires_in || 3600) * 1000).toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return this.http.post(`${this.API_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    }).toPromise();
  }

  async forgotPassword(email: string): Promise<any> {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, { email }).toPromise();
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password`, {
      token,
      newPassword
    }).toPromise();
  }

  isTokenExpired(): boolean {
    const expires = localStorage.getItem('token_expires');
    if (!expires) return true;
    return Date.now() > parseInt(expires);
  }

  async getAuthenticatedHeaders(): Promise<any> {
    const token = this.getToken();
    if (!token || this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        throw new Error('Authentication failed');
      }
    }

    return {
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    };
  }
}
