import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { NotificationService } from '../../core/services/notification.service';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  permissions: string[];
  joinedDate: string;
  department?: string;
  phone?: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  invitedDate: string;
  expiresAt: string;
}

interface TeamPlan {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  price: number;
  features: string[];
  current: boolean;
  popular?: boolean;
}

interface TeamActivity {
  id: string;
  member: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  selectedTab = 'members';
  showInviteModal = false;
  showPlanModal = false;
  searchQuery = '';
  selectedRole = 'all';
  selectedStatus = 'all';
  isLoading = false;

  // Team members
  teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'admin',
      status: 'active',
      lastActive: '2024-01-20T10:30:00Z',
      permissions: ['all'],
      joinedDate: '2023-01-15',
      department: 'Management',
      phone: '+46 70 123 4567'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'manager',
      status: 'active',
      lastActive: '2024-01-20T09:15:00Z',
      permissions: ['orders', 'inventory', 'suppliers'],
      joinedDate: '2023-03-10',
      department: 'Operations',
      phone: '+46 70 234 5678'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'buyer',
      status: 'active',
      lastActive: '2024-01-19T16:45:00Z',
      permissions: ['orders', 'products'],
      joinedDate: '2023-06-20',
      department: 'Procurement',
      phone: '+46 70 345 6789'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: 'viewer',
      status: 'pending',
      lastActive: '2024-01-18T14:20:00Z',
      permissions: ['products'],
      joinedDate: '2024-01-18',
      department: 'Finance'
    }
  ];

  // Team invitations
  teamInvitations: TeamInvitation[] = [
    {
      id: '1',
      email: 'alex@company.com',
      role: 'buyer',
      status: 'pending',
      invitedBy: 'John Doe',
      invitedDate: '2024-01-19',
      expiresAt: '2024-01-26'
    },
    {
      id: '2',
      email: 'emma@company.com',
      role: 'viewer',
      status: 'pending',
      invitedBy: 'Jane Smith',
      invitedDate: '2024-01-18',
      expiresAt: '2024-01-25'
    }
  ];

  // Team plans
  teamPlans: TeamPlan[] = [
    {
      id: '1',
      name: 'Starter',
      description: 'Perfect for small teams',
      maxMembers: 3,
      price: 0,
      features: [
        'Basic inventory management',
        'Order tracking',
        'Email support',
        'Standard reports'
      ],
      current: false
    },
    {
      id: '2',
      name: 'Professional',
      description: 'Ideal for growing businesses',
      maxMembers: 10,
      price: 29.99,
      features: [
        'Advanced inventory management',
        'AI-powered insights',
        'Multi-user access',
        'Priority support',
        'Custom reports',
        'API access'
      ],
      current: true,
      popular: true
    },
    {
      id: '3',
      name: 'Enterprise',
      description: 'For large organizations',
      maxMembers: 50,
      price: 99.99,
      features: [
        'Unlimited inventory management',
        'Advanced AI analytics',
        'Unlimited users',
        '24/7 phone support',
        'Custom integrations',
        'Dedicated account manager',
        'White-label options'
      ],
      current: false
    }
  ];

  // Team activity
  teamActivity: TeamActivity[] = [
    {
      id: '1',
      member: 'John Doe',
      action: 'Invited new member',
      details: 'Invited alex@company.com as buyer',
      timestamp: '2024-01-19T15:30:00Z',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      member: 'Jane Smith',
      action: 'Updated inventory',
      details: 'Updated stock levels for Fever Tree products',
      timestamp: '2024-01-19T14:20:00Z',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      member: 'Mike Johnson',
      action: 'Placed order',
      details: 'Ordered 50 units of Organic Milk',
      timestamp: '2024-01-19T13:15:00Z',
      ipAddress: '192.168.1.102'
    }
  ];

  roles = [
    { id: 'all', name: 'All Roles' },
    { id: 'admin', name: 'Admin' },
    { id: 'manager', name: 'Manager' },
    { id: 'buyer', name: 'Buyer' },
    { id: 'viewer', name: 'Viewer' }
  ];

  statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'pending', name: 'Pending' }
  ];

  get filteredMembers(): TeamMember[] {
    let filtered = this.teamMembers;

    // Role filter
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(member => member.role === this.selectedRole);
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(member => member.status === this.selectedStatus);
    }

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        member.department?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  get activeMembersCount(): number {
    return this.teamMembers.filter(member => member.status === 'active').length;
  }

  get pendingInvitationsCount(): number {
    return this.teamInvitations.filter(invitation => invitation.status === 'pending').length;
  }

  pendingInvitations: TeamInvitation[] = [];
  recentActivity: any[] = [];

  getActiveMembersCount(): number {
    return this.activeMembersCount;
  }

  getPendingInvitationsCount(): number {
    return this.pendingInvitationsCount;
  }

  get currentPlan(): TeamPlan {
    return this.teamPlans.find(plan => plan.current) || this.teamPlans[0];
  }

  constructor(
    private teamService: TeamService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTeamData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabSelect(tab: string): void {
    this.selectedTab = tab;
  }

  onSearch(): void {
    // Search functionality is handled by getter
  }

  onRoleChange(role: string): void {
    this.selectedRole = role;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  inviteMember(): void {
    this.showInviteModal = true;
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
  }

  sendInvitation(email: string, role: string): void {
    const invitation: TeamInvitation = {
      id: Date.now().toString(),
      email: email,
      role: role as any,
      status: 'pending',
      invitedBy: 'Current User',
      invitedDate: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    this.teamInvitations.push(invitation);
    this.closeInviteModal();
    console.log('Invitation sent to:', email);
  }

  removeMember(member: TeamMember): void {
    if (confirm(`Remove ${member.name} from the team?`)) {
      const index = this.teamMembers.indexOf(member);
      if (index > -1) {
        this.teamMembers.splice(index, 1);
      }
      console.log('Member removed:', member.name);
    }
  }

  updateMemberRole(member: TeamMember, newRole: string): void {
    if (confirm(`Change ${member.name}'s role to ${newRole}?`)) {
      member.role = newRole as any;
      this.updateMemberPermissions(member);
      console.log('Member role updated:', member.name, 'to', newRole);
    }
  }

  activateMember(member: TeamMember): void {
    member.status = 'active';
    console.log('Member activated:', member.name);
  }

  deactivateMember(member: TeamMember): void {
    member.status = 'inactive';
    console.log('Member deactivated:', member.name);
  }

  cancelInvitation(invitation: TeamInvitation): void {
    if (confirm('Cancel this invitation?')) {
      const index = this.teamInvitations.indexOf(invitation);
      if (index > -1) {
        this.teamInvitations.splice(index, 1);
      }
      console.log('Invitation cancelled:', invitation.email);
    }
  }

  resendInvitation(invitation: TeamInvitation): void {
    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    console.log('Invitation resent to:', invitation.email);
  }

  upgradePlan(plan: TeamPlan): void {
    this.showPlanModal = true;
    console.log('Upgrading to plan:', plan.name);
  }

  closePlanModal(): void {
    this.showPlanModal = false;
  }

  confirmPlanUpgrade(plan: TeamPlan): void {
    // Update current plan
    this.teamPlans.forEach(p => p.current = false);
    plan.current = true;
    this.closePlanModal();
    console.log('Plan upgraded to:', plan.name);
  }

  getRoleClass(role: string): string {
    const classes: { [key: string]: string } = {
      'admin': 'role-admin',
      'manager': 'role-manager',
      'buyer': 'role-buyer',
      'viewer': 'role-viewer'
    };
    return classes[role] || 'role-viewer';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'pending': 'status-pending'
    };
    return classes[status] || 'status-inactive';
  }

  getRoleName(role: string): string {
    const names: { [key: string]: string } = {
      'admin': 'Admin',
      'manager': 'Manager',
      'buyer': 'Buyer',
      'viewer': 'Viewer'
    };
    return names[role] || 'Viewer';
  }

  getStatusName(status: string): string {
    const names: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive',
      'pending': 'Pending'
    };
    return names[status] || 'Inactive';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('sv-SE');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('sv-SE');
  }

  private updateMemberPermissions(member: TeamMember): void {
    const rolePermissions: { [key: string]: string[] } = {
      'admin': ['all'],
      'manager': ['orders', 'inventory', 'suppliers', 'reports'],
      'buyer': ['orders', 'products', 'suppliers'],
      'viewer': ['products', 'reports']
    };
    
    member.permissions = rolePermissions[member.role] || ['products'];
  }

  private loadTeamData(): void {
    this.isLoading = true;
    
    // Load team members
    this.teamService.getMembers({})
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.teamMembers = (Array.isArray(response) ? response : (response as any).data || []).map((member: any) => ({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            avatar: member.avatar,
            status: member.status,
            lastActive: member.lastActive,
            permissions: member.permissions || [],
            joinedDate: member.joinedDate || member.createdAt,
            department: member.department,
            phone: member.phone
          }));
        },
        error: (error) => {
          console.error('Error loading team members:', error);
          this.notificationService.error('Error loading team members');
        }
      });
    
    // Load pending invitations
    this.teamService.getInvitations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.pendingInvitations = (Array.isArray(response) ? response : (response as any).data || []).filter((inv: any) => inv.status === 'pending');
        },
        error: (error) => {
          console.error('Error loading invitations:', error);
        }
      });
    
    // Load recent activities
    this.teamService.getActivity({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.recentActivity = Array.isArray(response) ? response : (response as any).data || [];
        },
        error: (error) => {
          console.error('Error loading activities:', error);
        }
      });
  }
}
