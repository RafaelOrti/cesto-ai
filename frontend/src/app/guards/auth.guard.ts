import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { RoleRedirectService } from '../core/services/role-redirect.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private roleRedirectService: RoleRedirectService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // If accessing root path, redirect to role-specific dashboard
    if (route.routeConfig?.path === '' || route.routeConfig?.path === 'dashboard') {
      this.roleRedirectService.redirectToRoleDashboard();
      return false;
    }

    return true;
  }
}
