import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { RoleRedirectService } from '../../core/services/role-redirect.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  currentRoute = '';
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleRedirectService: RoleRedirectService
  ) {
    console.log('[LAYOUT] Constructor called');
  }

  ngOnInit() {
    console.log('[LAYOUT] Component initialized');
    
    // Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('[LAYOUT] Route changed to:', event.url);
        this.currentRoute = event.url;
      });

    // Get current user and redirect if needed
    this.authService.currentUser$.subscribe(user => {
      console.log('[LAYOUT] Current user:', user);
      this.currentUser = user;
      
      // If user is on root path or generic dashboard, redirect to role-specific dashboard
      if (user && (this.currentRoute === '' || this.currentRoute === '/dashboard' || this.currentRoute === '/')) {
        console.log('[LAYOUT] Redirecting user to role-specific dashboard');
        this.roleRedirectService.redirectToRoleDashboard();
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('[LAYOUT] Logout successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('[LAYOUT] Logout error:', error);
        // Even if logout fails, redirect to login
        this.router.navigate(['/login']);
      }
    });
  }
}
