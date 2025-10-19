import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

interface MenuItem {
  labelKey?: string;
  label?: string;
  icon: string;
  route: string;
  subItems?: MenuItem[];
  expanded?: boolean;
  badge?: string | number;
}

interface User {
  role: 'client' | 'supplier' | 'admin';
  name?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentRoute = '';
  isClient = false;
  isSupplier = false;
  isAdmin = false;
  menuItems: MenuItem[] = [];
  currentUser: User | null = null;
  searchQuery = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    console.log('Sidebar - OnInit called');
    this.trackCurrentRoute();
    this.subscribeToUserChanges();
    // Set default menu items to ensure sidebar is always visible
    this.setDefaultMenuItems();
    console.log('Sidebar - Initial menu items:', this.menuItems);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(route: string): void {
    console.log('Navigating to:', route);
    this.router.navigate([route]).then(success => {
      console.log('Navigation successful:', success);
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  toggleSubItems(menuItem: MenuItem): void {
    if (menuItem.subItems) {
      menuItem.expanded = !menuItem.expanded;
    }
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  private trackCurrentRoute(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  private subscribeToUserChanges(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('Sidebar - User changed:', user);
        this.currentUser = user;
        if (user) {
          this.setUserRole(user);
          this.setMenuItems();
          console.log('Sidebar - Menu items set:', this.menuItems);
        }
      });
  }

  private setUserRole(user: User): void {
    this.isClient = user.role === 'client';
    this.isSupplier = user.role === 'supplier';
    this.isAdmin = user.role === 'admin';
  }

  private setMenuItems(): void {
    console.log('Sidebar - Setting menu items. User role flags:', {
      isAdmin: this.isAdmin,
      isClient: this.isClient,
      isSupplier: this.isSupplier
    });
    
    if (this.isAdmin) {
      this.menuItems = this.getAdminMenuItems();
      console.log('Sidebar - Set admin menu items');
    } else if (this.isClient) {
      this.menuItems = this.getClientMenuItems();
      console.log('Sidebar - Set client menu items');
    } else if (this.isSupplier) {
      this.menuItems = this.getSupplierMenuItems();
      console.log('Sidebar - Set supplier menu items');
    } else {
      // Fallback to default menu items
      this.setDefaultMenuItems();
      console.log('Sidebar - Set default menu items');
    }
  }

  private setDefaultMenuItems(): void {
    // This will be overridden by role-specific menus
    this.menuItems = this.getClientMenuItems();
  }

  private getClientMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/client/dashboard'
      },
      {
        label: 'Suppliers',
        icon: 'store',
        route: '/client/suppliers',
        subItems: [
          { label: 'My Suppliers', icon: 'list', route: '/client/suppliers/my-suppliers' },
          { label: 'Search for Suppliers', icon: 'search', route: '/client/suppliers/explore' }
        ]
      },
      {
        label: 'Products',
        icon: 'inventory_2',
        route: '/client/products',
        subItems: [
          { label: 'All Items', icon: 'list', route: '/client/products' },
          { label: 'On Sale', icon: 'local_offer', route: '/client/products?tab=on-sale' }
        ]
      },
      {
        label: 'Orders',
        icon: 'shopping_cart',
        route: '/client/orders',
        subItems: [
          { label: 'Past Orders', icon: 'history', route: '/client/orders?filter=past' },
          { label: 'Incoming Orders', icon: 'local_shipping', route: '/client/orders?filter=incoming' }
        ]
      },
      {
        label: 'Shopping List',
        icon: 'checklist',
        route: '/client/shopping-lists'
      },
      {
        label: 'Inventory',
        icon: 'warehouse',
        route: '/client/inventory'
      },
      {
        label: 'Analysis',
        icon: 'analytics',
        route: '/client/analysis'
      },
      {
        label: 'Team',
        icon: 'group',
        route: '/client/team'
      },
      {
        label: 'Transactions',
        icon: 'receipt_long',
        route: '/client/transactions'
      }
    ];
  }

  private getSupplierMenuItems(): MenuItem[] {
    return [
      {
        labelKey: 'navigation.supplierDashboard',
        icon: 'dashboard',
        route: '/supplier/dashboard'
      },
      {
        labelKey: 'navigation.products',
        icon: 'inventory',
        route: '/supplier/products'
      },
      {
        labelKey: 'navigation.inventory',
        icon: 'warehouse',
        route: '/supplier/inventory'
      },
      {
        labelKey: 'navigation.ean',
        icon: 'qr_code',
        route: '/supplier/ean'
      },
      {
        labelKey: 'navigation.edi',
        icon: 'integration_instructions',
        route: '/supplier/edi'
      },
      {
        labelKey: 'navigation.analysis',
        icon: 'analytics',
        route: '/supplier/analysis'
      }
    ];
  }

  private getAdminMenuItems(): MenuItem[] {
    return [
      {
        labelKey: 'navigation.adminDashboard',
        icon: 'admin_panel_settings',
        route: '/admin/dashboard'
      },
      {
        labelKey: 'navigation.userManagement',
        icon: 'people',
        route: '/admin/users'
      },
      {
        labelKey: 'navigation.systemSettings',
        icon: 'settings',
        route: '/admin/settings'
      },
      {
        labelKey: 'navigation.clients',
        icon: 'business',
        route: '/admin/client',
        subItems: [
          { labelKey: 'navigation.clientDashboard', icon: 'dashboard', route: '/admin/client/dashboard' },
          { labelKey: 'navigation.suppliers', icon: 'store', route: '/admin/client/suppliers' },
          { labelKey: 'navigation.products', icon: 'inventory', route: '/admin/client/products' },
          { labelKey: 'navigation.orders', icon: 'shopping_cart', route: '/admin/client/orders' },
          { labelKey: 'navigation.shoppingList', icon: 'shopping_list', route: '/admin/client/shopping-lists' },
          { labelKey: 'navigation.inventory', icon: 'warehouse', route: '/admin/client/inventory' },
          { labelKey: 'navigation.analysis', icon: 'analytics', route: '/admin/client/analysis' },
          { labelKey: 'navigation.team', icon: 'group', route: '/admin/client/team' },
          { labelKey: 'navigation.transactions', icon: 'receipt', route: '/admin/client/transactions' }
        ]
      },
      {
        labelKey: 'navigation.suppliers',
        icon: 'store',
        route: '/admin/supplier',
        subItems: [
          { labelKey: 'navigation.supplierDashboard', icon: 'dashboard', route: '/admin/supplier/dashboard' },
          { labelKey: 'navigation.products', icon: 'inventory', route: '/admin/supplier/products' },
          { labelKey: 'navigation.inventory', icon: 'warehouse', route: '/admin/supplier/inventory' },
          { labelKey: 'navigation.ean', icon: 'qr_code', route: '/admin/supplier/ean' },
          { labelKey: 'navigation.edi', icon: 'integration_instructions', route: '/admin/supplier/edi' },
          { labelKey: 'navigation.analysis', icon: 'analytics', route: '/admin/supplier/analysis' }
        ]
      }
    ];
  }


  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  getUserRoleLabel(): string {
    if (!this.currentUser) return '';
    
    switch (this.currentUser.role) {
      case 'admin':
        return this.i18n.translate('roles.admin');
      case 'client':
        return this.i18n.translate('roles.client');
      case 'supplier':
        return this.i18n.translate('roles.supplier');
      default:
        return this.i18n.translate('roles.user');
    }
  }

}