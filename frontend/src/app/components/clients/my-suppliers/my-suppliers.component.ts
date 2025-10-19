import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { I18nService } from '../../../core/services/i18n.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilsService } from '../../../core/services/utils.service';
import { SupplierService } from '../../../services/supplier.service';
import { Supplier, SupplierRelationshipRequest } from '../../../../shared/types/common.types';
import { BaseComponent } from '../../../core/components/base-component';

// Extended interface for My Suppliers with additional relationship and order data
interface MySupplier extends Supplier {
  companyName: string;
  supplierName: string;
  description: string;
  website: string;
  logo: string;
  isVerified: boolean;
  relationshipStatus: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  relationshipId: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  minimumOrderAmount: number;
  deliveryAreas: string[];
  contactPerson: string;
  businessHours: string;
  joinedDate: string;
  totalProducts: number;
  reviewCount: number;
  // Override inherited properties to be required (inherited from Supplier)
  createdAt: string;
  updatedAt: string;
  rating: number;
}

@Component({
  selector: 'app-my-suppliers',
  templateUrl: './my-suppliers.component.html',
  styleUrls: ['./my-suppliers.component.scss']
})
export class MySuppliersComponent extends BaseComponent implements OnInit, OnDestroy {
  suppliers: MySupplier[] = [];
  filteredSuppliers: MySupplier[] = [];
  searchQuery = '';
  selectedCategory = 'all';
  selectedStatus = 'all';
  showRequestForm = false;
  selectedSupplier: MySupplier | null = null;
  isLoading = false;

  // Properties from BaseComponent
  i18n: any = { translate: (key: string) => key };
  notificationService: any = { error: (msg: string) => console.error(msg) };
  setLoading: (loading: boolean) => void = (loading: boolean) => { this.isLoading = loading; };

  showError(message: string): void {
    this.notificationService.error(message);
  }

  // Request form
  requestForm: FormGroup;

  // Filter options
  categories = [
    'Dairy',
    'Fruits & Vegetables',
    'Meat & Poultry',
    'Seafood',
    'Beverages',
    'Bakery',
    'Frozen Foods',
    'Packaged Goods',
    'Health & Beauty',
    'Cleaning Supplies'
  ];

  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'inactive', label: 'Inactive' }
  ];

  constructor(
    protected fb: FormBuilder,
    private supplierService: SupplierService
  ) {
    super(fb);
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  ngOnDestroy(): void {
    // Additional cleanup if needed
  }

  private initializeForm(): void {
    this.requestForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10)]],
      requestType: ['inquiry', Validators.required]
    });
  }

  loadSuppliers(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // Load mock data instead of API call
      this.suppliers = this.getMockSuppliers();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);

    // Original API call (commented out for demo purposes)
    /*
    this.supplierService.getMySuppliers()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading suppliers:', error);
          this.showError('Failed to load suppliers');
        }
      });
    */
  }

  private getMockSuppliers(): MySupplier[] {
    return [
      {
        id: '1',
        name: 'Fresh Dairy Co',
        companyName: 'Fresh Dairy Co',
        supplierName: 'Fresh Dairy Co',
        email: 'contact@freshdairy.com',
        phone: '+46 8 123 4567',
        address: 'Dairy Lane 123, Stockholm, Stockholm 12345, Sweden',
        city: 'Stockholm',
        country: 'Sweden',
        isActive: true,
        joinedDate: '2023-01-15',
        totalProducts: 150,
        description: 'Premium dairy products supplier specializing in organic milk, cheese, and yogurt. We provide fresh, high-quality dairy products to restaurants and retail businesses across Sweden.',
        website: 'https://freshdairy.com',
        logo: 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=FD',
        isVerified: true,
        rating: 4.8,
        reviewCount: 127,
        createdAt: '2023-01-15',
        updatedAt: '2024-01-15',
        categories: ['Dairy', 'Organic Products'],
        relationshipStatus: 'approved',
        relationshipId: 'rel-001',
        totalOrders: 45,
        totalSpent: 125000,
        lastOrderDate: '2024-01-15',
        minimumOrderAmount: 500,
        deliveryAreas: ['Stockholm', 'Uppsala', 'Västerås'],
        contactPerson: 'Erik Andersson',
        businessHours: 'Mon-Fri 8:00-17:00'
      },
      {
        id: '2',
        name: 'Nordic Meats Ltd',
        companyName: 'Nordic Meats Ltd',
        supplierName: 'Nordic Meats Ltd',
        email: 'orders@nordicmeats.se',
        phone: '+46 31 987 6543',
        address: 'Meat Street 456, Gothenburg, Västra Götaland 54321, Sweden',
        city: 'Gothenburg',
        country: 'Sweden',
        isActive: true,
        joinedDate: '2023-02-20',
        totalProducts: 200,
        description: 'Leading supplier of premium meat and poultry products. We offer a wide range of fresh and frozen meats, including organic and free-range options.',
        website: 'https://nordicmeats.se',
        logo: 'https://via.placeholder.com/80x80/FF5722/FFFFFF?text=NM',
        isVerified: true,
        rating: 4.6,
        reviewCount: 89,
        createdAt: '2023-02-20',
        updatedAt: '2024-01-12',
        categories: ['Meat & Poultry', 'Frozen Foods'],
        relationshipStatus: 'approved',
        relationshipId: 'rel-002',
        totalOrders: 32,
        totalSpent: 89000,
        lastOrderDate: '2024-01-12',
        minimumOrderAmount: 750,
        deliveryAreas: ['Gothenburg', 'Malmö', 'Helsingborg'],
        contactPerson: 'Anna Lindqvist',
        businessHours: 'Mon-Fri 7:00-16:00'
      },
      {
        id: '3',
        name: 'Green Valley Produce',
        companyName: 'Green Valley Produce',
        supplierName: 'Green Valley Produce',
        email: 'sales@greenvalley.se',
        phone: '+46 42 555 1234',
        address: 'Valley Road 789, Malmö, Skåne 98765, Sweden',
        city: 'Malmö',
        country: 'Sweden',
        isActive: true,
        joinedDate: '2023-03-10',
        totalProducts: 80,
        description: 'Organic fruits and vegetables supplier committed to sustainable farming practices. We deliver fresh, seasonal produce directly from our farms.',
        website: 'https://greenvalley.se',
        logo: 'https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=GV',
        isVerified: true,
        rating: 4.9,
        reviewCount: 203,
        createdAt: '2023-03-10',
        updatedAt: '2024-01-08',
        categories: ['Fruits & Vegetables', 'Organic Products'],
        relationshipStatus: 'pending',
        relationshipId: 'rel-003',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        minimumOrderAmount: 300,
        deliveryAreas: ['Malmö', 'Lund', 'Helsingborg'],
        contactPerson: 'Lars Eriksson',
        businessHours: 'Mon-Sat 6:00-18:00'
      },
      {
        id: '4',
        name: 'Premium Beverages AB',
        companyName: 'Premium Beverages AB',
        supplierName: 'Premium Beverages AB',
        email: 'info@premiumbeverages.se',
        phone: '+46 8 555 9876',
        address: 'Beverage Boulevard 321, Stockholm, Stockholm 13579, Sweden',
        city: 'Stockholm',
        country: 'Sweden',
        isActive: true,
        joinedDate: '2023-04-05',
        totalProducts: 300,
        description: 'Specialized beverage distributor offering premium alcoholic and non-alcoholic drinks. We carry exclusive brands and craft beverages from around the world.',
        website: 'https://premiumbeverages.se',
        logo: 'https://via.placeholder.com/80x80/2196F3/FFFFFF?text=PB',
        isVerified: true,
        rating: 4.7,
        reviewCount: 156,
        createdAt: '2023-04-05',
        updatedAt: '2024-01-18',
        categories: ['Beverages', 'Packaged Goods'],
        relationshipStatus: 'approved',
        relationshipId: 'rel-004',
        totalOrders: 28,
        totalSpent: 156000,
        lastOrderDate: '2024-01-18',
        minimumOrderAmount: 1000,
        deliveryAreas: ['Stockholm', 'Uppsala', 'Södertälje'],
        contactPerson: 'Maria Johansson',
        businessHours: 'Mon-Fri 9:00-18:00'
      },
      {
        id: '5',
        name: 'Artisan Bakery Co',
        companyName: 'Artisan Bakery Co',
        supplierName: 'Artisan Bakery Co',
        email: 'orders@artisanbakery.se',
        phone: '+46 11 333 7777',
        address: 'Baker Street 654, Uppsala, Uppsala 24680, Sweden',
        city: 'Uppsala',
        country: 'Sweden',
        isActive: false,
        joinedDate: '2023-05-12',
        totalProducts: 50,
        description: 'Traditional artisan bakery producing fresh bread, pastries, and desserts daily. We use only the finest ingredients and traditional baking methods.',
        website: 'https://artisanbakery.se',
        logo: 'https://via.placeholder.com/80x80/FF9800/FFFFFF?text=AB',
        isVerified: false,
        rating: 4.4,
        reviewCount: 23,
        createdAt: '2023-05-12',
        updatedAt: '2023-12-15',
        categories: ['Bakery', 'Frozen Foods'],
        relationshipStatus: 'rejected',
        relationshipId: null,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        minimumOrderAmount: 200,
        deliveryAreas: ['Uppsala', 'Enköping'],
        contactPerson: 'Sven Gustafsson',
        businessHours: 'Mon-Sat 5:00-15:00'
      },
      {
        id: '6',
        name: 'Ocean Fresh Seafood',
        companyName: 'Ocean Fresh Seafood',
        supplierName: 'Ocean Fresh Seafood',
        email: 'contact@oceanfresh.se',
        phone: '+46 31 777 8888',
        address: 'Harbor View 147, Gothenburg, Västra Götaland 36912, Sweden',
        city: 'Gothenburg',
        country: 'Sweden',
        isActive: true,
        description: 'Premium seafood supplier offering fresh fish, shellfish, and marine products. We source directly from local fishermen and maintain the highest quality standards.',
        website: 'https://oceanfresh.se',
        logo: 'https://via.placeholder.com/80x80/03A9F4/FFFFFF?text=OF',
        isVerified: true,
        rating: 4.5,
        reviewCount: 78,
        createdAt: '2023-06-18',
        updatedAt: '2024-01-14',
        joinedDate: '2023-06-18',
        totalProducts: 120,
        categories: ['Seafood', 'Frozen Foods'],
        relationshipStatus: 'approved',
        relationshipId: 'rel-006',
        totalOrders: 19,
        totalSpent: 67000,
        lastOrderDate: '2024-01-14',
        minimumOrderAmount: 400,
        deliveryAreas: ['Gothenburg', 'Malmö', 'Helsingborg', 'Halmstad'],
        contactPerson: 'Björn Hansen',
        businessHours: 'Mon-Fri 6:00-14:00'
      },
      {
        id: '7',
        name: 'Health & Wellness Supplies',
        companyName: 'Health & Wellness Supplies',
        supplierName: 'Health & Wellness Supplies',
        email: 'sales@healthwellness.se',
        phone: '+46 8 999 1111',
        address: 'Wellness Way 258, Stockholm, Stockholm 75319, Sweden',
        city: 'Stockholm',
        country: 'Sweden',
        isActive: true,
        description: 'Comprehensive supplier of health, beauty, and wellness products for retail and hospitality businesses. We offer both branded and private label products.',
        website: 'https://healthwellness.se',
        logo: 'https://via.placeholder.com/80x80/9C27B0/FFFFFF?text=HW',
        isVerified: true,
        rating: 4.3,
        reviewCount: 67,
        createdAt: '2023-07-22',
        updatedAt: '2023-12-20',
        joinedDate: '2023-07-22',
        totalProducts: 95,
        categories: ['Health & Beauty', 'Cleaning Supplies'],
        relationshipStatus: 'inactive',
        relationshipId: 'rel-007',
        totalOrders: 12,
        totalSpent: 34000,
        lastOrderDate: '2023-12-20',
        minimumOrderAmount: 250,
        deliveryAreas: ['Stockholm', 'Uppsala'],
        contactPerson: 'Ingrid Nilsson',
        businessHours: 'Mon-Fri 8:00-17:00'
      },
      {
        id: '8',
        name: 'Frozen Delights AB',
        companyName: 'Frozen Delights AB',
        supplierName: 'Frozen Delights AB',
        email: 'orders@frozendelights.se',
        phone: '+46 42 444 2222',
        address: 'Frozen Avenue 963, Malmö, Skåne 85274, Sweden',
        city: 'Malmö',
        country: 'Sweden',
        isActive: false,
        description: 'Specialized frozen food distributor offering a wide range of frozen vegetables, fruits, meats, and ready-to-eat meals for commercial kitchens.',
        website: 'https://frozendelights.se',
        logo: 'https://via.placeholder.com/80x80/00BCD4/FFFFFF?text=FD',
        isVerified: false,
        rating: 4.1,
        reviewCount: 34,
        createdAt: '2023-08-30',
        updatedAt: '2023-11-25',
        joinedDate: '2023-08-30',
        totalProducts: 85,
        categories: ['Frozen Foods', 'Packaged Goods'],
        relationshipStatus: 'pending',
        relationshipId: 'rel-008',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        minimumOrderAmount: 600,
        deliveryAreas: ['Malmö', 'Lund', 'Kristianstad'],
        contactPerson: 'Gunnar Larsson',
        businessHours: 'Mon-Fri 7:00-16:00'
      }
    ];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredSuppliers = this.suppliers.filter(supplier => {
      const matchesSearch = !this.searchQuery || 
        (supplier.companyName || supplier.supplierName).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (supplier.description || '').toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'all' || 
        (supplier.categories || []).includes(this.selectedCategory);
      
      const matchesStatus = this.selectedStatus === 'all' || 
        supplier.relationshipStatus === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  requestRelationship(supplier: MySupplier): void {
    this.selectedSupplier = supplier;
    this.showRequestForm = true;
    this.requestForm.reset({
      requestType: 'inquiry',
      message: ''
    });
  }

  submitRequest(): void {
    if (this.requestForm.valid && this.selectedSupplier) {
      const request = {
        id: '',
        buyerId: 'current-user-id',
        clientId: 'current-user-id',
        supplierId: this.selectedSupplier.id,
        requestType: this.requestForm.get('requestType')?.value,
        status: 'pending' as const,
        requestedAt: new Date().toISOString(),
        message: this.requestForm.get('message')?.value
      };

      this.supplierService.requestSupplierRelationship(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Success:', response.message);
            this.showRequestForm = false;
            this.selectedSupplier = null;
            this.loadSuppliers(); // Refresh the list
          },
          error: (error) => {
            console.error('Error requesting relationship:', error);
            this.showError('Failed to send relationship request');
          }
        });
    }
  }

  cancelRequest(): void {
    this.showRequestForm = false;
    this.selectedSupplier = null;
    this.requestForm.reset();
  }

  viewSupplierDetails(supplier: MySupplier): void {
    // Navigate to supplier details page
    console.log('View supplier details:', supplier);
  }

  placeOrder(supplier: MySupplier): void {
    // Navigate to order placement page
    console.log('Place order with supplier:', supplier);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'inactive': return 'status-inactive';
      default: return 'status-unknown';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  }

  canRequestRelationship(supplier: MySupplier): boolean {
    return (supplier as any).relationshipStatus === 'rejected' || !(supplier as any).relationshipId;
  }

  canPlaceOrder(supplier: MySupplier): boolean {
    return (supplier as any).relationshipStatus === 'active';
  }

  getSupplierRating(supplier: MySupplier): string {
    const rating = supplier.rating || 0;
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}