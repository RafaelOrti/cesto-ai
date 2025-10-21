import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientInsightsComponent } from './components/clients/client-insights/client-insights.component';
import { SearchSuppliersComponent } from './components/suppliers/search-suppliers/search-suppliers.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { TeamComponent } from './components/team/team.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SupplierDashboardComponent } from './components/supplier-dashboard/supplier-dashboard.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { EdiComponent } from './components/edi/edi.component';
import { EANComponent } from './components/ean/ean.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RoleBasedSidebarComponent } from './components/layout/role-based-sidebar/role-based-sidebar.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AdvancedInventoryComponent } from './components/inventory/advanced-inventory/advanced-inventory.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { SupplierProductsComponent } from './components/supplier-products/supplier-products.component';
import { SupplierInventoryComponent } from './components/supplier-inventory/supplier-inventory.component';
import { SupplierAnalysisComponent } from './components/supplier-analysis/supplier-analysis.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';
import { EanManagementComponent } from './components/ean-management/ean-management.component';
import { SupplierProductsManagementComponent } from './components/supplier-products-management/supplier-products-management.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HelpComponent } from './components/help/help.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
  },
  
  // Client routes
  {
    path: 'client',
    component: LayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'client' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: ClientDashboardComponent,
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            component: SuppliersComponent,
          },
          {
            path: 'search',
            component: SearchSuppliersComponent,
          },
          {
            path: ':id',
            loadChildren: () => import('./components/suppliers/suppliers.module').then(m => m.SuppliersModule)
          }
        ]
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'shopping-lists',
        component: ShoppingListComponent,
      },
      {
        path: 'inventory',
        component: AdvancedInventoryComponent,
      },
      {
        path: 'analysis',
        component: AnalysisComponent,
      },
      {
        path: 'team',
        component: TeamComponent,
      },
      {
        path: 'transactions',
        children: [
          {
            path: 'invoices',
            component: TransactionsComponent,
          },
          {
            path: 'purchase-orders',
            component: TransactionsComponent,
          },
          {
            path: '',
            redirectTo: 'invoices',
            pathMatch: 'full'
          }
        ]
      },
    ],
  },

  // Settings, Help, and Notifications will be rendered inside Layout (see legacy section below)

  // Supplier routes
  {
    path: 'supplier',
    component: LayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'supplier' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: SupplierDashboardComponent,
      },
      {
        path: 'products',
        component: SupplierProductsComponent,
      },
      {
        path: 'inventory',
        component: SupplierInventoryComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'analysis',
        component: SupplierAnalysisComponent,
      },
      {
        path: 'edi',
        component: EdiComponent,
      },
      {
        path: 'ean',
        component: EanManagementComponent,
      },
    ],
  },

  // Admin routes
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
      },
      {
        path: 'users',
        component: UserManagementComponent,
      },
      {
        path: 'settings',
        component: SystemSettingsComponent,
      },
      {
        path: 'client',
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            component: ClientDashboardComponent,
          },
          {
            path: 'suppliers',
            children: [
              {
                path: '',
                component: SuppliersComponent,
              },
              {
                path: 'search',
                component: SearchSuppliersComponent,
              },
              {
                path: ':id',
                loadChildren: () => import('./components/suppliers/suppliers.module').then(m => m.SuppliersModule)
              }
            ]
          },
          {
            path: 'products',
            component: ProductsComponent,
          },
          {
            path: 'orders',
            component: OrdersComponent,
          },
          {
            path: 'shopping-lists',
            component: ShoppingListComponent,
          },
          {
            path: 'inventory',
            component: AdvancedInventoryComponent,
          },
          {
            path: 'analysis',
            component: AnalysisComponent,
          },
          {
            path: 'team',
            component: TeamComponent,
          },
          {
            path: 'transactions',
            children: [
              {
                path: 'invoices',
                component: TransactionsComponent,
              },
              {
                path: 'purchase-orders',
                component: TransactionsComponent,
              },
              {
                path: '',
                redirectTo: 'invoices',
                pathMatch: 'full'
              }
            ]
          },
        ],
      },
      {
        path: 'supplier',
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            component: SupplierDashboardComponent,
          },
          {
            path: 'products',
            component: SupplierProductsManagementComponent,
          },
          {
            path: 'inventory',
            component: AdvancedInventoryComponent,
          },
          {
            path: 'ean',
            component: EanManagementComponent,
          },
          {
            path: 'edi',
            component: EdiComponent,
          },
          {
            path: 'analysis',
            component: AnalysisComponent,
          },
        ],
      },
    ]
  },

  // Legacy routes for backward compatibility
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'suppliers',
        children: [
          {
            path: '',
            component: SuppliersComponent,
          },
          {
            path: 'search',
            component: SearchSuppliersComponent,
          },
          {
            path: ':id',
            loadChildren: () => import('./components/suppliers/suppliers.module').then(m => m.SuppliersModule)
          }
        ]
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'shopping-lists',
        component: ShoppingListComponent,
      },
      {
        path: 'inventory',
        component: AdvancedInventoryComponent,
      },
      {
        path: 'analysis',
        component: AnalysisComponent,
      },
      {
        path: 'team',
        component: TeamComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'supplier-dashboard',
        component: SupplierDashboardComponent,
      },
      {
        path: 'edi',
        component: EdiComponent,
      },
      // Global utility routes rendered within the layout
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
    ],
  },

  // Main routes (direct access)
  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
  },
  {
    path: 'supplier-dashboard',
    component: SupplierDashboardComponent,
  },
  {
    path: 'supplier-products',
    component: SupplierProductsComponent,
  },
  {
    path: 'supplier-inventory',
    component: SupplierInventoryComponent,
  },
  {
    path: 'supplier-analysis',
    component: SupplierAnalysisComponent,
  },
  {
    path: 'client-insights',
    component: ClientInsightsComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
  },

  // Catch all route
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}