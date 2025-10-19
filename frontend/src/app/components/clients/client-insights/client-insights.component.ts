import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';

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

  constructor(private i18nService: I18nService) {}
  
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
    console.log('Generating report with parameters:', {
      filter: this.selectedFilter,
      dateRange: this.dateRange,
      data: this.analyticsData
    });
    
    // Show loading state
    const reportButton = document.querySelector('.generate-btn') as HTMLButtonElement;
    if (reportButton) {
      reportButton.disabled = true;
      reportButton.innerHTML = '<i class="icon-loading"></i> Generating...';
    }

    // Simulate report generation
    setTimeout(() => {
      // Reset button state
      if (reportButton) {
        reportButton.disabled = false;
        reportButton.innerHTML = 'Generate';
      }
      
      // Create and download report
      this.createReportFile();
      
      // Show success notification
      this.showNotification('Report generated successfully!', 'success');
    }, 2000);
  }

  exportData(): void {
    console.log('Exporting data:', {
      filter: this.selectedFilter,
      dateRange: this.dateRange,
      customerData: this.customerData,
      analyticsData: this.analyticsData
    });

    // Show loading state
    const exportButton = document.querySelector('.export-btn') as HTMLButtonElement;
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.innerHTML = '<i class="icon-loading"></i> Exporting...';
    }

    // Simulate export process
    setTimeout(() => {
      // Reset button state
      if (exportButton) {
        exportButton.disabled = false;
        exportButton.innerHTML = '<i class="icon-export"></i> Export';
      }
      
      // Create and download CSV
      this.createCSVExport();
      
      // Show success notification
      this.showNotification('Data exported successfully!', 'success');
    }, 1500);
  }

  addComparison(): void {
    console.log('Adding comparison for filter:', this.selectedFilter);
    
    // Create comparison modal or inline form
    const comparisonData = prompt('Enter comparison criteria (e.g., "Previous Year", "Competitor", "Target"):');
    
    if (comparisonData && comparisonData.trim()) {
      // Add comparison to the chart
      this.addComparisonToChart(comparisonData.trim());
      this.showNotification(`Comparison "${comparisonData}" added successfully!`, 'success');
    }
  }

  private createReportFile(): void {
    const reportData = {
      title: `${this.selectedFilter} Analytics Report`,
      dateRange: this.dateRange,
      generatedDate: new Date().toISOString(),
      summary: this.summaryTotals,
      customerData: this.customerData,
      analyticsData: this.analyticsData
    };

    const reportContent = `
# ${reportData.title}

**Date Range:** ${reportData.dateRange.from} to ${reportData.dateRange.to}
**Generated:** ${new Date(reportData.generatedDate).toLocaleString()}

## Summary
- Total Stores: ${reportData.summary.totalStores}
- Total Orders: ${reportData.summary.totalOrders.toLocaleString()}
- Average Order Value: ${reportData.summary.averageOrder}
- Average Value: ${reportData.summary.averageValue}

## Customer Performance
${reportData.customerData.map(customer => `
### ${customer.name}
- Orders: ${customer.orders.toLocaleString()}
- Average Order: ${customer.averageOrder}
- Total Value: ${customer.totalValue.toLocaleString()}
- Frequency: ${customer.frequency}
`).join('')}

## Analytics Data
${reportData.analyticsData.sales.map(data => `- ${data.month}: ${data.value.toLocaleString()}`).join('\n')}
    `;

    this.downloadFile(reportContent, `${this.selectedFilter.toLowerCase()}-report-${Date.now()}.md`, 'text/markdown');
  }

  private createCSVExport(): void {
    const csvHeaders = ['Customer', 'Orders', 'Average Order', 'Total Value', 'Frequency'];
    const csvRows = this.customerData.map(customer => [
      customer.name,
      customer.orders,
      customer.averageOrder,
      customer.totalValue,
      customer.frequency
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    this.downloadFile(csvContent, `client-insights-${Date.now()}.csv`, 'text/csv');
  }

  private addComparisonToChart(comparisonName: string): void {
    // Add comparison data to the chart
    const comparisonData = this.analyticsData.sales.map(data => ({
      month: data.month,
      value: Math.floor(data.value * (0.8 + Math.random() * 0.4)) // Simulate comparison data
    }));

    // Update legend to include comparison
    this.legendData.push({
      color: this.getRandomColor(),
      value: Math.floor(Math.random() * 20) + 70
    });

    console.log(`Added comparison "${comparisonName}":`, comparisonData);
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="icon-${type === 'success' ? 'check' : type === 'error' ? 'error' : 'info'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  private getRandomColor(): string {
    const colors = ['purple', 'pink', 'cyan', 'lime', 'indigo', 'teal', 'amber', 'emerald'];
    return colors[Math.floor(Math.random() * colors.length)];
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