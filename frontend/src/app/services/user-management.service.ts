import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'buyer' | 'supplier';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  profile?: {
    company?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  };
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'buyer' | 'supplier';
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'buyer' | 'supplier';
  companyName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly API_URL = 'http://localhost:3000/api/admin';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all users with optional filtering
   */
  getUsers(filters?: UserFilters, page = 1, pageSize = 10): Observable<PaginatedUsers> {
    let params: any = { page: page.toString(), pageSize: pageSize.toString() };
    
    if (filters) {
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
    }

    return this.http.get<PaginatedUsers>(`${this.API_URL}/users`, { params });
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${userId}`);
  }

  /**
   * Create new user
   */
  createUser(userData: Partial<User>, adminUserId: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users`, {
      ...userData,
      adminUserId
    });
  }

  /**
   * Update existing user
   */
  updateUser(userId: string, userData: Partial<User>, adminUserId: string): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${userId}`, {
      ...userData,
      adminUserId
    });
  }

  /**
   * Delete user
   */
  deleteUser(userId: string, adminUserId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${userId}`, {
      body: { adminUserId }
    });
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(userId: string, adminUserId: string): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/users/${userId}/toggle-status`, {
      adminUserId
    });
  }

  /**
   * Reset user password
   */
  resetUserPassword(userId: string, adminUserId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/users/${userId}/reset-password`, {
      adminUserId
    });
  }

  /**
   * Get user statistics
   */
  getUserStats(): Observable<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: { [role: string]: number };
    newUsersThisMonth: number;
    lastLoginStats: { [period: string]: number };
  }> {
    return this.http.get<any>(`${this.API_URL}/users/stats`);
  }

  /**
   * Bulk operations
   */
  bulkUpdateUsers(userIds: string[], updates: Partial<User>, adminUserId: string): Observable<{ updated: number }> {
    return this.http.post<{ updated: number }>(`${this.API_URL}/users/bulk-update`, {
      userIds,
      updates,
      adminUserId
    });
  }

  bulkDeleteUsers(userIds: string[], adminUserId: string): Observable<{ deleted: number }> {
    return this.http.post<{ deleted: number }>(`${this.API_URL}/users/bulk-delete`, {
      userIds,
      adminUserId
    });
  }

  /**
   * Export users data
   */
  exportUsers(format: 'csv' | 'xlsx' | 'json', filters?: UserFilters): Observable<Blob> {
    let params: any = { format };
    
    if (filters) {
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
    }

    return this.http.get(`${this.API_URL}/users/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Import users from file
   */
  importUsers(file: File, adminUserId: string): Observable<{
    imported: number;
    errors: string[];
    warnings: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('adminUserId', adminUserId);

    return this.http.post<{
      imported: number;
      errors: string[];
      warnings: string[];
    }>(`${this.API_URL}/users/import`, formData);
  }

  /**
   * Get user activity logs
   */
  getUserActivityLogs(userId: string, page = 1, pageSize = 20): Observable<{
    logs: any[];
    total: number;
  }> {
    return this.http.get<{ logs: any[]; total: number }>(`${this.API_URL}/users/${userId}/activity-logs`, {
      params: { page: page.toString(), pageSize: pageSize.toString() }
    });
  }

  /**
   * Update local users cache
   */
  updateLocalUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  /**
   * Add user to local cache
   */
  addUserToCache(user: User): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([user, ...currentUsers]);
  }

  /**
   * Update user in local cache
   */
  updateUserInCache(updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      currentUsers[index] = updatedUser;
      this.usersSubject.next([...currentUsers]);
    }
  }

  /**
   * Remove user from local cache
   */
  removeUserFromCache(userId: string): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next(currentUsers.filter(u => u.id !== userId));
  }

  /**
   * Utility methods
   */
  getUserFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getUserStatusText(user: User): string {
    return user.isActive ? 'Activo' : 'Inactivo';
  }

  getUserRoleText(user: User): string {
    const roleMap = {
      admin: 'Administrador',
      buyer: 'Comprador',
      supplier: 'Proveedor'
    };
    return roleMap[user.role] || user.role;
  }

  getUserStatusClass(user: User): string {
    return user.isActive ? 'status-active' : 'status-inactive';
  }

  getUserRoleClass(user: User): string {
    return `role-${user.role}`;
  }

  /**
   * Validation helpers
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateUserData(userData: Partial<User>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.email || !this.validateEmail(userData.email)) {
      errors.push('Email válido es requerido');
    }

    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.push('Nombre debe tener al menos 2 caracteres');
    }

    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.push('Apellido debe tener al menos 2 caracteres');
    }

    if (!userData.role || !['admin', 'buyer', 'supplier'].includes(userData.role)) {
      errors.push('Rol válido es requerido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}