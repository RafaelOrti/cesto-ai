import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { SuppliersComponent } from './suppliers.component';
import { SearchSuppliersComponent } from './search-suppliers/search-suppliers.component';
import { SupplierProfileComponent } from './supplier-profile/supplier-profile.component';
import { DemoSupplierSearchComponent } from './demo-supplier-search/demo-supplier-search.component';
import { MySuppliersComponent } from '../clients/my-suppliers/my-suppliers.component';
import { SupplierProductsComponent } from './supplier-products/supplier-products.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { SuppliersEnhancedComponent } from './suppliers-enhanced.component';

const routes = [
  {
    path: 'suppliers',
    children: [
      { path: '', redirectTo: 'demo', pathMatch: 'full' as const },
      { path: 'demo', component: DemoSupplierSearchComponent },
      { path: 'search', component: SearchSuppliersComponent },
      { path: ':id', component: SupplierProfileComponent },
      { path: ':id/order', component: SupplierProfileComponent }
    ]
  }
];

@NgModule({
  declarations: [
    SuppliersComponent,
    SearchSuppliersComponent,
    SupplierProfileComponent,
    DemoSupplierSearchComponent,
    SupplierProductsComponent,
    OrderHistoryComponent,
    SuppliersEnhancedComponent,
    MySuppliersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule
  ],
  exports: [
    SuppliersComponent,
    SearchSuppliersComponent,
    SupplierProfileComponent
  ]
})
export class SuppliersModule { }