import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PaginatedResponse } from '../../shared/types/common.types';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  department?: string;
  phone?: string;
  permissions: string[];
  joinedDate: string;
  lastActive: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  invitedDate: string;
  expiresAt: string;
  message?: string;
}

export interface TeamActivity {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface TeamPlan {
  planId: string;
  planName: string;
  maxMembers: number;
  currentMembers: number;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  features: string[];
  status: 'active' | 'cancelled' | 'expired';
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  permissions: string[];
  message?: string;
}

export interface UpdateMemberRequest {
  role?: 'admin' | 'manager' | 'buyer' | 'viewer';
  permissions?: string[];
  status?: 'active' | 'inactive';
  department?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    this.apiUrl = `${apiBaseUrl}/team`;
  }

  /**
   * Get all team members
   */
  getMembers(params: {
    status?: 'active' | 'inactive' | 'pending';
    role?: 'admin' | 'manager' | 'buyer' | 'viewer';
    search?: string;
  } = {}): Observable<TeamMember[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get<{ data: TeamMember[] }>(`${this.apiUrl}/members`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get team member by ID
   */
  getMemberById(id: string): Observable<TeamMember> {
    return this.http.get<{ data: TeamMember }>(`${this.apiUrl}/members/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Invite team member
   */
  inviteMember(data: InviteMemberRequest): Observable<TeamInvitation> {
    return this.http.post<{ data: TeamInvitation }>(`${this.apiUrl}/members/invite`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update team member
   */
  updateMember(id: string, data: UpdateMemberRequest): Observable<TeamMember> {
    return this.http.put<{ data: TeamMember }>(`${this.apiUrl}/members/${id}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Remove team member
   */
  removeMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/members/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Activate team member
   */
  activateMember(id: string): Observable<TeamMember> {
    return this.http.post<{ data: TeamMember }>(`${this.apiUrl}/members/${id}/activate`, {})
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Deactivate team member
   */
  deactivateMember(id: string): Observable<TeamMember> {
    return this.http.post<{ data: TeamMember }>(`${this.apiUrl}/members/${id}/deactivate`, {})
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get pending invitations
   */
  getInvitations(params: {
    status?: 'pending' | 'accepted' | 'declined' | 'expired';
  } = {}): Observable<TeamInvitation[]> {
    let httpParams = new HttpParams();
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<{ data: TeamInvitation[] }>(`${this.apiUrl}/invitations`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Resend invitation
   */
  resendInvitation(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invitations/${id}/resend`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Cancel invitation
   */
  cancelInvitation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/invitations/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get team activity log
   */
  getActivity(params: {
    page?: number;
    limit?: number;
    memberId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Observable<PaginatedResponse<TeamActivity>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<TeamActivity>>(`${this.apiUrl}/activity`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get available permissions
   */
  getPermissions(): Observable<Permission[]> {
    return this.http.get<{ data: Permission[] }>(`${this.apiUrl}/permissions`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get current team plan
   */
  getPlan(): Observable<TeamPlan> {
    return this.http.get<TeamPlan>(`${this.apiUrl}/plan`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Upgrade team plan
   */
  upgradePlan(data: {
    planId: string;
    billingCycle: 'monthly' | 'yearly';
  }): Observable<TeamPlan> {
    return this.http.post<TeamPlan>(`${this.apiUrl}/plan/upgrade`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get team statistics
   */
  getStats(): Observable<{
    totalMembers: number;
    activeMembers: number;
    pendingInvitations: number;
    planLimit: number;
    remainingSlots: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Export team data
   */
  export(format: 'xlsx' | 'csv' | 'pdf'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Team Service Error:', error);
    throw error;
  }
}


