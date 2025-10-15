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
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  role: 'buyer' | 'supplier';
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
    if (token) {
      this.loadUserProfile();
    }
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
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
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
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
}
