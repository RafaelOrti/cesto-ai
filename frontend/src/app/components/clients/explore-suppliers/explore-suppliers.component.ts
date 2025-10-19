import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Supplier {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number;
  isRecommended: boolean;
  hasSpecialOffer: boolean;
  categories: string[];
  deliveryOptions: string[];
  isNew: boolean;
}

interface SupplierFilters {
  freeDelivery: boolean;
  coDelivery: boolean;
  onSale: boolean;
  newProducts: boolean;
}

@Component({
  selector: 'app-explore-suppliers',
  templateUrl: './explore-suppliers.component.html',
  styleUrls: ['./explore-suppliers.component.scss']
})
export class ExploreSuppliersComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  selectedFilters: SupplierFilters = {
    freeDelivery: false,
    coDelivery: false,
    onSale: false,
    newProducts: false
  };

  constructor(public i18n: I18nService) {}

  categories: Category[] = [
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'meat', name: 'Meat', icon: '🥩' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' }
  ];

  private recommendedSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Gatimport',
      description: 'Premium food products and ingredients',
      logo: 'assets/images/gatimport-logo.png',
      rating: 4.8,
      isRecommended: true,
      hasSpecialOffer: true,
      categories: ['dairy', 'meat'],
      deliveryOptions: ['free-delivery', 'co-delivery'],
      isNew: false
    },
    {
      id: '2',
      name: 'Fresh Foods Co',
      description: 'Fresh vegetables and fruits daily delivery',
      logo: 'assets/images/fresh-foods-logo.png',
      rating: 4.6,
      isRecommended: true,
      hasSpecialOffer: false,
      categories: ['vegetables', 'fruits'],
      deliveryOptions: ['free-delivery'],
      isNew: true
    },
    {
      id: '3',
      name: 'Ocean Catch',
      description: 'Fresh seafood and fish products',
      logo: 'assets/images/ocean-catch-logo.png',
      rating: 4.7,
      isRecommended: true,
      hasSpecialOffer: true,
      categories: ['fish'],
      deliveryOptions: ['co-delivery'],
      isNew: false
    }
  ];

  private allSuppliers: Supplier[] = [
    ...this.recommendedSuppliers,
    {
      id: '4',
      name: 'Bakery Master',
      description: 'Artisan breads and pastries',
      logo: 'assets/images/bakery-master-logo.png',
      rating: 4.5,
      isRecommended: false,
      hasSpecialOffer: false,
      categories: ['bakery'],
      deliveryOptions: [],
      isNew: true
    },
    {
      id: '5',
      name: 'Meat Premium',
      description: 'High-quality meat products',
      logo: 'assets/images/meat-premium-logo.png',
      rating: 4.9,
      isRecommended: false,
      hasSpecialOffer: true,
      categories: ['meat'],
      deliveryOptions: ['free-delivery'],
      isNew: false
    }
  ];

  filteredSuppliers: Supplier[] = this.allSuppliers;

  get recommendedSuppliersList(): Supplier[] {
    return this.recommendedSuppliers;
  }

  ngOnInit(): void {
    this.loadRecommendedSuppliers();
  }

  onSearch(): void {
    this.filterSuppliers();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.filterSuppliers();
  }

  onFilterChange(filter: string): void {
    this.selectedFilters[filter as keyof SupplierFilters] = !this.selectedFilters[filter as keyof SupplierFilters];
    this.filterSuppliers();
  }

  onSearchChange(): void {
    this.filterSuppliers();
  }

  addSupplier(supplier: Supplier): void {
    console.log('Adding supplier to favorites:', supplier);
    
    // Show loading state
    const addButton = document.querySelector(`[data-supplier-id="${supplier.id}"] .add-btn`) as HTMLButtonElement;
    if (addButton) {
      addButton.disabled = true;
      addButton.innerHTML = '<i class="icon-loading"></i> Adding...';
    }

    // Simulate API call
    setTimeout(() => {
      // Reset button state
      if (addButton) {
        addButton.disabled = false;
        addButton.innerHTML = '<i class="icon-plus"></i> Add Supplier';
      }
      
      // Update supplier state
      supplier.isRecommended = true;
      
      // Show success notification
      this.showNotification(`${supplier.name} added to your suppliers successfully!`, 'success');
      
      // Optional: Navigate to my suppliers page
      // this.router.navigate(['/clients/my-suppliers']);
    }, 1000);
  }

  viewSupplier(supplier: Supplier): void {
    console.log('Viewing supplier details:', supplier);
    
    // Create supplier details modal
    this.showSupplierDetailsModal(supplier);
  }

  private showSupplierDetailsModal(supplier: Supplier): void {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'supplier-modal-overlay';
    modal.innerHTML = `
      <div class="supplier-modal">
        <div class="modal-header">
          <h2>${supplier.name}</h2>
          <button class="close-btn" onclick="this.closest('.supplier-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="supplier-info">
            <div class="supplier-logo">
              <img src="${supplier.logo}" alt="${supplier.name}" onerror="this.style.display='none'">
            </div>
            <div class="supplier-details">
              <p class="description">${supplier.description}</p>
              <div class="rating">
                <span class="stars">${'★'.repeat(Math.floor(supplier.rating))}</span>
                <span class="rating-value">${supplier.rating}/5</span>
              </div>
              <div class="categories">
                <strong>Categories:</strong> ${supplier.categories.map(cat => this.getCategoryName(cat)).join(', ')}
              </div>
              <div class="delivery-options">
                <strong>Delivery Options:</strong>
                <ul>
                  ${supplier.deliveryOptions.map(option => `<li>${this.getDeliveryOptionName(option)}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-primary" onclick="window.addSupplierToFavorites('${supplier.id}')">
              <i class="icon-plus"></i> Add to My Suppliers
            </button>
            <button class="btn btn-secondary" onclick="window.contactSupplier('${supplier.id}')">
              <i class="icon-mail"></i> Contact Supplier
            </button>
            <button class="btn btn-outline" onclick="window.viewSupplierProducts('${supplier.id}')">
              <i class="icon-products"></i> View Products
            </button>
          </div>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Add global functions for modal actions
    (window as any).addSupplierToFavorites = (supplierId: string) => {
      const supplier = this.allSuppliers.find(s => s.id === supplierId);
      if (supplier) {
        this.addSupplier(supplier);
        modal.remove();
      }
    };

    (window as any).contactSupplier = (supplierId: string) => {
      const supplier = this.allSuppliers.find(s => s.id === supplierId);
      if (supplier) {
        this.contactSupplier(supplier);
        modal.remove();
      }
    };

    (window as any).viewSupplierProducts = (supplierId: string) => {
      const supplier = this.allSuppliers.find(s => s.id === supplierId);
      if (supplier) {
        this.viewSupplierProducts(supplier);
        modal.remove();
      }
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  contactSupplier(supplier: Supplier): void {
    console.log('Contacting supplier:', supplier);
    
    // Create contact form or open email client
    const emailSubject = encodeURIComponent(`Business Inquiry - ${supplier.name}`);
    const emailBody = encodeURIComponent(`
Hello,

I am interested in establishing a business relationship with your company.

Company Details:
- Name: [Your Company Name]
- Industry: [Your Industry]
- Location: [Your Location]

Please contact me to discuss potential collaboration opportunities.

Best regards,
[Your Name]
    `);
    
    // Open email client
    window.open(`mailto:contact@${supplier.name.toLowerCase().replace(/\s+/g, '')}.com?subject=${emailSubject}&body=${emailBody}`);
    
    this.showNotification(`Email client opened to contact ${supplier.name}`, 'info');
  }

  viewSupplierProducts(supplier: Supplier): void {
    console.log('Viewing supplier products:', supplier);
    
    // Navigate to supplier products page or show products modal
    this.showSupplierProductsModal(supplier);
  }

  private showSupplierProductsModal(supplier: Supplier): void {
    // Mock products data
    const mockProducts = [
      { id: '1', name: 'Premium Organic Milk', price: 3.50, unit: 'L', category: 'Dairy' },
      { id: '2', name: 'Fresh Vegetables Mix', price: 2.80, unit: 'kg', category: 'Vegetables' },
      { id: '3', name: 'Artisan Bread', price: 4.20, unit: 'piece', category: 'Bakery' }
    ];

    // Create products modal
    const modal = document.createElement('div');
    modal.className = 'products-modal-overlay';
    modal.innerHTML = `
      <div class="products-modal">
        <div class="modal-header">
          <h2>${supplier.name} - Products</h2>
          <button class="close-btn" onclick="this.closest('.products-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="products-grid">
            ${mockProducts.map(product => `
              <div class="product-card">
                <div class="product-info">
                  <h3>${product.name}</h3>
                  <p class="category">${product.category}</p>
                  <p class="price">€${product.price}/${product.unit}</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="window.addProductToCart('${product.id}')">
                  <i class="icon-cart"></i> Add to Cart
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Add global function for adding products to cart
    (window as any).addProductToCart = (productId: string) => {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        this.showNotification(`${product.name} added to cart!`, 'success');
      }
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private getDeliveryOptionName(option: string): string {
    const optionNames: { [key: string]: string } = {
      'free-delivery': 'Free Delivery',
      'co-delivery': 'Co-Delivery',
      'express': 'Express Delivery',
      'scheduled': 'Scheduled Delivery'
    };
    return optionNames[option] || option;
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

  getSupplierStatus(supplier: Supplier): string {
    if (supplier.isRecommended) return 'Recommended';
    if (supplier.isNew) return 'New';
    if (supplier.hasSpecialOffer) return 'Special Offer';
    return 'Available';
  }

  getStatusClass(supplier: Supplier): string {
    if (supplier.isRecommended) return 'recommended';
    if (supplier.isNew) return 'new';
    if (supplier.hasSpecialOffer) return 'offer';
    return 'available';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  private loadRecommendedSuppliers(): void {
    // Load recommended suppliers based on client's buying history
  }

  getFeatureIcon(feature: string): string {
    switch (feature) {
      case 'AI Recommendations': return 'icon-ai-recommendations';
      case 'Delivery Options': return 'icon-delivery-options';
      case 'Quality Assurance': return 'icon-quality-assurance';
      default: return 'icon-default';
    }
  }

  getFilterLabel(filter: string): string {
    switch (filter) {
      case 'freeDelivery': return 'Free Delivery';
      case 'coDelivery': return 'Co-Delivery';
      case 'onSale': return 'On Sale';
      case 'newProducts': return 'New Products';
      default: return filter;
    }
  }

  private filterSuppliers(): void {
    let suppliers = [...this.allSuppliers];

    suppliers = this.applySearchFilter(suppliers);
    suppliers = this.applyCategoryFilter(suppliers);
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
    
    return suppliers.filter(supplier =>
      supplier.categories.includes(this.selectedCategory)
    );
  }

  private applyDeliveryFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.freeDelivery) {
      filtered = filtered.filter(supplier =>
        supplier.deliveryOptions.includes('free-delivery')
      );
    }

    if (this.selectedFilters.coDelivery) {
      filtered = filtered.filter(supplier =>
        supplier.deliveryOptions.includes('co-delivery')
      );
    }

    return filtered;
  }

  private applySpecialFilters(suppliers: Supplier[]): Supplier[] {
    let filtered = suppliers;

    if (this.selectedFilters.onSale) {
      filtered = filtered.filter(supplier => supplier.hasSpecialOffer);
    }

    if (this.selectedFilters.newProducts) {
      filtered = filtered.filter(supplier => supplier.isNew);
    }

    return filtered;
  }
}