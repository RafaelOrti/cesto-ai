import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientInsightsComponent } from './components/clients/client-insights/client-insights.component';
import { ExploreSuppliersComponent } from './components/clients/explore-suppliers/explore-suppliers.component';
import { MySuppliersComponent } from './components/clients/my-suppliers/my-suppliers.component';
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
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [AuthGuard], // Temporarily disabled for testing
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
        path: 'clients',
        children: [
          {
            path: 'insights',
            component: ClientInsightsComponent,
          },
          {
            path: 'explore',
            component: ExploreSuppliersComponent,
          },
          {
            path: 'my-suppliers',
            component: MySuppliersComponent,
          },
          {
            path: '',
            redirectTo: 'insights',
            pathMatch: 'full'
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
        path: 'shopping-list',
        component: ShoppingListComponent,
      },
      {
        path: 'inventory',
        component: InventoryComponent,
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
        path: 'suppliers',
        component: SuppliersComponent,
      },
    ],
  },
  {
    path: 'supplier',
    component: SupplierDashboardComponent,
    // canActivate: [AuthGuard], // Temporarily disabled for testing
  },
  {
    path: 'supplier/edi',
    component: EdiComponent,
    // canActivate: [AuthGuard], // Temporarily disabled for testing
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        // canActivate: [AuthGuard], // Temporarily disabled for testing
      },
      {
        path: 'users',
        component: AdminDashboardComponent, // Will handle user management views
      },
      {
        path: 'settings',
        component: AdminDashboardComponent, // Will handle system settings views
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
