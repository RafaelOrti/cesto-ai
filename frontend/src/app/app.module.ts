import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientInsightsComponent } from './components/clients/client-insights/client-insights.component';
import { ExploreSuppliersComponent } from './components/clients/explore-suppliers/explore-suppliers.component';
import { SuppliersModule } from './components/suppliers/suppliers.module';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { TeamComponent } from './components/team/team.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SupplierDashboardComponent } from './components/supplier-dashboard/supplier-dashboard.component';
import { EdiComponent } from './components/edi/edi.component';
import { EANComponent } from './components/ean/ean.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RoleBasedSidebarComponent } from './components/layout/role-based-sidebar/role-based-sidebar.component';
import { ColorThemeConfigComponent } from './components/admin-dashboard/color-theme-config/color-theme-config.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { ProductsOnSaleComponent } from './components/products/products-on-sale/products-on-sale.component';
import { LoadingComponent } from './core/components/loading/loading.component';
import { NotificationsComponent } from './core/components/notifications/notifications.component';

import { AuthService } from './core/services/auth.service';
import { SupplierService } from './services/supplier.service';
import { ColorThemeService } from './services/color-theme.service';
import { UserManagementService } from './services/user-management.service';
import { ProductsService } from './services/products.service';
import { ThemeInitializerService } from './core/services/theme-initializer.service';
import { UtilsService } from './core/services/utils.service';
import { StateService } from './core/services/state.service';
import { CacheService } from './core/services/cache.service';
import { NotificationService } from './core/services/notification.service';
import { ValidationService } from './core/services/validation.service';
import { I18nService } from './core/services/i18n.service';
import { AdvancedInventoryService } from './services/advanced-inventory.service';
import { SupplierDashboardService } from './services/supplier-dashboard.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { CacheInterceptor } from './core/interceptors/cache.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AdvancedInventoryComponent } from './components/inventory/advanced-inventory/advanced-inventory.component';
import { ProviderOrdersComponent } from './components/provider/orders/orders.component';
import { EanManagementComponent } from './components/ean-management/ean-management.component';
import { SupplierProductsManagementComponent } from './components/supplier-products-management/supplier-products-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { SupplierProductsComponent } from './components/supplier-products/supplier-products.component';
import { SupplierInventoryComponent } from './components/supplier-inventory/supplier-inventory.component';
import { SupplierAnalysisComponent } from './components/supplier-analysis/supplier-analysis.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ClientDashboardComponent,
    ClientInsightsComponent,
    ExploreSuppliersComponent,
    ProductsComponent,
    OrdersComponent,
    ShoppingListComponent,
    InventoryComponent,
    AnalysisComponent,
    TeamComponent,
    TransactionsComponent,
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    SupplierDashboardComponent,
    SupplierProductsComponent,
    SupplierAnalysisComponent,
    EdiComponent,
    EANComponent,
    AdminDashboardComponent,
    RoleBasedSidebarComponent,
    ColorThemeConfigComponent,
    ProductsListComponent,
    ProductsOnSaleComponent,
    LoadingComponent,
    NotificationsComponent,
    ProviderOrdersComponent,
    OnboardingComponent,
    AdvancedInventoryComponent,
    EanManagementComponent,
    SupplierProductsManagementComponent,
    UserManagementComponent,
    SystemSettingsComponent,
    ClientDashboardComponent,
    SupplierProductsComponent,
    SupplierInventoryComponent,
    SupplierAnalysisComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    SuppliersModule,
    SharedModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatMenuModule,
    MatExpansionModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSliderModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressBarModule,
    MatGridListModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
  ],
  providers: [
    AuthService,
    SupplierService,
    ColorThemeService,
    UserManagementService,
    ProductsService,
    ThemeInitializerService,
    UtilsService,
    StateService,
    CacheService,
    NotificationService,
    ValidationService,
    I18nService,
    AdvancedInventoryService,
    SupplierDashboardService,
    DatePipe,
    {
      provide: 'API_BASE_URL',
      useValue: 'http://localhost:3400/api/v1'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
