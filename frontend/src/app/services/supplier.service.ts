import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService, ApiResponse, PaginatedResponse } from '../core/services/base-api.service';
import { Supplier, PaginationParams } from '../core/interfaces/api.interface';

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

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseApiService {

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

    return this.getPaginated<Supplier>('/suppliers', pagination.page, pagination.limit, params);
  }

  /**
   * Get supplier by ID
   */
  getSupplierById(id: string): Observable<ApiResponse<Supplier>> {
    return this.get<Supplier>(`/suppliers/${id}`);
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

    return this.getPaginated<Supplier>('/suppliers/search', pagination.page, pagination.limit, params);
  }

  /**
   * Get suppliers by category
   */
  getSuppliersByCategory(
    category: string,
    pagination: PaginationParams
  ): Observable<PaginatedResponse<Supplier>> {
    return this.getPaginated<Supplier>(
      `/suppliers/category/${category}`,
      pagination.page,
      pagination.limit
    );
  }

  /**
   * Get recommended suppliers
   */
  getRecommendedSuppliers(
    type: 'recently_added' | 'popular' | 'trending',
    pagination: PaginationParams
  ): Observable<PaginatedResponse<Supplier>> {
    return this.getPaginated<Supplier>(
      `/suppliers/recommended/${type}`,
      pagination.page,
      pagination.limit
    );
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

    return this.post<SupplierInquiryResponse>(`/suppliers/${supplierId}/inquiry`, payload).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get supplier categories
   */
  getSupplierCategories(): Observable<ApiResponse<string[]>> {
    return this.get<string[]>('/suppliers/categories');
  }

  /**
   * Get supplier statistics
   */
  getSupplierStats(): Observable<ApiResponse<{
    total: number;
    byCategory: Record<string, number>;
    onSale: number;
    freeDelivery: number;
    coDelivery: number;
  }>> {
    return this.get('/suppliers/stats');
  }

  /**
   * Add supplier to favorites
   */
  addToFavorites(supplierId: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/suppliers/${supplierId}/favorite`, {});
  }

  /**
   * Remove supplier from favorites
   */
  removeFromFavorites(supplierId: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.delete<{ success: boolean }>(`/suppliers/${supplierId}/favorite`);
  }

  /**
   * Get favorite suppliers
   */
  getFavoriteSuppliers(pagination: PaginationParams): Observable<PaginatedResponse<Supplier>> {
    return this.getPaginated<Supplier>('/suppliers/favorites', pagination.page, pagination.limit);
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

    return this.getPaginated<any>(`/suppliers/${supplierId}/products`, pagination.page, pagination.limit, params);
  }

  /**
   * Get supplier campaigns
   */
  getSupplierCampaigns(supplierId: string): Observable<ApiResponse<any[]>> {
    return this.get<any[]>(`/suppliers/${supplierId}/campaigns`);
  }

  /**
   * Rate supplier
   */
  rateSupplier(supplierId: string, rating: number, review?: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/suppliers/${supplierId}/rate`, {
      rating,
      review
    });
  }

  /**
   * Get supplier reviews
   */
  getSupplierReviews(
    supplierId: string,
    pagination: PaginationParams
  ): Observable<PaginatedResponse<any>> {
    return this.getPaginated<any>(`/suppliers/${supplierId}/reviews`, pagination.page, pagination.limit);
  }

  /**
   * Report supplier
   */
  reportSupplier(supplierId: string, reason: string, description?: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/suppliers/${supplierId}/report`, {
      reason,
      description
    });
  }

  /**
   * Get supplier delivery options
   */
  getSupplierDeliveryOptions(supplierId: string): Observable<ApiResponse<{
    freeDelivery: boolean;
    coDelivery: boolean;
    deliveryAreas: string[];
    deliveryTime: string;
    minimumOrder: number;
  }>> {
    return this.get(`/suppliers/${supplierId}/delivery-options`);
  }

  /**
   * Check supplier availability
   */
  checkSupplierAvailability(supplierId: string): Observable<ApiResponse<{
    isAvailable: boolean;
    message?: string;
    nextAvailable?: string;
  }>> {
    return this.get(`/suppliers/${supplierId}/availability`);
  }

  /**
   * Get supplier contact information
   */
  getSupplierContact(supplierId: string): Observable<ApiResponse<{
    email: string;
    phone?: string;
    website?: string;
    address?: string;
    contactPerson?: string;
  }>> {
    return this.get(`/suppliers/${supplierId}/contact`);
  }

  /**
   * Request supplier information
   */
  requestSupplierInfo(supplierId: string, infoType: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(`/suppliers/${supplierId}/request-info`, {
      infoType
    });
  }

  /**
   * Get supplier analytics
   */
  getSupplierAnalytics(supplierId: string): Observable<ApiResponse<{
    views: number;
    inquiries: number;
    favorites: number;
    rating: number;
    reviews: number;
    products: number;
    campaigns: number;
  }>> {
    return this.get(`/suppliers/${supplierId}/analytics`);
  }
}