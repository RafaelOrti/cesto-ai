import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

export interface ChartDataPoint {
  month: string;
  value: number;
  date: Date;
}

export interface CustomerData {
  name: string;
  color: string;
  sales: number;
  orders: number;
  averageOrder: number;
  frequency: number;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export interface SummaryTotals {
  totalStores: number;
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
  averageFrequency: number;
}

export interface LegendItem {
  color: string;
  value: number;
  label: string;
}

export interface FilterOptions {
  type: string;
  value: string;
  label: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface AnalyticsFilters {
  selectedFilter: string;
  dateRange: DateRange;
  additionalFilters: string[];
  comparisonData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly mockData = {
    // Mock data for different filter types
    sales: [
      { month: 'Feb', value: 1800000, date: new Date('2022-02-01') },
      { month: 'Mar', value: 2200000, date: new Date('2022-03-01') },
      { month: 'Apr', value: 1900000, date: new Date('2022-04-01') },
      { month: 'May', value: 2100000, date: new Date('2022-05-01') },
      { month: 'Jun', value: 2000000, date: new Date('2022-06-01') },
      { month: 'Jul', value: 2300000, date: new Date('2022-07-01') },
      { month: 'Aug', value: 2400000, date: new Date('2022-08-01') },
      { month: 'Sep', value: 2200000, date: new Date('2022-09-01') },
      { month: 'Oct', value: 2100000, date: new Date('2022-10-01') },
      { month: 'Nov', value: 2000000, date: new Date('2022-11-01') },
      { month: 'Dec', value: 1900000, date: new Date('2022-12-01') },
      { month: 'Jan', value: 1800000, date: new Date('2023-01-01') }
    ],
    orders: [
      { month: 'Feb', value: 850, date: new Date('2022-02-01') },
      { month: 'Mar', value: 920, date: new Date('2022-03-01') },
      { month: 'Apr', value: 780, date: new Date('2022-04-01') },
      { month: 'May', value: 1050, date: new Date('2022-05-01') },
      { month: 'Jun', value: 980, date: new Date('2022-06-01') },
      { month: 'Jul', value: 1120, date: new Date('2022-07-01') },
      { month: 'Aug', value: 1180, date: new Date('2022-08-01') },
      { month: 'Sep', value: 950, date: new Date('2022-09-01') },
      { month: 'Oct', value: 890, date: new Date('2022-10-01') },
      { month: 'Nov', value: 820, date: new Date('2022-11-01') },
      { month: 'Dec', value: 750, date: new Date('2022-12-01') },
      { month: 'Jan', value: 680, date: new Date('2023-01-01') }
    ],
    deliveryDate: [
      { month: 'Feb', value: 95, date: new Date('2022-02-01') },
      { month: 'Mar', value: 92, date: new Date('2022-03-01') },
      { month: 'Apr', value: 88, date: new Date('2022-04-01') },
      { month: 'May', value: 91, date: new Date('2022-05-01') },
      { month: 'Jun', value: 94, date: new Date('2022-06-01') },
      { month: 'Jul', value: 89, date: new Date('2022-07-01') },
      { month: 'Aug', value: 87, date: new Date('2022-08-01') },
      { month: 'Sep', value: 90, date: new Date('2022-09-01') },
      { month: 'Oct', value: 93, date: new Date('2022-10-01') },
      { month: 'Nov', value: 96, date: new Date('2022-11-01') },
      { month: 'Dec', value: 98, date: new Date('2022-12-01') },
      { month: 'Jan', value: 85, date: new Date('2023-01-01') }
    ]
  };

  private readonly mockCustomerData = [
    {
      name: 'Butik Nära Hällevadshellm',
      color: 'red',
      sales: 4003061,
      orders: 45,
      averageOrder: 88957,
      frequency: 5,
      dateRange: { from: new Date('2022-02-01'), to: new Date('2023-01-31') }
    },
    {
      name: 'Butik Närs Hällevadshelm',
      color: 'orange',
      sales: 2987558,
      orders: 27,
      averageOrder: 110650,
      frequency: 8,
      dateRange: { from: new Date('2022-02-01'), to: new Date('2023-01-31') }
    },
    {
      name: 'Coop Forum Hököpinge',
      color: 'yellow',
      sales: 1926981,
      orders: 28,
      averageOrder: 68821,
      frequency: 5,
      dateRange: { from: new Date('2022-02-01'), to: new Date('2023-01-31') }
    },
    {
      name: 'Coop Forum Järna',
      color: 'green',
      sales: 901860,
      orders: 7,
      averageOrder: 141694,
      frequency: 36,
      dateRange: { from: new Date('2022-02-01'), to: new Date('2023-01-31') }
    },
    {
      name: 'City Nära Stavsnäs',
      color: 'blue',
      sales: 457475,
      orders: 30,
      averageOrder: 15249,
      frequency: 5,
      dateRange: { from: new Date('2022-02-01'), to: new Date('2023-01-31') }
    }
  ];

  private filtersSubject = new BehaviorSubject<AnalyticsFilters>({
    selectedFilter: 'Sales',
    dateRange: { from: '2022-02-01', to: '2023-01-31' },
    additionalFilters: []
  });

  constructor(private http: HttpClient, @Inject('API_BASE_URL') private apiBaseUrl: string) {}

  getFilters(): Observable<FilterOptions[]> {
    return of([
      { type: 'primary', value: 'Sales', label: 'Sales' },
      { type: 'primary', value: 'Orders', label: 'Orders' },
      { type: 'primary', value: 'Delivere', label: 'Delivere' },
      { type: 'primary', value: 'Delivery date', label: 'Delivery date' },
      { type: 'secondary', value: 'Customer Type', label: 'Customer Type' },
      { type: 'secondary', value: 'Region', label: 'Region' },
      { type: 'secondary', value: 'Product Category', label: 'Product Category' }
    ]);
  }

  getAnalyticsData(filters: AnalyticsFilters): Observable<{ chartData: ChartDataPoint[], customerData: CustomerData[], summaryTotals: SummaryTotals, legendData: LegendItem[] }> {
    const params = new HttpParams()
      .set('dateFrom', filters.dateRange.from)
      .set('dateTo', filters.dateRange.to);

    return this.http.get<any>(`${this.apiBaseUrl}/orders/buyer/analytics`, { params }).pipe(
      map(res => this.transformBackendAnalytics(res))
    );
  }

  private processFilters(filters: AnalyticsFilters): { chartData: ChartDataPoint[], customerData: CustomerData[], summaryTotals: SummaryTotals, legendData: LegendItem[] } {
    const fromDate = new Date(filters.dateRange.from);
    const toDate = new Date(filters.dateRange.to);

    // Filter chart data based on date range and filter type
    let chartData = this.mockData[filters.selectedFilter.toLowerCase().replace(' ', '') as keyof typeof this.mockData] || this.mockData.sales;
    
    chartData = chartData.filter(data => 
      data.date >= fromDate && data.date <= toDate
    );

    // Filter customer data based on date range
    let customerData = this.mockCustomerData.filter(customer => 
      customer.dateRange.from >= fromDate && customer.dateRange.to <= toDate
    );

    // Apply additional filters
    if (filters.additionalFilters.includes('highVolume')) {
      customerData = customerData.filter(customer => customer.sales > 1000000);
    }
    if (filters.additionalFilters.includes('highFrequency')) {
      customerData = customerData.filter(customer => customer.frequency > 10);
    }

    // Calculate summary totals
    const summaryTotals: SummaryTotals = {
      totalStores: customerData.length,
      totalSales: customerData.reduce((sum, customer) => sum + customer.sales, 0),
      totalOrders: customerData.reduce((sum, customer) => sum + customer.orders, 0),
      averageOrder: customerData.length > 0 ? 
        customerData.reduce((sum, customer) => sum + customer.averageOrder, 0) / customerData.length : 0,
      averageFrequency: customerData.length > 0 ? 
        customerData.reduce((sum, customer) => sum + customer.frequency, 0) / customerData.length : 0
    };

    // Generate legend data based on filtered results
    const legendData: LegendItem[] = [
      { color: 'red', value: customerData.filter(c => c.color === 'red').length, label: 'High Volume' },
      { color: 'orange', value: customerData.filter(c => c.color === 'orange').length, label: 'Medium Volume' },
      { color: 'yellow', value: customerData.filter(c => c.color === 'yellow').length, label: 'Low Volume' },
      { color: 'green', value: customerData.filter(c => c.color === 'green').length, label: 'New Customers' },
      { color: 'blue', value: customerData.filter(c => c.color === 'blue').length, label: 'Regular Customers' },
      { color: 'green', value: Math.floor(customerData.length * 0.3), label: 'Premium Customers' },
      { color: 'pink', value: Math.floor(customerData.length * 0.1), label: 'VIP Customers' }
    ];

    return {
      chartData,
      customerData,
      summaryTotals,
      legendData
    };
  }

  private transformBackendAnalytics(res: any): { chartData: ChartDataPoint[], customerData: CustomerData[], summaryTotals: SummaryTotals, legendData: LegendItem[] } {
    const chartData: ChartDataPoint[] = Object.entries(res.trends || {}).map(([month, v]: any) => ({
      month,
      value: (v as any).sales,
      date: new Date(`${month}-01`)
    }));

    const customerData: CustomerData[] = (res.suppliers || []).map((s: any, idx: number) => ({
      name: s.supplierId,
      color: ['red','orange','yellow','green','blue'][idx % 5],
      sales: s.sales,
      orders: s.orders,
      averageOrder: s.avgOrder,
      frequency: Math.max(1, Math.round(s.orders / 2)),
      dateRange: { from: new Date(), to: new Date() }
    }));

    const summaryTotals: SummaryTotals = {
      totalStores: customerData.length,
      totalSales: res.totalSales || 0,
      totalOrders: res.totalOrders || 0,
      averageOrder: res.averageOrderValue || 0,
      averageFrequency: customerData.length ? Math.round(customerData.reduce((a,c)=>a+c.frequency,0)/customerData.length) : 0
    };

    const legendData: LegendItem[] = [
      { color: 'red', value: 1, label: 'Sales' },
      { color: 'blue', value: 1, label: 'Orders' }
    ];

    return { chartData, customerData, summaryTotals, legendData };
  }

  updateFilters(filters: Partial<AnalyticsFilters>): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, ...filters });
  }

  getCurrentFilters(): Observable<AnalyticsFilters> {
    return this.filtersSubject.asObservable();
  }

  generateReport(filters: AnalyticsFilters): Observable<any> {
    return of(filters).pipe(
      delay(500), // Simulate report generation
      map(f => ({
        reportId: `RPT_${Date.now()}`,
        filters: f,
        generatedAt: new Date(),
        status: 'completed'
      }))
    );
  }

  addComparison(filters: AnalyticsFilters, comparisonFilters: Partial<AnalyticsFilters>): Observable<any> {
    return of({ filters, comparisonFilters }).pipe(
      delay(300),
      map(data => ({
        originalData: this.processFilters(data.filters),
        comparisonData: this.processFilters({ ...data.filters, ...data.comparisonFilters }),
        comparisonType: 'side-by-side'
      }))
    );
  }
}
