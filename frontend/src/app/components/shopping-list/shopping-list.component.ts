import { Component, OnInit } from '@angular/core';

interface ShoppingListItem {
  id: string;
  productName: string;
  productImage: string;
  category: string;
  supplier: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  priority: 'low' | 'medium' | 'high';
  aiRecommended: boolean;
  aiConfidence: number;
  lastOrdered?: string;
  averageConsumption: number;
  stockLevel: 'low' | 'medium' | 'high' | 'out';
  notes?: string;
}

interface MLPrediction {
  productId: string;
  recommendedQuantity: number;
  confidence: number;
  reason: string;
  restockDate: string;
  urgency: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'all';
  selectedPriority = 'all';
  selectedSupplier = 'all';
  showMLPredictions = true;
  showOnlyAIRecommended = false;

  // Sample shopping list data
  shoppingListItems: ShoppingListItem[] = [
    {
      id: '1',
      productName: 'Fever Tree Premium Indian Tonic Water',
      productImage: 'assets/images/products/tonic-water.png',
      category: 'Beverages',
      supplier: 'Fever Tree Beverages',
      quantity: 8,
      unit: 'PC',
      estimatedPrice: 230.40,
      priority: 'high',
      aiRecommended: true,
      aiConfidence: 0.85,
      lastOrdered: '2024-01-15',
      averageConsumption: 6.5,
      stockLevel: 'low',
      notes: 'Popular item, restock before weekend'
    },
    {
      id: '2',
      productName: 'Organic Milk 330ml',
      productImage: 'assets/images/products/milk.png',
      category: 'Dairy',
      supplier: 'Luntgårdena Mejeri',
      quantity: 12,
      unit: 'st',
      estimatedPrice: 72.00,
      priority: 'high',
      aiRecommended: true,
      aiConfidence: 0.92,
      lastOrdered: '2024-01-12',
      averageConsumption: 10.2,
      stockLevel: 'low',
      notes: 'Essential item, AI predicts high demand'
    },
    {
      id: '3',
      productName: 'Non-Alcoholic Origin',
      productImage: 'assets/images/products/non-alcoholic.png',
      category: 'Beverages',
      supplier: 'TT Beverage Supplier',
      quantity: 24,
      unit: 'st',
      estimatedPrice: 204.00,
      priority: 'medium',
      aiRecommended: false,
      aiConfidence: 0.45,
      lastOrdered: '2024-01-10',
      averageConsumption: 18.0,
      stockLevel: 'medium'
    },
    {
      id: '4',
      productName: 'Fuzn Slim All White',
      productImage: 'assets/images/products/snus.png',
      category: 'Tobacco',
      supplier: 'General Snus Supplier',
      quantity: 240,
      unit: 'st',
      estimatedPrice: 3600.00,
      priority: 'medium',
      aiRecommended: true,
      aiConfidence: 0.78,
      lastOrdered: '2024-01-08',
      averageConsumption: 200.0,
      stockLevel: 'low'
    }
  ];

  // ML Predictions
  mlPredictions: MLPrediction[] = [
    {
      productId: '1',
      recommendedQuantity: 10,
      confidence: 0.85,
      reason: 'High demand predicted for weekend, current stock insufficient',
      restockDate: '2024-01-22',
      urgency: 'high'
    },
    {
      productId: '2',
      recommendedQuantity: 15,
      confidence: 0.92,
      reason: 'Seasonal increase in dairy consumption',
      restockDate: '2024-01-21',
      urgency: 'high'
    },
    {
      productId: '4',
      recommendedQuantity: 300,
      confidence: 0.78,
      reason: 'Regular consumption pattern suggests higher order',
      restockDate: '2024-01-25',
      urgency: 'medium'
    }
  ];

  categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'tobacco', name: 'Tobacco' },
    { id: 'snacks', name: 'Snacks' }
  ];

  suppliers = [
    { id: 'all', name: 'All Suppliers' },
    { id: 'fever-tree', name: 'Fever Tree Beverages' },
    { id: 'luntgarden', name: 'Luntgårdena Mejeri' },
    { id: 'tt-beverage', name: 'TT Beverage Supplier' },
    { id: 'general-snus', name: 'General Snus Supplier' }
  ];

  priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ];

  get filteredItems(): ShoppingListItem[] {
    let filtered = this.shoppingListItems;

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === this.selectedCategory
      );
    }

    // Priority filter
    if (this.selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === this.selectedPriority);
    }

    // Supplier filter
    if (this.selectedSupplier !== 'all') {
      filtered = filtered.filter(item => 
        item.supplier.toLowerCase().replace(/\s+/g, '-') === this.selectedSupplier
      );
    }

    // AI Recommended filter
    if (this.showOnlyAIRecommended) {
      filtered = filtered.filter(item => item.aiRecommended);
    }

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  get totalEstimatedCost(): number {
    return this.filteredItems.reduce((total, item) => total + item.estimatedPrice, 0);
  }

  get aiRecommendedCount(): number {
    return this.filteredItems.filter(item => item.aiRecommended).length;
  }

  ngOnInit(): void {
    this.loadShoppingList();
    this.loadMLPredictions();
  }

  onSearch(): void {
    // Search functionality is handled by getter
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onPriorityChange(priority: string): void {
    this.selectedPriority = priority;
  }

  onSupplierChange(supplier: string): void {
    this.selectedSupplier = supplier;
  }

  toggleMLPredictions(): void {
    this.showMLPredictions = !this.showMLPredictions;
  }

  toggleAIRecommended(): void {
    this.showOnlyAIRecommended = !this.showOnlyAIRecommended;
  }

  updateQuantity(item: ShoppingListItem, newQuantity: number): void {
    if (newQuantity >= 0) {
      item.quantity = newQuantity;
      item.estimatedPrice = item.estimatedPrice * (newQuantity / item.quantity);
    }
  }

  updatePriority(item: ShoppingListItem, priority: 'low' | 'medium' | 'high'): void {
    item.priority = priority;
  }

  removeItem(item: ShoppingListItem): void {
    if (confirm('Remove this item from shopping list?')) {
      const index = this.shoppingListItems.indexOf(item);
      if (index > -1) {
        this.shoppingListItems.splice(index, 1);
      }
    }
  }

  addToCart(item: ShoppingListItem): void {
    // Add item to cart
    console.log('Adding to cart:', item);
  }

  addToCheckout(item: ShoppingListItem): void {
    // Add item to checkout
    console.log('Adding to checkout:', item);
  }

  buyNow(item: ShoppingListItem): void {
    // Direct purchase
    console.log('Buying now:', item);
  }

  applyMLPrediction(item: ShoppingListItem): void {
    const prediction = this.mlPredictions.find(p => p.productId === item.id);
    if (prediction) {
      item.quantity = prediction.recommendedQuantity;
      item.aiRecommended = true;
      item.aiConfidence = prediction.confidence;
      console.log('Applied ML prediction for:', item.productName);
    }
  }

  viewProductDetails(item: ShoppingListItem): void {
    // Navigate to product details
    console.log('View product details:', item.id);
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return classes[priority] || 'priority-low';
  }

  getStockLevelClass(stockLevel: string): string {
    const classes: { [key: string]: string } = {
      'low': 'stock-low',
      'medium': 'stock-medium',
      'high': 'stock-high',
      'out': 'stock-out'
    };
    return classes[stockLevel] || 'stock-medium';
  }

  getUrgencyClass(urgency: string): string {
    const classes: { [key: string]: string } = {
      'high': 'urgency-high',
      'medium': 'urgency-medium',
      'low': 'urgency-low'
    };
    return classes[urgency] || 'urgency-low';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }

  getProductName(productId: string): string {
    const item = this.shoppingListItems.find(i => i.id === productId);
    return item ? item.productName : 'Unknown Product';
  }

  getShoppingListItem(productId: string): ShoppingListItem | undefined {
    return this.shoppingListItems.find(i => i.id === productId);
  }

  getNextPriority(currentPriority: string): 'low' | 'medium' | 'high' {
    const priorities = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(currentPriority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    return priorities[nextIndex] as 'low' | 'medium' | 'high';
  }

  private loadShoppingList(): void {
    // Load shopping list from API
  }

  private loadMLPredictions(): void {
    // Load ML predictions from AI service
  }
}
