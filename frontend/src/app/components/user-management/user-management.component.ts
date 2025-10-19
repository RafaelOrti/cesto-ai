import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../core/services/notification.service';
import { I18nService } from '../../core/services/i18n.service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'client' | 'supplier';
  companyName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  avatar?: string;
  permissions: string[];
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  newUsersThisWeek: number;
  adminUsers: number;
  clientUsers: number;
  supplierUsers: number;
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
  company: string;
  dateRange: {
    start: string;
    end: string;
  };
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentView = 'overview';
  searchQuery = '';
  selectedRole = 'all';
  selectedStatus = 'all';
  selectedCompany = 'all';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  userForm: FormGroup;
  isEditing = false;
  editingUser: User | null = null;
  
  // Sample data
  users: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'client',
      companyName: 'Tech Solutions Inc',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      lastLogin: '2024-01-20T10:30:00Z',
      permissions: ['read', 'write', 'orders']
    },
    {
      id: '2',
      email: 'jane.smith@supplier.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'supplier',
      companyName: 'Premium Foods Ltd',
      phone: '+1987654321',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      lastLogin: '2024-01-19T14:20:00Z',
      permissions: ['read', 'write', 'products', 'inventory']
    },
    {
      id: '3',
      email: 'admin@cesto.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      companyName: 'CESTO Platform',
      phone: '+1555123456',
      address: '789 Pine St',
      city: 'San Francisco',
      country: 'USA',
      status: 'active',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20',
      lastLogin: '2024-01-20T09:15:00Z',
      permissions: ['read', 'write', 'admin', 'users', 'system']
    },
    {
      id: '4',
      email: 'pending@example.com',
      firstName: 'Pending',
      lastName: 'User',
      role: 'client',
      companyName: 'New Company',
      status: 'pending',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-19',
      permissions: []
    }
  ];
  
  userStats: UserStats = {
    totalUsers: 4,
    activeUsers: 3,
    pendingUsers: 1,
    inactiveUsers: 0,
    suspendedUsers: 0,
    newUsersThisWeek: 2,
    adminUsers: 1,
    clientUsers: 2,
    supplierUsers: 1
  };
  
  roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'client', label: 'Client' },
    { value: 'supplier', label: 'Supplier' }
  ];
  
  statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];
  
  companies = [
    { value: 'all', label: 'All Companies' },
    { value: 'Tech Solutions Inc', label: 'Tech Solutions Inc' },
    { value: 'Premium Foods Ltd', label: 'Premium Foods Ltd' },
    { value: 'CESTO Platform', label: 'CESTO Platform' },
    { value: 'New Company', label: 'New Company' }
  ];
  
  availablePermissions = [
    'read',
    'write',
    'admin',
    'users',
    'system',
    'orders',
    'products',
    'inventory',
    'analytics',
    'reports'
  ];
  
  displayedColumns: string[] = ['avatar', 'name', 'email', 'role', 'company', 'status', 'lastLogin', 'actions'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public i18n: I18nService
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      status: ['active', [Validators.required]],
      permissions: [[]]
    });
  }

  private loadUsers(): void {
    // In a real application, this would load from a service
    console.log('Loading users...');
  }

  setView(view: string): void {
    this.currentView = view;
  }

  onSearch(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  onRoleChange(): void {
    // Implement role filtering
    console.log('Role changed to:', this.selectedRole);
  }

  onStatusChange(): void {
    // Implement status filtering
    console.log('Status changed to:', this.selectedStatus);
  }

  onCompanyChange(): void {
    // Implement company filtering
    console.log('Company changed to:', this.selectedCompany);
  }

  onSortChange(): void {
    // Implement sorting
    console.log('Sorting by:', this.sortBy, this.sortOrder);
  }

  addNewUser(): void {
    this.isEditing = false;
    this.editingUser = null;
    this.userForm.reset({ 
      status: 'active',
      permissions: []
    });
    this.currentView = 'form';
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.editingUser = user;
    this.userForm.patchValue({
      ...user,
      permissions: [...user.permissions]
    });
    this.currentView = 'form';
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.isEditing && this.editingUser) {
        // Update existing user
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...formValue,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        this.notificationService.success('User updated successfully');
      } else {
        // Add new user
        const newUser: User = {
          id: (this.users.length + 1).toString(),
          ...formValue,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          permissions: formValue.permissions || []
        };
        this.users.unshift(newUser);
        this.notificationService.success('User added successfully');
      }
      
      this.currentView = 'overview';
      this.updateStats();
    } else {
      this.notificationService.error('Please fill in all required fields correctly');
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.notificationService.success('User deleted successfully');
        this.updateStats();
      }
    }
  }

  toggleUserStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index].status = newStatus;
      this.users[index].updatedAt = new Date().toISOString().split('T')[0];
      this.notificationService.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      this.updateStats();
    }
  }

  suspendUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index].status = 'suspended';
      this.users[index].updatedAt = new Date().toISOString().split('T')[0];
      this.notificationService.success('User suspended successfully');
      this.updateStats();
    }
  }

  resetUserPassword(user: User): void {
    // Implement password reset
    console.log('Resetting password for:', user.email);
    this.notificationService.info('Password reset email sent successfully');
  }

  exportUsers(): void {
    // Implement user export
    console.log('Exporting users...');
    this.notificationService.info('Users exported successfully');
  }

  importUsers(): void {
    // Implement user import
    console.log('Importing users...');
    this.notificationService.info('Users imported successfully');
  }

  private updateStats(): void {
    this.userStats = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === 'active').length,
      pendingUsers: this.users.filter(u => u.status === 'pending').length,
      inactiveUsers: this.users.filter(u => u.status === 'inactive').length,
      suspendedUsers: this.users.filter(u => u.status === 'suspended').length,
      newUsersThisWeek: this.userStats.newUsersThisWeek, // This would be calculated based on date
      adminUsers: this.users.filter(u => u.role === 'admin').length,
      clientUsers: this.users.filter(u => u.role === 'client').length,
      supplierUsers: this.users.filter(u => u.role === 'supplier').length
    };
  }

  get filteredUsers(): User[] {
    let filtered = this.users;
    
    if (this.searchQuery) {
      filtered = filtered.filter(u => 
        u.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.companyName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(u => u.role === this.selectedRole);
    }
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(u => u.status === this.selectedStatus);
    }
    
    if (this.selectedCompany !== 'all') {
      filtered = filtered.filter(u => u.companyName === this.selectedCompany);
    }
    
    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4caf50';
      case 'inactive': return '#2E7D32';
      case 'pending': return '#8BC34A';
      case 'suspended': return '#9e9e9e';
      default: return '#757575';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'pending': return 'Pending';
      case 'suspended': return 'Suspended';
      default: return 'Unknown';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return '#9c27b0';
      case 'client': return '#4CAF50';
      case 'supplier': return '#8BC34A';
      default: return '#757575';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Admin';
      case 'client': return 'Client';
      case 'supplier': return 'Supplier';
      default: return 'Unknown';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'admin': return 'admin_panel_settings';
      case 'client': return 'business';
      case 'supplier': return 'store';
      default: return 'person';
    }
  }

  formatLastLogin(lastLogin?: string): string {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  onPermissionChange(permission: string, checked: boolean): void {
    const permissions = this.userForm.get('permissions')?.value || [];
    if (checked) {
      if (!permissions.includes(permission)) {
        permissions.push(permission);
      }
    } else {
      const index = permissions.indexOf(permission);
      if (index > -1) {
        permissions.splice(index, 1);
      }
    }
    this.userForm.patchValue({ permissions });
  }

  isPermissionSelected(permission: string): boolean {
    const permissions = this.userForm.get('permissions')?.value || [];
    return permissions.includes(permission);
  }
}