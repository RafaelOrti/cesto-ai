import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerUnit: string;
  totalPrice: string;
  packaging: string;
  quantity: string;
  isNew: boolean;
  campaign?: string;
  lastDelivery: Date;
  category: string;
  moq: number;
  unit: string;
}

export interface OrderHistory {
  orderNumber: string;
  orderDate: Date;
  status: string;
  itemsCount: number;
  totalAmount: number;
  deliveryDate?: Date;
}

export interface SupplierProfile {
  id: string;
  name: string;
  description: string;
  logo?: string;
  bannerImage?: string;
  slogan: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  joinedDate: Date;
  aboutText: string;
  foundedYear: number;
  employeeCount: number;
  location: string;
  certifications: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  deliveryTerms: {
    minimumOrder: number;
    shippingCosts: Array<{
      range: string;
      cost: number;
    }>;
    schedule: Array<{
      orderBy: string;
      deliveryDay: string;
      cutoffTime: string;
    }>;
    notes: string;
  };
  products: Product[];
  orderHistory: OrderHistory[];
}

@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.scss']
})
export class SupplierProfileComponent implements OnInit, OnDestroy {
  supplier: SupplierProfile | null = null;
  activeTab = 'products';
  activeProductTab = 'all';
  
  productSearchQuery = '';
  productSortBy = 'name';
  filteredProducts: Product[] = [];
  
  currentProductPage = 1;
  productsPerPage = 12;
  totalProducts = 0;
  totalProductPages = 0;
  
  historyFilter = 'all';
  filteredOrderHistory: OrderHistory[] = [];
  
  private destroy$ = new Subject<void>();

  tabs = [
    { id: 'products', name: 'Products', icon: 'icon-package', badge: null },
    { id: 'delivery', name: 'Delivery Terms', icon: 'icon-truck', badge: null },
    { id: 'history', name: 'Order History', icon: 'icon-history', badge: null },
    { id: 'about', name: 'About Us', icon: 'icon-info', badge: null }
  ];

  productSubTabs = [
    { id: 'all', name: 'All Products' },
    { id: 'campaigns', name: 'Campaigns' },
    { id: 'new', name: '+ New Products' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const supplierId = params['id'];
      if (supplierId) {
        this.loadSupplier(supplierId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadSupplier(supplierId: string): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.supplier = this.generateMockSupplier(supplierId);
      this.filteredProducts = [...this.supplier.products];
      this.filteredOrderHistory = [...this.supplier.orderHistory];
      
      this.totalProducts = this.filteredProducts.length;
      this.totalProductPages = Math.ceil(this.totalProducts / this.productsPerPage);
      
      this.filterProducts();
    } catch (error) {
      console.error('Error loading supplier:', error);
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  setActiveProductTab(subTabId: string): void {
    this.activeProductTab = subTabId;
    this.currentProductPage = 1;
    this.filterProducts();
  }

  filterProducts(): void {
    let filtered = [...(this.supplier?.products || [])];

    // Apply search query
    if (this.productSearchQuery.trim()) {
      const query = this.productSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply sub-tab filters
    if (this.activeProductTab === 'campaigns') {
      filtered = filtered.filter(product => product.campaign);
    } else if (this.activeProductTab === 'new') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(product => product.isNew);
    }

    // Apply sorting
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.totalProducts = filtered.length;
    this.totalProductPages = Math.ceil(this.totalProducts / this.productsPerPage);
    
    // Apply pagination
    this.applyProductPagination();
  }

  private sortProducts(products: Product[]): Product[] {
    return products.sort((a, b) => {
      switch (this.productSortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const priceA = parseFloat(a.pricePerUnit.replace(/[^\d.]/g, ''));
          const priceB = parseFloat(b.pricePerUnit.replace(/[^\d.]/g, ''));
          return priceA - priceB;
        case 'newest':
          return b.lastDelivery.getTime() - a.lastDelivery.getTime();
        case 'popular':
          // Mock popularity based on last delivery date
          return b.lastDelivery.getTime() - a.lastDelivery.getTime();
        default:
          return 0;
      }
    });
  }


  private applyProductPagination(): void {
    const startIndex = (this.currentProductPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.filteredProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  filterOrderHistory(): void {
    let filtered = [...(this.supplier?.orderHistory || [])];

    const now = new Date();
    switch (this.historyFilter) {
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = filtered.filter(order => order.orderDate >= lastMonth);
        break;
      case 'last-3-months':
        const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        filtered = filtered.filter(order => order.orderDate >= last3Months);
        break;
      case 'last-year':
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        filtered = filtered.filter(order => order.orderDate >= lastYear);
        break;
    }

    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());

    this.filteredOrderHistory = filtered;
  }

  toggleFavorite(): void {
    if (this.supplier) {
      this.supplier.isFavorite = !this.supplier.isFavorite;
      
      // Update in backend
      this.updateSupplierFavorite(this.supplier.id, this.supplier.isFavorite);
      
      // Show notification
      const message = this.supplier.isFavorite 
        ? `${this.supplier.name} added to favorites` 
        : `${this.supplier.name} removed from favorites`;
      this.showNotification(message, 'success');
    }
  }

  private async updateSupplierFavorite(supplierId: string, isFavorite: boolean): Promise<void> {
    try {
      // API call to update favorite status
      console.log(`Updating favorite status for supplier ${supplierId}: ${isFavorite}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error updating favorite status:', error);
      this.showNotification('Error updating favorite status', 'error');
    }
  }

  showContactInfo(): void {
    if (this.supplier) {
      // Show contact modal
      this.showContactModal();
    }
  }

  reportError(): void {
    if (this.supplier) {
      // Show report error modal
      this.showReportErrorModal();
    }
  }

  private showContactModal(): void {
    if (!this.supplier) return;

    const modal = document.createElement('div');
    modal.className = 'contact-modal-overlay';
    modal.innerHTML = `
      <div class="contact-modal">
        <div class="modal-header">
          <h2>Contact ${this.supplier.name}</h2>
          <button class="close-btn" onclick="this.closest('.contact-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <div class="contact-details">
                <h4>Email</h4>
                <p>${this.supplier.contactInfo.email}</p>
                <button class="btn btn-sm btn-primary" onclick="window.sendEmail('${this.supplier.contactInfo.email}')">
                  Send Email
                </button>
              </div>
            </div>
            
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <div class="contact-details">
                <h4>Phone</h4>
                <p>${this.supplier.contactInfo.phone}</p>
                <button class="btn btn-sm btn-primary" onclick="window.callNumber('${this.supplier.contactInfo.phone}')">
                  Call Now
                </button>
              </div>
            </div>
            
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <div class="contact-details">
                <h4>Address</h4>
                <p>${this.supplier.contactInfo.address}</p>
                <button class="btn btn-sm btn-primary" onclick="window.openMaps('${this.supplier.contactInfo.address}')">
                  View on Map
                </button>
              </div>
            </div>
          </div>
          
          <div class="quick-actions">
            <h4>Quick Actions</h4>
            <div class="action-buttons">
              <button class="btn btn-secondary" onclick="window.sendInquiry('${this.supplier.id}')">
                <i class="fas fa-comment"></i> Send Inquiry
              </button>
              <button class="btn btn-secondary" onclick="window.requestQuote('${this.supplier.id}')">
                <i class="fas fa-file-invoice"></i> Request Quote
              </button>
              <button class="btn btn-secondary" onclick="window.scheduleMeeting('${this.supplier.id}')">
                <i class="fas fa-calendar"></i> Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add global functions for contact modal
    (window as any).sendEmail = (email: string) => {
      const subject = encodeURIComponent(`Business Inquiry - ${this.supplier?.name}`);
      const body = encodeURIComponent(`
Hello,

I am interested in discussing business opportunities with your company.

Best regards,
[Your Name]
      `);
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      modal.remove();
    };

    (window as any).callNumber = (phone: string) => {
      window.open(`tel:${phone}`);
      modal.remove();
    };

    (window as any).openMaps = (address: string) => {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
    };

    (window as any).sendInquiry = (supplierId: string) => {
      modal.remove();
      this.sendInquiry();
    };

    (window as any).requestQuote = (supplierId: string) => {
      modal.remove();
      this.requestQuote();
    };

    (window as any).scheduleMeeting = (supplierId: string) => {
      modal.remove();
      this.scheduleMeeting();
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private showReportErrorModal(): void {
    if (!this.supplier) return;

    const modal = document.createElement('div');
    modal.className = 'report-error-modal-overlay';
    modal.innerHTML = `
      <div class="report-error-modal">
        <div class="modal-header">
          <h2>Report Issue - ${this.supplier.name}</h2>
          <button class="close-btn" onclick="this.closest('.report-error-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form class="report-error-form">
            <div class="form-group">
              <label>Issue Type *</label>
              <select id="issue-type" required>
                <option value="">Select issue type</option>
                <option value="delivery">Delivery Issue</option>
                <option value="product">Product Quality</option>
                <option value="pricing">Pricing Problem</option>
                <option value="communication">Communication Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Order Number (if applicable)</label>
              <input type="text" id="order-number" placeholder="Enter order number">
            </div>
            
            <div class="form-group">
              <label>Description *</label>
              <textarea id="issue-description" rows="4" placeholder="Describe the issue in detail" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Priority</label>
              <select id="issue-priority">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Contact Information</label>
              <input type="email" id="reporter-email" placeholder="Your email" required>
              <input type="tel" id="reporter-phone" placeholder="Your phone number">
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" onclick="window.submitErrorReport('${this.supplier.id}')">
                <i class="fas fa-exclamation-triangle"></i> Submit Report
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.report-error-modal-overlay').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    (window as any).submitErrorReport = (supplierId: string) => {
      const issueType = (document.getElementById('issue-type') as HTMLSelectElement)?.value;
      const orderNumber = (document.getElementById('order-number') as HTMLInputElement)?.value;
      const description = (document.getElementById('issue-description') as HTMLTextAreaElement)?.value;
      const priority = (document.getElementById('issue-priority') as HTMLSelectElement)?.value;
      const email = (document.getElementById('reporter-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('reporter-phone') as HTMLInputElement)?.value;

      if (!issueType || !description || !email) {
        this.showNotification('Please fill in all required fields', 'error');
        return;
      }

      modal.remove();
      this.showNotification('Issue report submitted successfully!', 'success');
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private sendInquiry(): void {
    if (!this.supplier) return;

    const modal = document.createElement('div');
    modal.className = 'inquiry-modal-overlay';
    modal.innerHTML = `
      <div class="inquiry-modal">
        <div class="modal-header">
          <h2>Send Inquiry - ${this.supplier.name}</h2>
          <button class="close-btn" onclick="this.closest('.inquiry-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form class="inquiry-form">
            <div class="form-group">
              <label>Subject *</label>
              <input type="text" id="inquiry-subject" placeholder="Enter inquiry subject" required>
            </div>
            
            <div class="form-group">
              <label>Message *</label>
              <textarea id="inquiry-message" rows="5" placeholder="Enter your inquiry message" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Contact Information</label>
              <input type="email" id="inquiry-email" placeholder="Your email" required>
              <input type="tel" id="inquiry-phone" placeholder="Your phone number">
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" onclick="window.submitInquiry('${this.supplier.id}')">
                <i class="fas fa-paper-plane"></i> Send Inquiry
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.inquiry-modal-overlay').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    (window as any).submitInquiry = (supplierId: string) => {
      const subject = (document.getElementById('inquiry-subject') as HTMLInputElement)?.value;
      const message = (document.getElementById('inquiry-message') as HTMLTextAreaElement)?.value;
      const email = (document.getElementById('inquiry-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('inquiry-phone') as HTMLInputElement)?.value;

      if (!subject || !message || !email) {
        this.showNotification('Please fill in all required fields', 'error');
        return;
      }

      modal.remove();
      this.showNotification('Inquiry sent successfully!', 'success');
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private requestQuote(): void {
    if (!this.supplier) return;

    const modal = document.createElement('div');
    modal.className = 'quote-modal-overlay';
    modal.innerHTML = `
      <div class="quote-modal">
        <div class="modal-header">
          <h2>Request Quote - ${this.supplier.name}</h2>
          <button class="close-btn" onclick="this.closest('.quote-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form class="quote-form">
            <div class="form-group">
              <label>Products of Interest *</label>
              <select id="quote-products" multiple required>
                ${this.supplier.products.slice(0, 10).map(product => 
                  `<option value="${product.id}">${product.name} - ${product.pricePerUnit}</option>`
                ).join('')}
              </select>
              <small>Hold Ctrl/Cmd to select multiple products</small>
            </div>
            
            <div class="form-group">
              <label>Quantity *</label>
              <input type="number" id="quote-quantity" placeholder="Enter quantity" min="1" required>
            </div>
            
            <div class="form-group">
              <label>Delivery Requirements</label>
              <textarea id="quote-delivery" rows="3" placeholder="Specify delivery requirements"></textarea>
            </div>
            
            <div class="form-group">
              <label>Additional Notes</label>
              <textarea id="quote-notes" rows="3" placeholder="Any additional requirements or notes"></textarea>
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" onclick="window.submitQuoteRequest('${this.supplier.id}')">
                <i class="fas fa-file-invoice"></i> Request Quote
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.quote-modal-overlay').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    (window as any).submitQuoteRequest = (supplierId: string) => {
      const products = Array.from((document.getElementById('quote-products') as HTMLSelectElement)?.selectedOptions || [])
        .map(option => option.value);
      const quantity = (document.getElementById('quote-quantity') as HTMLInputElement)?.value;
      const delivery = (document.getElementById('quote-delivery') as HTMLTextAreaElement)?.value;
      const notes = (document.getElementById('quote-notes') as HTMLTextAreaElement)?.value;

      if (!products.length || !quantity) {
        this.showNotification('Please select products and quantity', 'error');
        return;
      }

      modal.remove();
      this.showNotification('Quote request sent successfully!', 'success');
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  private scheduleMeeting(): void {
    if (!this.supplier) return;

    const modal = document.createElement('div');
    modal.className = 'meeting-modal-overlay';
    modal.innerHTML = `
      <div class="meeting-modal">
        <div class="modal-header">
          <h2>Schedule Meeting - ${this.supplier.name}</h2>
          <button class="close-btn" onclick="this.closest('.meeting-modal-overlay').remove()">
            <i class="icon-close"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <form class="meeting-form">
            <div class="form-group">
              <label>Meeting Type *</label>
              <select id="meeting-type" required>
                <option value="">Select meeting type</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In-Person Meeting</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Preferred Date *</label>
              <input type="date" id="meeting-date" required>
            </div>
            
            <div class="form-group">
              <label>Preferred Time *</label>
              <input type="time" id="meeting-time" required>
            </div>
            
            <div class="form-group">
              <label>Duration</label>
              <select id="meeting-duration">
                <option value="30">30 minutes</option>
                <option value="60" selected>1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Meeting Purpose *</label>
              <textarea id="meeting-purpose" rows="3" placeholder="Describe the purpose of the meeting" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Contact Information</label>
              <input type="email" id="meeting-email" placeholder="Your email" required>
              <input type="tel" id="meeting-phone" placeholder="Your phone number">
            </div>
            
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary" onclick="window.submitMeetingRequest('${this.supplier.id}')">
                <i class="fas fa-calendar"></i> Schedule Meeting
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.meeting-modal-overlay').remove()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    (window as any).submitMeetingRequest = (supplierId: string) => {
      const type = (document.getElementById('meeting-type') as HTMLSelectElement)?.value;
      const date = (document.getElementById('meeting-date') as HTMLInputElement)?.value;
      const time = (document.getElementById('meeting-time') as HTMLInputElement)?.value;
      const duration = (document.getElementById('meeting-duration') as HTMLSelectElement)?.value;
      const purpose = (document.getElementById('meeting-purpose') as HTMLTextAreaElement)?.value;
      const email = (document.getElementById('meeting-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('meeting-phone') as HTMLInputElement)?.value;

      if (!type || !date || !time || !purpose || !email) {
        this.showNotification('Please fill in all required fields', 'error');
        return;
      }

      modal.remove();
      this.showNotification('Meeting request sent successfully!', 'success');
    };

    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
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

  decreaseQuantity(product: Product): void {
    const qty = parseInt(product.quantity.toString());
    if (qty > 0) {
      product.quantity = (qty - 1).toString();
    }
  }

  increaseQuantity(product: Product): void {
    const qty = parseInt(product.quantity.toString());
    product.quantity = (qty + 1).toString();
  }

  addToCart(product: Product): void {
    const qty = parseInt(product.quantity.toString());
    if (qty > 0) {
      console.log('Adding to cart:', product.name, 'Quantity:', product.quantity);
      // Add to cart logic
    }
  }

  viewOrderDetails(order: OrderHistory): void {
    console.log('Viewing order details:', order.orderNumber);
    // Navigate to order details
  }

  repeatOrder(order: OrderHistory): void {
    console.log('Repeating order:', order.orderNumber);
    // Add all items from order to cart
  }

  // Pagination methods
  getProductPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentProductPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalProductPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  previousProductPage(): void {
    if (this.currentProductPage > 1) {
      this.currentProductPage--;
      this.filterProducts();
    }
  }

  nextProductPage(): void {
    if (this.currentProductPage < this.totalProductPages) {
      this.currentProductPage++;
      this.filterProducts();
    }
  }

  goToProductPage(page: number): void {
    this.currentProductPage = page;
    this.filterProducts();
  }

  // Mock data generation
  private generateMockSupplier(supplierId: string): SupplierProfile {
    const supplierNames = [
      'Luntgårdens Mejeri', 'Nihao Foods', 'Birta Organic', 'Galatea Products',
      'PAUL & Thom', 'Hugos Chark', 'Fresh Valley', 'Mountain Dairy'
    ];
    
    const name = supplierNames[Math.floor(Math.random() * supplierNames.length)];
    
    return {
      id: supplierId,
      name: name,
      description: `High-quality products from ${name}. Specializing in fresh, organic goods with a focus on sustainability and traditional methods.`,
      logo: `https://picsum.photos/100/100?random=${supplierId}`,
      bannerImage: `https://picsum.photos/800/300?random=${supplierId}`,
      slogan: 'Happy cows that fill happy stomachs.',
      tags: ['Organic', 'Local', 'Sustainable', 'Traditional', 'Fresh'],
      rating: 4.5,
      reviewCount: 127,
      isFavorite: Math.random() > 0.5,
      joinedDate: new Date(2019, 0, 1),
      aboutText: `${name} has been providing high-quality products since 2019. We are committed to sustainable farming practices and delivering the freshest products to our customers. Our team of experienced farmers and food experts work together to ensure that every product meets our high standards.`,
      foundedYear: 2019,
      employeeCount: 45,
      location: 'Stockholm, Sweden',
      certifications: ['Organic Certified', 'ISO 9001', 'HACCP'],
      contactInfo: {
        email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+46 123 456 789',
        address: 'Farm Road 123, Stockholm, Sweden'
      },
      deliveryTerms: {
        minimumOrder: 0,
        shippingCosts: [
          { range: '0 - 2 items', cost: 100 },
          { range: 'More than 2 items', cost: 0 }
        ],
        schedule: [
          { orderBy: 'Friday', deliveryDay: 'Monday', cutoffTime: '17:00' },
          { orderBy: 'Monday', deliveryDay: 'Tuesday', cutoffTime: '17:00' },
          { orderBy: 'Wednesday', deliveryDay: 'Thursday', cutoffTime: '17:00' },
          { orderBy: 'Thursday', deliveryDay: 'Friday', cutoffTime: '17:00' }
        ],
        notes: 'All deliveries are made during business hours. Please ensure someone is available to receive the order.'
      },
      products: this.generateMockProducts(),
      orderHistory: this.generateMockOrderHistory()
    };
  }

  private generateMockProducts(): Product[] {
    const products: Product[] = [];
    const productNames = [
      'Minimjölk 0,1%', 'Goat milk 1 L', 'Organic Cheese', 'Fresh Yogurt',
      'Farm Butter', 'Cream 35%', 'Milk Chocolate', 'Vanilla Ice Cream',
      'Strawberry Jam', 'Honey', 'Bread Loaf', 'Croissants'
    ];

    for (let i = 0; i < 24; i++) {
      const randomName = productNames[Math.floor(Math.random() * productNames.length)];
      const price = Math.floor(Math.random() * 100) + 10;
      
      products.push({
        id: `product-${i}`,
        name: `${randomName} ${i > 0 ? i : ''}`.trim(),
        description: `Delicious ${randomName.toLowerCase()} made with the finest ingredients.`,
        image: `https://picsum.photos/200/200?random=${i}`,
        pricePerUnit: `${price} kr/pc`,
        totalPrice: `${price * 20} kr`,
        packaging: 'Kfp 1 l',
        quantity: '20 pcs',
        isNew: Math.random() > 0.7,
        campaign: Math.random() > 0.6 ? 'Order 10 and get 15% discount!' : undefined,
        lastDelivery: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        category: 'Dairy',
        moq: 10,
        unit: 'pcs'
      });
    }

    return products;
  }

  private generateMockOrderHistory(): OrderHistory[] {
    const orders: OrderHistory[] = [];
    const statuses = ['Delivered', 'In Transit', 'Processing', 'Cancelled'];
    
    for (let i = 0; i < 12; i++) {
      orders.push({
        orderNumber: `ORD-${String(i + 1).padStart(4, '0')}`,
        orderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        itemsCount: Math.floor(Math.random() * 20) + 5,
        totalAmount: Math.floor(Math.random() * 5000) + 1000,
        deliveryDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  }

  // Utility methods
  Math = Math;
}

