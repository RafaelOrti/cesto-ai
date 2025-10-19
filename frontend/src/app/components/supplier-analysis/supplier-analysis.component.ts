import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-analysis',
  templateUrl: './supplier-analysis.component.html',
  styleUrls: ['./supplier-analysis.component.scss']
})
export class SupplierAnalysisComponent implements OnInit {
  selectedTimeRange = '30days';
  selectedMetric = 'sales';
  loading = false;

  timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' }
  ];

  metrics = [
    { value: 'sales', label: 'Sales Performance' },
    { value: 'inventory', label: 'Inventory Analysis' },
    { value: 'orders', label: 'Order Trends' },
    { value: 'customers', label: 'Customer Insights' }
  ];

  salesData: any[] = [];
  inventoryData: any[] = [];
  orderData: any[] = [];
  customerData: any[] = [];

  kpis = {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingProduct: '',
    customerSatisfaction: 0,
    inventoryTurnover: 0
  };

  constructor() { }

  ngOnInit(): void {
    this.loadAnalysisData();
  }

  loadAnalysisData(): void {
    this.loading = true;
    // Mock data - replace with actual API calls
    setTimeout(() => {
      this.salesData = this.generateSalesData();
      this.inventoryData = this.generateInventoryData();
      this.orderData = this.generateOrderData();
      this.customerData = this.generateCustomerData();
      this.calculateKPIs();
      this.loading = false;
    }, 1000);
  }

  generateSalesData(): any[] {
    const data = [];
    const days = this.selectedTimeRange === '7days' ? 7 : 
                this.selectedTimeRange === '30days' ? 30 :
                this.selectedTimeRange === '90days' ? 90 : 365;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 8000) + 2000
      });
    }
    return data;
  }

  generateInventoryData(): any[] {
    return [
      { category: 'Dairy', currentStock: 150, sold: 75, turnover: 2.0 },
      { category: 'Fruits', currentStock: 200, sold: 120, turnover: 1.8 },
      { category: 'Meat', currentStock: 80, sold: 60, turnover: 2.5 },
      { category: 'Frozen', currentStock: 300, sold: 90, turnover: 1.2 },
      { category: 'Packaged', currentStock: 500, sold: 200, turnover: 1.6 }
    ];
  }

  generateOrderData(): any[] {
    return [
      { month: 'Jan', orders: 45, value: 12500 },
      { month: 'Feb', orders: 52, value: 14200 },
      { month: 'Mar', orders: 48, value: 13800 },
      { month: 'Apr', orders: 61, value: 16800 },
      { month: 'May', orders: 55, value: 15200 },
      { month: 'Jun', orders: 58, value: 16100 }
    ];
  }

  generateCustomerData(): any[] {
    return [
      { segment: 'Restaurants', count: 25, revenue: 45000, growth: 12.5 },
      { segment: 'Cafes', count: 18, revenue: 28000, growth: 8.3 },
      { segment: 'Hotels', count: 12, revenue: 35000, growth: 15.2 },
      { segment: 'Catering', count: 8, revenue: 22000, growth: 6.8 }
    ];
  }

  calculateKPIs(): void {
    this.kpis = {
      totalSales: this.salesData.reduce((sum, day) => sum + day.sales, 0),
      totalOrders: this.salesData.reduce((sum, day) => sum + day.orders, 0),
      averageOrderValue: this.salesData.reduce((sum, day) => sum + day.revenue, 0) / 
                        this.salesData.reduce((sum, day) => sum + day.orders, 0),
      topSellingProduct: 'Organic Milk 1L',
      customerSatisfaction: 4.6,
      inventoryTurnover: 1.8
    };
  }

  onTimeRangeChange(timeRange: string): void {
    this.selectedTimeRange = timeRange;
    this.loadAnalysisData();
  }

  onMetricChange(metric: string): void {
    this.selectedMetric = metric;
  }

  exportReport(): void {
    console.log('Exporting analysis report...');
  }

  generateInsights(): void {
    console.log('Generating AI insights...');
  }
}