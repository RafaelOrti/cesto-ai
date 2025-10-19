import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { UserRole } from '../../shared/types/common.types';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = currentUser.role as UserRole;
    const expectedRole = route.data['role'] as UserRole;

    if (expectedRole && userRole !== expectedRole) {
      // Redirect to appropriate dashboard based on user role
      this.redirectToRoleDashboard(userRole);
      return false;
    }

    return true;
  }

  private redirectToRoleDashboard(role: UserRole): void {
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
        this.router.navigate(['/dashboard']);
    }
  }
}
