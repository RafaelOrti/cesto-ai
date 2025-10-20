import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeInitializerService } from './core/services/theme-initializer.service';
import { I18nService } from './core/services/i18n.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cesto AI';
  isLoggedIn = false;
  currentUser: any = null;
  isAuthenticated = false;
  isLoginPage = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeInitializer: ThemeInitializerService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.themeInitializer.initializeTheme();
    this.i18nService.initializeLanguage();
    
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      this.isAuthenticated = isAuth;
      this.currentUser = this.authService.getCurrentUser();
    });

    // Detect login page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = event.url === '/login';
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
