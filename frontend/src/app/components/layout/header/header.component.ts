import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { SearchService, SearchSuggestion } from '../../../core/services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() currentUser: any = null;
  @Output() logout = new EventEmitter<void>();

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
    // Navigate to settings page
    this.router.navigate(['/settings']);
  }

  onHelp() {
    // Navigate to help page or open help modal
    this.router.navigate(['/help']);
  }

  onNotifications() {
    // Navigate to notifications page or open notifications modal
    this.router.navigate(['/notifications']);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.hideSuggestions();
      this.searchService.performSearch(this.searchQuery);
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  onSearchFocus() {
    this.isSearchFocused = true;
    if (this.searchQuery.trim()) {
      this.showSuggestions = true;
    } else {
      // Show recent searches when focused but no query
      this.searchService.search('');
      this.showSuggestions = true;
    }
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.isSearchFocused = false;
      this.hideSuggestions();
    }, 200);
  }

  onSearchInput() {
    if (this.searchQuery.trim()) {
      this.searchService.search(this.searchQuery);
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
    this.searchQuery = suggestion.title;
    this.hideSuggestions();
    this.searchService.performSearch(this.searchQuery, suggestion);
    this.router.navigate([`/${suggestion.type}`], { queryParams: { q: this.searchQuery } });
  }

  hideSuggestions() {
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
  }

  toggleQuickFilter(filter: any) {
    filter.active = !filter.active;
    // Navigate to filtered view
    this.router.navigate([`/${filter.id}`]);
    this.hideSuggestions();
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

  getRoleDisplayName(): string {
    if (this.currentUser?.role) {
      return this.i18n.translate(`roles.${this.currentUser.role}`);
    }
    return this.i18n.translate('roles.user');
  }
}
