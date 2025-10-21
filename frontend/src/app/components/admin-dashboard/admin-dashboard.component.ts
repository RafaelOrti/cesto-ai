import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService, User, UserFilters, CreateUserRequest, UpdateUserRequest } from '../../services/user-management.service';
import { interval, Subscription } from 'rxjs';

interface ChartDataPoint {
  month: string;
  value: number;
}

// UserData interface is now replaced by User from the service

interface SystemConfigItem {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentView = 'dashboard';
  
  userGrowthData: ChartDataPoint[] = [];
  revenueData: ChartDataPoint[] = [];
  users: User[] = [];
  systemConfig: SystemConfigItem[] = [];
  
  // User management state
  showCreateUserModal = false;
  showEditUserModal = false;
  showDeleteConfirmModal = false;
  selectedUser: User | null = null;
  userFormData: CreateUserRequest | UpdateUserRequest = {};
  isLoading = false;
  currentAdminId = 'admin-1'; // TODO: Get from auth service
  
  // Pagination and sorting
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  sortField = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Global Statistics
  globalStats = {
    totalUsers: 0,
    totalSuppliers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    activeUsers: 0,
    recentOrders: 0,
    systemHealth: {
      database: 'healthy',
      api: 'healthy',
      aiServices: 'healthy',
      uptime: '99.9%'
    },
    revenueStats: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0
    },
    performance: {
      avgResponseTime: '120ms',
      errorRate: '0.02%',
      cpuUsage: '45%',
      memoryUsage: '68%'
    }
  };

  // Global Analytics Data (similar to Client Insights but for all users)
  globalAnalytics = {
    sales: {
      total: 0,
      trend: 'increasing',
      monthlyData: [] as ChartDataPoint[]
    },
    orders: {
      total: 0,
      trend: 'stable',
      monthlyData: [] as ChartDataPoint[]
    },
    users: {
      total: 0,
      trend: 'growing',
      monthlyData: [] as ChartDataPoint[]
    }
  };

  // Users Management
  userFilters: UserFilters = {
    role: '',
    status: '',
    search: ''
  };

  // Real-time updates
  private refreshSubscription: Subscription | null = null;
  autoRefresh = true;
  refreshInterval = 30000; // 30 seconds
  lastUpdated: Date = new Date();
  
  // Notifications
  notifications: Array<{id: string, type: 'success' | 'error' | 'info' | 'warning', message: string, timestamp: Date}> = [];
  
  // Search functionality
  searchQuery = '';
  searchResults: any[] = [];
  showSearchResults = false;

  // Additional properties for the new template
  recentActivity: any[] = [];
  systemLogs: any[] = [];
  userForm: FormGroup;

  constructor(
    private router: Router,
    private userManagementService: UserManagementService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDashboardData();
    this.loadGlobalAnalytics();
    this.loadUsers();
    this.loadSystemConfig();
    this.loadRecentActivity();
    this.loadSystemLogs();
    this.startAutoRefresh();
    this.setupKeyboardShortcuts();
  }

  private initializeForm(): void {
    // Initialize userFormData with default values
    this.userFormData = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'client',
      companyName: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      isActive: true
    };
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    this.removeKeyboardShortcuts();
  }

  loadDashboardData(): void {
    // Load global dashboard statistics
    this.globalStats = {
      totalUsers: 1247,
      totalSuppliers: 89,
      totalBuyers: 234,
      totalProducts: 1250,
      activeUsers: 1156,
      recentOrders: 567,
      systemHealth: {
        database: 'healthy',
        api: 'healthy',
        aiServices: 'healthy',
        uptime: '99.9%'
      },
      revenueStats: {
        totalRevenue: 2500000,
        monthlyRevenue: 208333,
        revenueGrowth: 12.5
      },
      performance: {
        avgResponseTime: '120ms',
        errorRate: '0.02%',
        cpuUsage: '45%',
        memoryUsage: '68%'
      }
    };
  }

  loadGlobalAnalytics(): void {
    // Load global analytics data (Client Insights for all users)
    this.globalAnalytics = {
      sales: {
        total: 2500000,
        trend: 'increasing',
        monthlyData: [
          { month: 'Feb', value: 1800000 },
          { month: 'Mar', value: 2100000 },
          { month: 'Apr', value: 2300000 },
          { month: 'May', value: 2500000 },
          { month: 'Jun', value: 2400000 },
          { month: 'Jul', value: 2600000 },
          { month: 'Aug', value: 2800000 },
          { month: 'Sep', value: 2700000 },
          { month: 'Oct', value: 2500000 },
          { month: 'Nov', value: 2300000 },
          { month: 'Dec', value: 2200000 },
          { month: 'Jan', value: 2500000 }
        ]
      },
      orders: {
        total: 5670,
        trend: 'stable',
        monthlyData: [
          { month: 'Feb', value: 4500 },
          { month: 'Mar', value: 4800 },
          { month: 'Apr', value: 5100 },
          { month: 'May', value: 5400 },
          { month: 'Jun', value: 5200 },
          { month: 'Jul', value: 5600 },
          { month: 'Aug', value: 5800 },
          { month: 'Sep', value: 5700 },
          { month: 'Oct', value: 5500 },
          { month: 'Nov', value: 5300 },
          { month: 'Dec', value: 5100 },
          { month: 'Jan', value: 5670 }
        ]
      },
      users: {
        total: 1247,
        trend: 'growing',
        monthlyData: [
          { month: 'Feb', value: 950 },
          { month: 'Mar', value: 1020 },
          { month: 'Apr', value: 1080 },
          { month: 'May', value: 1140 },
          { month: 'Jun', value: 1180 },
          { month: 'Jul', value: 1200 },
          { month: 'Aug', value: 1220 },
          { month: 'Sep', value: 1230 },
          { month: 'Oct', value: 1235 },
          { month: 'Nov', value: 1240 },
          { month: 'Dec', value: 1245 },
          { month: 'Jan', value: 1247 }
        ]
      }
    };
  }

  loadUsers(): void {
    this.isLoading = true;
    const filters = {
      ...this.userFilters,
      page: this.currentPage,
      limit: this.pageSize,
      sortField: this.sortField,
      sortDirection: this.sortDirection
    };
    
    this.userManagementService.getUsers(filters, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        // Handle both array response and paginated response
        if (Array.isArray(response)) {
          this.users = response;
          this.totalUsers = response.length;
        } else {
          this.users = response.data || response.users || [];
          this.totalUsers = response.total || response.count || 0;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        // Fallback to empty array on error
        this.users = [];
        this.totalUsers = 0;
      }
    });
  }

  loadSystemConfig(): void {
    // Load system configuration
    this.systemConfig = [
      // General Configuration
      {
        id: '1',
        key: 'app_name',
        value: 'CESTO',
        category: 'general',
        description: 'Application name'
      },
      {
        id: '2',
        key: 'app_version',
        value: '1.0.0',
        category: 'general',
        description: 'Application version'
      },
      {
        id: '3',
        key: 'maintenance_mode',
        value: 'false',
        category: 'general',
        description: 'Enable maintenance mode'
      },
      {
        id: '4',
        key: 'default_language',
        value: 'en',
        category: 'general',
        description: 'Default application language'
      },
      // Security Configuration
      {
        id: '5',
        key: 'session_timeout',
        value: '3600',
        category: 'security',
        description: 'Session timeout in seconds'
      },
      {
        id: '6',
        key: 'max_login_attempts',
        value: '5',
        category: 'security',
        description: 'Maximum login attempts before lockout'
      },
      {
        id: '7',
        key: 'password_min_length',
        value: '8',
        category: 'security',
        description: 'Minimum password length'
      },
      {
        id: '8',
        key: 'enable_2fa',
        value: 'true',
        category: 'security',
        description: 'Enable two-factor authentication'
      },
      // Notification Configuration
      {
        id: '9',
        key: 'enable_notifications',
        value: 'true',
        category: 'notification',
        description: 'Enable system notifications'
      },
      {
        id: '10',
        key: 'email_notifications',
        value: 'true',
        category: 'notification',
        description: 'Enable email notifications'
      },
      {
        id: '11',
        key: 'push_notifications',
        value: 'true',
        category: 'notification',
        description: 'Enable push notifications'
      },
      // System Limits
      {
        id: '12',
        key: 'max_file_upload_size',
        value: '10MB',
        category: 'limits',
        description: 'Maximum file upload size'
      },
      {
        id: '13',
        key: 'max_users_per_company',
        value: '50',
        category: 'limits',
        description: 'Maximum users per company'
      },
      {
        id: '14',
        key: 'api_rate_limit',
        value: '1000',
        category: 'limits',
        description: 'API requests per hour per user'
      }
    ];
  }

  navigateToView(view: string): void {
    this.currentView = view;
  }

  navigateToBuyerDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToSupplierDashboard(): void {
    this.router.navigate(['/supplier']);
  }

  createUser(): void {
    if (this.userForm && this.userForm.valid) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.closeCreateUserModal();
        this.addNotification('success', 'User created successfully');
        this.loadUsers(); // Reload users list
      }, 2000);
    } else {
      // Open modal if form doesn't exist
      this.userFormData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'client',
        companyName: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: ''
      };
      this.showCreateUserModal = true;
    }
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.userFormData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      companyName: user.companyName || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      postalCode: user.postalCode || ''
    };
    this.showEditUserModal = true;
  }

  deleteUser(user: User): void {
    this.selectedUser = user;
    this.showDeleteConfirmModal = true;
  }

  confirmDeleteUser(): void {
    if (this.selectedUser) {
      this.isLoading = true;
      this.userManagementService.deleteUser(this.selectedUser.id, this.currentAdminId).subscribe({
        next: () => {
          this.loadUsers(); // Reload users list
          this.showDeleteConfirmModal = false;
          this.selectedUser = null;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.isLoading = false;
        }
      });
    }
  }

  saveUser(): void {
    if (this.showCreateUserModal) {
      this.createNewUser();
    } else if (this.showEditUserModal && this.selectedUser) {
      this.updateExistingUser();
    }
  }

  private createNewUser(): void {
    this.isLoading = true;
    this.userManagementService.createUser(this.userFormData as any, this.currentAdminId).subscribe({
      next: () => {
        this.loadUsers(); // Reload users list
        this.showCreateUserModal = false;
        this.userFormData = {};
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.isLoading = false;
      }
    });
  }

  private updateExistingUser(): void {
    if (this.selectedUser) {
      this.isLoading = true;
      this.userManagementService.updateUser(this.selectedUser.id, this.userFormData as any, this.currentAdminId).subscribe({
        next: () => {
          this.loadUsers(); // Reload users list
          this.showEditUserModal = false;
          this.selectedUser = null;
          this.userFormData = {};
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.isLoading = false;
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    this.isLoading = true;
    this.userManagementService.toggleUserStatus(user.id, this.currentAdminId).subscribe({
      next: () => {
        this.loadUsers(); // Reload users list
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadUsers();
  }

  clearFilters(): void {
    this.userFilters = {
      role: '',
      status: '',
      search: ''
    };
    this.loadUsers();
  }

  closeModals(): void {
    this.showCreateUserModal = false;
    this.showEditUserModal = false;
    this.showDeleteConfirmModal = false;
    this.selectedUser = null;
    this.userFormData = {};
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1; // Reset to first page
    this.loadUsers();
  }

  onPageSizeChangeEvent(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onPageSizeChange(Number(target.value));
  }

  // Sorting methods
  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1; // Reset to first page when sorting
    this.loadUsers();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return '↕️';
    }
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  // Get pagination info
  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalUsers);
    return `Showing ${start}-${end} of ${this.totalUsers} users`;
  }

  get totalPages(): number {
    return Math.ceil(this.totalUsers / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getConfigByCategory(category: string): SystemConfigItem[] {
    return this.systemConfig.filter(config => config.category === category);
  }

  updateSystemConfig(config: any): void {
    console.log('Updating system config:', config);
    // Implement system config update logic
  }

  exportData(entityType: string): void {
    console.log('Exporting data for:', entityType);
    // Implement data export logic
  }

  importData(entityType: string): void {
    console.log('Importing data for:', entityType);
    // Implement data import logic
  }

  generateReport(): void {
    console.log('Generating global report...');
    // Implement report generation logic
  }

  // Additional utility methods for enhanced functionality
  refreshData(): void {
    this.loadDashboardData();
    this.loadGlobalAnalytics();
    this.loadUsers();
    this.loadSystemConfig();
  }

  exportUsersToCSV(): void {
    const headers = ['Email', 'Name', 'Role', 'Status', 'Company', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...this.users.map(user => [
        user.email,
        `${user.firstName} ${user.lastName}`,
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        user.companyName || '',
        user.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getSystemStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'healthy':
        return '#22c55e';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  getPerformanceColor(usage: string): string {
    const value = parseInt(usage.replace('%', ''));
    if (value < 50) return '#22c55e';
    if (value < 80) return '#f59e0b';
    return '#ef4444';
  }

  // Real-time update methods
  startAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshSubscription = interval(this.refreshInterval).subscribe(() => {
        this.refreshData();
        this.lastUpdated = new Date();
        this.addNotification('info', 'Data refreshed automatically');
      });
    }
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
      this.addNotification('success', 'Auto-refresh enabled');
    } else {
      this.stopAutoRefresh();
      this.addNotification('info', 'Auto-refresh disabled');
    }
  }

  // Notification methods
  addNotification(type: 'success' | 'error' | 'info' | 'warning', message: string): void {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };
    this.notifications.unshift(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
    
    // Limit notifications to 5
    if (this.notifications.length > 5) {
      this.notifications = this.notifications.slice(0, 5);
    }
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearAllNotifications(): void {
    this.notifications = [];
  }

  // Search functionality
  performSearch(query: string): void {
    if (!query.trim()) {
      this.showSearchResults = false;
      return;
    }

    this.searchQuery = query;
    // Simulate search results
    this.searchResults = [
      { type: 'user', name: 'John Doe', email: 'john@example.com', role: 'buyer' },
      { type: 'user', name: 'Jane Smith', email: 'jane@example.com', role: 'supplier' },
      { type: 'product', name: 'Product A', category: 'Electronics', price: '$99.99' },
      { type: 'order', id: 'ORD-001', status: 'completed', amount: '$299.99' }
    ];
    this.showSearchResults = true;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  // Keyboard shortcuts
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', this.handleKeyboardShortcut.bind(this));
  }

  private removeKeyboardShortcuts(): void {
    document.removeEventListener('keydown', this.handleKeyboardShortcut.bind(this));
  }

  private handleKeyboardShortcut(event: KeyboardEvent): void {
    // Ctrl/Cmd + R: Refresh data
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      this.refreshData();
      this.addNotification('info', 'Data refreshed');
    }
    
    // Ctrl/Cmd + K: Focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Escape: Clear search or close modals
    if (event.key === 'Escape') {
      this.clearSearch();
      this.closeModals();
    }
  }

  // Enhanced data loading with error handling
  loadDashboardDataWithErrorHandling(): void {
    try {
      this.loadDashboardData();
      this.addNotification('success', 'Dashboard data loaded successfully');
    } catch (error) {
      this.addNotification('error', 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', error);
    }
  }

  loadUsersWithErrorHandling(): void {
    this.isLoading = true;
    const filters = {
      ...this.userFilters,
      page: this.currentPage,
      limit: this.pageSize,
      sortField: this.sortField,
      sortDirection: this.sortDirection
    };
    
    this.userManagementService.getUsers(filters, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.users = response;
          this.totalUsers = response.length;
        } else {
          this.users = response.data || response.users || [];
          this.totalUsers = response.total || response.count || 0;
        }
        this.isLoading = false;
        this.addNotification('success', `Loaded ${this.users.length} users`);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        this.users = [];
        this.totalUsers = 0;
        this.addNotification('error', 'Failed to load users');
      }
    });
  }

  // Enhanced user management with confirmations
  deleteUserWithConfirmation(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?\n\nThis action cannot be undone.`)) {
      this.deleteUser(user);
    }
  }

  // Bulk operations
  selectedUsers: Set<string> = new Set();
  
  toggleUserSelection(userId: string): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  selectAllUsers(): void {
    this.users.forEach(user => this.selectedUsers.add(user.id));
  }

  deselectAllUsers(): void {
    this.selectedUsers.clear();
  }

  bulkDeleteUsers(): void {
    if (this.selectedUsers.size === 0) {
      this.addNotification('warning', 'No users selected for deletion');
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedUsers.size} selected users?\n\nThis action cannot be undone.`)) {
      this.isLoading = true;
      // Simulate bulk delete
      setTimeout(() => {
        this.users = this.users.filter(user => !this.selectedUsers.has(user.id));
        this.totalUsers = this.users.length;
        this.selectedUsers.clear();
        this.isLoading = false;
        this.addNotification('success', `${this.selectedUsers.size} users deleted successfully`);
      }, 2000);
    }
  }

  bulkToggleUserStatus(): void {
    if (this.selectedUsers.size === 0) {
      this.addNotification('warning', 'No users selected');
      return;
    }

    this.isLoading = true;
    // Simulate bulk status toggle
    setTimeout(() => {
      this.users.forEach(user => {
        if (this.selectedUsers.has(user.id)) {
          user.isActive = !user.isActive;
        }
      });
      this.selectedUsers.clear();
      this.isLoading = false;
      this.addNotification('success', `Status updated for ${this.selectedUsers.size} users`);
    }, 2000);
  }

  // Additional methods for the new template
  setCurrentView(view: string): void {
    this.currentView = view;
  }

  getNewUsersThisWeek(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return this.users.filter(user => new Date(user.createdAt) > oneWeekAgo).length;
  }

  getNewUsersGrowth(): number {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const usersTwoWeeksAgo = this.users.filter(user => new Date(user.createdAt) > twoWeeksAgo && new Date(user.createdAt) <= oneWeekAgo).length;
    const usersThisWeek = this.getNewUsersThisWeek();
    
    if (usersTwoWeeksAgo === 0) return 100;
    return Math.round(((usersThisWeek - usersTwoWeeksAgo) / usersTwoWeeksAgo) * 100);
  }

  getActiveUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  getActiveUsersPercentage(): number {
    if (this.users.length === 0) return 0;
    return Math.round((this.getActiveUsersCount() / this.users.length) * 100);
  }

  getTotalUsersCount(): number {
    return this.users.length;
  }

  exportUsers(): void {
    // Implementation for exporting users
    console.log('Exporting users...');
    this.addNotification('info', 'Exporting users data...');
  }

  openCreateUserModal(): void {
    this.showCreateUserModal = true;
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required]
    });
  }

  closeCreateUserModal(): void {
    this.showCreateUserModal = false;
    this.userForm.reset();
  }


  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalUsers) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  // Initialize additional data
  private loadRecentActivity(): void {
    this.recentActivity = [
      { user: 'John Doe', action: 'Logged in', timestamp: new Date(), status: 'success' },
      { user: 'Jane Smith', action: 'Created order', timestamp: new Date(), status: 'info' },
      { user: 'Bob Johnson', action: 'Updated profile', timestamp: new Date(), status: 'success' }
    ];
  }

  private loadSystemLogs(): void {
    this.systemLogs = [
      { timestamp: new Date(), level: 'info', message: 'System started successfully', source: 'main' },
      { timestamp: new Date(), level: 'warning', message: 'High memory usage detected', source: 'monitor' },
      { timestamp: new Date(), level: 'error', message: 'Database connection failed', source: 'database' }
    ];
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}

