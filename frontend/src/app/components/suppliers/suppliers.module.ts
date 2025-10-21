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

// Shared module for TranslatePipe
import { CoreModule } from '../../core/core.module';

import { SuppliersComponent } from './suppliers.component';
import { SearchSuppliersComponent } from './search-suppliers/search-suppliers.component';
import { SupplierProfileComponent } from './supplier-profile/supplier-profile.component';

const routes = [
  {
    path: 'suppliers',
    children: [
      { path: '', component: SuppliersComponent },
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
    SupplierProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    // Shared module for TranslatePipe
    CoreModule,
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