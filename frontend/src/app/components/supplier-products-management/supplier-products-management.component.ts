import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../core/services/notification.service';
import { I18nService } from '../../core/services/i18n.service';

interface SupplierProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  sku: string;
  eanCode?: string;
  status: 'active' | 'inactive' | 'draft' | 'pending';
  images: string[];
  tags: string[];
  supplier: string;
  createdAt: string;
  updatedAt: string;
  sales: number;
  views: number;
  rating: number;
  reviews: number;
}

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  pendingProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  lowStockProducts: number;
}

interface ProductCategory {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-supplier-products-management',
  templateUrl: './supplier-products-management.component.html',
  styleUrls: ['./supplier-products-management.component.scss']
})
export class SupplierProductsManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentView = 'overview';
  searchQuery = '';
  selectedCategory = 'all';
  selectedStatus = 'all';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  productForm: FormGroup;
  isEditing = false;
  editingProduct: SupplierProduct | null = null;
  
  // Sample data
  products: SupplierProduct[] = [
    {
      id: '1',
      name: 'Premium Tonic Water',
      description: 'High-quality tonic water with natural quinine',
      category: 'beverages',
      price: 28.8,
      cost: 18.5,
      stock: 156,
      minStock: 20,
      maxStock: 500,
      sku: 'TON001',
      eanCode: '1234567890123',
      status: 'active',
      images: ['assets/images/products/tonic-water.png'],
      tags: ['premium', 'natural', 'quinine'],
      supplier: 'Premium Beverages Ltd',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      sales: 45,
      views: 234,
      rating: 4.5,
      reviews: 12
    },
    {
      id: '2',
      name: 'Organic Milk 330ml',
      description: 'Fresh organic milk from local farms',
      category: 'dairy',
      price: 6.0,
      cost: 3.8,
      stock: 89,
      minStock: 30,
      maxStock: 200,
      sku: 'MIL001',
      eanCode: '2345678901234',
      status: 'active',
      images: ['assets/images/products/milk.png'],
      tags: ['organic', 'fresh', 'local'],
      supplier: 'Green Farms Co',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      sales: 23,
      views: 156,
      rating: 4.2,
      reviews: 8
    },
    {
      id: '3',
      name: 'Artisan Bread Mix',
      description: 'Traditional bread mix for homemade bread',
      category: 'bakery',
      price: 12.5,
      cost: 7.2,
      stock: 0,
      minStock: 15,
      maxStock: 100,
      sku: 'BRE001',
      eanCode: '3456789012345',
      status: 'inactive',
      images: ['assets/images/products/bread.png'],
      tags: ['artisan', 'traditional', 'homemade'],
      supplier: 'Artisan Foods',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15',
      sales: 18,
      views: 98,
      rating: 4.0,
      reviews: 5
    }
  ];
  
  productStats: ProductStats = {
    totalProducts: 3,
    activeProducts: 2,
    draftProducts: 0,
    pendingProducts: 0,
    totalSales: 86,
    totalRevenue: 1843.5,
    averageRating: 4.23,
    lowStockProducts: 1
  };
  
  categories: ProductCategory[] = [
    { value: 'all', label: 'All Categories', icon: 'category' },
    { value: 'beverages', label: 'Beverages', icon: 'local_drink' },
    { value: 'dairy', label: 'Dairy', icon: 'local_drink' },
    { value: 'bakery', label: 'Bakery', icon: 'bakery_dining' },
    { value: 'meat', label: 'Meat & Seafood', icon: 'restaurant' },
    { value: 'produce', label: 'Fresh Produce', icon: 'eco' },
    { value: 'snacks', label: 'Snacks', icon: 'cookie' },
    { value: 'frozen', label: 'Frozen Foods', icon: 'ac_unit' }
  ];
  
  statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' }
  ];
  
  displayedColumns: string[] = ['image', 'name', 'category', 'price', 'stock', 'sales', 'rating', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public i18n: I18nService
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
      maxStock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.required, Validators.minLength(3)]],
      eanCode: ['', [Validators.pattern(/^\d{13}$/)]],
      status: ['active', [Validators.required]],
      tags: [''],
      supplier: ['', [Validators.required]]
    });
  }

  private loadProducts(): void {
    // In a real application, this would load from a service
    console.log('Loading supplier products...');
  }

  setView(view: string): void {
    this.currentView = view;
  }

  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  onCategoryChange(): void {
    // Implement category filtering
    console.log('Category changed to:', this.selectedCategory);
  }

  onStatusChange(): void {
    // Implement status filtering
    console.log('Status changed to:', this.selectedStatus);
  }

  onSortChange(): void {
    // Implement sorting
    console.log('Sorting by:', this.sortBy, this.sortOrder);
  }

  addNewProduct(): void {
    this.isEditing = false;
    this.editingProduct = null;
    this.productForm.reset({ 
      status: 'active',
      supplier: 'Your Company Name' // This would come from user profile
    });
    this.currentView = 'form';
  }

  editProduct(product: SupplierProduct): void {
    this.isEditing = true;
    this.editingProduct = product;
    this.productForm.patchValue({
      ...product,
      tags: product.tags.join(', ')
    });
    this.currentView = 'form';
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];
      
      if (this.isEditing && this.editingProduct) {
        // Update existing product
        const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...formValue,
            tags,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        this.notificationService.success('Product updated successfully');
      } else {
        // Add new product
        const newProduct: SupplierProduct = {
          id: (this.products.length + 1).toString(),
          ...formValue,
          tags,
          images: ['assets/images/products/default.png'],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          sales: 0,
          views: 0,
          rating: 0,
          reviews: 0
        };
        this.products.unshift(newProduct);
        this.notificationService.success('Product added successfully');
      }
      
      this.currentView = 'overview';
      this.updateStats();
    } else {
      this.notificationService.error('Please fill in all required fields correctly');
    }
  }

  deleteProduct(product: SupplierProduct): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products.splice(index, 1);
        this.notificationService.success('Product deleted successfully');
        this.updateStats();
      }
    }
  }

  duplicateProduct(product: SupplierProduct): void {
    const duplicatedProduct: SupplierProduct = {
      ...product,
      id: (this.products.length + 1).toString(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      sales: 0,
      views: 0,
      rating: 0,
      reviews: 0
    };
    this.products.unshift(duplicatedProduct);
    this.notificationService.success('Product duplicated successfully');
    this.updateStats();
  }

  toggleProductStatus(product: SupplierProduct): void {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index].status = newStatus;
      this.products[index].updatedAt = new Date().toISOString().split('T')[0];
      this.notificationService.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      this.updateStats();
    }
  }

  exportProducts(): void {
    // Implement product export
    console.log('Exporting products...');
    this.notificationService.info('Products exported successfully');
  }

  importProducts(): void {
    // Implement product import
    console.log('Importing products...');
    this.notificationService.info('Products imported successfully');
  }

  private updateStats(): void {
    const activeProducts = this.products.filter(p => p.status === 'active');
    const lowStockProducts = this.products.filter(p => p.stock <= p.minStock);
    
    this.productStats = {
      totalProducts: this.products.length,
      activeProducts: activeProducts.length,
      draftProducts: this.products.filter(p => p.status === 'draft').length,
      pendingProducts: this.products.filter(p => p.status === 'pending').length,
      totalSales: this.products.reduce((sum, p) => sum + p.sales, 0),
      totalRevenue: this.products.reduce((sum, p) => sum + (p.sales * p.price), 0),
      averageRating: this.products.length > 0 ? 
        this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length : 0,
      lowStockProducts: lowStockProducts.length
    };
  }

  get filteredProducts(): SupplierProduct[] {
    let filtered = this.products;
    
    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }
    
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'sales':
          comparison = a.sales - b.sales;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4caf50';
      case 'inactive': return '#2E7D32';
      case 'draft': return '#8BC34A';
      case 'pending': return '#4CAF50';
      default: return '#757575';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'draft': return 'Draft';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  }

  getCategoryIcon(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.icon : 'category';
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  getStockStatus(product: SupplierProduct): { status: string; color: string } {
    if (product.stock === 0) {
      return { status: 'Out of Stock', color: '#2E7D32' };
    } else if (product.stock <= product.minStock) {
      return { status: 'Low Stock', color: '#8BC34A' };
    } else {
      return { status: 'In Stock', color: '#4caf50' };
    }
  }
}