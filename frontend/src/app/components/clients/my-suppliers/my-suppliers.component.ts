import { Component, OnInit } from '@angular/core';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  moq: number;
  price: number;
  unit: string;
  hasOrdered: boolean;
  lastOrderDate?: string;
  orderCount?: number;
}

interface Supplier {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'active' | 'stopped' | 'inactive';
  lastOrderDate: string;
  orderCount: number;
  totalSpent: number;
  categories: string[];
  hasNewProducts: boolean;
  hasCampaigns: boolean;
  deliveryOptions: string[];
  products: Product[];
}

interface SupplierCategory {
  id: string;
  name: string;
  count: number;
}

interface SupplierFilters {
  mayNeedToBuy: boolean;
  stoppedBuying: boolean;
  coDelivery: boolean;
  freeShipping: boolean;
  campaigns: boolean;
  newProducts: boolean;
}

@Component({
  selector: 'app-my-suppliers',
  templateUrl: './my-suppliers.component.html',
  styleUrls: ['./my-suppliers.component.scss']
})
export class MySuppliersComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  selectedFilters: SupplierFilters = {
    mayNeedToBuy: false,
    stoppedBuying: false,
    coDelivery: false,
    freeShipping: false,
    campaigns: false,
    newProducts: false
  };

  filterOptions = [
    { key: 'mayNeedToBuy', label: 'Suppliers I may need to buy from' },
    { key: 'stoppedBuying', label: 'Suppliers I have stopped buying from' },
    { key: 'coDelivery', label: 'Co-delivery' },
    { key: 'freeShipping', label: 'Free shipping' },
    { key: 'campaigns', label: 'Campaigns' },
    { key: 'newProducts', label: 'New products' }
  ];

  supplierCategories: SupplierCategory[] = [
    { id: 'favorites', name: 'My Favorites', count: 8 },
    { id: 'active', name: 'Active Suppliers', count: 12 },
    { id: 'new', name: 'New Suppliers', count: 3 }
  ];

  private mySuppliersData: Supplier[] = [
    {
      id: '1',
      name: 'Luntgårdens Mejeri',
      description: 'Happy cows that satiate happy stomachs',
      logo: 'assets/images/luntgardens-logo.png',
      status: 'active',
      lastOrderDate: '2024-01-15',
      orderCount: 45,
      totalSpent: 12500,
      categories: ['dairy'],
      hasNewProducts: true,
      hasCampaigns: true,
      deliveryOptions: ['free-shipping'],
      products: [
        {
          id: 'p1',
          name: 'Organic Whole Milk',
          description: 'Fresh organic milk from happy cows',
          image: 'assets/images/milk.jpg',
          moq: 24,
          price: 200,
          unit: 'kr',
          hasOrdered: true,
          lastOrderDate: '2024-01-10',
          orderCount: 12
        },
        {
          id: 'p2',
          name: 'Artisan Cheese Selection',
          description: 'Premium cheese varieties',
          image: 'assets/images/cheese.jpg',
          moq: 12,
          price: 450,
          unit: 'kr',
          hasOrdered: false
        }
      ]
    },
    {
      id: '2',
      name: 'Fresh Garden Produce',
      description: 'Farm-fresh vegetables and fruits',
      logo: 'assets/images/fresh-garden-logo.png',
      status: 'active',
      lastOrderDate: '2024-01-12',
      orderCount: 23,
      totalSpent: 8900,
      categories: ['vegetables', 'fruits'],
      hasNewProducts: false,
      hasCampaigns: true,
      deliveryOptions: ['co-delivery'],
      products: [
        {
          id: 'p3',
          name: 'Organic Tomatoes',
          description: 'Fresh organic tomatoes',
          image: 'assets/images/tomatoes.jpg',
          moq: 20,
          price: 150,
          unit: 'kr',
          hasOrdered: true,
          lastOrderDate: '2024-01-08',
          orderCount: 8
        }
      ]
    },
    {
      id: '3',
      name: 'Ocean Fresh Seafood',
      description: 'Premium seafood products',
      logo: 'assets/images/ocean-fresh-logo.png',
      status: 'stopped',
      lastOrderDate: '2023-12-20',
      orderCount: 15,
      totalSpent: 5600,
      categories: ['seafood'],
      hasNewProducts: true,
      hasCampaigns: false,
      deliveryOptions: [],
      products: []
    }
  ];

  filteredSuppliers: Supplier[] = this.mySuppliersData;

  ngOnInit(): void {
    this.loadMySuppliers();
  }

  onSearch(): void {
    this.filterSuppliers();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.filterSuppliers();
  }

  onFilterChange(filter: string): void {
    if (filter === 'mayNeedToBuy') {
      this.selectedFilters.mayNeedToBuy = !this.selectedFilters.mayNeedToBuy;
    } else if (filter === 'stoppedBuying') {
      this.selectedFilters.stoppedBuying = !this.selectedFilters.stoppedBuying;
    } else if (filter === 'coDelivery') {
      this.selectedFilters.coDelivery = !this.selectedFilters.coDelivery;
    } else if (filter === 'freeShipping') {
      this.selectedFilters.freeShipping = !this.selectedFilters.freeShipping;
    } else if (filter === 'campaigns') {
      this.selectedFilters.campaigns = !this.selectedFilters.campaigns;
    } else if (filter === 'newProducts') {
      this.selectedFilters.newProducts = !this.selectedFilters.newProducts;
    }
    this.filterSuppliers();
  }

  addToCart(product: Product): void {
    // Implementation for adding to cart
  }

  addToShoppingList(product: Product): void {
    // Implementation for adding to shopping list
  }

  viewOrderHistory(product: Product): void {
    // Show order history modal
  }

  getSupplierStatus(supplier: Supplier): string {
    const statusMap: Record<string, string> = {
      'active': 'Active',
      'stopped': 'Stopped Buying',
      'inactive': 'Inactive'
    };
    return statusMap[supplier.status] || 'Unknown';
  }

  getStatusClass(supplier: Supplier): string {
    return supplier.status;
  }

  getCategoryName(categoryId: string): string {
    const category = this.supplierCategories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  }

  getFilterLabel(filter: string): string {
    switch (filter) {
      case 'mayNeedToBuy': return 'Suppliers I may need to buy from';
      case 'stoppedBuying': return 'Suppliers I have stopped buying from';
      case 'coDelivery': return 'Co-delivery';
      case 'freeShipping': return 'Free shipping';
      case 'campaigns': return 'Campaigns';
      case 'newProducts': return 'New products';
      default: return filter;
    }
  }

  getFilterValue(filterKey: string): boolean {
    switch (filterKey) {
      case 'mayNeedToBuy': return this.selectedFilters.mayNeedToBuy;
      case 'stoppedBuying': return this.selectedFilters.stoppedBuying;
      case 'coDelivery': return this.selectedFilters.coDelivery;
      case 'freeShipping': return this.selectedFilters.freeShipping;
      case 'campaigns': return this.selectedFilters.campaigns;
      case 'newProducts': return this.selectedFilters.newProducts;
      default: return false;
    }
  }

  private loadMySuppliers(): void {
    // Load client's suppliers and their products
  }

  private filterSuppliers(): void {
    let suppliers = [...this.mySuppliersData];

    suppliers = this.applySearchFilter(suppliers);
    suppliers = this.applyCategoryFilter(suppliers);
    suppliers = this.applyStatusFilters(suppliers);
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
    
    return suppliers.filter(supplier => supplier.status === this.selectedCategory);
  }

  private applyStatusFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.mayNeedToBuy) {
      filtered = filtered.filter(supplier => supplier.status === 'active');
    }

    if (this.selectedFilters.stoppedBuying) {
      filtered = filtered.filter(supplier => supplier.status === 'stopped');
    }

    return filtered;
  }

  private applyDeliveryFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.coDelivery) {
      filtered = filtered.filter(supplier =>
        supplier.deliveryOptions.includes('co-delivery')
      );
    }

    if (this.selectedFilters.freeShipping) {
      filtered = filtered.filter(supplier =>
        supplier.deliveryOptions.includes('free-shipping')
      );
    }

    return filtered;
  }

  private applySpecialFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.campaigns) {
      filtered = filtered.filter(supplier => supplier.hasCampaigns);
    }

    if (this.selectedFilters.newProducts) {
      filtered = filtered.filter(supplier => supplier.hasNewProducts);
    }

    return filtered;
  }
}