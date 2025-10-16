import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService, User, UserFilters, CreateUserRequest, UpdateUserRequest } from '../../services/user-management.service';

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
export class AdminDashboardComponent implements OnInit {
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
    }
  };

  // Global Analytics Data (similar to Buyer Insights but for all users)
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

  constructor(
    private router: Router,
    private userManagementService: UserManagementService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadGlobalAnalytics();
    this.loadUsers();
    this.loadSystemConfig();
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
      }
    };
  }

  loadGlobalAnalytics(): void {
    // Load global analytics data (Buyer Insights for all users)
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
    
    this.userManagementService.getAllUsers(filters).subscribe({
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
      error: (error) => {
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
      {
        id: '1',
        key: 'max_file_upload_size',
        value: '10MB',
        category: 'system',
        description: 'Maximum file upload size'
      },
      {
        id: '2',
        key: 'session_timeout',
        value: '3600',
        category: 'security',
        description: 'Session timeout in seconds'
      },
      {
        id: '3',
        key: 'enable_notifications',
        value: 'true',
        category: 'notification',
        description: 'Enable system notifications'
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
    this.userFormData = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'buyer',
      companyName: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: ''
    };
    this.showCreateUserModal = true;
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
      this.userManagementService.deleteUser(this.selectedUser.id).subscribe({
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
    this.userManagementService.createUser(this.userFormData as CreateUserRequest).subscribe({
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
      this.userManagementService.updateUser(this.selectedUser.id, this.userFormData as UpdateUserRequest).subscribe({
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
    this.userManagementService.toggleUserStatus(user.id, !user.isActive).subscribe({
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
}

