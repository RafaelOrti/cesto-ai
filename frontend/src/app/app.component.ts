import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { ThemeInitializerService } from './core/services/theme-initializer.service';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Cesto AI';
  isLoggedIn = false;
  currentUser: any = null;

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
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
