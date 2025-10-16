import { Component, OnInit } from '@angular/core';

interface ChartDataPoint {
  month: string;
  value: number;
}

interface CustomerData {
  name: string;
  color: string;
  orders: number;
  averageOrder: number;
  totalValue: number;
  frequency: number;
}

interface SummaryTotals {
  totalStores: number;
  totalOrders: number;
  averageOrder: number;
  averageValue: number;
}

interface LegendItem {
  color: string;
  value: number;
}

@Component({
  selector: 'app-client-insights',
  templateUrl: './client-insights.component.html',
  styleUrls: ['./client-insights.component.scss']
})
export class ClientInsightsComponent implements OnInit {
  selectedFilter = 'Sales';
  filters = ['Sales', 'Websites', 'Delivery date'];
  
  dateRange = {
    from: '2023-02-17',
    to: '2024-01-29'
  };
  
  analyticsData: { sales: ChartDataPoint[] } = {
    sales: [
      { month: 'Jan', value: 2000000 },
      { month: 'Feb', value: 2200000 },
      { month: 'Mar', value: 1800000 },
      { month: 'Apr', value: 2100000 },
      { month: 'May', value: 2500000 },
      { month: 'Jun', value: 2800000 },
      { month: 'Jul', value: 2600000 },
      { month: 'Aug', value: 2400000 },
      { month: 'Sep', value: 2200000 },
      { month: 'Oct', value: 2000000 },
      { month: 'Nov', value: 2300000 },
      { month: 'Dec', value: 2100000 },
      { month: 'Jan', value: 2500000 },
      { month: 'Feb', value: 2800000 }
    ]
  };

  customerData: CustomerData[] = [
    {
      name: 'StockNet Microdistribution',
      color: 'red',
      orders: 1000000,
      averageOrder: 95,
      totalValue: 10000,
      frequency: 1
    },
    {
      name: 'StockNet Macrodistribution',
      color: 'orange',
      orders: 1200000,
      averageOrder: 87,
      totalValue: 14000,
      frequency: 1
    },
    {
      name: 'Deep Green Wholesalers',
      color: 'yellow',
      orders: 1500000,
      averageOrder: 90,
      totalValue: 15000,
      frequency: 1
    },
    {
      name: 'Deep Green Retailers',
      color: 'green',
      orders: 900000,
      averageOrder: 75,
      totalValue: 12000,
      frequency: 1
    },
    {
      name: 'City Ware Merchants',
      color: 'blue',
      orders: 850000,
      averageOrder: 70,
      totalValue: 10000,
      frequency: 1
    }
  ];

  summaryTotals: SummaryTotals = {
    totalStores: 21,
    totalOrders: 10657910,
    averageOrder: 90,
    averageValue: 8079
  };

  legendData: LegendItem[] = [
    { color: 'red', value: 78 },
    { color: 'orange', value: 91 },
    { color: 'yellow', value: 83 },
    { color: 'green', value: 71 },
    { color: 'blue', value: 69 },
    { color: 'purple', value: 77 },
    { color: 'pink', value: 80 },
    { color: 'cyan', value: 79 },
    { color: 'lime', value: 76 },
    { color: 'indigo', value: 75 }
  ];

  private readonly CHART_WIDTH = 800;
  private readonly CHART_HEIGHT = 200;
  private readonly MAX_VALUE = 3000000;

  ngOnInit(): void {
    this.loadAnalyticsData();
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
  }

  exportData(): void {
    // Implementation for data export
  }

  addComparison(): void {
    // Implementation for adding comparison
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
  }

  private calculateChartPoint(data: ChartDataPoint, index: number): { x: number; y: number } {
    const x = (index / (this.analyticsData.sales.length - 1)) * this.CHART_WIDTH;
    const y = this.CHART_HEIGHT - ((data.value / this.MAX_VALUE) * this.CHART_HEIGHT);
    return { x, y };
  }
}