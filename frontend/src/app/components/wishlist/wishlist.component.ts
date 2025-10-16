import { Component, OnInit } from '@angular/core';

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
  supplier: {
    id: string;
    name: string;
    logo: string;
  };
  pricing: {
    currentPrice: number;
    originalPrice?: number;
    unit: string;
    moq: number;
  };
  availability: {
    inStock: boolean;
    stockLevel: number;
    expectedRestock?: string;
  };
  addedDate: string;
  notes?: string;
  tags: string[];
  isOnSale: boolean;
  isNew: boolean;
  priority: 'low' | 'medium' | 'high';
  aiRecommended: boolean;
  aiConfidence?: number;
}

export interface WishlistCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
}

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'all';
  selectedPriority = 'all';
  selectedSupplier = 'all';
  sortBy = 'addedDate';
  sortOrder: 'asc' | 'desc' = 'desc';
  viewMode: 'grid' | 'list' = 'grid';
  showOnlyInStock = false;
  showOnlyOnSale = false;
  showOnlyAIRecommended = false;

  // Wishlist data
  wishlistItems: WishlistItem[] = [];
  filteredItems: WishlistItem[] = [];

  // Categories and filters
  categories: WishlistCategory[] = [];
  suppliers: { id: string; name: string }[] = [];
  priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ];

  sortOptions = [
    { value: 'addedDate', label: 'Date Added' },
    { value: 'productName', label: 'Product Name' },
    { value: 'currentPrice', label: 'Price' },
    { value: 'priority', label: 'Priority' },
    { value: 'supplier', label: 'Supplier' }
  ];

  // Loading states
  loading = false;
  processing = false;

  constructor() { }

  ngOnInit(): void {
    this.loadWishlistItems();
    this.initializeCategories();
    this.initializeSuppliers();
    this.applyFilters();
  }

  private loadWishlistItems(): void {
    this.loading = true;
    
    // Mock data - replace with actual service
    setTimeout(() => {
      this.wishlistItems = [
        {
          id: 'wish-1',
          productId: 'prod-1',
          productName: 'Fever Tree Premium Indian Tonic Water',
          description: 'Premium tonic water with natural quinine',
          image: '/assets/images/products/tonic-water.jpg',
          category: 'Beverages',
          subcategory: 'Tonic Water',
          supplier: {
            id: 'supplier-1',
            name: 'Fever Tree Beverages',
            logo: '/assets/images/suppliers/fever-tree.png'
          },
          pricing: {
            currentPrice: 28.8,
            originalPrice: 32.0,
            unit: 'PC',
            moq: 1
          },
          availability: {
            inStock: true,
            stockLevel: 150,
            expectedRestock: '2024-02-15'
          },
          addedDate: '2024-01-15',
          notes: 'Perfect for gin cocktails',
          tags: ['Premium', 'Cocktail', 'Natural'],
          isOnSale: true,
          isNew: false,
          priority: 'high',
          aiRecommended: true,
          aiConfidence: 0.92
        },
        {
          id: 'wish-2',
          productId: 'prod-2',
          productName: 'Organic Milk 330ml',
          description: 'Fresh organic milk from local farms',
          image: '/assets/images/products/milk.jpg',
          category: 'Dairy',
          subcategory: 'Milk',
          supplier: {
            id: 'supplier-2',
            name: 'Luntgårdena Mejeri',
            logo: '/assets/images/suppliers/luntgarden.png'
          },
          pricing: {
            currentPrice: 6.0,
            unit: 'PC',
            moq: 1
          },
          availability: {
            inStock: true,
            stockLevel: 200
          },
          addedDate: '2024-01-12',
          tags: ['Organic', 'Fresh', 'Local'],
          isOnSale: false,
          isNew: true,
          priority: 'medium',
          aiRecommended: false
        },
        {
          id: 'wish-3',
          productId: 'prod-3',
          productName: 'Artisan Bread Mix',
          description: 'Premium bread mix for bakery use',
          image: '/assets/images/products/bread-mix.jpg',
          category: 'Bakery',
          subcategory: 'Mixes',
          supplier: {
            id: 'supplier-3',
            name: 'Bakery Supplies Co',
            logo: '/assets/images/suppliers/bakery-supplies.png'
          },
          pricing: {
            currentPrice: 45.0,
            unit: 'KG',
            moq: 5
          },
          availability: {
            inStock: false,
            stockLevel: 0,
            expectedRestock: '2024-02-20'
          },
          addedDate: '2024-01-10',
          notes: 'Need for new bread line',
          tags: ['Artisan', 'Premium', 'Bakery'],
          isOnSale: false,
          isNew: false,
          priority: 'low',
          aiRecommended: true,
          aiConfidence: 0.78
        }
      ];

      this.loading = false;
      this.applyFilters();
    }, 500);
  }

  private initializeCategories(): void {
    this.categories = [
      { id: 'all', name: 'All Categories', count: 0, icon: 'fas fa-th' },
      { id: 'Beverages', name: 'Beverages', count: 0, icon: 'fas fa-coffee' },
      { id: 'Dairy', name: 'Dairy', count: 0, icon: 'fas fa-milk' },
      { id: 'Bakery', name: 'Bakery', count: 0, icon: 'fas fa-bread-slice' },
      { id: 'Meat', name: 'Meat', count: 0, icon: 'fas fa-drumstick-bite' },
      { id: 'Vegetables', name: 'Vegetables', count: 0, icon: 'fas fa-carrot' }
    ];
  }

  private initializeSuppliers(): void {
    this.suppliers = [
      { id: 'all', name: 'All Suppliers' },
      { id: 'supplier-1', name: 'Fever Tree Beverages' },
      { id: 'supplier-2', name: 'Luntgårdena Mejeri' },
      { id: 'supplier-3', name: 'Bakery Supplies Co' }
    ];
  }

  private updateCategoryCounts(): void {
    this.categories.forEach(category => {
      if (category.id === 'all') {
        category.count = this.wishlistItems.length;
      } else {
        category.count = this.wishlistItems.filter(item => item.category === category.id).length;
      }
    });
  }

  applyFilters(): void {
    this.updateCategoryCounts();
    
    let filtered = [...this.wishlistItems];

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    // Priority filter
    if (this.selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === this.selectedPriority);
    }

    // Supplier filter
    if (this.selectedSupplier !== 'all') {
      filtered = filtered.filter(item => item.supplier.id === this.selectedSupplier);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.supplier.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Stock filter
    if (this.showOnlyInStock) {
      filtered = filtered.filter(item => item.availability.inStock);
    }

    // Sale filter
    if (this.showOnlyOnSale) {
      filtered = filtered.filter(item => item.isOnSale);
    }

    // AI Recommended filter
    if (this.showOnlyAIRecommended) {
      filtered = filtered.filter(item => item.aiRecommended);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'productName':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'currentPrice':
          aValue = a.pricing.currentPrice;
          bValue = b.pricing.currentPrice;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'supplier':
          aValue = a.supplier.name.toLowerCase();
          bValue = b.supplier.name.toLowerCase();
          break;
        case 'addedDate':
        default:
          aValue = new Date(a.addedDate);
          bValue = new Date(b.addedDate);
          break;
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredItems = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  onSupplierChange(supplier: string): void {
    this.selectedSupplier = supplier;
    this.applyFilters();
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  onSortOrderChange(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onFilterToggle(filter: string): void {
    switch (filter) {
      case 'inStock':
        this.showOnlyInStock = !this.showOnlyInStock;
        break;
      case 'onSale':
        this.showOnlyOnSale = !this.showOnlyOnSale;
        break;
      case 'aiRecommended':
        this.showOnlyAIRecommended = !this.showOnlyAIRecommended;
        break;
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedPriority = 'all';
    this.selectedSupplier = 'all';
    this.showOnlyInStock = false;
    this.showOnlyOnSale = false;
    this.showOnlyAIRecommended = false;
    this.applyFilters();
  }

  // Item actions
  addToCart(item: WishlistItem): void {
    this.processing = true;
    console.log('Adding to cart:', item);
    
    // Simulate API call
    setTimeout(() => {
      this.processing = false;
      console.log('Added to cart successfully');
    }, 1000);
  }

  buyNow(item: WishlistItem): void {
    console.log('Buying now:', item);
    // Implement buy now logic
  }

  removeFromWishlist(item: WishlistItem): void {
    if (confirm('Remove this item from your wishlist?')) {
      this.wishlistItems = this.wishlistItems.filter(i => i.id !== item.id);
      this.applyFilters();
    }
  }

  updatePriority(item: WishlistItem, priority: 'low' | 'medium' | 'high'): void {
    item.priority = priority;
    this.applyFilters();
  }

  updateNotes(item: WishlistItem, notes: string): void {
    item.notes = notes;
  }

  moveToCart(item: WishlistItem): void {
    this.addToCart(item);
    this.removeFromWishlist(item);
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getDiscountPercentage(item: WishlistItem): number {
    if (!item.pricing.originalPrice) return 0;
    return Math.round(((item.pricing.originalPrice - item.pricing.currentPrice) / item.pricing.originalPrice) * 100);
  }

  getPriorityClass(priority: string): string {
    const classes = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return classes[priority] || 'priority-low';
  }

  getStockStatusClass(item: WishlistItem): string {
    if (!item.availability.inStock) return 'out-of-stock';
    if (item.availability.stockLevel < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockStatusText(item: WishlistItem): string {
    if (!item.availability.inStock) return 'Out of Stock';
    if (item.availability.stockLevel < 10) return 'Low Stock';
    return 'In Stock';
  }

  getDaysSinceAdded(dateString: string): number {
    const addedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - addedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedCategory !== 'all') count++;
    if (this.selectedPriority !== 'all') count++;
    if (this.selectedSupplier !== 'all') count++;
    if (this.showOnlyInStock) count++;
    if (this.showOnlyOnSale) count++;
    if (this.showOnlyAIRecommended) count++;
    if (this.searchQuery) count++;
    return count;
  }

  exportWishlist(): void {
    console.log('Exporting wishlist');
    // Implement export functionality
  }

  shareWishlist(): void {
    console.log('Sharing wishlist');
    // Implement share functionality
  }

  getNextPriority(currentPriority: string): 'low' | 'medium' | 'high' {
    const priorities = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(currentPriority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    return priorities[nextIndex] as 'low' | 'medium' | 'high';
  }
}
