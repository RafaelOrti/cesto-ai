import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface PerformanceData {
  period: string;
  sales: number;
  orders: number;
  averageOrderValue: number;
  growth: number;
}

export interface PerformanceResponse {
  data: PerformanceData[];
  totals: {
    sales: number;
    orders: number;
    averageOrderValue: number;
  };
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  sales: number;
  orders: number;
  revenue: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  orders: number;
  totalValue: number;
  averageOrderValue: number;
  deliveryTime: number;
  rating: number;
  growth: number;
}

export interface CategoryPerformance {
  category: string;
  sales: number;
  orders: number;
  revenue: number;
  growth: number;
  topProducts: Array<{
    name: string;
    sales: number;
  }>;
}

export interface SeasonalTrend {
  month: string;
  category: string;
  sales: number;
  orders: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ForecastData {
  period: string;
  predictedSales: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface KPIData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    target: number;
  };
  profitMargin: number;
  customerRetention: number;
  orderFulfillment: number;
  inventoryTurnover: number;
  averageOrderValue: number;
}

export interface CompetitorComparison {
  productId: string;
  productName: string;
  ourPrice: number;
  competitorAveragePrice: number;
  difference: number;
  differencePercent: number;
  marketPosition: 'cheaper' | 'average' | 'expensive';
}

export interface CustomReportRequest {
  metrics: string[];
  dimensions: string[];
  filters: any;
  dateRange: {
    start: string;
    end: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    this.apiUrl = `${apiBaseUrl}/analysis`;
  }

  /**
   * Get sales performance analysis
   */
  getSalesPerformance(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Observable<PerformanceResponse> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    
    if (params.groupBy) {
      httpParams = httpParams.set('groupBy', params.groupBy);
    }

    return this.http.get<PerformanceResponse>(`${this.apiUrl}/sales-performance`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get purchases performance analysis
   */
  getPurchasesPerformance(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month' | 'year';
  }): Observable<PerformanceResponse> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);
    
    if (params.groupBy) {
      httpParams = httpParams.set('groupBy', params.groupBy);
    }

    return this.http.get<PerformanceResponse>(`${this.apiUrl}/purchases-performance`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get sales vs purchases comparison
   */
  getSalesVsPurchases(params: {
    startDate: string;
    endDate: string;
  }): Observable<any> {
    const httpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate);

    return this.http.get<any>(`${this.apiUrl}/sales-vs-purchases`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get product performance analysis
   */
  getProductPerformance(params: {
    productId?: string;
    period?: string;
    limit?: number;
  } = {}): Observable<ProductPerformance[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<{ data: ProductPerformance[] }>(`${this.apiUrl}/product-performance`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get supplier performance analysis
   */
  getSupplierPerformance(params: {
    supplierId?: string;
    period?: string;
    limit?: number;
  } = {}): Observable<SupplierPerformance[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<{ data: SupplierPerformance[] }>(`${this.apiUrl}/supplier-performance`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get category performance
   */
  getCategoryPerformance(params: {
    startDate?: string;
    endDate?: string;
  } = {}): Observable<CategoryPerformance[]> {
    let httpParams = new HttpParams();
    if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);

    return this.http.get<{ data: CategoryPerformance[] }>(`${this.apiUrl}/category-performance`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get seasonal trends
   */
  getSeasonalTrends(params: {
    year?: number;
    category?: string;
  } = {}): Observable<SeasonalTrend[]> {
    let httpParams = new HttpParams();
    if (params.year) httpParams = httpParams.set('year', params.year.toString());
    if (params.category) httpParams = httpParams.set('category', params.category);

    return this.http.get<{ data: SeasonalTrend[] }>(`${this.apiUrl}/seasonal-trends`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get sales forecast
   */
  getForecast(params: {
    months?: number;
    confidence?: number;
  } = {}): Observable<ForecastData[]> {
    let httpParams = new HttpParams();
    if (params.months) httpParams = httpParams.set('months', params.months.toString());
    if (params.confidence) httpParams = httpParams.set('confidence', params.confidence.toString());

    return this.http.get<{ forecast: ForecastData[] }>(`${this.apiUrl}/forecast`, { params: httpParams })
      .pipe(
        map(response => response.forecast),
        catchError(this.handleError)
      );
  }

  /**
   * Get Key Performance Indicators
   */
  getKPIs(period?: string): Observable<KPIData> {
    const params = period ? new HttpParams().set('period', period) : new HttpParams();
    
    return this.http.get<KPIData>(`${this.apiUrl}/kpis`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get competitor comparison
   */
  getCompetitorComparison(productIds: string[]): Observable<CompetitorComparison[]> {
    const params = new HttpParams().set('productIds', productIds.join(','));
    
    return this.http.get<{ data: CompetitorComparison[] }>(`${this.apiUrl}/competitor-comparison`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Generate custom report
   */
  generateCustomReport(request: CustomReportRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/custom-report`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Export analysis data
   */
  export(params: {
    format: 'xlsx' | 'csv' | 'pdf';
    type: string;
    period?: string;
    filters?: any;
  }): Observable<Blob> {
    let httpParams = new HttpParams()
      .set('format', params.format)
      .set('type', params.type);
    
    if (params.period) httpParams = httpParams.set('period', params.period);

    return this.http.get(`${this.apiUrl}/export`, {
      params: httpParams,
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) httpParams = httpParams.set(key, params[key]);
    });
    
    return this.http.get<any>(`${this.apiUrl}/metrics`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Analysis Service Error:', error);
    throw error;
  }
}

