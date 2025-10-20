import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
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
  lastDelivery: string;
  futureDelivery: string;
  hasCampaign: boolean;
  hasNewProducts: boolean;
  isFavorite: boolean;
  minimumOrder: string;
  shippingCost: string;
  freeShippingThreshold: string;
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
  selectedTab = 'all'; // 'all', 'favorites', 'new'
  selectedFilters: SupplierFilters = {
    freeDelivery: false,
    coDelivery: false,
    onSale: false,
    newProducts: false
  };

  constructor(
    public i18n: I18nService,
    private router: Router
  ) {}

  categories: Category[] = [
    { id: 'pharmacy', name: 'Apotek & Hälsa', icon: '💊', color: '#e3f2fd' },
    { id: 'children', name: 'Barn & Baby', icon: '👶', color: '#fce4ec' },
    { id: 'drinks', name: 'Dryck', icon: '🥤', color: '#e8f5e8' },
    { id: 'snacks', name: 'Mellanmål', icon: '🍪', color: '#fff3e0' },
    { id: 'household', name: 'Hushåll', icon: '🏠', color: '#f3e5f5' },
    { id: 'meat', name: 'Kött & Chark', icon: '🥩', color: '#ffebee' },
    { id: 'ready-meals', name: 'Färdigmat', icon: '🍱', color: '#e0f2f1' },
    { id: 'vegetables', name: 'Frukt & Grönt', icon: '🥕', color: '#e8f5e8' },
    { id: 'ice-cream', name: 'Glass', icon: '🍦', color: '#fff8e1' },
    { id: 'bakery', name: 'Bakery', icon: '🥖', color: '#fafafa' }
  ];

  private recommendedSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Bärta',
      description: 'Premium organic products and natural ingredients',
      logo: 'assets/images/barta-logo.png',
      rating: 4.8,
      isRecommended: true,
      hasSpecialOffer: true,
      categories: ['vegetables', 'household'],
      deliveryOptions: ['free-delivery', 'co-delivery'],
      isNew: false,
      lastDelivery: '2024-02-19',
      futureDelivery: 'Söka ett lägre order',
      hasCampaign: true,
      hasNewProducts: false,
      isFavorite: true,
      minimumOrder: 'No minimum',
      shippingCost: '100 kr',
      freeShippingThreshold: '2 items'
    },
    {
      id: '2',
      name: 'Galatea',
      description: 'Fresh dairy and cheese products',
      logo: 'assets/images/galatea-logo.png',
      rating: 4.6,
      isRecommended: true,
      hasSpecialOffer: false,
      categories: ['dairy', 'ready-meals'],
      deliveryOptions: ['free-delivery'],
      isNew: true,
      lastDelivery: '2024-01-18',
      futureDelivery: 'Inget beställn',
      hasCampaign: false,
      hasNewProducts: true,
      isFavorite: false,
      minimumOrder: '500 kr',
      shippingCost: '50 kr',
      freeShippingThreshold: '3 items'
    },
    {
      id: '3',
      name: 'PAOL och There',
      description: 'Artisan bakery and gourmet products',
      logo: 'assets/images/paol-logo.png',
      rating: 4.7,
      isRecommended: true,
      hasSpecialOffer: true,
      categories: ['bakery', 'snacks'],
      deliveryOptions: ['co-delivery'],
      isNew: false,
      lastDelivery: '2024-02-15',
      futureDelivery: '2024-01-31',
      hasCampaign: true,
      hasNewProducts: false,
      isFavorite: true,
      minimumOrder: '200 kr',
      shippingCost: '75 kr',
      freeShippingThreshold: '4 items'
    },
    {
      id: '4',
      name: 'Hugos Chark',
      description: 'Premium meat and charcuterie products',
      logo: 'assets/images/hugos-logo.png',
      rating: 4.9,
      isRecommended: true,
      hasSpecialOffer: false,
      categories: ['meat', 'ready-meals'],
      deliveryOptions: ['free-delivery'],
      isNew: true,
      lastDelivery: '2024-02-20',
      futureDelivery: '2024-02-28',
      hasCampaign: false,
      hasNewProducts: true,
      isFavorite: false,
      minimumOrder: '300 kr',
      shippingCost: '100 kr',
      freeShippingThreshold: '2 items'
    }
  ];

  private allSuppliers: Supplier[] = [
    ...this.recommendedSuppliers,
    {
      id: '5',
      name: 'Luntgårdens Mejeri',
      description: 'Glada kor som mättar glada magar - Milk from Sweden',
      logo: 'assets/images/luntgardens-logo.png',
      rating: 4.9,
      isRecommended: false,
      hasSpecialOffer: true,
      categories: ['dairy', 'ready-meals'],
      deliveryOptions: ['free-delivery'],
      isNew: false,
      lastDelivery: '2024-02-22',
      futureDelivery: '2024-03-01',
      hasCampaign: true,
      hasNewProducts: true,
      isFavorite: false,
      minimumOrder: 'No minimum',
      shippingCost: '100 kr',
      freeShippingThreshold: '2 items'
    },
    {
      id: '6',
      name: 'Fresh Market',
      description: 'Fresh fruits and vegetables daily delivery',
      logo: 'assets/images/fresh-market-logo.png',
      rating: 4.5,
      isRecommended: false,
      hasSpecialOffer: false,
      categories: ['vegetables', 'fruits'],
      deliveryOptions: ['co-delivery'],
      isNew: true,
      lastDelivery: '2024-02-18',
      futureDelivery: '2024-02-25',
      hasCampaign: false,
      hasNewProducts: true,
      isFavorite: false,
      minimumOrder: '250 kr',
      shippingCost: '80 kr',
      freeShippingThreshold: '3 items'
    }
  ];

  filteredSuppliers: Supplier[] = this.allSuppliers;

  get recommendedSuppliersList(): Supplier[] {
    return this.recommendedSuppliers;
  }

  ngOnInit(): void {
    this.loadRecommendedSuppliers();
    this.filterSuppliers();
  }

  onSearch(): void {
    this.filterSuppliers();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category === this.selectedCategory ? '' : category;
    this.filterSuppliers();
  }

  onFilterChange(filter: string): void {
    this.selectedFilters[filter as keyof SupplierFilters] = !this.selectedFilters[filter as keyof SupplierFilters];
    this.filterSuppliers();
  }

  onSearchChange(): void {
    this.filterSuppliers();
  }

  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.filterSuppliers();
  }

  toggleFavorite(supplier: Supplier): void {
    supplier.isFavorite = !supplier.isFavorite;
    this.showNotification(
      supplier.isFavorite 
        ? `${supplier.name} added to favorites` 
        : `${supplier.name} removed from favorites`, 
      'success'
    );
  }

  orderFromSupplier(supplier: Supplier): void {
    console.log('Ordering from supplier:', supplier);
    // Navigate to supplier's product page or order page
    this.router.navigate(['/client/supplier', supplier.id, 'products']);
  }

  viewSupplierDetails(supplier: Supplier): void {
    console.log('Viewing supplier details:', supplier);
    this.router.navigate(['/client/supplier', supplier.id]);
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

    // Apply tab filter first
    suppliers = this.applyTabFilter(suppliers);
    
    // Then apply other filters
    suppliers = this.applySearchFilter(suppliers);
    suppliers = this.applyCategoryFilter(suppliers);
    suppliers = this.applyDeliveryFilters(suppliers);
    suppliers = this.applySpecialFilters(suppliers);

    this.filteredSuppliers = suppliers;
  }

  private applyTabFilter(suppliers: Supplier[]): Supplier[] {
    switch (this.selectedTab) {
      case 'favorites':
        return suppliers.filter(supplier => supplier.isFavorite);
      case 'new':
        return suppliers.filter(supplier => supplier.isNew);
      case 'all':
      default:
        return suppliers;
    }
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