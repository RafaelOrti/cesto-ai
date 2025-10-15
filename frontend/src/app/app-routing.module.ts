import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { TeamComponent } from './components/team/team.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
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
        component: SuppliersComponent,
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
    ],
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
