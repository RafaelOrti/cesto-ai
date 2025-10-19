import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../../../shared/types/common.types';

@Injectable({
  providedIn: 'root'
})
export class RoleRedirectService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Redirect user to appropriate dashboard based on their role
   */
  redirectToRoleDashboard(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const role = currentUser.role as UserRole;
    this.redirectByRole(role);
  }

  /**
   * Redirect based on specific role
   */
  redirectByRole(role: UserRole): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'supplier':
        this.router.navigate(['/supplier/dashboard']);
        break;
      case 'client':
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        console.warn('Unknown role:', role);
        this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Get the default route for a role
   */
  getDefaultRouteForRole(role: UserRole): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'supplier':
        return '/supplier/dashboard';
      case 'client':
        return '/client/dashboard';
      default:
        return '/dashboard';
    }
  }
}
