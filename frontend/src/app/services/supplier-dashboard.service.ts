import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SupplierMetric {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  icon: string;
}

export interface SalesChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
  }[];
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  orders: number;
  revenue: number;
  growth: number;
}

export interface RecentOrder {
  id: string;
  buyer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  products: number;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierDashboardService {
  private apiUrl = 'http://localhost:3400/api/v1';

  constructor(private http: HttpClient) { }

  getSupplierMetrics(): Observable<SupplierMetric[]> {
    // Mock data for now - replace with actual API call
    return of([
      {
        id: '1',
        title: 'Total Revenue',
        value: 125430.50,
        previousValue: 118920.30,
        change: 6510.20,
        changePercentage: 5.48,
        trend: 'up',
        unit: 'SEK',
        icon: 'trending_up'
      },
      {
        id: '2',
        title: 'Products Sold',
        value: 342,
        previousValue: 298,
        change: 44,
        changePercentage: 14.77,
        trend: 'up',
        unit: 'units',
        icon: 'shopping_cart'
      },
      {
        id: '3',
        title: 'Active Buyers',
        value: 28,
        previousValue: 25,
        change: 3,
        changePercentage: 12.0,
        trend: 'up',
        unit: 'buyers',
        icon: 'people'
      },
      {
        id: '4',
        title: 'Order Fulfillment',
        value: 94.5,
        previousValue: 91.2,
        change: 3.3,
        changePercentage: 3.62,
        trend: 'up',
        unit: '%',
        icon: 'check_circle'
      }
    ]);
  }

  getSalesChartData(): Observable<SalesChartData> {
    // Mock data for now - replace with actual API call
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [12000, 15000, 18000, 16000, 20000, 22000],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true
        }
      ]
    });
  }

  getTopProducts(): Observable<TopProduct[]> {
    // Mock data for now - replace with actual API call
    return of([
      {
        id: '1',
        name: 'Organic Milk 1L',
        sales: 156,
        orders: 23,
        revenue: 31200,
        growth: 12.5
      },
      {
        id: '2',
        name: 'Fresh Bread Loaf',
        sales: 89,
        orders: 15,
        revenue: 17800,
        growth: 8.3
      },
      {
        id: '3',
        name: 'Energy Drink 500ml',
        sales: 67,
        orders: 12,
        revenue: 13400,
        growth: -2.1
      }
    ]);
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    // Mock data for now - replace with actual API call
    return of([
      {
        id: '1',
        buyer: 'Restaurant ABC',
        amount: 2450.00,
        status: 'processing',
        date: '2024-01-15',
        products: 12
      },
      {
        id: '2',
        buyer: 'Cafe XYZ',
        amount: 1890.50,
        status: 'shipped',
        date: '2024-01-14',
        products: 8
      },
      {
        id: '3',
        buyer: 'Hotel DEF',
        amount: 3200.75,
        status: 'delivered',
        date: '2024-01-13',
        products: 15
      }
    ]);
  }

  // Real API calls (to be implemented)
  getSupplierMetricsFromAPI(): Observable<SupplierMetric[]> {
    return this.http.get<SupplierMetric[]>(`${this.apiUrl}/suppliers/dashboard/metrics`)
      .pipe(
        catchError(error => {
          console.error('Error fetching supplier metrics:', error);
          return of([]);
        })
      );
  }

  getSalesChartDataFromAPI(): Observable<SalesChartData> {
    return this.http.get<SalesChartData>(`${this.apiUrl}/suppliers/dashboard/sales-chart`)
      .pipe(
        catchError(error => {
          console.error('Error fetching sales chart data:', error);
          return of({ labels: [], datasets: [] });
        })
      );
  }
}

