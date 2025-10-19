import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from '../core/services/base-api.service';
import { ApiResponse, PaginatedResponse, Supplier, PaginationParams } from '../../shared/types/common.types';
import { HttpClient } from '@angular/common/http';

export interface SupplierInquiryRequest {
  supplierId: string;
  message?: string;
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface SupplierInquiryResponse {
  success: boolean;
  inquiryId: string;
  message: string;
}

export interface SupplierFilter {
  category?: string;
  onSale?: boolean;
  freeDelivery?: boolean;
  coDelivery?: boolean;
  recentlyAdded?: boolean;
  popular?: boolean;
  search?: string;
  rating?: number;
}

export interface SupplierRelationshipRequest {
  id: string;
  buyerId: string;
  clientId: string;
  supplierId: string;
  requestType: 'partnership' | 'collaboration' | 'general';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  message?: string;
}

export interface SupplierRelationshipResponse {
  success: boolean;
  relationshipId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  message: string;
  requiresApproval: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseApiService<Supplier> {
  constructor(http: HttpClient, @Inject('API_BASE_URL') private apiBaseUrl: string) {
    super(http, apiBaseUrl, '/suppliers');
  }

  /**
   * Get all suppliers with pagination and filtering
   */
  getSuppliers(
    pagination: PaginationParams,
    filters?: SupplierFilter
  ): Observable<PaginatedResponse<Supplier>> {
    const params = {
      ...pagination,
      ...filters
    };

    return this.getAll(params);
  }

  /**
   * Get supplier by ID
   */
  getSupplierById(id: string): Observable<Supplier> {
    return this.getById(id);
  }

  /**
   * Search suppliers
   */
  searchSuppliers(
    query: string,
    pagination: PaginationParams,
    filters?: SupplierFilter
  ): Observable<PaginatedResponse<Supplier>> {
    const params = {
      ...pagination,
      ...filters,
      search: query
    };

    return this.getAll(params);
  }

  /**
   * Get suppliers by category
   */
  getSuppliersByCategory(
    category: string,
    pagination: PaginationParams
  ): Observable<PaginatedResponse<Supplier>> {
    return this.getAll({
      ...pagination,
      category
    });
  }

  /**
   * Get recommended suppliers
   */
  getRecommendedSuppliers(
    type: 'recently_added' | 'popular' | 'trending',
    pagination: PaginationParams
  ): Observable<PaginatedResponse<Supplier>> {
    return this.getAll({
      ...pagination,
      type
    });
  }

  /**
   * Send inquiry to supplier
   */
  sendInquiry(supplierId: string, inquiry?: Partial<SupplierInquiryRequest>): Observable<SupplierInquiryResponse> {
    const payload: SupplierInquiryRequest = {
      supplierId,
      message: inquiry?.message || 'I am interested in your products and would like to know more about your offerings.',
      contactInfo: inquiry?.contactInfo || {
        name: '',
        email: '',
        phone: ''
      }
    };

    return this.http.post<ApiResponse<SupplierInquiryResponse>>(`${this.baseUrl}/${supplierId}/inquiry`, payload).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get supplier categories
   */
  getSupplierCategories(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/categories`)
      .pipe(map(response => response.data));
  }

  /**
   * Get supplier statistics
   */
  getSupplierStats(): Observable<{
    total: number;
    byCategory: Record<string, number>;
    onSale: number;
    freeDelivery: number;
    coDelivery: number;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats`)
      .pipe(map(response => response.data));
  }

  /**
   * Add supplier to favorites
   */
  addToFavorites(supplierId: string): Observable<{ success: boolean }> {
    return this.http.post<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${supplierId}/favorite`, {})
      .pipe(map(response => response.data));
  }

  /**
   * Remove supplier from favorites
   */
  removeFromFavorites(supplierId: string): Observable<{ success: boolean }> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${supplierId}/favorite`)
      .pipe(map(response => response.data));
  }

  /**
   * Get favorite suppliers
   */
  getFavoriteSuppliers(pagination: PaginationParams): Observable<PaginatedResponse<Supplier>> {
    return this.getAll({
      ...pagination,
      favorites: true
    });
  }

  /**
   * Get supplier products
   */
  getSupplierProducts(
    supplierId: string,
    pagination: PaginationParams,
    filters?: {
      category?: string;
      onSale?: boolean;
      search?: string;
    }
  ): Observable<PaginatedResponse<any>> {
    const params = {
      ...pagination,
      ...filters
    };

    return this.getAll({
      ...params,
      supplierId
    });
  }

  /**
   * Get supplier campaigns
   */
  getSupplierCampaigns(supplierId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/${supplierId}/campaigns`)
      .pipe(map(response => response.data));
  }

  /**
   * Rate supplier
   */
  rateSupplier(supplierId: string, rating: number, review?: string): Observable<{ success: boolean }> {
    return this.http.post<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${supplierId}/rate`, {
      rating,
      review
    }).pipe(map(response => response.data));
  }

  /**
   * Get supplier reviews
   */
  getSupplierReviews(
    supplierId: string,
    pagination: PaginationParams
  ): Observable<PaginatedResponse<any>> {
    return this.getAll({
      ...pagination,
      supplierId,
      reviews: true
    });
  }

  /**
   * Report supplier
   */
  reportSupplier(supplierId: string, reason: string, description?: string): Observable<{ success: boolean }> {
    return this.http.post<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${supplierId}/report`, {
      reason,
      description
    }).pipe(map(response => response.data));
  }

  /**
   * Get supplier delivery options
   */
  getSupplierDeliveryOptions(supplierId: string): Observable<{
    freeDelivery: boolean;
    coDelivery: boolean;
    deliveryAreas: string[];
    deliveryTime: string;
    minimumOrder: number;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${supplierId}/delivery-options`)
      .pipe(map(response => response.data));
  }

  /**
   * Check supplier availability
   */
  checkSupplierAvailability(supplierId: string): Observable<{
    isAvailable: boolean;
    message?: string;
    nextAvailable?: string;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${supplierId}/availability`)
      .pipe(map(response => response.data));
  }

  /**
   * Get supplier contact information
   */
  getSupplierContact(supplierId: string): Observable<{
    email: string;
    phone?: string;
    website?: string;
    address?: string;
    contactPerson?: string;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${supplierId}/contact`)
      .pipe(map(response => response.data));
  }

  /**
   * Request supplier information
   */
  requestSupplierInfo(supplierId: string, infoType: string): Observable<{ success: boolean }> {
    return this.http.post<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/${supplierId}/request-info`, {
      infoType
    }).pipe(map(response => response.data));
  }

  /**
   * Get supplier analytics
   */
  getSupplierAnalytics(supplierId: string): Observable<{
    views: number;
    inquiries: number;
    favorites: number;
    rating: number;
    reviews: number;
    products: number;
    campaigns: number;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${supplierId}/analytics`)
      .pipe(map(response => response.data));
  }

  /**
   * Get my approved suppliers
   */
  getMySuppliers(): Observable<Supplier[]> {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.baseUrl}/my-suppliers`)
      .pipe(map(response => response.data));
  }

  /**
   * Request supplier relationship
   */
  requestSupplierRelationship(request: SupplierRelationshipRequest): Observable<SupplierRelationshipResponse> {
    return this.http.post<ApiResponse<SupplierRelationshipResponse>>(`${this.baseUrl}/relationships/request`, request)
      .pipe(map(response => response.data));
  }

  /**
   * Get approved buyers for supplier
   */
  getApprovedBuyers(): Observable<Supplier[]> {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.baseUrl}/approved-buyers`)
      .pipe(map(response => response.data));
  }

  /**
   * Get pending relationship requests
   */
  getPendingRequests(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/pending-requests`)
      .pipe(map(response => response.data));
  }

  /**
   * Get relationship status with specific supplier
   */
  getRelationshipStatus(supplierId: string): Observable<{
    exists: boolean;
    status?: string;
    relationshipId?: string;
  }> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/relationships/status/${supplierId}`)
      .pipe(map(response => response.data));
  }

  // ============================================================================
  // ABSTRACT METHODS IMPLEMENTATION
  // ============================================================================

  protected getEntityName(): string {
    return 'Supplier';
  }

  protected validateEntity(data: Partial<Supplier>): boolean {
    return !!(data.name && data.email);
  }
}