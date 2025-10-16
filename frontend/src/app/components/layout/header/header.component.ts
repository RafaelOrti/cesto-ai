import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser: any = null;
  @Output() logout = new EventEmitter<void>();

  searchQuery = '';
  showUserMenu = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  onLogout() {
    this.logout.emit();
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  get userDisplayName(): string {
    if (this.currentUser) {
      return this.currentUser.email;
    }
    return 'User';
  }

  get userInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName?.charAt(0) || ''}${this.currentUser.lastName?.charAt(0) || ''}`.toUpperCase();
    }
    return 'U';
  }
}
