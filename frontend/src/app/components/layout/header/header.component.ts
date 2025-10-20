import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
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

  searchQuery = '';
  isSearchFocused = false;
  showSuggestions = false;
  searchSuggestions: SearchSuggestion[] = [];
  selectedSuggestionIndex = -1;
  quickFilters: any[] = [];
  private searchSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    public i18n: I18nService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Subscribe to search suggestions
    this.searchSubscription = this.searchService.searchSuggestions$.subscribe(
      suggestions => {
        this.searchSuggestions = suggestions;
      }
    );

    // Initialize quick filters
    this.initializeQuickFilters();
  }

  initializeQuickFilters() {
    this.quickFilters = [
      { id: 'products', label: 'Products', icon: 'inventory_2', active: false },
      { id: 'suppliers', label: 'Suppliers', icon: 'business', active: false },
      { id: 'orders', label: 'Orders', icon: 'shopping_cart', active: false },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', active: false }
    ];
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

  onSearch() {
    console.log('Header - Search clicked');
    if (this.searchQuery.trim()) {
      console.log('Header - Searching for:', this.searchQuery);
      this.hideSuggestions();
      
      // Navigate to products page with search query
      this.router.navigate(['/client/products'], { 
        queryParams: { search: this.searchQuery } 
      }).then(success => {
        console.log('Header - Search navigation successful:', success);
      }).catch(error => {
        console.error('Header - Search navigation error:', error);
      });
    } else {
      console.log('Header - No search query provided');
      // If no search query, just go to products page
      this.router.navigate(['/client/products']).then(success => {
        console.log('Header - Products navigation successful:', success);
      }).catch(error => {
        console.error('Header - Products navigation error:', error);
      });
    }
  }

  onSearchFocus() {
    console.log('Header - Search focused');
    this.isSearchFocused = true;
    // Show suggestions when focused
    this.showSuggestions = true;
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.isSearchFocused = false;
      this.hideSuggestions();
    }, 200);
  }

  onSearchInput() {
    console.log('Header - Search input:', this.searchQuery);
    if (this.searchQuery.trim()) {
      this.showSuggestions = true;
    } else {
      this.hideSuggestions();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.hideSuggestions();
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    console.log('Header - Suggestion selected:', suggestion);
    this.searchQuery = suggestion.title;
    this.hideSuggestions();
    this.router.navigate([`/${suggestion.type}`], { queryParams: { q: this.searchQuery } }).then(success => {
      console.log('Header - Suggestion navigation successful:', success);
    }).catch(error => {
      console.error('Header - Suggestion navigation error:', error);
    });
  }

  hideSuggestions() {
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
  }

  toggleQuickFilter(filter: any) {
    console.log('Header - Quick filter toggled:', filter);
    filter.active = !filter.active;
    // Navigate to filtered view
    this.router.navigate([`/${filter.id}`]).then(success => {
      console.log('Header - Filter navigation successful:', success);
    }).catch(error => {
      console.error('Header - Filter navigation error:', error);
    });
    this.hideSuggestions();
  }

  // Hide inline notifications dropdown on notifications route to avoid duplication
  isNotificationsPage(): boolean {
    return this.router.url.includes('/notifications');
  }

  clearRecentSearches() {
    this.searchService.clearRecentSearches();
    this.searchService.search('');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
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
