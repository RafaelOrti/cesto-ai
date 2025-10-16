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
    }
  }

  private async updateSupplierFavorite(supplierId: string, isFavorite: boolean): Promise<void> {
    try {
      // API call to update favorite status
      console.log(`Updating favorite status for supplier ${supplierId}: ${isFavorite}`);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  }

  showContactInfo(): void {
    if (this.supplier) {
      // Show contact modal or navigate to contact page
      console.log('Showing contact info:', this.supplier.contactInfo);
    }
  }

  reportError(): void {
    // Show report error modal
    console.log('Reporting error for supplier:', this.supplier?.id);
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

