import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { environment } from '../../../../environments/environment';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  children?: NavigationItem[];
  roles: string[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-role-based-sidebar',
  templateUrl: './role-based-sidebar.component.html',
  styleUrls: ['./role-based-sidebar.component.scss']
})
export class RoleBasedSidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: any = null;
  currentRole: string = '';
  currentRoute: string = '';
  isCollapsed: boolean = false;
  appVersion: string = environment.version;
  
  // Navigation items based on roles
  navigationItems: NavigationItem[] = [
    // Client navigation
    {
      id: 'client-dashboard',
      label: 'navigation.dashboard',
      icon: 'dashboard',
      route: '/client/dashboard',
      roles: ['client', 'admin']
    },
    {
      id: 'client-suppliers',
      label: 'navigation.suppliers',
      icon: 'local_shipping',
      route: '/client/suppliers',
      roles: ['client', 'admin'],
      children: [
        {
          id: 'client-suppliers-my',
          label: 'navigation.mySuppliers',
          icon: 'list',
          route: '/client/suppliers/my-suppliers',
          roles: ['client', 'admin']
        },
        {
          id: 'client-suppliers-search',
          label: 'navigation.searchSuppliers',
          icon: 'search',
          route: '/client/suppliers/explore',
          roles: ['client', 'admin']
        }
      ]
    },
    {
      id: 'client-products',
      label: 'navigation.products',
      icon: 'inventory',
      route: '/client/products',
      roles: ['client', 'admin'],
      children: [
        {
          id: 'client-products-all',
          label: 'navigation.allItems',
          icon: 'list',
          route: '/client/products',
          roles: ['client', 'admin']
        },
        {
          id: 'client-products-on-sale',
          label: 'navigation.onSale',
          icon: 'local_offer',
          route: '/client/products?tab=on-sale',
          roles: ['client', 'admin']
        }
      ]
    },
    {
      id: 'client-orders',
      label: 'navigation.orders',
      icon: 'shopping_cart',
      route: '/client/orders',
      roles: ['client', 'admin'],
      children: [
        {
          id: 'client-orders-past',
          label: 'navigation.pastOrders',
          icon: 'history',
          route: '/client/orders?filter=past',
          roles: ['client', 'admin']
        },
        {
          id: 'client-orders-incoming',
          label: 'navigation.incomingOrders',
          icon: 'local_shipping',
          route: '/client/orders?filter=incoming',
          roles: ['client', 'admin']
        }
      ]
    },
    {
      id: 'client-shopping-list',
      label: 'navigation.shoppingList',
      icon: 'list_alt',
      route: '/client/shopping-lists',
      roles: ['client', 'admin']
    },
    {
      id: 'client-inventory',
      label: 'navigation.inventory',
      icon: 'warehouse',
      route: '/client/inventory',
      roles: ['client', 'admin']
    },
    {
      id: 'client-analysis',
      label: 'navigation.analysis',
      icon: 'bar_chart',
      route: '/client/analysis',
      roles: ['client', 'admin']
    },
    {
      id: 'client-team',
      label: 'navigation.team',
      icon: 'group',
      route: '/client/team',
      roles: ['client', 'admin']
    },
    {
      id: 'client-transactions',
      label: 'navigation.transactions',
      icon: 'receipt',
      route: '/client/transactions',
      roles: ['client', 'admin'],
      children: [
        {
          id: 'client-transactions-invoices',
          label: 'navigation.invoices',
          icon: 'receipt_long',
          route: '/client/transactions/invoices',
          roles: ['client', 'admin']
        },
        {
          id: 'client-transactions-purchase-orders',
          label: 'navigation.purchaseOrders',
          icon: 'shopping_cart_checkout',
          route: '/client/transactions/purchase-orders',
          roles: ['client', 'admin']
        }
      ]
    },
    
    // Supplier navigation
    {
      id: 'supplier-dashboard',
      label: 'navigation.supplierDashboard',
      icon: 'dashboard',
      route: '/supplier/dashboard',
      roles: ['supplier', 'admin']
    },
    {
      id: 'supplier-products',
      label: 'navigation.supplierProducts',
      icon: 'inventory_2',
      route: '/supplier/products',
      roles: ['supplier', 'admin']
    },
    {
      id: 'supplier-inventory',
      label: 'navigation.supplierInventory',
      icon: 'warehouse',
      route: '/supplier/inventory',
      roles: ['supplier', 'admin']
    },
    {
      id: 'supplier-ean',
      label: 'navigation.ean',
      icon: 'qr_code',
      route: '/supplier/ean',
      roles: ['supplier', 'admin']
    },
    {
      id: 'supplier-edi',
      label: 'navigation.edi',
      icon: 'description',
      route: '/supplier/edi',
      roles: ['supplier', 'admin']
    },
    {
      id: 'supplier-analysis',
      label: 'navigation.supplierAnalysis',
      icon: 'analytics',
      route: '/supplier/analysis',
      roles: ['supplier', 'admin']
    },
    
    // Admin navigation
    {
      id: 'admin-dashboard',
      label: 'navigation.adminDashboard',
      icon: 'admin_panel_settings',
      route: '/admin/dashboard',
      roles: ['admin']
    },
    {
      id: 'admin-clients',
      label: 'navigation.clients',
      icon: 'people',
      route: '/admin/client',
      roles: ['admin'],
      children: [
        {
          id: 'admin-clients-dashboard',
          label: 'navigation.dashboard',
          icon: 'dashboard',
          route: '/admin/client/dashboard',
          roles: ['admin']
        },
        {
          id: 'admin-clients-suppliers',
          label: 'navigation.suppliers',
          icon: 'local_shipping',
          route: '/admin/client/suppliers',
          roles: ['admin']
        },
        {
          id: 'admin-clients-products',
          label: 'navigation.products',
          icon: 'inventory',
          route: '/admin/client/products',
          roles: ['admin']
        },
        {
          id: 'admin-clients-orders',
          label: 'navigation.orders',
          icon: 'shopping_cart',
          route: '/admin/client/orders',
          roles: ['admin']
        },
        {
          id: 'admin-clients-shopping-list',
          label: 'navigation.shoppingList',
          icon: 'list_alt',
          route: '/admin/client/shopping-list',
          roles: ['admin']
        },
        {
          id: 'admin-clients-inventory',
          label: 'navigation.inventory',
          icon: 'warehouse',
          route: '/admin/client/inventory',
          roles: ['admin']
        },
        {
          id: 'admin-clients-analysis',
          label: 'navigation.analysis',
          icon: 'bar_chart',
          route: '/admin/client/analysis',
          roles: ['admin']
        },
        {
          id: 'admin-clients-team',
          label: 'navigation.team',
          icon: 'group',
          route: '/admin/client/team',
          roles: ['admin']
        },
        {
          id: 'admin-clients-transactions',
          label: 'navigation.transactions',
          icon: 'receipt',
          route: '/admin/client/invoices',
          roles: ['admin']
        }
      ]
    },
    {
      id: 'admin-suppliers',
      label: 'navigation.suppliers',
      icon: 'local_shipping',
      route: '/admin/supplier',
      roles: ['admin'],
      children: [
        {
          id: 'admin-suppliers-dashboard',
          label: 'navigation.dashboard',
          icon: 'dashboard',
          route: '/admin/supplier/dashboard',
          roles: ['admin']
        },
        {
          id: 'admin-suppliers-products',
          label: 'navigation.products',
          icon: 'inventory_2',
          route: '/admin/supplier/products',
          roles: ['admin']
        },
        {
          id: 'admin-suppliers-inventory',
          label: 'navigation.inventory',
          icon: 'warehouse',
          route: '/admin/supplier/inventory',
          roles: ['admin']
        },
        {
          id: 'admin-suppliers-ean',
          label: 'navigation.ean',
          icon: 'qr_code',
          route: '/admin/supplier/ean',
          roles: ['admin']
        },
        {
          id: 'admin-suppliers-edi',
          label: 'navigation.edi',
          icon: 'description',
          route: '/admin/supplier/edi',
          roles: ['admin']
        },
        {
          id: 'admin-suppliers-analysis',
          label: 'navigation.analysis',
          icon: 'analytics',
          route: '/admin/supplier/analysis',
          roles: ['admin']
        }
      ]
    },
    {
      id: 'admin-users',
      label: 'navigation.users',
      icon: 'person',
      route: '/admin/users',
      roles: ['admin']
    },
    {
      id: 'admin-settings',
      label: 'navigation.settings',
      icon: 'settings',
      route: '/admin/settings',
      roles: ['admin']
    }
  ];

  filteredNavigationItems: NavigationItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.setupRouteTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      console.log('RoleBasedSidebar - User loaded:', user);
      this.currentUser = user;
      this.currentRole = user?.role || 'client';
      console.log('RoleBasedSidebar - Current role:', this.currentRole);
      this.filterNavigationItems();
      console.log('RoleBasedSidebar - Filtered navigation items:', this.filteredNavigationItems);
    });
  }

  private setupRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      this.updateActiveStates();
    });
  }

  private filterNavigationItems(): void {
    this.filteredNavigationItems = this.navigationItems.filter(item => 
      item.roles.includes(this.currentRole)
    );
  }

  private updateActiveStates(): void {
    this.filteredNavigationItems.forEach(item => {
      item.isExpanded = this.isItemActive(item);
      if (item.children) {
        item.children.forEach(child => {
          child.isExpanded = this.isItemActive(child);
        });
      }
    });
  }

  onItemClick(item: NavigationItem): void {
    console.log('RoleBasedSidebar - Item clicked:', item);
    console.log('RoleBasedSidebar - Current route:', this.currentRoute);
    console.log('RoleBasedSidebar - Current role:', this.currentRole);
    
    if (item.children) {
      item.isExpanded = !item.isExpanded;
      console.log('RoleBasedSidebar - Toggled expansion for item with children');
    } else {
      console.log('RoleBasedSidebar - Navigating to:', item.route);
      this.router.navigate([item.route]).then(success => {
        console.log('RoleBasedSidebar - Navigation successful:', success);
        if (success) {
          console.log('RoleBasedSidebar - Navigation completed, new route:', this.router.url);
        }
      }).catch(error => {
        console.error('RoleBasedSidebar - Navigation error:', error);
      });
    }
  }

  onChildItemClick(child: NavigationItem): void {
    console.log('RoleBasedSidebar - Child item clicked:', child);
    console.log('RoleBasedSidebar - Navigating to child route:', child.route);
    this.router.navigate([child.route]).then(success => {
      console.log('RoleBasedSidebar - Child navigation successful:', success);
      if (success) {
        console.log('RoleBasedSidebar - Child navigation completed, new route:', this.router.url);
      }
    }).catch(error => {
      console.error('RoleBasedSidebar - Child navigation error:', error);
    });
  }

  isItemExpanded(item: NavigationItem): boolean {
    return item.isExpanded || false;
  }

  isItemActive(item: NavigationItem): boolean {
    return this.currentRoute.startsWith(item.route);
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  isChildItemActive(child: NavigationItem): boolean {
    return this.currentRoute.startsWith(child.route);
  }

  getRoleDisplayName(): string {
    return this.i18n.translate(`roles.${this.currentRole}`);
  }

  getUserDisplayName(): string {
    return this.currentUser?.firstName || this.i18n.translate('common.user');
  }
}
