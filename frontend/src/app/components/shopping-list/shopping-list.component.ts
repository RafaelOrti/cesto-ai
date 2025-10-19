import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ShoppingList, ShoppingListItem, ShoppingListType, ItemPriority, AIRecommendations } from '../../../shared/types/common.types';
import { BaseComponent } from '../../core/components/base-component';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent extends BaseComponent implements OnInit, OnDestroy {
  // Shopping Lists Management
  shoppingLists: ShoppingList[] = [];
  currentList: ShoppingList | null = null;
  showCreateForm = false;
  showAIInsights = false;
  selectedTab = 'my-lists';

  // Forms
  createListForm: FormGroup;
  addItemForm: FormGroup;

  // Filter and search
  searchQuery = '';
  selectedCategory = 'all';
  selectedPriority = 'all';
  selectedSupplier = 'all';
  isLoading = false;
  selectedType = 'all';
  selectedStatus = 'all';
  showMLPredictions = true;
  showOnlyAIRecommended = false;
  
  // AI Recommendations
  aiRecommendations: AIRecommendations | null = null;

  // Keep the old shoppingListItems for backward compatibility
  shoppingListItems: ShoppingListItem[] = [];

  // Filter options
  categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'bakery', name: 'Bakery' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'frozen', name: 'Frozen' },
    { id: 'snacks', name: 'Snacks' }
  ];

  suppliers = [
    { id: 'all', name: 'All Suppliers' },
    { id: 'dairy-farm', name: 'Dairy Farm Co.' },
    { id: 'bakery-solutions', name: 'Bakery Solutions' },
    { id: 'beverage-corp', name: 'Beverage Corp' }
  ];

  priorities = [
    { id: 'all', name: 'All Priorities' },
    { id: 'high', name: 'High Priority' },
    { id: 'medium', name: 'Medium Priority' },
    { id: 'low', name: 'Low Priority' }
  ];

  constructor(fb: FormBuilder, public i18n: I18nService) {
    super(fb);
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadShoppingLists();
    this.loadShoppingList();
    this.loadMLPredictions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Methods
  onTabChange(tab: string): void {
    this.selectedTab = tab;
  }

  onSearch(): void {
    // Implement search functionality
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

  onTypeChange(type: string): void {
    this.selectedType = type;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  onToggleMLPredictions(): void {
    this.showMLPredictions = !this.showMLPredictions;
  }

  onToggleAIRecommended(): void {
    this.showOnlyAIRecommended = !this.showOnlyAIRecommended;
  }

  onCreateList(): void {
    if (this.createListForm.valid) {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: this.createListForm.value.name,
        description: this.createListForm.value.description,
        type: this.createListForm.value.type,
        status: 'active',
        isActive: true,
        isShared: false,
        sharedWith: [],
        lastUsedDate: new Date().toISOString().split('T')[0],
        usageCount: 0,
        totalItems: 0,
        purchasedItems: 0,
        pendingItems: 0,
        estimatedTotal: 0,
        actualTotal: 0,
        items: [],
        aiRecommendations: {
          suggestedItems: [],
          priceAlerts: [],
          restockPredictions: [],
          seasonalInsights: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.shoppingLists.push(newList);
      this.currentList = newList;
      this.showCreateForm = false;
      this.createListForm.reset();
    }
  }

  onAddItem(): void {
    if (this.addItemForm.valid) {
      const newItem: ShoppingListItem = {
        id: Date.now().toString(),
        productName: this.addItemForm.value.productName,
        productImage: this.addItemForm.value.productImage || 'assets/images/products/default.png',
        category: this.addItemForm.value.category,
        supplier: this.addItemForm.value.supplier,
        quantity: this.addItemForm.value.quantity,
        unit: this.addItemForm.value.unit,
        estimatedPrice: this.addItemForm.value.estimatedPrice,
        priority: this.addItemForm.value.priority,
        aiRecommended: false,
        aiConfidence: 0,
        lastOrdered: null,
        averageConsumption: 0,
        stockLevel: 'medium'
      };

      if (this.currentList) {
        this.currentList.items.push(newItem);
        this.currentList.totalItems = this.currentList.items.length;
        this.currentList.pendingItems = this.currentList.items.filter(item => !item.purchased).length;
        this.currentList.estimatedTotal = this.currentList.items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
      }

      this.addItemForm.reset();
    }
  }

  onSelectList(list: ShoppingList): void {
    this.currentList = list;
  }

  onEditList(list: ShoppingList): void {
    // Implement edit functionality
    console.log('Editing list:', list);
  }

  onDeleteList(list: ShoppingList): void {
    const index = this.shoppingLists.findIndex(l => l.id === list.id);
    if (index > -1) {
      this.shoppingLists.splice(index, 1);
      if (this.currentList === list) {
        this.currentList = this.shoppingLists.length > 0 ? this.shoppingLists[0] : null;
      }
    }
  }

  onShareList(list: ShoppingList): void {
    // Implement share functionality
    console.log('Sharing list:', list);
  }

  onDuplicateList(list: ShoppingList): void {
    const duplicatedList: ShoppingList = {
      ...list,
      id: Date.now().toString(),
      name: `${list.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      purchasedItems: 0,
      pendingItems: list.items.length,
      actualTotal: 0
    };

    this.shoppingLists.push(duplicatedList);
  }

  onToggleItemPurchased(item: ShoppingListItem): void {
    item.purchased = !item.purchased;
    if (this.currentList) {
      this.currentList.purchasedItems = this.currentList.items.filter(i => i.purchased).length;
      this.currentList.pendingItems = this.currentList.items.filter(i => !i.purchased).length;
    }
  }

  onEditItem(item: ShoppingListItem): void {
    // Implement edit item functionality
    console.log('Editing item:', item);
  }

  onDeleteItem(item: ShoppingListItem): void {
    if (this.currentList) {
      const index = this.currentList.items.findIndex(i => i.id === item.id);
      if (index > -1) {
        this.currentList.items.splice(index, 1);
        this.currentList.totalItems = this.currentList.items.length;
        this.currentList.purchasedItems = this.currentList.items.filter(i => i.purchased).length;
        this.currentList.pendingItems = this.currentList.items.filter(i => !i.purchased).length;
        this.currentList.estimatedTotal = this.currentList.items.reduce((sum, i) => sum + (i.estimatedPrice * i.quantity), 0);
      }
    }
  }

  onMoveItem(item: ShoppingListItem, direction: 'up' | 'down'): void {
    if (this.currentList) {
      const index = this.currentList.items.findIndex(i => i.id === item.id);
      if (index > -1) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < this.currentList.items.length) {
          const temp = this.currentList.items[index];
          this.currentList.items[index] = this.currentList.items[newIndex];
          this.currentList.items[newIndex] = temp;
        }
      }
    }
  }

  onExportList(list: ShoppingList): void {
    // Implement export functionality
    console.log('Exporting list:', list);
  }

  onImportList(): void {
    // Implement import functionality
    console.log('Importing list');
  }

  onPrintList(list: ShoppingList): void {
    // Implement print functionality
    console.log('Printing list:', list);
  }

  onSendToSupplier(list: ShoppingList): void {
    // Implement send to supplier functionality
    console.log('Sending list to supplier:', list);
  }

  onGenerateOrder(list: ShoppingList): void {
    // Implement generate order functionality
    console.log('Generating order from list:', list);
  }

  onViewAIInsights(): void {
    this.showAIInsights = !this.showAIInsights;
  }

  onRefreshRecommendations(): void {
    this.loadMLPredictions();
  }

  onApplyRecommendation(recommendation: any): void {
    // Implement apply recommendation functionality
    console.log('Applying recommendation:', recommendation);
  }

  onDismissRecommendation(recommendation: any): void {
    // Implement dismiss recommendation functionality
    console.log('Dismissing recommendation:', recommendation);
  }

  // Private methods
  private initializeForms(): void {
    this.createListForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: [ShoppingListType.REGULAR, Validators.required]
    });

    this.addItemForm = this.fb.group({
      productName: ['', Validators.required],
      productImage: [''],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit: ['pcs', Validators.required],
      estimatedPrice: [0, [Validators.required, Validators.min(0)]],
      priority: [ItemPriority.MEDIUM, Validators.required]
    });
  }

  private loadShoppingLists(): void {
    // Mock data - replace with actual API call
    this.shoppingLists = [
      {
        id: '1',
        name: 'Weekly Groceries',
        description: 'Weekly grocery shopping list',
        type: ShoppingListType.REGULAR,
        status: 'active',
        isActive: true,
        isShared: false,
        sharedWith: [],
        lastUsedDate: '2024-01-01',
        usageCount: 0,
        totalItems: this.shoppingListItems.length,
        purchasedItems: 0,
        pendingItems: this.shoppingListItems.length,
        estimatedTotal: 1920.00,
        actualTotal: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        items: this.shoppingListItems,
        aiRecommendations: {
          suggestedItems: [],
          priceAlerts: [],
          restockPredictions: [],
          seasonalInsights: []
        }
      }
    ];
  }

  private loadShoppingList(): void {
    if (this.shoppingLists.length > 0) {
      this.currentList = this.shoppingLists[0];
    }
  }

  private loadMLPredictions(): void {
    // Mock AI recommendations
    this.aiRecommendations = {
      suggestedItems: [
        {
          name: 'Organic Milk',
          reason: 'Based on your consumption patterns',
          confidence: 0.85
        },
        {
          name: 'Fresh Bread',
          reason: 'Frequently ordered item',
          confidence: 0.92
        }
      ],
      priceAlerts: [
        {
          item: 'Chicken Breast',
          oldPrice: 15.99,
          newPrice: 12.99,
          savings: 3.00
        }
      ],
      restockPredictions: [
        {
          item: 'Rice',
          predictedDate: '2024-01-25',
          confidence: 0.78
        }
      ],
      seasonalInsights: [
        {
          insight: 'Winter vegetables are in season',
          recommendation: 'Consider adding seasonal produce'
        }
      ]
    };
  }

  // Utility methods
  getFilteredItems(): ShoppingListItem[] {
    if (!this.currentList) return [];

    let items = this.currentList.items;

    if (this.searchQuery) {
      items = items.filter(item => 
        item.productName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'all') {
      items = items.filter(item => item.category === this.selectedCategory);
    }

    if (this.selectedPriority !== 'all') {
      items = items.filter(item => item.priority === this.selectedPriority);
    }

    if (this.selectedSupplier !== 'all') {
      items = items.filter(item => item.supplier === this.selectedSupplier);
    }

    if (this.showOnlyAIRecommended) {
      items = items.filter(item => item.aiRecommended);
    }

    return items;
  }

  getTotalValue(): number {
    if (!this.currentList) return 0;
    return this.currentList.items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
  }

  getPurchasedValue(): number {
    if (!this.currentList) return 0;
    return this.currentList.items
      .filter(item => item.purchased)
      .reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
  }

  getPendingValue(): number {
    if (!this.currentList) return 0;
    return this.currentList.items
      .filter(item => !item.purchased)
      .reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0);
  }

  getCompletionPercentage(): number {
    if (!this.currentList || this.currentList.totalItems === 0) return 0;
    return Math.round((this.currentList.purchasedItems / this.currentList.totalItems) * 100);
  }

  getPriorityClass(priority: ItemPriority): string {
    switch (priority) {
      case ItemPriority.HIGH:
        return 'priority-high';
      case ItemPriority.MEDIUM:
        return 'priority-medium';
      case ItemPriority.LOW:
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  }

  getStockLevelClass(stockLevel: string): string {
    switch (stockLevel) {
      case 'low':
        return 'stock-low';
      case 'medium':
        return 'stock-medium';
      case 'high':
        return 'stock-high';
      default:
        return 'stock-medium';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  // Event handlers for template
  onItemClick(item: ShoppingListItem): void {
    console.log('Item clicked:', item);
  }

  onListClick(list: ShoppingList): void {
    console.log('List clicked:', list);
  }

  onToggleFavorite(item: ShoppingListItem): void {
    // Implement favorite toggle
    console.log('Toggling favorite for item:', item);
  }

  onAddToCart(item: ShoppingListItem): void {
    // Implement add to cart
    console.log('Adding to cart:', item);
  }

  onViewDetails(item: ShoppingListItem): void {
    // Implement view details
    console.log('Viewing details for:', item);
  }

  onUpdateItem(item: ShoppingListItem): void {
    // Implement update item
    console.log('Updating item:', item);
  }
}