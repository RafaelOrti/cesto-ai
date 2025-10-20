import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface SupplierCategory {
  id: string;
  name: string;
  nameSwedish: string;
  nameSpanish: string;
  nameEnglish: string;
  icon: string;
  active: boolean;
}

export interface SupplierCampaign {
  id: string;
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface SupplierProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isNew: boolean;
  isOnSale: boolean;
  category: string;
}

export interface MySupplier {
  id: string;
  companyName: string;
  supplierName: string;
  logo?: string;
  categories: SupplierCategory[];
  activeCampaigns: SupplierCampaign[];
  newProducts: SupplierProduct[];
  deliveryInfo: {
    combinedDelivery: boolean;
    freeShipping: boolean;
  };
  status: 'active' | 'stopped' | 'potential';
  lastOrderDate?: string;
  totalOrders: number;
  rating: number;
  description?: string;
  onSale?: boolean;
  freeDelivery?: boolean;
  coDelivery?: boolean;
  recentlyAdded?: boolean;
  popular?: boolean;
  inquirySent?: boolean;
  imageUrl?: string;
  lastDelivery?: string;
  futureDelivery?: string;
  hasCampaign?: boolean;
  hasNewProducts?: boolean;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Data properties
  suppliers: MySupplier[] = [];
  filteredSuppliers: MySupplier[] = [];
  loading = false;

  // Search and filters
  mainSearchTerm = '';
  secondarySearchTerm = '';
  viewMode: 'table' | 'cards' = 'table';

  // Filters object
  filters = {
    freeDelivery: false,
    coDelivery: false,
    onSale: false,
    suppliersMayNeedToBuy: false,
    suppliersStoppedBuying: false,
    combinedDelivery: false,
    freeShippingCost: false,
    activeCampaigns: false,
    newProducts: false
  };

  // Categories
  categories: SupplierCategory[] = [
    { id: 'dairy', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', nameEnglish: 'Dairy', icon: '🥛', active: false },
    { id: 'fruits', name: 'Fruits', nameSwedish: 'Frukt', nameSpanish: 'Frutas', nameEnglish: 'Fruits', icon: '🍎', active: false },
    { id: 'vegetables', name: 'Vegetables', nameSwedish: 'Grönsaker', nameSpanish: 'Verduras', nameEnglish: 'Vegetables', icon: '🥕', active: false },
    { id: 'deli', name: 'Deli', nameSwedish: 'Chark', nameSpanish: 'Charcutería', nameEnglish: 'Deli', icon: '🥓', active: false },
    { id: 'healthBeauty', name: 'Health & Beauty', nameSwedish: 'Hälsa & Skönhet', nameSpanish: 'Salud y Belleza', nameEnglish: 'Health & Beauty', icon: '💄', active: false },
    { id: 'frozen', name: 'Frozen', nameSwedish: 'Djupfryst', nameSpanish: 'Congelados', nameEnglish: 'Frozen', icon: '❄️', active: false },
    { id: 'freshMeat', name: 'Fresh Meat', nameSwedish: 'Färskvaror, Ko', nameSpanish: 'Carnes Frescas', nameEnglish: 'Fresh Meat', icon: '🥩', active: false },
    { id: 'beverages', name: 'Beverages', nameSwedish: 'Drycker', nameSpanish: 'Bebidas', nameEnglish: 'Beverages', icon: '🥤', active: false }
  ];

  availableCategories: SupplierCategory[] = [];

  // Recommendations
  recommendations = [
    { id: 'popular', name: 'Popular', icon: 'fas fa-fire', active: false },
    { id: 'new', name: 'New', icon: 'fas fa-star', active: false },
    { id: 'sale', name: 'On Sale', icon: 'fas fa-tag', active: false },
    { id: 'all', name: 'All Suppliers', icon: 'fas fa-th', active: false }
  ];

  constructor(private router: Router) {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadCategories();
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
        this.applyFilters();
      });
  }

  private loadSuppliers(): void {
    this.loading = true;
    // Mock data - replace with actual service call
    setTimeout(() => {
      this.suppliers = this.getMockSuppliers();
      this.filteredSuppliers = [...this.suppliers];
      this.loading = false;
    }, 800);
  }

  private loadCategories(): void {
    this.availableCategories = [...this.categories];
  }

  onMainSearch(): void {
    this.searchSubject.next(this.mainSearchTerm);
  }

  onSecondarySearch(): void {
    this.searchSubject.next(this.secondarySearchTerm);
  }

  onRecommendationSelect(rec: any): void {
    rec.active = !rec.active;
    this.applyFilters();
  }

  onCategorySelect(category: SupplierCategory): void {
    category.active = !category.active;
    this.applyFilters();
  }

  toggleFilter(filterKey: string): void {
    (this.filters as any)[filterKey] = !(this.filters as any)[filterKey];
    this.applyFilters();
  }

  onAddSupplier(): void {
    this.router.navigate(['/suppliers/search']);
  }

  showMoreCategories(): void {
    console.log('Show more categories - implement modal or expand');
  }

  clearAllFilters(): void {
    this.mainSearchTerm = '';
    this.secondarySearchTerm = '';
    
    // Reset all filters
    Object.keys(this.filters).forEach(key => {
      (this.filters as any)[key] = false;
    });
    
    // Reset categories and recommendations
    this.categories.forEach(cat => cat.active = false);
    this.recommendations.forEach(rec => rec.active = false);
    
    this.applyFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    
    // Count active categories
    count += this.categories.filter(cat => cat.active).length;
    
    // Count active recommendations
    count += this.recommendations.filter(rec => rec.active).length;
    
    // Count active filters
    count += Object.values(this.filters).filter(f => f === true).length;
    
    return count;
  }

  applyFilters(): void {
    let filtered = [...this.suppliers];

    // Search filter
    const searchTerm = this.mainSearchTerm || this.secondarySearchTerm;
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(search) ||
        supplier.companyName.toLowerCase().includes(search) ||
        (supplier.description && supplier.description.toLowerCase().includes(search))
      );
    }

    // Category filters
    const activeCategories = this.categories.filter(cat => cat.active).map(cat => cat.id);
    if (activeCategories.length > 0) {
      filtered = filtered.filter(supplier =>
        supplier.categories.some(cat => activeCategories.includes(cat.id))
      );
    }

    // Recommendation filters
    if (this.recommendations.find(r => r.id === 'popular')?.active) {
      filtered = filtered.filter(supplier => supplier.popular);
    }
    if (this.recommendations.find(r => r.id === 'new')?.active) {
      filtered = filtered.filter(supplier => supplier.recentlyAdded);
    }
    if (this.recommendations.find(r => r.id === 'sale')?.active) {
      filtered = filtered.filter(supplier => supplier.onSale);
    }

    // Specific filters
    if (this.filters.freeDelivery || this.filters.freeShippingCost) {
      filtered = filtered.filter(supplier => 
        supplier.freeDelivery || supplier.deliveryInfo.freeShipping
      );
    }
    if (this.filters.coDelivery || this.filters.combinedDelivery) {
      filtered = filtered.filter(supplier => 
        supplier.coDelivery || supplier.deliveryInfo.combinedDelivery
      );
    }
    if (this.filters.onSale) {
      filtered = filtered.filter(supplier => supplier.onSale);
    }
    if (this.filters.suppliersMayNeedToBuy) {
      filtered = filtered.filter(supplier => supplier.status === 'potential');
    }
    if (this.filters.suppliersStoppedBuying) {
      filtered = filtered.filter(supplier => supplier.status === 'stopped');
    }
    if (this.filters.activeCampaigns) {
      filtered = filtered.filter(supplier => 
        supplier.hasCampaign || supplier.activeCampaigns.length > 0
      );
    }
    if (this.filters.newProducts) {
      filtered = filtered.filter(supplier => 
        supplier.hasNewProducts || supplier.newProducts.length > 0
      );
    }

    this.filteredSuppliers = filtered;
  }

  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  trackBySupplierId(index: number, supplier: MySupplier): string {
    return supplier.id;
  }

  getCategoryName(category: SupplierCategory): string {
    // Return Spanish name for now - can be modified based on language setting
    return category.nameSpanish;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  toggleFavorite(supplier: MySupplier): void {
    supplier.isFavorite = !supplier.isFavorite;
    // TODO: Call API to update favorite status
    console.log('Toggle favorite for:', supplier.supplierName, supplier.isFavorite);
  }

  viewSupplier(supplierId: string): void {
    this.router.navigate(['/suppliers', supplierId]);
  }

  viewSupplierProducts(supplier: MySupplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'products']);
  }

  // Mock data generation
  private getMockSuppliers(): MySupplier[] {
    const mockSuppliers: MySupplier[] = [
      {
        id: '1',
        companyName: 'Luntgårdens Mejeri AB',
        supplierName: 'Luntgårdens Mejeri',
        description: 'Swedish dairy products from local farms',
        logo: '/assets/images/suppliers/luntgardens.jpg',
        imageUrl: '/assets/images/suppliers/luntgardens.jpg',
        categories: [
          { id: 'dairy', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', nameEnglish: 'Dairy', icon: '🥛', active: false }
        ],
        activeCampaigns: [
          {
            id: '1',
            name: 'Summer Dairy Special',
            discount: 15,
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            active: true
          }
        ],
        newProducts: [
          {
            id: '1',
            name: 'Organic Milk 1L',
            price: 15.50,
            isNew: true,
            isOnSale: false,
            category: 'dairy'
          },
          {
            id: '2',
            name: 'Greek Yogurt 500g',
            price: 22.90,
            originalPrice: 28.00,
            isNew: true,
            isOnSale: true,
            category: 'dairy'
          }
        ],
        deliveryInfo: {
          combinedDelivery: false,
          freeShipping: true
        },
        status: 'active',
        lastOrderDate: '2024-01-15',
        futureDelivery: '2024-02-05',
        totalOrders: 12,
        rating: 4.6,
        onSale: true,
        freeDelivery: true,
        coDelivery: false,
        recentlyAdded: true,
        popular: true,
        inquirySent: false,
        hasCampaign: true,
        hasNewProducts: true,
        isFavorite: true
      },
      {
        id: '2',
        companyName: 'Nihao Foods International',
        supplierName: 'Nihao Foods',
        description: 'Asian food specialty supplier',
        categories: [
          { id: 'deli', name: 'Deli', nameSwedish: 'Chark', nameSpanish: 'Charcutería', nameEnglish: 'Deli', icon: '🥓', active: false }
        ],
        activeCampaigns: [],
        newProducts: [
          {
            id: '3',
            name: 'Soy Sauce Premium',
            price: 35.00,
            isNew: true,
            isOnSale: false,
            category: 'deli'
          }
        ],
        deliveryInfo: {
          combinedDelivery: true,
          freeShipping: false
        },
        status: 'active',
        lastOrderDate: '2024-01-10',
        futureDelivery: '2024-02-10',
        totalOrders: 8,
        rating: 4.5,
        onSale: false,
        freeDelivery: false,
        coDelivery: true,
        recentlyAdded: false,
        popular: false,
        inquirySent: false,
        hasCampaign: false,
        hasNewProducts: true,
        isFavorite: false
      },
      {
        id: '3',
        companyName: 'Galatea Products Ltd',
        supplierName: 'Galatea',
        description: 'Organic and natural products',
        categories: [
          { id: 'healthBeauty', name: 'Health & Beauty', nameSwedish: 'Hälsa & Skönhet', nameSpanish: 'Salud y Belleza', nameEnglish: 'Health & Beauty', icon: '💄', active: false }
        ],
        activeCampaigns: [
          {
            id: '2',
            name: 'Spring Sale',
            discount: 20,
            startDate: '2024-03-01',
            endDate: '2024-05-31',
            active: true
          }
        ],
        newProducts: [],
        deliveryInfo: {
          combinedDelivery: true,
          freeShipping: true
        },
        status: 'potential',
        lastOrderDate: undefined,
        futureDelivery: undefined,
        totalOrders: 0,
        rating: 4.8,
        onSale: true,
        freeDelivery: true,
        coDelivery: true,
        recentlyAdded: true,
        popular: true,
        inquirySent: false,
        hasCampaign: true,
        hasNewProducts: false,
        isFavorite: false
      },
      {
        id: '4',
        companyName: 'Hugos Chark AB',
        supplierName: 'Hugos Chark',
        description: 'Traditional Swedish meat products',
        categories: [
          { id: 'freshMeat', name: 'Fresh Meat', nameSwedish: 'Färskvaror, Ko', nameSpanish: 'Carnes Frescas', nameEnglish: 'Fresh Meat', icon: '🥩', active: false },
          { id: 'deli', name: 'Deli', nameSwedish: 'Chark', nameSpanish: 'Charcutería', nameEnglish: 'Deli', icon: '🥓', active: false }
        ],
        activeCampaigns: [],
        newProducts: [
          {
            id: '4',
            name: 'Smoked Ham 1kg',
            price: 120.00,
            originalPrice: 150.00,
            isNew: false,
            isOnSale: true,
            category: 'deli'
          }
        ],
        deliveryInfo: {
          combinedDelivery: false,
          freeShipping: false
        },
        status: 'stopped',
        lastOrderDate: '2023-10-20',
        futureDelivery: undefined,
        totalOrders: 25,
        rating: 4.3,
        onSale: true,
        freeDelivery: false,
        coDelivery: false,
        recentlyAdded: false,
        popular: false,
        inquirySent: false,
        hasCampaign: false,
        hasNewProducts: true,
        isFavorite: false
      }
    ];

    return mockSuppliers;
  }
}
