import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PaginatedResponse } from '../../shared/types/common.types';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  category: string;
  department: string;
  supplier: {
    id: string;
    name: string;
  };
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  lastRestocked: string;
  nextRestockDate: string;
  aiPrediction?: AIPrediction;
  stockStatus: 'ok' | 'low' | 'critical' | 'out';
}

export interface AIPrediction {
  recommendedStock: number;
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  estimatedStockoutDate?: string;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'restock_needed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  inventoryItemId: string;
  productName: string;
  productImage?: string;
  message: string;
  createdAt: string;
  actionRequired: boolean;
  dismissed: boolean;
}

export interface StockHistory {
  id: string;
  inventoryItemId: string;
  date: string;
  type: 'restock' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes?: string;
  reference?: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  turnoverRate: number;
  averageStockValue: number;
}

export interface RestockEvent {
  inventoryItemId: string;
  quantity: number;
  supplier: string;
  cost: number;
  invoiceNumber?: string;
  expectedDate?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    this.apiUrl = `${apiBaseUrl}/inventory`;
  }

  /**
   * Get inventory items with filters
   */
  getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    department?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Observable<PaginatedResponse<InventoryItem>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<InventoryItem>>(`${this.apiUrl}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get inventory item by ID
   */
  getById(id: string): Observable<InventoryItem> {
    return this.http.get<{ data: InventoryItem }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update inventory item
   */
  update(id: string, data: {
    currentStock?: number;
    minStock?: number;
    maxStock?: number;
    notes?: string;
  }): Observable<InventoryItem> {
    return this.http.put<{ data: InventoryItem }>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Record restock event
   */
  restock(data: RestockEvent): Observable<InventoryItem> {
    return this.http.post<{ data: InventoryItem }>(`${this.apiUrl}/restock`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get low stock items
   */
  getLowStock(threshold: number = 10): Observable<InventoryItem[]> {
    const params = new HttpParams().set('threshold', threshold.toString());
    return this.http.get<{ data: InventoryItem[] }>(`${this.apiUrl}/low-stock`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get out of stock items
   */
  getOutOfStock(): Observable<InventoryItem[]> {
    return this.http.get<{ data: InventoryItem[] }>(`${this.apiUrl}/out-of-stock`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get stock history for item
   */
  getStockHistory(id: string, params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<PaginatedResponse<StockHistory>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<StockHistory>>(`${this.apiUrl}/stock-history/${id}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get inventory alerts
   */
  getAlerts(params: {
    severity?: 'low' | 'medium' | 'high' | 'critical';
    dismissed?: boolean;
  } = {}): Observable<InventoryAlert[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<{ data: InventoryAlert[] }>(`${this.apiUrl}/alerts`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Dismiss inventory alert
   */
  dismissAlert(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/alerts/${id}/dismiss`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Get inventory statistics
   */
  getStats(): Observable<InventoryStats> {
    return this.http.get<{ data: InventoryStats }>(`${this.apiUrl}/stats`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get AI restock predictions
   */
  getAIPredictions(productIds?: string[]): Observable<AIPrediction[]> {
    let params = new HttpParams();
    if (productIds && productIds.length > 0) {
      params = params.set('productIds', productIds.join(','));
    }

    return this.http.get<{ data: AIPrediction[] }>(`${this.apiUrl}/ai-predictions`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Export inventory report
   */
  export(params: {
    format: 'xlsx' | 'csv' | 'pdf';
    filters?: any;
  }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, params, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Get categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<{ data: string[] }>(`${this.apiUrl}/categories`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get departments
   */
  getDepartments(): Observable<string[]> {
    return this.http.get<{ data: string[] }>(`${this.apiUrl}/departments`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get AI insights for inventory
   */
  getAIInsights(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ai-insights`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Inventory Service Error:', error);
    throw error;
  }
}

