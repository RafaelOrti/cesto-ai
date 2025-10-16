import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface ChartDataPoint {
  month: string;
  value: number;
}

interface CustomerData {
  name: string;
  color: string;
  sales: number;
  orders: number;
  averageOrder: number;
  frequency: number;
}

interface SummaryTotals {
  totalStores: number;
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
  averageFrequency: number;
}

interface LegendItem {
  color: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isBuyer = false;
  isSupplier = false;

  selectedFilter = 'Sales';
  filters = ['Sales', 'Orders', 'Delivere', 'Delivery date'];

  dateRange = {
    from: '2022-02-01',
    to: '2023-01-31'
  };

  analyticsData: { sales: ChartDataPoint[] } = {
    sales: [
      { month: 'Feb', value: 1800000 },
      { month: 'Mar', value: 2200000 },
      { month: 'Apr', value: 1900000 },
      { month: 'May', value: 2100000 },
      { month: 'Jun', value: 2000000 },
      { month: 'Jul', value: 2300000 },
      { month: 'Aug', value: 2400000 },
      { month: 'Sep', value: 2200000 },
      { month: 'Oct', value: 2100000 },
      { month: 'Nov', value: 2000000 },
      { month: 'Dec', value: 1900000 },
      { month: 'Jan', value: 1800000 }
    ]
  };

  customerData: CustomerData[] = [
    {
      name: 'Butik Nära Hällevadshellm',
      color: 'red',
      sales: 4003061,
      orders: 45,
      averageOrder: 88957,
      frequency: 5
    },
    {
      name: 'Butik Närs Hällevadshelm',
      color: 'orange',
      sales: 2987558,
      orders: 27,
      averageOrder: 110650,
      frequency: 8
    },
    {
      name: 'Coop Forum Hököpinge',
      color: 'yellow',
      sales: 1926981,
      orders: 28,
      averageOrder: 68821,
      frequency: 5
    },
    {
      name: 'Coop Forum Järna',
      color: 'green',
      sales: 901860,
      orders: 7,
      averageOrder: 141694,
      frequency: 36
    },
    {
      name: 'City Nära Stavsnäs',
      color: 'blue',
      sales: 457475,
      orders: 30,
      averageOrder: 15249,
      frequency: 5
    }
  ];

  summaryTotals: SummaryTotals = {
    totalStores: 245,
    totalSales: 16677110,
    totalOrders: 917,
    averageOrder: 8777,
    averageFrequency: 21
  };

  legendData: LegendItem[] = [
    { color: 'red', value: 78 },
    { color: 'orange', value: 40 },
    { color: 'yellow', value: 31 },
    { color: 'green', value: 0 },
    { color: 'blue', value: 0 },
    { color: 'purple', value: 90 },
    { color: 'pink', value: 6 }
  ];

  yAxisLabels = ['2.00M', '1.50M', '1.00M', '0.50M', '0.00M'];

  private readonly CHART_WIDTH = 800;
  private readonly CHART_HEIGHT = 200;
  private readonly MAX_VALUE = 2500000;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.isBuyer = user.role === 'buyer';
        this.isSupplier = user.role === 'supplier';
      }
    });
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.loadAnalyticsData();
  }

  onDateRangeChange(): void {
    this.loadAnalyticsData();
  }

  generateReport(): void {
    // Implementation for report generation
    console.log('Generating report...');
  }

  addComparison(): void {
    // Implementation for adding comparison
    console.log('Adding comparison...');
  }

  getChartPoints(): string {
    return this.analyticsData.sales
      .map((data, index) => this.calculateChartPoint(data, index))
      .map(point => `${point.x},${point.y}`)
      .join(' ');
  }

  getChartPointsArray(): { x: number; y: number }[] {
    return this.analyticsData.sales
      .map((data, index) => this.calculateChartPoint(data, index));
  }

  private loadAnalyticsData(): void {
    // Load client insights data from API
    console.log('Loading analytics data...');
  }

  private calculateChartPoint(data: ChartDataPoint, index: number): { x: number; y: number } {
    const x = (index / (this.analyticsData.sales.length - 1)) * this.CHART_WIDTH;
    const y = this.CHART_HEIGHT - ((data.value / this.MAX_VALUE) * this.CHART_HEIGHT);
    return { x, y };
  }
}