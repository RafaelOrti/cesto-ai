import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { User, Product, Supplier, Order, Category, SearchFilters } from '../../../shared/types/common.types';

/**
 * Global state management service using RxJS
 * Provides centralized state management for the entire application
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  // ============================================================================
  // USER STATE
  // ============================================================================
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly userRoleSubject = new BehaviorSubject<'admin' | 'supplier' | 'client' | null>(null);
  public readonly userRole$ = this.userRoleSubject.asObservable();

  // ============================================================================
  // PRODUCTS STATE
  // ============================================================================
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  public readonly products$ = this.productsSubject.asObservable();

  private readonly selectedProductSubject = new BehaviorSubject<Product | null>(null);
  public readonly selectedProduct$ = this.selectedProductSubject.asObservable();

  private readonly productFiltersSubject = new BehaviorSubject<SearchFilters>({});
  public readonly productFilters$ = this.productFiltersSubject.asObservable();

  private readonly filteredProductsSubject = new BehaviorSubject<Product[]>([]);
  public readonly filteredProducts$ = this.filteredProductsSubject.asObservable();

  // ============================================================================
  // SUPPLIERS STATE
  // ============================================================================
  private readonly suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  public readonly suppliers$ = this.suppliersSubject.asObservable();

  private readonly selectedSupplierSubject = new BehaviorSubject<Supplier | null>(null);
  public readonly selectedSupplier$ = this.selectedSupplierSubject.asObservable();

  // ============================================================================
  // ORDERS STATE
  // ============================================================================
  private readonly ordersSubject = new BehaviorSubject<Order[]>([]);
  public readonly orders$ = this.ordersSubject.asObservable();

  private readonly selectedOrderSubject = new BehaviorSubject<Order | null>(null);
  public readonly selectedOrder$ = this.selectedOrderSubject.asObservable();

  // ============================================================================
  // CATEGORIES STATE
  // ============================================================================
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  public readonly categories$ = this.categoriesSubject.asObservable();

  // ============================================================================
  // UI STATE
  // ============================================================================
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  public readonly error$ = this.errorSubject.asObservable();

  private readonly successMessageSubject = new BehaviorSubject<string | null>(null);
  public readonly successMessage$ = this.successMessageSubject.asObservable();

  private readonly sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  public readonly sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  private readonly currentPageSubject = new BehaviorSubject<string>('dashboard');
  public readonly currentPage$ = this.currentPageSubject.asObservable();

  // ============================================================================
  // CART STATE
  // ============================================================================
  private readonly cartItemsSubject = new BehaviorSubject<{product: Product; quantity: number}[]>([]);
  public readonly cartItems$ = this.cartItemsSubject.asObservable();

  private readonly cartTotalSubject = new BehaviorSubject<number>(0);
  public readonly cartTotal$ = this.cartTotalSubject.asObservable();

  private readonly cartItemCountSubject = new BehaviorSubject<number>(0);
  public readonly cartItemCount$ = this.cartItemCountSubject.asObservable();

  // ============================================================================
  // WISHLIST STATE
  // ============================================================================
  private readonly wishlistSubject = new BehaviorSubject<Product[]>([]);
  public readonly wishlist$ = this.wishlistSubject.asObservable();

  // ============================================================================
  // NOTIFICATIONS STATE
  // ============================================================================
  private readonly notificationsSubject = new BehaviorSubject<any[]>([]);
  public readonly notifications$ = this.notificationsSubject.asObservable();

  private readonly unreadNotificationsSubject = new BehaviorSubject<number>(0);
  public readonly unreadNotifications$ = this.unreadNotificationsSubject.asObservable();

  constructor() {
    // Initialize computed observables
    this.initializeComputedObservables();
    
    // Load initial state from localStorage
    this.loadInitialState();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeComputedObservables(): void {
    // Update filtered products when products or filters change
    combineLatest([
      this.products$,
      this.productFilters$
    ]).pipe(
      map(([products, filters]) => this.filterProducts(products, filters))
    ).subscribe(filteredProducts => {
      this.filteredProductsSubject.next(filteredProducts);
    });

    // Update cart totals when cart items change
    this.cartItems$.pipe(
      map(items => this.calculateCartTotals(items))
    ).subscribe(({ total, count }) => {
      this.cartTotalSubject.next(total);
      this.cartItemCountSubject.next(count);
    });

    // Update authentication state based on user
    this.currentUser$.subscribe(user => {
      this.isAuthenticatedSubject.next(!!user);
      if (user) {
        this.userRoleSubject.next(user.role);
      } else {
        this.userRoleSubject.next(null);
      }
    });
  }

  private loadInitialState(): void {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.setCurrentUser(user);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(cartItems);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cartItems');
      }
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        this.wishlistSubject.next(wishlist);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }

  // ============================================================================
  // USER ACTIONS
  // ============================================================================

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserRole(): 'admin' | 'supplier' | 'client' | null {
    return this.userRoleSubject.value;
  }

  logout(): void {
    this.setCurrentUser(null);
    this.clearCart();
    this.clearWishlist();
    this.clearNotifications();
  }

  // ============================================================================
  // PRODUCTS ACTIONS
  // ============================================================================

  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, product]);
  }

  updateProduct(updatedProduct: Product): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      currentProducts[index] = updatedProduct;
      this.productsSubject.next([...currentProducts]);
    }
  }

  removeProduct(productId: string): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next(currentProducts.filter(p => p.id !== productId));
  }

  setSelectedProduct(product: Product | null): void {
    this.selectedProductSubject.next(product);
  }

  setProductFilters(filters: SearchFilters): void {
    this.productFiltersSubject.next(filters);
  }

  clearProductFilters(): void {
    this.productFiltersSubject.next({});
  }

  // ============================================================================
  // SUPPLIERS ACTIONS
  // ============================================================================

  setSuppliers(suppliers: Supplier[]): void {
    this.suppliersSubject.next(suppliers);
  }

  addSupplier(supplier: Supplier): void {
    const currentSuppliers = this.suppliersSubject.value;
    this.suppliersSubject.next([...currentSuppliers, supplier]);
  }

  updateSupplier(updatedSupplier: Supplier): void {
    const currentSuppliers = this.suppliersSubject.value;
    const index = currentSuppliers.findIndex(s => s.id === updatedSupplier.id);
    if (index > -1) {
      currentSuppliers[index] = updatedSupplier;
      this.suppliersSubject.next([...currentSuppliers]);
    }
  }

  setSelectedSupplier(supplier: Supplier | null): void {
    this.selectedSupplierSubject.next(supplier);
  }

  // ============================================================================
  // ORDERS ACTIONS
  // ============================================================================

  setOrders(orders: Order[]): void {
    this.ordersSubject.next(orders);
  }

  addOrder(order: Order): void {
    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([...currentOrders, order]);
  }

  updateOrder(updatedOrder: Order): void {
    const currentOrders = this.ordersSubject.value;
    const index = currentOrders.findIndex(o => o.id === updatedOrder.id);
    if (index > -1) {
      currentOrders[index] = updatedOrder;
      this.ordersSubject.next([...currentOrders]);
    }
  }

  setSelectedOrder(order: Order | null): void {
    this.selectedOrderSubject.next(order);
  }

  // ============================================================================
  // CATEGORIES ACTIONS
  // ============================================================================

  setCategories(categories: Category[]): void {
    this.categoriesSubject.next(categories);
  }

  addCategory(category: Category): void {
    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next([...currentCategories, category]);
  }

  // ============================================================================
  // CART ACTIONS
  // ============================================================================

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Update existing item
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveCartToStorage();
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next(currentItems.filter(item => item.product.id !== productId));
    this.saveCartToStorage();
  }

  updateCartItemQuantity(productId: string, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems[itemIndex].quantity = quantity;
      }
      this.cartItemsSubject.next([...currentItems]);
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItemsSubject.value));
  }

  // ============================================================================
  // WISHLIST ACTIONS
  // ============================================================================

  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistSubject.value;
    if (!currentWishlist.find(p => p.id === product.id)) {
      this.wishlistSubject.next([...currentWishlist, product]);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: string): void {
    const currentWishlist = this.wishlistSubject.value;
    this.wishlistSubject.next(currentWishlist.filter(p => p.id !== productId));
    this.saveWishlistToStorage();
  }

  clearWishlist(): void {
    this.wishlistSubject.next([]);
    this.saveWishlistToStorage();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistSubject.value.some(p => p.id === productId);
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistSubject.value));
  }

  // ============================================================================
  // UI ACTIONS
  // ============================================================================

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  setSuccessMessage(message: string | null): void {
    this.successMessageSubject.next(message);
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSubject.next(open);
  }

  setCurrentPage(page: string): void {
    this.currentPageSubject.next(page);
  }

  // ============================================================================
  // NOTIFICATIONS ACTIONS
  // ============================================================================

  addNotification(notification: any): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
    this.updateUnreadCount();
  }

  markNotificationAsRead(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllNotificationsAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
    this.unreadNotificationsSubject.next(0);
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    this.unreadNotificationsSubject.next(unreadCount);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private filterProducts(products: Product[], filters: SearchFilters): Product[] {
    if (!filters || Object.keys(filters).length === 0) {
      return products;
    }

    return products.filter(product => {
      // Search query
      if (filters.query && !product.name.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price range
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // Rating
      if (filters.rating && (!product.rating || product.rating < filters.rating)) {
        return false;
      }

      // In stock
      if (filters.inStock && product.stockQuantity <= 0) {
        return false;
      }

      // Featured
      if (filters.featured && !product.isFeatured) {
        return false;
      }

      return true;
    });
  }

  private calculateCartTotals(items: {product: Product; quantity: number}[]): {total: number; count: number} {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, count };
  }

  // ============================================================================
  // COMPUTED OBSERVABLES
  // ============================================================================

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.category === categoryId))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isFeatured))
    );
  }

  getProductsOnSale(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.price < p.price * 1.1)) // Assuming 10% discount threshold
    );
  }

  getSupplierProducts(supplierId: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.supplierId === supplierId))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartTotal$;
  }

  getCartItemCount(): Observable<number> {
    return this.cartItemCount$;
  }

  getIsInWishlist(productId: string): Observable<boolean> {
    return this.wishlist$.pipe(
      map(wishlist => wishlist.some(p => p.id === productId))
    );
  }

  // ============================================================================
  // STATE PERSISTENCE
  // ============================================================================

  saveState(): void {
    const state = {
      currentUser: this.currentUserSubject.value,
      cartItems: this.cartItemsSubject.value,
      wishlist: this.wishlistSubject.value,
      notifications: this.notificationsSubject.value
    };
    localStorage.setItem('appState', JSON.stringify(state));
  }

  loadState(): void {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.currentUser) this.setCurrentUser(state.currentUser);
        if (state.cartItems) this.cartItemsSubject.next(state.cartItems);
        if (state.wishlist) this.wishlistSubject.next(state.wishlist);
        if (state.notifications) this.notificationsSubject.next(state.notifications);
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }

  clearState(): void {
    localStorage.removeItem('appState');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('wishlist');
    this.logout();
  }
}
