import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  subItems?: MenuItem[];
  expanded?: boolean;
}

interface User {
  role: 'buyer' | 'supplier' | 'admin';
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentRoute = '';
  isClient = false;
  isSupplier = false;
  isAdmin = false;
  menuItems: MenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.trackCurrentRoute();
    this.subscribeToUserChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
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
        if (user) {
          this.setUserRole(user);
          this.setMenuItems();
        }
      });
  }

  private setUserRole(user: User): void {
    this.isClient = user.role === 'buyer';
    this.isSupplier = user.role === 'supplier';
    this.isAdmin = user.role === 'admin';
  }

  private setMenuItems(): void {
    if (this.isAdmin) {
      this.menuItems = this.getAdminMenuItems();
    } else if (this.isClient) {
      this.menuItems = this.getClientMenuItems();
    } else if (this.isSupplier) {
      this.menuItems = this.getSupplierMenuItems();
    }
  }

         private getClientMenuItems(): MenuItem[] {
           return [
             {
               label: 'DASHBOARD',
               icon: 'dashboard',
               route: '/dashboard'
             },
             {
               label: 'SUPPLIERS',
               icon: 'store',
               route: '/suppliers',
               subItems: [
                 { label: 'Demo', icon: 'star', route: '/suppliers/demo' },
                 { label: 'Search for suppliers', icon: 'search', route: '/suppliers/search' },
                 { label: 'My Suppliers', icon: 'list', route: '/suppliers' }
               ]
             },
             {
               label: 'PRODUCTS',
               icon: 'inventory',
               route: '/products'
             },
             {
               label: 'ORDERS',
               icon: 'shopping_cart',
               route: '/orders'
             },
             {
               label: 'SHOPPING LIST',
               icon: 'shopping_list',
               route: '/shopping-list'
             },
             {
               label: 'INVENTORY',
               icon: 'warehouse',
               route: '/inventory'
             },
             {
               label: 'ANALYSIS',
               icon: 'analytics',
               route: '/analysis'
             },
             {
               label: 'TEAM',
               icon: 'group',
               route: '/team'
             },
             {
               label: 'INVOICES',
               icon: 'receipt',
               route: '/invoices'
             }
           ];
         }

  private getSupplierMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard'
      },
      {
        label: 'Products',
        icon: 'inventory',
        route: '/products',
        subItems: [
          { label: 'All Products', icon: 'category', route: '/products/all' },
          { label: 'Campaigns', icon: 'campaign', route: '/products/campaigns' },
          { label: 'On Sale', icon: 'local_offer', route: '/products/sale' }
        ]
      },
      {
        label: 'Orders',
        icon: 'shopping_cart',
        route: '/orders',
        subItems: [
          { label: 'Incoming Orders', icon: 'inbox', route: '/orders/incoming' },
          { label: 'Order History', icon: 'history', route: '/orders/history' },
          { label: 'Issues', icon: 'error', route: '/orders/issues' }
        ]
      },
      {
        label: 'Inventory',
        icon: 'warehouse',
        route: '/inventory'
      },
      {
        label: 'Invoices',
        icon: 'receipt_long',
        route: '/invoices'
      },
      {
        label: 'Analysis',
        icon: 'analytics',
        route: '/analysis'
      }
    ];
  }
}
