import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

export interface EANProduct {
  id: string;
  eanCode: string;
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  currency: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-ean',
  templateUrl: './ean.component.html',
  styleUrls: ['./ean.component.scss']
})
export class EANComponent implements OnInit {
  selectedTab = 'products';
  searchQuery = '';
  selectedCategory = 'all';
  selectedStatus = 'all';
  showCreateForm = false;
  showBulkImport = false;
  isLoading = false;

  // EAN Products
  eanProducts: EANProduct[] = [
    {
      id: '1',
      eanCode: '1234567890123',
      productName: 'Leche Orgánica 1L',
      category: 'Lácteos',
      brand: 'Granja Láctea Co.',
      description: 'Leche orgánica fresca de vaca',
      price: 20.00,
      currency: 'EUR',
      weight: 1.0,
      dimensions: { length: 10, width: 6, height: 20 },
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      eanCode: '2345678901234',
      productName: 'Pan Integral 500g',
      category: 'Panadería',
      brand: 'Panadería Artesanal',
      description: 'Pan integral artesanal',
      price: 3.50,
      currency: 'EUR',
      weight: 0.5,
      dimensions: { length: 20, width: 10, height: 8 },
      status: 'active',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
    {
      id: '3',
      eanCode: '3456789012345',
      productName: 'Aceite de Oliva Extra Virgen',
      category: 'Aceites',
      brand: 'Aceites Premium',
      description: 'Aceite de oliva extra virgen primera prensión',
      price: 15.00,
      currency: 'EUR',
      weight: 0.5,
      dimensions: { length: 8, width: 8, height: 25 },
      status: 'pending',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13'
    }
  ];

  categories = [
    { id: 'all', name: 'Todas las Categorías' },
    { id: 'lácteos', name: 'Lácteos' },
    { id: 'panadería', name: 'Panadería' },
    { id: 'aceites', name: 'Aceites' },
    { id: 'bebidas', name: 'Bebidas' },
    { id: 'carnes', name: 'Carnes' },
    { id: 'vegetales', name: 'Vegetales' }
  ];

  statusOptions = [
    { id: 'all', name: 'Todos los Estados' },
    { id: 'active', name: 'Activo' },
    { id: 'inactive', name: 'Inactivo' },
    { id: 'pending', name: 'Pendiente' }
  ];

  // EAN Generation
  eanForm = {
    productName: '',
    category: '',
    brand: '',
    description: '',
    price: 0,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 }
  };

  // Statistics
  statistics = {
    totalProducts: 0,
    activeProducts: 0,
    pendingProducts: 0,
    totalCategories: 0
  };

  constructor(public i18n: I18nService) {}

  ngOnInit(): void {
    this.loadEANData();
    this.calculateStatistics();
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
  }

  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  onCreateEAN(): void {
    this.showCreateForm = true;
  }

  onBulkImport(): void {
    this.showBulkImport = true;
  }

  onGenerateEAN(): void {
    if (this.eanForm.productName && this.eanForm.category) {
      const newEAN: EANProduct = {
        id: Date.now().toString(),
        eanCode: this.generateEANCode(),
        productName: this.eanForm.productName,
        category: this.eanForm.category,
        brand: this.eanForm.brand,
        description: this.eanForm.description,
        price: this.eanForm.price,
        currency: 'EUR',
        weight: this.eanForm.weight,
        dimensions: this.eanForm.dimensions,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      this.eanProducts.push(newEAN);
      this.showCreateForm = false;
      this.resetForm();
      this.calculateStatistics();
    }
  }

  onEditEAN(product: EANProduct): void {
    console.log('Editing EAN product:', product);
  }

  onDeleteEAN(product: EANProduct): void {
    const index = this.eanProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.eanProducts.splice(index, 1);
      this.calculateStatistics();
    }
  }

  onActivateEAN(product: EANProduct): void {
    product.status = 'active';
    product.updatedAt = new Date().toISOString().split('T')[0];
    this.calculateStatistics();
  }

  onDeactivateEAN(product: EANProduct): void {
    product.status = 'inactive';
    product.updatedAt = new Date().toISOString().split('T')[0];
    this.calculateStatistics();
  }

  onExportEAN(): void {
    console.log('Exporting EAN data...');
  }

  onPrintBarcode(product: EANProduct): void {
    console.log('Printing barcode for:', product);
  }

  onScanBarcode(): void {
    console.log('Scanning barcode...');
  }

  onValidateEAN(eanCode: string): boolean {
    // Basic EAN-13 validation
    if (eanCode.length !== 13) return false;
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(eanCode[i]) * (i % 2 === 0 ? 1 : 3);
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(eanCode[12]);
  }

  getFilteredProducts(): EANProduct[] {
    let products = this.eanProducts;

    if (this.searchQuery) {
      products = products.filter(p => 
        p.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.eanCode.includes(this.searchQuery) ||
        p.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === this.selectedCategory);
    }

    if (this.selectedStatus !== 'all') {
      products = products.filter(p => p.status === this.selectedStatus);
    }

    return products;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
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

  private loadEANData(): void {
    // Load EAN data from service
    console.log('Loading EAN data...');
  }

  private calculateStatistics(): void {
    this.statistics.totalProducts = this.eanProducts.length;
    this.statistics.activeProducts = this.eanProducts.filter(p => p.status === 'active').length;
    this.statistics.pendingProducts = this.eanProducts.filter(p => p.status === 'pending').length;
    this.statistics.totalCategories = new Set(this.eanProducts.map(p => p.category)).size;
  }

  private generateEANCode(): string {
    // Generate a random EAN-13 code (simplified)
    let ean = '';
    for (let i = 0; i < 12; i++) {
      ean += Math.floor(Math.random() * 10);
    }
    
    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(ean[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return ean + checkDigit;
  }

  private resetForm(): void {
    this.eanForm = {
      productName: '',
      category: '',
      brand: '',
      description: '',
      price: 0,
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 }
    };
  }
}

