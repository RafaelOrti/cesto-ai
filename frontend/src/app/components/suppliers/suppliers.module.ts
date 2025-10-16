import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SuppliersComponent } from './suppliers.component';
import { SearchSuppliersComponent } from './search-suppliers/search-suppliers.component';
import { SupplierProfileComponent } from './supplier-profile/supplier-profile.component';
import { DemoSupplierSearchComponent } from './demo-supplier-search/demo-supplier-search.component';

const routes = [
  {
    path: 'suppliers',
    children: [
      { path: '', redirectTo: 'demo', pathMatch: 'full' },
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
    DemoSupplierSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    SuppliersComponent,
    SearchSuppliersComponent,
    SupplierProfileComponent
  ]
})
export class SuppliersModule { }