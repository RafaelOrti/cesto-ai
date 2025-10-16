import { Component, OnInit } from '@angular/core';

interface InventoryItem {
  id: string;
  productName: string;
  productImage: string;
  category: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  lastRestocked: string;
  nextRestockDate: string;
  aiPrediction: {
    recommendedStock: number;
    confidence: number;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
  };
  stockAlerts: StockAlert[];
}

interface StockAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'overstock';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  date: string;
  actionRequired: boolean;
}

interface AIInsight {
  id: string;
  type: 'optimization' | 'prediction' | 'alert';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionItems: string[];
  estimatedSavings?: number;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'all';
  selectedSupplier = 'all';
  selectedAlertLevel = 'all';
  showAIInsights = true;
  showOnlyAlerts = false;

  // Sample inventory data
  inventoryItems: InventoryItem[] = [
    {
      id: '1',
      productName: 'Fever Tree Premium Indian Tonic Water',
      productImage: 'assets/images/products/tonic-water.png',
      category: 'Beverages',
      supplier: 'Fever Tree Beverages',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      unit: 'PC',
      unitCost: 28.8,
      totalValue: 144.0,
      lastRestocked: '2024-01-15',
      nextRestockDate: '2024-01-22',
      aiPrediction: {
        recommendedStock: 15,
        confidence: 0.85,
        reason: 'High demand predicted for weekend, current stock insufficient',
        urgency: 'high'
      },
      stockAlerts: [
        {
          id: '1',
          type: 'low_stock',
          severity: 'high',
          message: 'Stock below minimum level',
          date: '2024-01-20',
          actionRequired: true
        }
      ]
    },
    {
      id: '2',
      productName: 'Organic Milk 330ml',
      productImage: 'assets/images/products/milk.png',
      category: 'Dairy',
      supplier: 'Luntgårdena Mejeri',
      currentStock: 3,
      minStock: 8,
      maxStock: 30,
      unit: 'st',
      unitCost: 6.0,
      totalValue: 18.0,
      lastRestocked: '2024-01-12',
      nextRestockDate: '2024-01-21',
      aiPrediction: {
        recommendedStock: 12,
        confidence: 0.92,
        reason: 'Essential item with seasonal demand increase',
        urgency: 'high'
      },
      stockAlerts: [
        {
          id: '2',
          type: 'low_stock',
          severity: 'critical',
          message: 'Critical stock level - restock immediately',
          date: '2024-01-20',
          actionRequired: true
        },
        {
          id: '3',
          type: 'expiring_soon',
          severity: 'medium',
          message: '5 units expiring in 3 days',
          date: '2024-01-18',
          actionRequired: true
        }
      ]
    },
    {
      id: '3',
      productName: 'Non-Alcoholic Origin',
      productImage: 'assets/images/products/non-alcoholic.png',
      category: 'Beverages',
      supplier: 'TT Beverage Supplier',
      currentStock: 45,
      minStock: 20,
      maxStock: 60,
      unit: 'st',
      unitCost: 8.5,
      totalValue: 382.5,
      lastRestocked: '2024-01-10',
      nextRestockDate: '2024-01-28',
      aiPrediction: {
        recommendedStock: 35,
        confidence: 0.65,
        reason: 'Stable demand pattern, current stock adequate',
        urgency: 'low'
      },
      stockAlerts: []
    },
    {
      id: '4',
      productName: 'Fuzn Slim All White',
      productImage: 'assets/images/products/snus.png',
      category: 'Tobacco',
      supplier: 'General Snus Supplier',
      currentStock: 180,
      minStock: 150,
      maxStock: 400,
      unit: 'st',
      unitCost: 15.0,
      totalValue: 2700.0,
      lastRestocked: '2024-01-08',
      nextRestockDate: '2024-01-25',
      aiPrediction: {
        recommendedStock: 250,
        confidence: 0.78,
        reason: 'Regular consumption pattern suggests moderate restock',
        urgency: 'medium'
      },
      stockAlerts: []
    }
  ];

  // AI Insights
  aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'optimization',
      title: 'Inventory Optimization Opportunity',
      description: 'Reduce overstock of Non-Alcoholic Origin by 10 units to optimize cash flow',
      impact: 'positive',
      confidence: 0.82,
      actionItems: [
        'Reduce next order quantity by 10 units',
        'Monitor demand patterns for 2 weeks',
        'Consider promotional pricing'
      ],
      estimatedSavings: 85.0
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Demand Surge Prediction',
      description: 'AI predicts 25% increase in beverage demand for next weekend',
      impact: 'neutral',
      confidence: 0.88,
      actionItems: [
        'Increase stock of popular beverages',
        'Prepare for higher order volume',
        'Notify suppliers of potential increase'
      ]
    },
    {
      id: '3',
      type: 'alert',
      title: 'Critical Stock Alert',
      description: '2 products below minimum stock levels require immediate attention',
      impact: 'negative',
      confidence: 0.95,
      actionItems: [
        'Place emergency orders for low stock items',
        'Contact suppliers for expedited delivery',
        'Consider alternative suppliers'
      ]
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

  alertLevels = [
    { id: 'all', name: 'All Alerts' },
    { id: 'critical', name: 'Critical' },
    { id: 'high', name: 'High' },
    { id: 'medium', name: 'Medium' },
    { id: 'low', name: 'Low' }
  ];

  get filteredItems(): InventoryItem[] {
    let filtered = this.inventoryItems;

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === this.selectedCategory
      );
    }

    // Supplier filter
    if (this.selectedSupplier !== 'all') {
      filtered = filtered.filter(item => 
        item.supplier.toLowerCase().replace(/\s+/g, '-') === this.selectedSupplier
      );
    }

    // Alert level filter
    if (this.selectedAlertLevel !== 'all') {
      filtered = filtered.filter(item => 
        item.stockAlerts.some(alert => alert.severity === this.selectedAlertLevel)
      );
    }

    // Show only alerts filter
    if (this.showOnlyAlerts) {
      filtered = filtered.filter(item => item.stockAlerts.length > 0);
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

  get totalInventoryValue(): number {
    return this.filteredItems.reduce((total, item) => total + item.totalValue, 0);
  }

  get criticalAlertsCount(): number {
    return this.inventoryItems.reduce((count, item) => 
      count + item.stockAlerts.filter(alert => alert.severity === 'critical').length, 0
    );
  }

  get lowStockCount(): number {
    return this.inventoryItems.filter(item => item.currentStock < item.minStock).length;
  }

  ngOnInit(): void {
    this.loadInventory();
    this.loadAIInsights();
  }

  onSearch(): void {
    // Search functionality is handled by getter
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onSupplierChange(supplier: string): void {
    this.selectedSupplier = supplier;
  }

  onAlertLevelChange(level: string): void {
    this.selectedAlertLevel = level;
  }

  toggleAIInsights(): void {
    this.showAIInsights = !this.showAIInsights;
  }

  toggleOnlyAlerts(): void {
    this.showOnlyAlerts = !this.showOnlyAlerts;
  }

  updateStock(item: InventoryItem, newStock: number): void {
    if (newStock >= 0) {
      item.currentStock = newStock;
      item.totalValue = item.currentStock * item.unitCost;
      this.updateStockAlerts(item);
    }
  }

  addToShoppingList(item: InventoryItem): void {
    // Add item to shopping list for restocking
    console.log('Adding to shopping list:', item);
  }

  autoRestock(item: InventoryItem): void {
    // Use AI recommendation for automatic restocking
    const recommendedQuantity = item.aiPrediction.recommendedStock - item.currentStock;
    if (recommendedQuantity > 0) {
      item.currentStock += recommendedQuantity;
      item.totalValue = item.currentStock * item.unitCost;
      item.nextRestockDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      this.updateStockAlerts(item);
      console.log('Auto restocked:', item.productName, 'Quantity:', recommendedQuantity);
    }
  }

  dismissAlert(alert: StockAlert): void {
    // Find and remove the alert
    this.inventoryItems.forEach(item => {
      const index = item.stockAlerts.indexOf(alert);
      if (index > -1) {
        item.stockAlerts.splice(index, 1);
      }
    });
  }

  viewProductDetails(item: InventoryItem): void {
    // Navigate to product details
    console.log('View product details:', item.id);
  }

  getStockLevelClass(item: InventoryItem): string {
    const ratio = item.currentStock / item.minStock;
    if (ratio <= 0.5) return 'stock-critical';
    if (ratio <= 1.0) return 'stock-low';
    if (ratio <= 1.5) return 'stock-medium';
    return 'stock-high';
  }

  getAlertSeverityClass(severity: string): string {
    const classes: { [key: string]: string } = {
      'critical': 'alert-critical',
      'high': 'alert-high',
      'medium': 'alert-medium',
      'low': 'alert-low'
    };
    return classes[severity] || 'alert-low';
  }

  getInsightImpactClass(impact: string): string {
    const classes: { [key: string]: string } = {
      'positive': 'insight-positive',
      'negative': 'insight-negative',
      'neutral': 'insight-neutral'
    };
    return classes[impact] || 'insight-neutral';
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

  private updateStockAlerts(item: InventoryItem): void {
    // Clear existing alerts
    item.stockAlerts = [];

    // Check for low stock
    if (item.currentStock <= item.minStock) {
      const severity = item.currentStock === 0 ? 'critical' : 'high';
      item.stockAlerts.push({
        id: `${item.id}-low-stock`,
        type: 'low_stock',
        severity: severity,
        message: item.currentStock === 0 ? 'Out of stock' : 'Stock below minimum level',
        date: new Date().toISOString().split('T')[0],
        actionRequired: true
      });
    }

    // Check for overstock
    if (item.currentStock > item.maxStock) {
      item.stockAlerts.push({
        id: `${item.id}-overstock`,
        type: 'overstock',
        severity: 'medium',
        message: 'Stock above maximum level',
        date: new Date().toISOString().split('T')[0],
        actionRequired: true
      });
    }
  }

  private loadInventory(): void {
    // Load inventory from API
  }

  private loadAIInsights(): void {
    // Load AI insights from AI service
  }
}
