import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-inventory',
  templateUrl: './supplier-inventory.component.html',
  styleUrls: ['./supplier-inventory.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SupplierInventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  loading = false;
  selectedCategory = 'all';
  searchTerm = '';

  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'fruits', label: 'Fruits & Vegetables' },
    { value: 'meat', label: 'Fresh Meat' },
    { value: 'frozen', label: 'Frozen' },
    { value: 'packaged', label: 'Packaged' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadInventoryItems();
  }

  loadInventoryItems(): void {
    this.loading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.inventoryItems = [
        {
          id: 1,
          name: 'Organic Milk 1L',
          category: 'dairy',
          sku: 'MILK-001',
          currentStock: 150,
          minStock: 50,
          maxStock: 300,
          unitPrice: 2.99,
          totalValue: 448.50,
          lastRestocked: '2024-01-15',
          nextRestock: '2024-01-22',
          status: 'inStock'
        },
        {
          id: 2,
          name: 'Fresh Apples (kg)',
          category: 'fruits',
          sku: 'APPL-001',
          currentStock: 25,
          minStock: 30,
          maxStock: 100,
          unitPrice: 1.99,
          totalValue: 49.75,
          lastRestocked: '2024-01-14',
          nextRestock: '2024-01-21',
          status: 'lowStock'
        },
        {
          id: 3,
          name: 'Ground Beef 500g',
          category: 'meat',
          sku: 'BEEF-001',
          currentStock: 0,
          minStock: 20,
          maxStock: 80,
          unitPrice: 8.99,
          totalValue: 0,
          lastRestocked: '2024-01-10',
          nextRestock: '2024-01-17',
          status: 'outOfStock'
        }
      ];
      this.loading = false;
    }, 1000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'inStock': return 'status-in-stock';
      case 'lowStock': return 'status-low-stock';
      case 'outOfStock': return 'status-out-of-stock';
      default: return 'status-unknown';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'inStock': return 'In Stock';
      case 'lowStock': return 'Low Stock';
      case 'outOfStock': return 'Out of Stock';
      default: return 'Unknown';
    }
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterItems();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterItems();
  }

  filterItems(): void {
    // Implement filtering logic
    // This would filter inventoryItems based on selectedCategory and searchTerm
  }

  restockItem(item: any): void {
    // Implement restock functionality
    console.log('Restocking item:', item);
  }

  adjustStock(item: any): void {
    // Implement stock adjustment functionality
    console.log('Adjusting stock for item:', item);
  }

  addNewItem(): void {
    // Implement add new item functionality
    console.log('Adding new item');
  }

  getTotalValue(): number {
    return this.inventoryItems.reduce((total, item) => total + item.totalValue, 0);
  }

  getLowStockCount(): number {
    return this.inventoryItems.filter(item => item.status === 'lowStock').length;
  }

  getOutOfStockCount(): number {
    return this.inventoryItems.filter(item => item.status === 'outOfStock').length;
  }
}
