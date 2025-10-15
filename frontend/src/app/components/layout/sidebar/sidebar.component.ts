import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  subItems?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentRoute = '';
  isBuyer = false;
  isSupplier = false;
  isAdmin = false;

  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Track current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    // Get user role and set menu items
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isBuyer = user.role === 'buyer';
        this.isSupplier = user.role === 'supplier';
        this.isAdmin = user.role === 'admin';
        this.setMenuItems();
      }
    });
  }

  private setMenuItems() {
    if (this.isBuyer || this.isAdmin) {
      this.menuItems = [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/dashboard'
        },
        {
          label: 'Suppliers',
          icon: 'store',
          route: '/suppliers',
          subItems: [
            { label: 'My Suppliers', icon: 'list', route: '/suppliers/my' },
            { label: 'Search for Suppliers', icon: 'search', route: '/suppliers/search' }
          ]
        },
        {
          label: 'Products',
          icon: 'inventory',
          route: '/products',
          subItems: [
            { label: 'All Items', icon: 'category', route: '/products/all' },
            { label: 'Campaigns', icon: 'campaign', route: '/products/campaigns' },
            { label: 'On Sale', icon: 'local_offer', route: '/products/sale' }
          ]
        },
        {
          label: 'Orders',
          icon: 'shopping_cart',
          route: '/orders',
          subItems: [
            { label: 'Past Orders', icon: 'history', route: '/orders/past' },
            { label: 'Upcoming Deliveries', icon: 'schedule', route: '/orders/upcoming' },
            { label: 'Purchase Orders', icon: 'receipt', route: '/orders/po' },
            { label: 'Unfulfilled Orders', icon: 'error', route: '/orders/unfulfilled' }
          ]
        },
        {
          label: 'Shopping List',
          icon: 'shopping_list',
          route: '/shopping-list'
        },
        {
          label: 'Inventory',
          icon: 'warehouse',
          route: '/inventory'
        },
        {
          label: 'Analysis',
          icon: 'analytics',
          route: '/analysis'
        },
        {
          label: 'Team',
          icon: 'group',
          route: '/team'
        },
        {
          label: 'Transactions',
          icon: 'payment',
          route: '/transactions'
        }
      ];
    } else if (this.isSupplier) {
      this.menuItems = [
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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleSubItems(menuItem: MenuItem) {
    if (menuItem.subItems) {
      menuItem.expanded = !menuItem.expanded;
    }
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
}
