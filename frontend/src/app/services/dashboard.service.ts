import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalSuppliers: number;
  activeSuppliers: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

export interface RevenueChartData {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  supplier: {
    id: string;
    name: string;
    logo: string;
  };
  total: number;
  status: string;
  date: string;
  items: number;
}

export interface TopSupplier {
  id: string;
  name: string;
  logo: string;
  orders: number;
  totalValue: number;
  rating: number;
  lastOrder: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'alert' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    this.apiUrl = `${apiBaseUrl}/dashboard`;
  }

  /**
   * Get dashboard statistics
   */
  getStats(): Observable<DashboardStats> {
    return this.http.get<{ data: DashboardStats }>(`${this.apiUrl}/stats`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get revenue chart data
   */
  getRevenueChart(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Observable<RevenueChartData> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    
    if (params.groupBy) {
      httpParams = httpParams.set('groupBy', params.groupBy);
    }

    return this.http.get<RevenueChartData>(`${this.apiUrl}/charts/revenue`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get orders chart data
   */
  getOrdersChart(params: {
    startDate: string;
    endDate: string;
  }): Observable<any> {
    const httpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    return this.http.get(`${this.apiUrl}/charts/orders`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get suppliers performance chart
   */
  getSuppliersChart(period: string = '30d'): Observable<any> {
    const params = new HttpParams().set('period', period);
    return this.http.get(`${this.apiUrl}/charts/suppliers`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get recent orders
   */
  getRecentOrders(limit: number = 10): Observable<RecentOrder[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<{ data: RecentOrder[] }>(`${this.apiUrl}/recent-orders`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get top suppliers
   */
  getTopSuppliers(params: {
    limit?: number;
    sortBy?: 'totalValue' | 'orders' | 'rating';
  } = {}): Observable<TopSupplier[]> {
    let httpParams = new HttpParams();
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);

    return this.http.get<{ data: TopSupplier[] }>(`${this.apiUrl}/top-suppliers`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get dashboard notifications
   */
  getNotifications(params: {
    unreadOnly?: boolean;
    limit?: number;
  } = {}): Observable<Notification[]> {
    let httpParams = new HttpParams();
    if (params.unreadOnly !== undefined) {
      httpParams = httpParams.set('unreadOnly', params.unreadOnly.toString());
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<{ data: Notification[] }>(`${this.apiUrl}/notifications`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get buyer insights data
   */
  getInsights(params: {
    metric: 'sales' | 'orders' | 'deliveries';
    startDate: string;
    endDate: string;
  }): Observable<any> {
    const httpParams = new HttpParams()
      .set('metric', params.metric)
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    return this.http.get(`${this.apiUrl}/insights`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Export dashboard data
   */
  exportData(format: 'xlsx' | 'csv' | 'pdf', filters: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, {
      format,
      filters
    }, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Dashboard Service Error:', error);
    throw error;
  }
}


