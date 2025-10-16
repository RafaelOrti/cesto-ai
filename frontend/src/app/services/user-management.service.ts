import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'buyer' | 'supplier';
  isActive: boolean;
  emailVerified: boolean;
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'buyer' | 'supplier';
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'buyer' | 'supplier';
  isActive?: boolean;
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  /**
   * Get all users with optional filters
   */
  getAllUsers(filters?: UserFilters): Observable<User[]> {
    let params = new HttpParams();
    
    if (filters?.role) {
      params = params.set('role', filters.role);
    }
    
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params });
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  /**
   * Update an existing user
   */
  updateUser(userId: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData);
  }

  /**
   * Delete a user
   */
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${userId}`);
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(userId: string, isActive: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, { isActive });
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }
}
