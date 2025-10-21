import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { SearchService, SearchSuggestion } from '../../../core/services/search.service';
import { Subscription } from 'rxjs';
import { NotificationsComponent } from '../../../core/components/notifications/notifications.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() currentUser: any = null;
  @Output() logout = new EventEmitter<void>();

  @ViewChild(NotificationsComponent) notificationsComp?: NotificationsComponent;

  // Search properties
  searchQuery: string = '';
  searchSuggestions: SearchSuggestion[] = [];
  showSuggestions: boolean = false;
  isSearchFocused: boolean = false;
  selectedSuggestionIndex: number = -1;
  private searchSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private searchService: SearchService,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    // Subscribe to search suggestions
    this.searchSubscription = this.searchService.searchSuggestions$.subscribe(
      suggestions => {
        this.searchSuggestions = suggestions;
      }
    );
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.logout.emit();
  }

  onSettings() {
    console.log('Header - Settings clicked');
    // Navigate to settings page
    this.router.navigate(['/settings']).then(success => {
      console.log('Header - Settings navigation successful:', success);
    }).catch(error => {
      console.error('Header - Settings navigation error:', error);
    });
  }

  onProfile() {
    // Navega a la vista de perfil/ajustes de usuario
    this.router.navigate(['/settings']);
  }

  onHelp() {
    console.log('Header - Help clicked');
    // Navigate to help page or open help modal
    this.router.navigate(['/help']).then(success => {
      console.log('Header - Help navigation successful:', success);
    }).catch(error => {
      console.error('Header - Help navigation error:', error);
    });
  }

  onNotifications() {
    console.log('Header - Notifications clicked');
    // Navigate to notifications page instead of inline dropdown
    this.router.navigate(['/notifications']).then(success => {
      console.log('Header - Notifications navigation successful:', success);
    }).catch(error => {
      console.error('Header - Notifications navigation error:', error);
    });
  }

  // Hide inline notifications dropdown on notifications route to avoid duplication
  isNotificationsPage(): boolean {
    return this.router.url.includes('/notifications');
  }

  // Search functionality
  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Header - Searching for:', this.searchQuery);
      // Navigate to search results page
      this.router.navigate(['/search'], {
        queryParams: { search: this.searchQuery }
      });
    }
  }

  onSearchFocus() {
    this.isSearchFocused = true;
    if (this.searchQuery.trim()) {
      this.showSuggestions = true;
    }
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      this.isSearchFocused = false;
      this.showSuggestions = false;
    }, 200);
  }

  onSearchInput() {
    console.log('Header - Search input:', this.searchQuery);
    if (this.searchQuery.trim()) {
      this.showSuggestions = true;
      this.searchService.search(this.searchQuery);
    } else {
      this.showSuggestions = false;
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.showSuggestions = false;
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    this.searchQuery = suggestion.title;
    this.showSuggestions = false;
    this.router.navigate([`/${suggestion.type}`], { queryParams: { q: this.searchQuery } }).then(success => {
      console.log('Header - Navigation successful:', success);
    });
  }

  hideSuggestions() {
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
  }

  clearRecentSearches() {
    this.searchService.clearRecentSearches();
    this.searchService.search('');
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.searchSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.searchSuggestions[this.selectedSuggestionIndex]);
        } else {
          this.onSearch();
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }


  get userDisplayName(): string {
    if (this.currentUser) {
      return this.currentUser.firstName || this.currentUser.email || 'User';
    }
    return 'User';
  }

  get userInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName?.charAt(0) || ''}${this.currentUser.lastName?.charAt(0) || ''}`.toUpperCase();
    }
    return 'U';
  }

  getRoleDisplayName(): string {
    if (this.currentUser?.role) {
      return this.i18n.translate(`roles.${this.currentUser.role}`);
    }
    return this.i18n.translate('roles.user');
  }
}
