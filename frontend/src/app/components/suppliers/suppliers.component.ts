import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { SupplierService } from '../../services/supplier.service';
import { NotificationService } from '../../core/services/notification.service';
import { I18nService } from '../../core/services/i18n.service';

export interface SupplierCategory {
  id: string;
  name: string;
  nameSwedish: string;
  nameSpanish: string;
  icon: string;
  active: boolean;
}

export interface SupplierFilter {
  recommendation: 'recently_added' | 'popular' | 'all' | null;
  category: string | null;
  onSale: boolean;
  freeDelivery: boolean;
  coDelivery: boolean;
  search: string;
}

export interface RecommendationType {
  id: string;
  name: string;
  nameSwedish: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Search controls
  mainSearchControl = new FormControl('');
  secondarySearchControl = new FormControl('');

  // Data
  suppliers: any[] = [];
  filteredSuppliers: any[] = [];
  loading = false;
  pagination = { page: 1, limit: 20 };

  // Filters
  currentFilter: SupplierFilter = {
    recommendation: null,
    category: null,
    onSale: false,
    freeDelivery: false,
    coDelivery: false,
    search: ''
  };

  // Categories (based on the image)
  categories: SupplierCategory[] = [
    { id: 'dairy', name: 'Dairy', nameSwedish: 'Mejeri', nameSpanish: 'Lácteos', icon: '🥛', active: false },
    { id: 'fruits-vegetables', name: 'Fruits & Vegetables', nameSwedish: 'Frukt & Grönt', nameSpanish: 'Frutas y Verduras', icon: '🥬', active: false },
    { id: 'deli', name: 'Deli', nameSwedish: 'Chark', nameSpanish: 'Charcutería', icon: '🥩', active: false },
    { id: 'health-beauty', name: 'Health & Beauty', nameSwedish: 'Hälsa & Skönhet', nameSpanish: 'Salud y Belleza', icon: '💄', active: false },
    { id: 'frozen', name: 'Frozen', nameSwedish: 'Djupfryst', nameSpanish: 'Congelados', icon: '🧊', active: false },
    { id: 'fresh-meat', name: 'Fresh Meat', nameSwedish: 'Färskvaror, Ko', nameSpanish: 'Carne Fresca', icon: '🥩', active: false },
    { id: 'packaged', name: 'Packaged', nameSwedish: 'Packade', nameSpanish: 'Empaquetados', icon: '📦', active: false }
  ];

  // Recommendation types
  recommendations: RecommendationType[] = [
    { id: 'recently_added', name: 'Recently Added', nameSwedish: 'Nyligen Tillagd', icon: '🔔', active: false },
    { id: 'popular', name: 'Popular', nameSwedish: 'Popular', icon: '⭐', active: false },
    { id: 'all', name: 'All Suppliers', nameSwedish: 'Alla Leverantörer', icon: '📋', active: true }
  ];

  // Special filters (from the image)
  specialFilters = [
    { id: 'free-delivery', label: 'FREE DELIVERY', active: false },
    { id: 'co-delivery', label: 'CO-DELIVERY', active: false },
    { id: 'on-sale', label: 'ON SALE', active: false },
    { id: 'suppliers-etc', label: 'SUPPLIERS ETC', active: false }
  ];

  // Sample suppliers (based on the image)
  sampleSuppliers = [
    {
      id: '1',
      name: "Engelman's",
      description: "Vi har allt för den perfekta delibrickan. Välkommen att upptäcka fantastiska smaker tillsammans med oss!",
      category: 'deli',
      onSale: true,
      freeDelivery: true,
      coDelivery: false,
      recentlyAdded: false,
      popular: true,
      inquirySent: false,
      rating: 4.5,
      imageUrl: '/assets/images/suppliers/engelman.jpg'
    },
    {
      id: '2',
      name: "Gastro Import",
      description: "Vi har drygt 25 års erfarenhet av att importera gourmetspecialiteter från Medelhavsområdet vilka vi säljer till restauranger, delikatessbutiker och detaljhandelsbutiker. Företaget grundades 1988 och ä...",
      category: 'packaged',
      onSale: false,
      freeDelivery: false,
      coDelivery: true,
      recentlyAdded: false,
      popular: false,
      inquirySent: true,
      rating: 4.2,
      imageUrl: '/assets/images/suppliers/gastro-import.jpg'
    }
  ];

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private i18nService: I18nService
  ) {}

  ngOnInit(): void {
    this.initializeSearch();
    this.loadSuppliers();
    this.setupSampleData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSearch(): void {
    // Main search
    this.mainSearchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.currentFilter.search = searchTerm || '';
        this.applyFilters();
      });

    // Secondary search
    this.secondarySearchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.currentFilter.search = searchTerm || '';
        this.applyFilters();
      });
  }

  private loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getSuppliers(this.pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.suppliers = response.data || [];
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading suppliers:', error);
          this.notificationService.error('Error loading suppliers');
          this.loading = false;
        }
      });
  }

  private setupSampleData(): void {
    // Use sample data if no real data is available
    if (this.suppliers.length === 0) {
      this.suppliers = this.sampleSuppliers;
      this.applyFilters();
    }
  }

  onRecommendationSelect(recommendation: RecommendationType): void {
    // Deactivate all recommendations
    this.recommendations.forEach(rec => rec.active = false);
    
    // Activate selected recommendation
    recommendation.active = true;
    this.currentFilter.recommendation = recommendation.id as any;
    
    this.applyFilters();
  }

  onCategorySelect(category: SupplierCategory): void {
    // Toggle category selection
    category.active = !category.active;
    
    // Update filter
    if (category.active) {
      this.currentFilter.category = category.id;
    } else {
      this.currentFilter.category = null;
    }
    
    this.applyFilters();
  }

  onSpecialFilterToggle(filter: any): void {
    filter.active = !filter.active;
    
    // Update filter based on type
    switch (filter.id) {
      case 'free-delivery':
        this.currentFilter.freeDelivery = filter.active;
        break;
      case 'co-delivery':
        this.currentFilter.coDelivery = filter.active;
        break;
      case 'on-sale':
        this.currentFilter.onSale = filter.active;
        break;
    }
    
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.suppliers];

    // Apply search filter
    if (this.currentFilter.search) {
      const searchTerm = this.currentFilter.search.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (this.currentFilter.category) {
      filtered = filtered.filter(supplier => supplier.category === this.currentFilter.category);
    }

    // Apply recommendation filter
    if (this.currentFilter.recommendation) {
      switch (this.currentFilter.recommendation) {
        case 'recently_added':
          filtered = filtered.filter(supplier => supplier.recentlyAdded);
          break;
        case 'popular':
          filtered = filtered.filter(supplier => supplier.popular);
          break;
        case 'all':
          // No additional filtering needed
          break;
      }
    }

    // Apply special filters
    if (this.currentFilter.onSale) {
      filtered = filtered.filter(supplier => supplier.onSale);
    }

    if (this.currentFilter.freeDelivery) {
      filtered = filtered.filter(supplier => supplier.freeDelivery);
    }

    if (this.currentFilter.coDelivery) {
      filtered = filtered.filter(supplier => supplier.coDelivery);
    }

    this.filteredSuppliers = filtered;
  }

  onSendInquiry(supplier: any): void {
    if (supplier.inquirySent) {
      this.notificationService.info('Inquiry already sent to this supplier');
      return;
    }

    this.supplierService.sendInquiry(supplier.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          supplier.inquirySent = true;
          this.notificationService.success(`Inquiry sent to ${supplier.name}`);
        },
        error: (error) => {
          console.error('Error sending inquiry:', error);
          this.notificationService.error('Error sending inquiry');
        }
      });
  }

  onAddSupplier(): void {
    // Navigate to add supplier page or open modal
    this.notificationService.info('Add supplier functionality will be implemented');
  }

  clearAllFilters(): void {
    // Reset all filters
    this.currentFilter = {
      recommendation: null,
      category: null,
      onSale: false,
      freeDelivery: false,
      coDelivery: false,
      search: ''
    };

    // Reset UI states
    this.recommendations.forEach(rec => rec.active = rec.id === 'all');
    this.categories.forEach(cat => cat.active = false);
    this.specialFilters.forEach(filter => filter.active = false);
    this.mainSearchControl.setValue('');
    this.secondarySearchControl.setValue('');

    this.applyFilters();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.currentFilter.category) count++;
    if (this.currentFilter.onSale) count++;
    if (this.currentFilter.freeDelivery) count++;
    if (this.currentFilter.coDelivery) count++;
    if (this.currentFilter.search) count++;
    return count;
  }

  // Translation methods
  getTranslation(key: string): string {
    return this.i18nService.translate(key);
  }

  getCategoryName(category: SupplierCategory): string {
    const currentLang = this.i18nService.getCurrentLanguage();
    switch (currentLang) {
      case 'sv': return category.nameSwedish;
      case 'es': return category.nameSpanish;
      default: return category.name;
    }
  }

  getRecommendationName(recommendation: RecommendationType): string {
    const currentLang = this.i18nService.getCurrentLanguage();
    switch (currentLang) {
      case 'sv': return recommendation.nameSwedish;
      default: return recommendation.name;
    }
  }
}