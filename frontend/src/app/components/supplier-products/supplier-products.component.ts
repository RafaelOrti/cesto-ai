import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  ean: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  sales: number;
  revenue: number;
  rating: number;
  reviews: number;
}

interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ProductFilter {
  search: string;
  category: string;
  status: string;
  stock: string;
  priceRange: {
    min: number;
    max: number;
  };
}

@Component({
  selector: 'app-supplier-products',
  templateUrl: './supplier-products.component.html',
  styleUrls: ['./supplier-products.component.scss']
})
export class SupplierProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: any = null;
  isLoading = false;
  
  // Products Data
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Forms
  productForm: FormGroup;
  showProductModal = false;
  editingProduct: Product | null = null;
  
  // Filters
  filters: ProductFilter = {
    search: '',
    category: 'all',
    status: 'all',
    stock: 'all',
    priceRange: { min: 0, max: 10000 }
  };
  
  // Categories
  categories: ProductCategory[] = [
    { id: 'dairy', name: 'Lácteos', icon: 'milk', color: '#4CAF50' },
    { id: 'bakery', name: 'Panadería', icon: 'bread', color: '#8BC34A' },
    { id: 'beverages', name: 'Bebidas', icon: 'coffee', color: '#4CAF50' },
    { id: 'meat', name: 'Carnes', icon: 'meat', color: '#2E7D32' },
    { id: 'vegetables', name: 'Verduras', icon: 'carrot', color: '#8BC34A' },
    { id: 'fruits', name: 'Frutas', icon: 'apple', color: '#66BB6A' },
    { id: 'frozen', name: 'Congelados', icon: 'snowflake', color: '#4CAF50' },
    { id: 'pantry', name: 'Despensa', icon: 'jar', color: '#757575' }
  ];
  
  // Status Options
  statusOptions = [
    { value: 'active', label: 'Activo', color: '#4CAF50' },
    { value: 'inactive', label: 'Inactivo', color: '#9E9E9E' },
    { value: 'draft', label: 'Borrador', color: '#FF9800' }
  ];
  
  // Stock Options
  stockOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'in-stock', label: 'En Stock' },
    { value: 'low-stock', label: 'Stock Bajo' },
    { value: 'out-of-stock', label: 'Sin Stock' }
  ];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  
  // Statistics
  stats = {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalRevenue: 0,
    averagePrice: 0
  };
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initializeForm();
  }
  
  ngOnInit(): void {
    this.loadUserData();
    this.loadProducts();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          console.log('[SUPPLIER-PRODUCTS] User loaded:', user);
        }
      });
  }
  
  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      ean: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, [Validators.required, Validators.min(0)]],
      maxStock: [1000, [Validators.required, Validators.min(1)]],
      unit: ['pcs', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      length: [0, [Validators.required, Validators.min(0)]],
      width: [0, [Validators.required, Validators.min(0)]],
      height: [0, [Validators.required, Validators.min(0)]],
      status: ['draft', Validators.required],
      tags: ['']
    });
  }
  
  private loadProducts(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.products = this.getMockProducts();
      this.applyFilters();
      this.calculateStats();
      this.isLoading = false;
    }, 1000);
  }
  
  private getMockProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Leche Orgánica 1L',
        description: 'Leche orgánica fresca de vacas alimentadas con pasto natural',
        sku: 'LEO-001',
        ean: '1234567890123',
        category: 'dairy',
        price: 2.50,
        cost: 1.80,
        stock: 45,
        minStock: 20,
        maxStock: 200,
        unit: 'pcs',
        weight: 1.0,
        dimensions: { length: 10, width: 6, height: 20 },
        images: ['assets/images/products/milk.png'],
        status: 'active',
        tags: ['orgánico', 'fresco', 'lácteos'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        sales: 156,
        revenue: 390.00,
        rating: 4.8,
        reviews: 23
      },
      {
        id: '2',
        name: 'Pan Integral Artesanal',
        description: 'Pan integral hecho a mano con harina de trigo integral',
        sku: 'PAN-002',
        ean: '1234567890124',
        category: 'bakery',
        price: 3.20,
        cost: 2.10,
        stock: 23,
        minStock: 15,
        maxStock: 100,
        unit: 'pcs',
        weight: 0.5,
        dimensions: { length: 25, width: 12, height: 8 },
        images: ['assets/images/products/bread.png'],
        status: 'active',
        tags: ['integral', 'artesanal', 'panadería'],
        createdAt: '2024-01-02',
        updatedAt: '2024-01-14',
        sales: 98,
        revenue: 313.60,
        rating: 4.6,
        reviews: 18
      },
      {
        id: '3',
        name: 'Huevos Frescos de Campo',
        description: 'Huevos frescos de gallinas criadas en libertad',
        sku: 'HUE-003',
        ean: '1234567890125',
        category: 'dairy',
        price: 4.50,
        cost: 3.20,
        stock: 67,
        minStock: 30,
        maxStock: 150,
        unit: 'dozen',
        weight: 0.7,
        dimensions: { length: 20, width: 15, height: 8 },
        images: ['assets/images/products/eggs.png'],
        status: 'active',
        tags: ['fresco', 'campo', 'huevos'],
        createdAt: '2024-01-03',
        updatedAt: '2024-01-13',
        sales: 87,
        revenue: 391.50,
        rating: 4.9,
        reviews: 31
      },
      {
        id: '4',
        name: 'Aceite de Oliva Extra Virgen',
        description: 'Aceite de oliva extra virgen de primera prensada en frío',
        sku: 'ACE-004',
        ean: '1234567890126',
        category: 'pantry',
        price: 8.90,
        cost: 6.50,
        stock: 12,
        minStock: 10,
        maxStock: 50,
        unit: 'bottles',
        weight: 0.75,
        dimensions: { length: 8, width: 8, height: 25 },
        images: ['assets/images/products/olive-oil.png'],
        status: 'active',
        tags: ['extra virgen', 'prensada en frío', 'aceite'],
        createdAt: '2024-01-04',
        updatedAt: '2024-01-12',
        sales: 45,
        revenue: 400.50,
        rating: 4.7,
        reviews: 15
      },
      {
        id: '5',
        name: 'Tomates Frescos',
        description: 'Tomates frescos de invernadero ecológico',
        sku: 'TOM-005',
        ean: '1234567890127',
        category: 'vegetables',
        price: 3.50,
        cost: 2.20,
        stock: 0,
        minStock: 20,
        maxStock: 100,
        unit: 'kg',
        weight: 1.0,
        dimensions: { length: 30, width: 20, height: 15 },
        images: ['assets/images/products/tomatoes.png'],
        status: 'inactive',
        tags: ['fresco', 'ecológico', 'tomates'],
        createdAt: '2024-01-05',
        updatedAt: '2024-01-11',
        sales: 0,
        revenue: 0,
        rating: 0,
        reviews: 0
      }
    ];
  }
  
  private applyFilters(): void {
    let filtered = [...this.products];
    
    // Search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.ean.includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Category filter
    if (this.filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === this.filters.category);
    }
    
    // Status filter
    if (this.filters.status !== 'all') {
      filtered = filtered.filter(product => product.status === this.filters.status);
    }
    
    // Stock filter
    switch (this.filters.stock) {
      case 'in-stock':
        filtered = filtered.filter(product => product.stock > 0);
        break;
      case 'low-stock':
        filtered = filtered.filter(product => product.stock > 0 && product.stock <= product.minStock);
        break;
      case 'out-of-stock':
        filtered = filtered.filter(product => product.stock === 0);
        break;
    }
    
    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= this.filters.priceRange.min && 
      product.price <= this.filters.priceRange.max
    );
    
    this.filteredProducts = filtered;
    this.totalItems = filtered.length;
  }
  
  private calculateStats(): void {
    this.stats = {
      totalProducts: this.products.length,
      activeProducts: this.products.filter(p => p.status === 'active').length,
      lowStockProducts: this.products.filter(p => p.stock > 0 && p.stock <= p.minStock).length,
      outOfStockProducts: this.products.filter(p => p.stock === 0).length,
      totalRevenue: this.products.reduce((sum, p) => sum + p.revenue, 0),
      averagePrice: this.products.length > 0 ? this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length : 0
    };
  }
  
  // Event Handlers
  onSearchChange(): void {
    this.applyFilters();
    this.currentPage = 1;
  }
  
  onFilterChange(): void {
    this.applyFilters();
    this.currentPage = 1;
  }
  
  onAddProduct(): void {
    this.editingProduct = null;
    this.productForm.reset();
    this.productForm.patchValue({
      status: 'draft',
      unit: 'pcs',
      minStock: 0,
      maxStock: 1000
    });
    this.showProductModal = true;
  }
  
  onEditProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      ...product,
      length: product.dimensions.length,
      width: product.dimensions.width,
      height: product.dimensions.height,
      tags: product.tags.join(', ')
    });
    this.showProductModal = true;
  }
  
  onDeleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`)) {
      const index = this.products.findIndex(p => p.id === product.id);
      if (index > -1) {
        this.products.splice(index, 1);
        this.applyFilters();
        this.calculateStats();
      }
    }
  }
  
  onSaveProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const productData: Product = {
        id: this.editingProduct?.id || Date.now().toString(),
        name: formValue.name,
        description: formValue.description,
        sku: formValue.sku,
        ean: formValue.ean,
        category: formValue.category,
        price: formValue.price,
        cost: formValue.cost,
        stock: formValue.stock,
        minStock: formValue.minStock,
        maxStock: formValue.maxStock,
        unit: formValue.unit,
        weight: formValue.weight,
        dimensions: {
          length: formValue.length,
          width: formValue.width,
          height: formValue.height
        },
        images: this.editingProduct?.images || ['assets/images/products/default.png'],
        status: formValue.status,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
        createdAt: this.editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sales: this.editingProduct?.sales || 0,
        revenue: this.editingProduct?.revenue || 0,
        rating: this.editingProduct?.rating || 0,
        reviews: this.editingProduct?.reviews || 0
      };
      
      if (this.editingProduct) {
        const index = this.products.findIndex(p => p.id === this.editingProduct!.id);
        if (index > -1) {
          this.products[index] = productData;
        }
      } else {
        this.products.unshift(productData);
      }
      
      this.applyFilters();
      this.calculateStats();
      this.showProductModal = false;
      this.editingProduct = null;
    }
  }
  
  onCancelEdit(): void {
    this.showProductModal = false;
    this.editingProduct = null;
    this.productForm.reset();
  }
  
  onToggleProductStatus(product: Product): void {
    product.status = product.status === 'active' ? 'inactive' : 'active';
    product.updatedAt = new Date().toISOString();
    this.applyFilters();
    this.calculateStats();
  }
  
  onBulkAction(action: string): void {
    const selectedProducts = this.getSelectedProducts();
    if (selectedProducts.length === 0) {
      alert('Por favor selecciona al menos un producto');
      return;
    }
    
    switch (action) {
      case 'activate':
        selectedProducts.forEach(product => {
          product.status = 'active';
          product.updatedAt = new Date().toISOString();
        });
        break;
      case 'deactivate':
        selectedProducts.forEach(product => {
          product.status = 'inactive';
          product.updatedAt = new Date().toISOString();
        });
        break;
      case 'delete':
        if (confirm(`¿Estás seguro de que quieres eliminar ${selectedProducts.length} productos?`)) {
          selectedProducts.forEach(product => {
            const index = this.products.findIndex(p => p.id === product.id);
            if (index > -1) {
              this.products.splice(index, 1);
            }
          });
        }
        break;
    }
    
    this.applyFilters();
    this.calculateStats();
  }
  
  onExportProducts(): void {
    // Implement export functionality
    console.log('Exporting products...');
  }
  
  onImportProducts(): void {
    // Implement import functionality
    console.log('Importing products...');
  }
  
  // Utility Methods
  getSelectedProducts(): Product[] {
    // This would be implemented with checkboxes in the template
    return [];
  }
  
  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }
  
  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'draft':
        return 'status-draft';
      default:
        return 'status-draft';
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'draft':
        return 'Borrador';
      default:
        return 'Borrador';
    }
  }
  
  getStockClass(stock: number, minStock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock <= minStock) return 'stock-low';
    return 'stock-normal';
  }
  
  getStockLabel(stock: number, minStock: number): string {
    if (stock === 0) return 'Sin Stock';
    if (stock <= minStock) return 'Stock Bajo';
    return 'En Stock';
  }
  
  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.icon : 'box';
  }
  
  getCategoryColor(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#9E9E9E';
  }
  
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}