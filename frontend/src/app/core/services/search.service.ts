import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'products' | 'suppliers' | 'orders' | 'shopping-lists' | 'analytics' | 'inventory';
  category?: string;
  relevanceScore?: number;
}

export interface SearchResult {
  query: string;
  suggestions: SearchSuggestion[];
  totalResults: number;
  searchTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  private recentSearches: string[] = [];
  private popularSearches: string[] = [];

  constructor(private http: HttpClient) {
    this.loadRecentSearches();
    this.loadPopularSearches();
  }

  // Observable for search suggestions
  searchSuggestions$ = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.getSuggestions(query))
  );

  // Search with debouncing
  search(query: string): void {
    this.searchSubject.next(query);
  }

  // Get search suggestions
  private getSuggestions(query: string): Observable<SearchSuggestion[]> {
    if (!query || query.length < 2) {
      return of(this.getDefaultSuggestions());
    }

    // In a real app, this would make an HTTP request
    return this.mockSearchAPI(query).pipe(
      map(response => response.suggestions),
      catchError(() => of(this.getDefaultSuggestions()))
    );
  }

  // Mock API call - replace with real API
  private mockSearchAPI(query: string): Observable<SearchResult> {
    const suggestions = this.generateMockSuggestions(query);
    
    return of({
      query,
      suggestions,
      totalResults: suggestions.length,
      searchTime: Math.random() * 100
    });
  }

  // Generate mock suggestions based on query
  private generateMockSuggestions(query: string): SearchSuggestion[] {
    const allSuggestions: SearchSuggestion[] = [
      // Products
      { id: 'prod-1', title: 'Organic Milk', subtitle: 'Fresh dairy products', icon: 'local_drink', type: 'products', category: 'Dairy' },
      { id: 'prod-2', title: 'Premium Wine', subtitle: 'Fine wines collection', icon: 'wine_bar', type: 'products', category: 'Beverages' },
      { id: 'prod-3', title: 'Fresh Vegetables', subtitle: 'Farm-fresh produce', icon: 'eco', type: 'products', category: 'Produce' },
      
      // Suppliers
      { id: 'supp-1', title: 'Green Farms Ltd', subtitle: 'Organic produce supplier', icon: 'business', type: 'suppliers', category: 'Agriculture' },
      { id: 'supp-2', title: 'Wine Distributors Inc', subtitle: 'Premium wine distributor', icon: 'store', type: 'suppliers', category: 'Beverages' },
      { id: 'supp-3', title: 'Fresh Foods Co', subtitle: 'Fresh food supplier', icon: 'restaurant', type: 'suppliers', category: 'Food' },
      
      // Orders
      { id: 'order-1', title: 'Order #12345', subtitle: 'Pending approval', icon: 'shopping_cart', type: 'orders', category: 'Pending' },
      { id: 'order-2', title: 'Order #12346', subtitle: 'In transit', icon: 'local_shipping', type: 'orders', category: 'Shipped' },
      
      // Shopping Lists
      { id: 'list-1', title: 'Weekly Groceries', subtitle: '15 items', icon: 'list_alt', type: 'shopping-lists', category: 'Personal' },
      { id: 'list-2', title: 'Office Supplies', subtitle: '8 items', icon: 'work', type: 'shopping-lists', category: 'Business' },
      
      // Analytics
      { id: 'anal-1', title: 'Sales Report', subtitle: 'Q4 2024 analysis', icon: 'analytics', type: 'analytics', category: 'Reports' },
      { id: 'anal-2', title: 'Inventory Analysis', subtitle: 'Stock level insights', icon: 'inventory', type: 'analytics', category: 'Inventory' }
    ];

    const filteredSuggestions = allSuggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.category?.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by relevance (exact matches first, then partial matches)
    return filteredSuggestions
      .map(suggestion => ({
        ...suggestion,
        relevanceScore: this.calculateRelevanceScore(query, suggestion)
      }))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, 8);
  }

  // Calculate relevance score for sorting
  private calculateRelevanceScore(query: string, suggestion: SearchSuggestion): number {
    const queryLower = query.toLowerCase();
    const titleLower = suggestion.title.toLowerCase();
    const subtitleLower = suggestion.subtitle.toLowerCase();
    
    let score = 0;
    
    // Exact title match gets highest score
    if (titleLower === queryLower) score += 100;
    
    // Title starts with query
    if (titleLower.startsWith(queryLower)) score += 50;
    
    // Title contains query
    if (titleLower.includes(queryLower)) score += 25;
    
    // Subtitle contains query
    if (subtitleLower.includes(queryLower)) score += 10;
    
    // Category contains query
    if (suggestion.category?.toLowerCase().includes(queryLower)) score += 5;
    
    return score;
  }

  // Get default suggestions when no query
  private getDefaultSuggestions(): SearchSuggestion[] {
    return [
      { id: 'recent-1', title: 'Recent Searches', subtitle: 'View your recent searches', icon: 'history', type: 'products' },
      { id: 'popular-1', title: 'Popular Products', subtitle: 'Most searched items', icon: 'trending_up', type: 'products' },
      { id: 'quick-1', title: 'Quick Actions', subtitle: 'Common tasks and shortcuts', icon: 'flash_on', type: 'products' }
    ];
  }

  // Add search to recent searches
  addToRecentSearches(query: string): void {
    if (query && query.trim()) {
      // Remove if already exists
      this.recentSearches = this.recentSearches.filter(item => item !== query);
      // Add to beginning
      this.recentSearches.unshift(query);
      // Keep only last 10
      this.recentSearches = this.recentSearches.slice(0, 10);
      this.saveRecentSearches();
    }
  }

  // Get recent searches
  getRecentSearches(): string[] {
    return [...this.recentSearches];
  }

  // Clear recent searches
  clearRecentSearches(): void {
    this.recentSearches = [];
    this.saveRecentSearches();
  }

  // Load recent searches from localStorage
  private loadRecentSearches(): void {
    try {
      const saved = localStorage.getItem('cesto_recent_searches');
      if (saved) {
        this.recentSearches = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
      this.recentSearches = [];
    }
  }

  // Save recent searches to localStorage
  private saveRecentSearches(): void {
    try {
      localStorage.setItem('cesto_recent_searches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }
  }

  // Load popular searches (mock data)
  private loadPopularSearches(): void {
    this.popularSearches = [
      'organic milk',
      'premium wine',
      'fresh vegetables',
      'office supplies',
      'inventory report'
    ];
  }

  // Get popular searches
  getPopularSearches(): string[] {
    return [...this.popularSearches];
  }

  // Perform actual search (navigate to results)
  performSearch(query: string, suggestion?: SearchSuggestion): void {
    this.addToRecentSearches(query);
    
    if (suggestion) {
      // Navigate to specific suggestion
      console.log('Navigating to:', suggestion);
      // In a real app, you would navigate to the specific page
    } else {
      // Navigate to general search results
      console.log('Performing search for:', query);
      // In a real app, you would navigate to search results page
    }
  }
}
