import { Component, OnInit } from '@angular/core';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Supplier {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  isRecommended: boolean;
  hasSpecialOffer: boolean;
  categories: string[];
  deliveryOptions: string[];
  isNew: boolean;
}

interface SupplierFilters {
  freeDelivery: boolean;
  coDelivery: boolean;
  onSale: boolean;
  newProducts: boolean;
}

@Component({
  selector: 'app-explore-suppliers',
  templateUrl: './explore-suppliers.component.html',
  styleUrls: ['./explore-suppliers.component.scss']
})
export class ExploreSuppliersComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  selectedFilters: SupplierFilters = {
    freeDelivery: false,
    coDelivery: false,
    onSale: false,
    newProducts: false
  };

  categories: Category[] = [
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'meat', name: 'Meat', icon: '🥩' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' }
  ];

  private recommendedSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Gatimport',
      description: 'Premium food products and ingredients',
      logo: 'assets/images/gatimport-logo.png',
      rating: 4.8,
      isRecommended: true,
      hasSpecialOffer: true,
      categories: ['dairy', 'meat'],
      deliveryOptions: ['free-delivery', 'co-delivery'],
      isNew: false
    },
    {
      id: '2',
      name: 'Fresh Foods Co',
      description: 'Fresh vegetables and fruits daily delivery',
      logo: 'assets/images/fresh-foods-logo.png',
      rating: 4.6,
      isRecommended: true,
      hasSpecialOffer: false,
      categories: ['vegetables', 'fruits'],
      deliveryOptions: ['free-delivery'],
      isNew: true
    },
    {
      id: '3',
      name: 'Ocean Catch',
      description: 'Fresh seafood and fish products',
      logo: 'assets/images/ocean-catch-logo.png',
      rating: 4.7,
      isRecommended: true,
      hasSpecialOffer: true,
      categories: ['fish'],
      deliveryOptions: ['co-delivery'],
      isNew: false
    }
  ];

  private allSuppliers: Supplier[] = [
    ...this.recommendedSuppliers,
    {
      id: '4',
      name: 'Bakery Master',
      description: 'Artisan breads and pastries',
      logo: 'assets/images/bakery-master-logo.png',
      rating: 4.5,
      isRecommended: false,
      hasSpecialOffer: false,
      categories: ['bakery'],
      deliveryOptions: [],
      isNew: true
    },
    {
      id: '5',
      name: 'Meat Premium',
      description: 'High-quality meat products',
      logo: 'assets/images/meat-premium-logo.png',
      rating: 4.9,
      isRecommended: false,
      hasSpecialOffer: true,
      categories: ['meat'],
      deliveryOptions: ['free-delivery'],
      isNew: false
    }
  ];

  filteredSuppliers: Supplier[] = this.allSuppliers;

  get recommendedSuppliersList(): Supplier[] {
    return this.recommendedSuppliers;
  }

  ngOnInit(): void {
    this.loadRecommendedSuppliers();
  }

  onSearch(): void {
    this.filterSuppliers();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.filterSuppliers();
  }

  onFilterChange(filter: string): void {
    this.selectedFilters[filter as keyof SupplierFilters] = !this.selectedFilters[filter as keyof SupplierFilters];
    this.filterSuppliers();
  }

  addSupplier(supplier: Supplier): void {
    // Implementation for adding supplier to favorites
  }

  viewSupplier(supplier: Supplier): void {
    // Navigation to supplier details
  }

  getSupplierStatus(supplier: Supplier): string {
    if (supplier.isRecommended) return 'Recommended';
    if (supplier.isNew) return 'New';
    if (supplier.hasSpecialOffer) return 'Special Offer';
    return 'Available';
  }

  getStatusClass(supplier: Supplier): string {
    if (supplier.isRecommended) return 'recommended';
    if (supplier.isNew) return 'new';
    if (supplier.hasSpecialOffer) return 'offer';
    return 'available';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  private loadRecommendedSuppliers(): void {
    // Load recommended suppliers based on client's buying history
  }

  getFeatureIcon(feature: string): string {
    switch (feature) {
      case 'AI Recommendations': return 'icon-ai-recommendations';
      case 'Delivery Options': return 'icon-delivery-options';
      case 'Quality Assurance': return 'icon-quality-assurance';
      default: return 'icon-default';
    }
  }

  getFilterLabel(filter: string): string {
    switch (filter) {
      case 'freeDelivery': return 'Free Delivery';
      case 'coDelivery': return 'Co-Delivery';
      case 'onSale': return 'On Sale';
      case 'newProducts': return 'New Products';
      default: return filter;
    }
  }

  private filterSuppliers(): void {
    let suppliers = [...this.allSuppliers];

    suppliers = this.applySearchFilter(suppliers);
    suppliers = this.applyCategoryFilter(suppliers);
    suppliers = this.applyDeliveryFilters(suppliers);
    suppliers = this.applySpecialFilters(suppliers);

    this.filteredSuppliers = suppliers;
  }

  private applySearchFilter(suppliers: Supplier[]): Supplier[] {
    if (!this.searchQuery.trim()) return suppliers;
    
    const query = this.searchQuery.toLowerCase();
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(query) ||
      supplier.description.toLowerCase().includes(query)
    );
  }

  private applyCategoryFilter(suppliers: Supplier[]): Supplier[] {
    if (!this.selectedCategory) return suppliers;
    
    return suppliers.filter(supplier =>
      supplier.categories.includes(this.selectedCategory)
    );
  }

  private applyDeliveryFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.freeDelivery) {
      filtered = filtered.filter(supplier =>
        supplier.deliveryOptions.includes('free-delivery')
      );
    }

    if (this.selectedFilters.coDelivery) {
      filtered = filtered.filter(supplier =>
        supplier.deliveryOptions.includes('co-delivery')
      );
    }

    return filtered;
  }

  private applySpecialFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.onSale) {
      filtered = filtered.filter(supplier => supplier.hasSpecialOffer);
    }

    if (this.selectedFilters.newProducts) {
      filtered = filtered.filter(supplier => supplier.isNew);
    }

    return filtered;
  }
}