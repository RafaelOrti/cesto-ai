import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit() {
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
