import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

interface Supplier {
  id: string;
  name: string;
  description: string;
  logo?: string;
  category: string;
  verified: boolean;
  freeDelivery: boolean;
  coDelivery: boolean;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  isConnected: boolean;
  requestSent: boolean;
  requestDate?: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  averageOrderValue: number;
  responseTime: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  address: string;
  deliveryAreas: string[];
  specialties: string[];
  certifications: string[];
  minimumOrder: number;
  paymentTerms: string;
  establishedYear: number;
  employeeCount: string;
  annualRevenue: string;
  languages: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-my-suppliers',
  templateUrl: './my-suppliers.component.html',
  styleUrls: ['./my-suppliers.component.scss']
})
export class MySuppliersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  categories: Category[] = [];
  loading = false;
  error: string | null = null;

  // Search and Filters
  searchTerm = '';
  selectedCategory = '';
  selectedFilters: string[] = [];
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Forms
  supplierForm: FormGroup;
  showAddModal = false;
  showEditModal = false;
  editingSupplier: Supplier | null = null;

  // Filter options
  filterOptions = [
    { key: 'freeDelivery', label: 'Envío gratis', icon: 'truck' },
    { key: 'coDelivery', label: 'Co-entrega', icon: 'users' },
    { key: 'onSale', label: 'En oferta', icon: 'percent' },
    { key: 'verified', label: 'Verificados', icon: 'check-circle' },
    { key: 'connected', label: 'Conectados', icon: 'link' },
    { key: 'highRating', label: 'Alta valoración', icon: 'star' }
  ];

  // Sort options
  sortOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoría' },
    { key: 'rating', label: 'Valoración' },
    { key: 'lastOrderDate', label: 'Último pedido' },
    { key: 'totalOrders', label: 'Total pedidos' },
    { key: 'averageOrderValue', label: 'Valor promedio' },
    { key: 'responseTime', label: 'Tiempo de respuesta' }
  ];

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.createSupplierForm();
    this.initializeData();
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createSupplierForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      website: [''],
      address: ['', Validators.required],
      minimumOrder: [0, [Validators.min(0)]],
      paymentTerms: [''],
      establishedYear: [new Date().getFullYear(), [Validators.min(1800), Validators.max(new Date().getFullYear())]],
      employeeCount: [''],
      annualRevenue: [''],
      languages: [[]],
      specialties: [[]],
      certifications: [[]],
      deliveryAreas: [[]],
      freeDelivery: [false],
      coDelivery: [false],
      onSale: [false]
    });
  }

  private initializeData(): void {
    // Initialize categories
    this.categories = [
      { id: 'dairy', name: 'Lácteos', icon: 'milk', count: 45 },
      { id: 'fruits-vegetables', name: 'Frutas y Verduras', icon: 'carrot', count: 32 },
      { id: 'delicatessen', name: 'Delicatessen, Embutidos', icon: 'sausage', count: 28 },
      { id: 'health-beauty', name: 'Salud y Belleza', icon: 'lotion', count: 15 },
      { id: 'frozen', name: 'Congelados', icon: 'snowflake', count: 22 },
      { id: 'seafood', name: 'Fresco del mar', icon: 'fish', count: 18 },
      { id: 'meat', name: 'Productos frescos envasados, Carne...', icon: 'package', count: 35 },
      { id: 'beverages', name: 'Bebidas', icon: 'bottle', count: 25 },
      { id: 'bakery', name: 'Panadería', icon: 'bread', count: 20 },
      { id: 'organic', name: 'Orgánico', icon: 'leaf', count: 12 }
    ];
  }

  private loadSuppliers(): void {
    this.loading = true;
    
    // Mock data - in real app this would come from API
    setTimeout(() => {
      this.suppliers = [
        {
          id: '1',
          name: 'Engelmanns',
          description: 'Tenemos todo para la tabla de embutidos perfecta. ¡Bienvenido a descubrir sabores fantásticos con nosotros!',
          category: 'delicatessen',
          verified: true,
          freeDelivery: true,
          coDelivery: false,
          onSale: false,
          rating: 4.8,
          reviewCount: 156,
          isConnected: true,
          requestSent: false,
          totalOrders: 45,
          averageOrderValue: 1250,
          responseTime: '2 horas',
          contactEmail: 'contacto@engelmanns.com',
          contactPhone: '+34 91 123 4567',
          website: 'www.engelmanns.com',
          address: 'Madrid, España',
          deliveryAreas: ['Madrid', 'Barcelona', 'Valencia'],
          specialties: ['Embutidos', 'Quesos', 'Vinos'],
          certifications: ['ISO 9001', 'HACCP'],
          minimumOrder: 100,
          paymentTerms: '30 días',
          establishedYear: 1985,
          employeeCount: '50-100',
          annualRevenue: '5M-10M',
          languages: ['Español', 'Inglés', 'Alemán']
        },
        {
          id: '2',
          name: 'Gastro Import',
          description: 'Tenemos más de 25 años de experiencia en la importación de especialidades gourmet de la región mediterránea que vendemos a restaurantes, tiendas de delicatessen y tiendas minoristas. La empresa fue fundada en 1988 y...',
          category: 'delicatessen',
          verified: true,
          freeDelivery: false,
          coDelivery: true,
          onSale: true,
          rating: 4.6,
          reviewCount: 89,
          isConnected: false,
          requestSent: true,
          requestDate: new Date('2024-01-15'),
          lastOrderDate: new Date('2024-01-10'),
          totalOrders: 23,
          averageOrderValue: 2100,
          responseTime: '4 horas',
          contactEmail: 'ventas@gastroimport.es',
          contactPhone: '+34 93 987 6543',
          website: 'www.gastroimport.es',
          address: 'Barcelona, España',
          deliveryAreas: ['Barcelona', 'Girona', 'Tarragona'],
          specialties: ['Productos mediterráneos', 'Aceites', 'Conservas'],
          certifications: ['ISO 9001', 'IFS'],
          minimumOrder: 200,
          paymentTerms: '15 días',
          establishedYear: 1988,
          employeeCount: '20-50',
          annualRevenue: '2M-5M',
          languages: ['Español', 'Catalán', 'Inglés']
        },
        {
          id: '3',
          name: 'Fresh Produce Co',
          description: 'Especialistas en productos frescos de temporada, cultivados localmente con los más altos estándares de calidad.',
          category: 'fruits-vegetables',
          verified: true,
          freeDelivery: true,
          coDelivery: true,
          onSale: false,
          rating: 4.9,
          reviewCount: 234,
          isConnected: true,
          requestSent: false,
          lastOrderDate: new Date('2024-01-20'),
          totalOrders: 67,
          averageOrderValue: 850,
          responseTime: '1 hora',
          contactEmail: 'pedidos@freshproduce.com',
          contactPhone: '+34 96 555 1234',
          address: 'Valencia, España',
          deliveryAreas: ['Valencia', 'Alicante', 'Castellón'],
          specialties: ['Verduras de temporada', 'Frutas locales', 'Hierbas aromáticas'],
          certifications: ['Agricultura ecológica', 'GlobalGAP'],
          minimumOrder: 50,
          paymentTerms: '7 días',
          establishedYear: 1995,
          employeeCount: '10-20',
          annualRevenue: '1M-2M',
          languages: ['Español', 'Valenciano']
        }
      ];

      this.applyFilters();
      this.loading = false;
    }, 1000);
  }

  private setupSearch(): void {
    // This would be connected to a search input with debouncing
    // For now, we'll implement it in the search method
  }

  // Search and Filter Methods
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterToggle(filterKey: string): void {
    const index = this.selectedFilters.indexOf(filterKey);
    if (index > -1) {
      this.selectedFilters.splice(index, 1);
    } else {
      this.selectedFilters.push(filterKey);
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.suppliers];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(term) ||
        supplier.description.toLowerCase().includes(term) ||
        supplier.specialties.some(s => s.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(supplier => supplier.category === this.selectedCategory);
    }

    // Additional filters
    this.selectedFilters.forEach(filter => {
      switch (filter) {
        case 'freeDelivery':
          filtered = filtered.filter(s => s.freeDelivery);
          break;
        case 'coDelivery':
          filtered = filtered.filter(s => s.coDelivery);
          break;
        case 'onSale':
          filtered = filtered.filter(s => s.onSale);
          break;
        case 'verified':
          filtered = filtered.filter(s => s.verified);
          break;
        case 'connected':
          filtered = filtered.filter(s => s.isConnected);
          break;
        case 'highRating':
          filtered = filtered.filter(s => s.rating >= 4.5);
          break;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof Supplier];
      let bValue: any = b[this.sortBy as keyof Supplier];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredSuppliers = filtered;
    this.totalItems = filtered.length;
    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredSuppliers = this.filteredSuppliers.slice(startIndex, endIndex);
  }

  // Pagination Methods
  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.applyFilters();
  }

  // CRUD Methods
  openAddModal(): void {
    this.supplierForm.reset();
    this.showAddModal = true;
  }

  openEditModal(supplier: Supplier): void {
    this.editingSupplier = supplier;
    this.supplierForm.patchValue({
      ...supplier,
      languages: supplier.languages || [],
      specialties: supplier.specialties || [],
      certifications: supplier.certifications || [],
      deliveryAreas: supplier.deliveryAreas || []
    });
    this.showEditModal = true;
  }

  saveSupplier(): void {
    if (this.supplierForm.valid) {
      const formData = this.supplierForm.value;
      
      if (this.editingSupplier) {
        // Update existing supplier
        const index = this.suppliers.findIndex(s => s.id === this.editingSupplier!.id);
        if (index > -1) {
          this.suppliers[index] = { ...this.editingSupplier, ...formData };
        }
        this.showEditModal = false;
      } else {
        // Add new supplier
        const newSupplier: Supplier = {
          id: Date.now().toString(),
          ...formData,
          verified: false,
          rating: 0,
          reviewCount: 0,
          isConnected: false,
          requestSent: false,
          totalOrders: 0,
          averageOrderValue: 0,
          responseTime: 'No disponible'
        };
        this.suppliers.unshift(newSupplier);
        this.showAddModal = false;
      }
      
      this.applyFilters();
      this.editingSupplier = null;
    }
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${supplier.name}?`)) {
      this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
      this.applyFilters();
    }
  }

  toggleConnection(supplier: Supplier): void {
    supplier.isConnected = !supplier.isConnected;
    if (!supplier.isConnected) {
      supplier.requestSent = false;
    }
  }

  sendRequest(supplier: Supplier): void {
    supplier.requestSent = true;
    supplier.requestDate = new Date();
    // In real app, this would make an API call
  }

  cancelRequest(supplier: Supplier): void {
    supplier.requestSent = false;
    supplier.requestDate = undefined;
  }

  // Utility Methods
  getSupplierStatus(supplier: Supplier): string {
    if (supplier.isConnected) return 'Conectado';
    if (supplier.requestSent) return 'Solicitud enviada';
    return 'Disponible';
  }

  getSupplierStatusClass(supplier: Supplier): string {
    if (supplier.isConnected) return 'status-connected';
    if (supplier.requestSent) return 'status-pending';
    return 'status-available';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.icon : 'package';
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return Array(fullStars).fill(1).concat(hasHalfStar ? [0.5] : []);
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.editingSupplier = null;
  }

  // Export functionality
  exportSuppliers(): void {
    console.log('Exporting suppliers data...');
    
    // Show loading state
    const exportButton = document.querySelector('.export-btn') as HTMLButtonElement;
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.innerHTML = '<i class="icon-loading"></i> Exporting...';
    }

    // Simulate export process
    setTimeout(() => {
      // Reset button state
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<i class="icon-export"></i> Export';
      }
      
      // Create and download CSV
      this.createSuppliersCSV();
      
      // Show success notification
      this.showNotification('Suppliers data exported successfully!', 'success');
    }, 1500);
  }

  // Bulk actions
  bulkAction(action: string): void {
    console.log(`Bulk action: ${action}`);
    
    const selectedSuppliers = this.getSelectedSuppliers();
    
    if (selectedSuppliers.length === 0) {
      this.showNotification('Please select suppliers first', 'error');
      return;
    }

    switch (action) {
      case 'delete':
        this.bulkDeleteSuppliers(selectedSuppliers);
        break;
      case 'export':
        this.bulkExportSuppliers(selectedSuppliers);
        break;
      case 'connect':
        this.bulkConnectSuppliers(selectedSuppliers);
        break;
      case 'disconnect':
        this.bulkDisconnectSuppliers(selectedSuppliers);
        break;
      default:
        console.log(`Unknown bulk action: ${action}`);
    }
  }

  private getSelectedSuppliers(): Supplier[] {
    // In a real app, this would get selected suppliers from checkboxes
    // For now, we'll return all suppliers as an example
    return this.filteredSuppliers;
  }

  private bulkDeleteSuppliers(suppliers: Supplier[]): void {
    const confirmed = confirm(`Are you sure you want to delete ${suppliers.length} supplier(s)?`);
    
    if (confirmed) {
      suppliers.forEach(supplier => {
        this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
      });
      
      this.applyFilters();
      this.showNotification(`${suppliers.length} supplier(s) deleted successfully`, 'success');
    }
  }

  private bulkExportSuppliers(suppliers: Supplier[]): void {
    const csvContent = this.createSuppliersCSV(suppliers);
    this.downloadFile(csvContent, `selected-suppliers-${Date.now()}.csv`, 'text/csv');
    this.showNotification(`${suppliers.length} supplier(s) exported successfully`, 'success');
  }

  private bulkConnectSuppliers(suppliers: Supplier[]): void {
    suppliers.forEach(supplier => {
      if (!supplier.isConnected) {
        supplier.isConnected = true;
        supplier.requestSent = false;
      }
    });
    
    this.showNotification(`${suppliers.length} supplier(s) connected successfully`, 'success');
  }

  private bulkDisconnectSuppliers(suppliers: Supplier[]): void {
    suppliers.forEach(supplier => {
      if (supplier.isConnected) {
        supplier.isConnected = false;
        supplier.requestSent = false;
      }
    });
    
    this.showNotification(`${suppliers.length} supplier(s) disconnected successfully`, 'success');
  }

  private createSuppliersCSV(suppliers?: Supplier[]): string {
    const suppliersToExport = suppliers || this.filteredSuppliers;
    
    const csvHeaders = [
      'Name', 'Description', 'Category', 'Rating', 'Review Count', 
      'Connected', 'Total Orders', 'Average Order Value', 'Response Time',
      'Contact Email', 'Contact Phone', 'Address', 'Minimum Order',
      'Payment Terms', 'Established Year', 'Specialties', 'Certifications'
    ];
    
    const csvRows = suppliersToExport.map(supplier => [
      supplier.name,
      supplier.description,
      this.getCategoryName(supplier.category),
      supplier.rating,
      supplier.reviewCount,
      supplier.isConnected ? 'Yes' : 'No',
      supplier.totalOrders,
      supplier.averageOrderValue,
      supplier.responseTime,
      supplier.contactEmail,
      supplier.contactPhone,
      supplier.address,
      supplier.minimumOrder,
      supplier.paymentTerms,
      supplier.establishedYear,
      supplier.specialties.join('; '),
      supplier.certifications.join('; ')
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    this.downloadFile(csvContent, `suppliers-export-${Date.now()}.csv`, 'text/csv');
    return csvContent;
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="icon-${type === 'success' ? 'check' : type === 'error' ? 'error' : 'info'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Pagination helpers
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Math utility for template
  Math = Math;

  // Get current year for form validation
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}