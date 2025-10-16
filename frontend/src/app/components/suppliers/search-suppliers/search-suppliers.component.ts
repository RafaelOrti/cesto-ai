import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface Supplier {
  id: string;
  name: string;
  description: string;
  logo?: string;
  tags: string[];
  category: string;
  rating: number;
  productsCount: number;
  isFavorite: boolean;
  lastDelivery: Date;
  futureDelivery: Date;
  activeCampaign?: string;
  newProductsCount: number;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  deliveryTerms: {
    minimumOrder: number;
    shippingCost: number;
    freeShippingThreshold: number;
  };
  joinedDate: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface SupplierTab {
  id: string;
  name: string;
  count: number;
}

@Component({
  selector: 'app-search-suppliers',
  templateUrl: './search-suppliers.component.html',
  styleUrls: ['./search-suppliers.component.scss']
})
export class SearchSuppliersComponent implements OnInit, OnDestroy {
  searchQuery = '';
  selectedCategories: string[] = [];
  activeTab = 'all';
  viewMode: 'grid' | 'list' = 'list';
  sortBy = 'name';
  isLoading = false;
  
  currentPage = 1;
  itemsPerPage = 20;
  totalSuppliers = 0;
  totalPages = 0;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];

  categories: Category[] = [
    { id: 'pharmacy', name: 'Pharmacy & Health', icon: 'icon-medical', count: 45 },
    { id: 'children', name: 'Children & Baby', icon: 'icon-baby', count: 32 },
    { id: 'bread', name: 'Bread & Bakery', icon: 'icon-bread', count: 28 },
    { id: 'animal', name: 'Animal & Accessory', icon: 'icon-paw', count: 15 },
    { id: 'drink', name: 'Drink', icon: 'icon-glass', count: 67 },
    { id: 'convenience', name: 'Convenience food & Snack', icon: 'icon-snack', count: 89 },
    { id: 'fish', name: 'Fish & Seafood', icon: 'icon-fish', count: 23 },
    { id: 'fruit', name: 'Fruit & Green', icon: 'icon-apple', count: 56 },
    { id: 'frozen', name: 'Frozen & Chilled', icon: 'icon-snowflake', count: 41 },
    { id: 'candy', name: 'Candy & Snacks', icon: 'icon-candy', count: 34 },
    { id: 'home', name: 'Home & Household', icon: 'icon-home', count: 78 },
    { id: 'meat', name: 'Meat & Charcuterie', icon: 'icon-meat', count: 29 }
  ];

  supplierTabs: SupplierTab[] = [
    { id: 'all', name: 'All suppliers', count: 0 },
    { id: 'favorites', name: 'My favorites', count: 0 },
    { id: 'new', name: 'New suppliers', count: 0 }
  ];

  filters = {
    suppliersToPurchase: false,
    stoppedBuying: false,
    coDelivery: false,
    freeShipping: false,
    activeCampaigns: false,
    newProducts: false
  };

  constructor(private router: Router) {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.updateTabCounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.searchQuery = query;
        this.applyFilters();
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  toggleCategory(categoryId: string): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
    this.applyFilters();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    this.currentPage = 1;
    this.applyFilters();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onSortChange(): void {
    this.applyFilters();
  }

  async loadSuppliers(): Promise<void> {
    this.isLoading = true;
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.suppliers = this.generateMockSuppliers();
      this.totalSuppliers = this.suppliers.length;
      this.totalPages = Math.ceil(this.totalSuppliers / this.itemsPerPage);
      
      this.applyFilters();
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private applyFilters(): void {
    let filtered = [...this.suppliers];

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.description.toLowerCase().includes(query) ||
        supplier.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filters
    if (this.selectedCategories.length > 0) {
      filtered = filtered.filter(supplier =>
        this.selectedCategories.includes(supplier.category)
      );
    }

    // Apply tab filters
    if (this.activeTab === 'favorites') {
      filtered = filtered.filter(supplier => supplier.isFavorite);
    } else if (this.activeTab === 'new') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(supplier => supplier.joinedDate > thirtyDaysAgo);
    }

    // Apply additional filters
    if (this.filters.freeShipping) {
      filtered = filtered.filter(supplier => supplier.deliveryTerms.freeShippingThreshold > 0);
    }

    if (this.filters.activeCampaigns) {
      filtered = filtered.filter(supplier => supplier.activeCampaign);
    }

    if (this.filters.newProducts) {
      filtered = filtered.filter(supplier => supplier.newProductsCount > 0);
    }

    // Apply sorting
    filtered = this.sortSuppliers(filtered);

    // Update counts
    this.totalSuppliers = filtered.length;
    this.totalPages = Math.ceil(this.totalSuppliers / this.itemsPerPage);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredSuppliers = filtered.slice(startIndex, endIndex);
  }

  private sortSuppliers(suppliers: Supplier[]): Supplier[] {
    return suppliers.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastDelivery':
          return b.lastDelivery.getTime() - a.lastDelivery.getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'products':
          return b.productsCount - a.productsCount;
        default:
          return 0;
      }
    });
  }

  private updateTabCounts(): void {
    this.supplierTabs[0].count = this.suppliers.length;
    this.supplierTabs[1].count = this.suppliers.filter(s => s.isFavorite).length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.supplierTabs[2].count = this.suppliers.filter(s => s.joinedDate > thirtyDaysAgo).length;
  }

  toggleFavorite(supplier: Supplier, event: Event): void {
    event.stopPropagation();
    supplier.isFavorite = !supplier.isFavorite;
    
    // Update in backend
    this.updateSupplierFavorite(supplier.id, supplier.isFavorite);
    
    // Update tab counts
    this.updateTabCounts();
    
    // Reapply filters if we're in favorites tab
    if (this.activeTab === 'favorites') {
      this.applyFilters();
    }
  }

  private async updateSupplierFavorite(supplierId: string, isFavorite: boolean): Promise<void> {
    try {
      // API call to update favorite status
      console.log(`Updating favorite status for supplier ${supplierId}: ${isFavorite}`);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }

  viewSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id]);
  }

  orderFromSupplier(supplier: Supplier, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/suppliers', supplier.id, 'order']);
  }

  getDeliveryStatus(lastDelivery: Date): string {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastDelivery.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      return 'Recently ordered';
    } else if (daysDiff <= 30) {
      return 'Ordered this month';
    } else {
      return 'Ordered long ago';
    }
  }

  getDeliveryStatusClass(lastDelivery: Date): string {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastDelivery.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      return 'status-recent';
    } else if (daysDiff <= 30) {
      return 'status-month';
    } else {
      return 'status-old';
    }
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.activeTab = 'all';
    Object.keys(this.filters).forEach(key => {
      (this.filters as any)[key] = false;
    });
    this.currentPage = 1;
    this.applyFilters();
  }

  // Pagination methods
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  // Mock data generation
  private generateMockSuppliers(): Supplier[] {
    const mockSuppliers: Supplier[] = [];
    const supplierNames = [
      'Luntgårdens Mejeri', 'Nihao Foods', 'Birta Organic', 'Galatea Products',
      'PAUL & Thom', 'Hugos Chark', 'Fresh Valley', 'Mountain Dairy',
      'Ocean Fresh', 'Green Harvest', 'Premium Meats', 'Artisan Breads'
    ];

    const categories = this.categories.map(c => c.id);
    const tags = [
      'Organic', 'Local', 'Premium', 'Fresh', 'Sustainable', 'Traditional',
      'Modern', 'Family-owned', 'Certified', 'Artisan', 'Eco-friendly'
    ];

    for (let i = 0; i < 50; i++) {
      const randomName = supplierNames[Math.floor(Math.random() * supplierNames.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      mockSuppliers.push({
        id: `supplier-${i}`,
        name: `${randomName} ${i > 0 ? i : ''}`.trim(),
        description: `High-quality products from ${randomName}. Specializing in fresh, organic goods.`,
        logo: i % 3 === 0 ? `https://picsum.photos/100/100?random=${i}` : undefined,
        tags: tags.slice(0, Math.floor(Math.random() * 4) + 2),
        category: randomCategory,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        productsCount: Math.floor(Math.random() * 500) + 50,
        isFavorite: Math.random() > 0.7,
        lastDelivery: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        futureDelivery: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        activeCampaign: Math.random() > 0.6 ? `${Math.floor(Math.random() * 20) + 10}% discount` : undefined,
        newProductsCount: Math.floor(Math.random() * 20),
        contactInfo: {
          email: `contact@${randomName.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: `+46 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
          address: `Address ${i}, Stockholm, Sweden`
        },
        deliveryTerms: {
          minimumOrder: Math.floor(Math.random() * 1000) + 500,
          shippingCost: Math.random() > 0.5 ? 100 : 0,
          freeShippingThreshold: Math.random() > 0.3 ? Math.floor(Math.random() * 2000) + 1000 : 0
        },
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      });
    }

    return mockSuppliers;
  }

  // Utility methods
  Math = Math;
}

