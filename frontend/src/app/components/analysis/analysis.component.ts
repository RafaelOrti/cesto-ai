import { Component, OnInit } from '@angular/core';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

interface PerformanceMetric {
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

interface ForecastingData {
  productId: string;
  productName: string;
  historicalData: number[];
  predictedData: number[];
  confidence: number;
  seasonality: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  industry: number;
  benchmark: number;
  unit: string;
}

interface AIRecommendation {
  id: string;
  type: 'cost_optimization' | 'demand_forecast' | 'inventory_management' | 'supplier_optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  estimatedSavings: number;
  implementationTime: string;
  actionItems: string[];
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  selectedTimeRange = '30d';
  selectedMetric = 'all';
  selectedCategory = 'all';
  showForecasting = true;
  showComparison = true;

  // Performance metrics
  performanceMetrics: PerformanceMetric[] = [
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
      title: 'Order Volume',
      value: 342,
      previousValue: 298,
      change: 44,
      changePercentage: 14.77,
      trend: 'up',
      unit: 'orders',
      icon: 'shopping_cart'
    },
    {
      id: '3',
      title: 'Average Order Value',
      value: 367.20,
      previousValue: 399.20,
      change: -32.00,
      changePercentage: -8.01,
      trend: 'down',
      unit: 'SEK',
      icon: 'attach_money'
    },
    {
      id: '4',
      title: 'Inventory Turnover',
      value: 8.5,
      previousValue: 7.2,
      change: 1.3,
      changePercentage: 18.06,
      trend: 'up',
      unit: 'times/year',
      icon: 'refresh'
    }
  ];

  // Chart data
  revenueChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue (SEK)',
        data: [95000, 102000, 98000, 110000, 105000, 118000, 112000, 120000, 115000, 125000, 130000, 125430],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true
      }
    ]
  };

  demandForecastData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Historical Demand',
        data: [120, 135, 128, 145, 140, 155, 148, 160],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: false
      },
      {
        label: 'AI Prediction',
        data: [160, 165, 170, 175, 180, 185, 190, 195],
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: false
      }
    ]
  };

  categoryPerformanceData: ChartData = {
    labels: ['Beverages', 'Dairy', 'Tobacco', 'Snacks', 'Pharmacy'],
    datasets: [
      {
        label: 'Revenue (SEK)',
        data: [45000, 28000, 32000, 15000, 5430],
        backgroundColor: '#4CAF50'
      }
    ]
  };

  // Forecasting data
  forecastingData: ForecastingData[] = [
    {
      productId: '1',
      productName: 'Fever Tree Premium Indian Tonic Water',
      historicalData: [120, 135, 128, 145, 140, 155, 148, 160],
      predictedData: [160, 165, 170, 175, 180, 185, 190, 195],
      confidence: 0.85,
      seasonality: 0.15,
      trend: 'increasing'
    },
    {
      productId: '2',
      productName: 'Organic Milk 330ml',
      historicalData: [80, 85, 90, 88, 95, 92, 98, 100],
      predictedData: [105, 110, 115, 120, 125, 130, 135, 140],
      confidence: 0.92,
      seasonality: 0.08,
      trend: 'increasing'
    }
  ];

  // Comparison data
  comparisonData: ComparisonData[] = [
    {
      metric: 'Inventory Turnover',
      current: 8.5,
      previous: 7.2,
      industry: 6.8,
      benchmark: 10.0,
      unit: 'times/year'
    },
    {
      metric: 'Order Fulfillment Time',
      current: 2.3,
      previous: 2.8,
      industry: 3.5,
      benchmark: 2.0,
      unit: 'days'
    },
    {
      metric: 'Customer Satisfaction',
      current: 4.6,
      previous: 4.4,
      industry: 4.2,
      benchmark: 4.8,
      unit: '/5.0'
    }
  ];

  // AI Recommendations
  aiRecommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'cost_optimization',
      title: 'Optimize Inventory Levels',
      description: 'Reduce overstock of Non-Alcoholic Origin by 15% to improve cash flow',
      impact: 'high',
      confidence: 0.88,
      estimatedSavings: 1250.0,
      implementationTime: '1-2 weeks',
      actionItems: [
        'Adjust reorder points for overstocked items',
        'Implement dynamic pricing for slow-moving inventory',
        'Negotiate better terms with suppliers'
      ],
      priority: 'high'
    },
    {
      id: '2',
      type: 'demand_forecast',
      title: 'Weekend Demand Surge Prediction',
      description: 'AI predicts 30% increase in beverage demand for upcoming weekend',
      impact: 'medium',
      confidence: 0.92,
      estimatedSavings: 0,
      implementationTime: 'Immediate',
      actionItems: [
        'Increase stock of popular beverages',
        'Prepare for higher order volume',
        'Notify suppliers of potential increase'
      ],
      priority: 'medium'
    },
    {
      id: '3',
      type: 'supplier_optimization',
      title: 'Supplier Performance Analysis',
      description: 'Consider diversifying suppliers for better price competition',
      impact: 'medium',
      confidence: 0.75,
      estimatedSavings: 800.0,
      implementationTime: '2-4 weeks',
      actionItems: [
        'Research alternative suppliers',
        'Request quotes from new suppliers',
        'Negotiate better terms with current suppliers'
      ],
      priority: 'low'
    }
  ];

  timeRanges = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
    { id: '1y', name: 'Last Year' }
  ];

  metrics = [
    { id: 'all', name: 'All Metrics' },
    { id: 'revenue', name: 'Revenue' },
    { id: 'orders', name: 'Orders' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'customers', name: 'Customers' }
  ];

  categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'tobacco', name: 'Tobacco' },
    { id: 'snacks', name: 'Snacks' }
  ];

  ngOnInit(): void {
    this.loadAnalysisData();
  }

  onTimeRangeChange(range: string): void {
    this.selectedTimeRange = range;
    this.loadAnalysisData();
  }

  onMetricChange(metric: string): void {
    this.selectedMetric = metric;
    this.filterData();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterData();
  }

  toggleForecasting(): void {
    this.showForecasting = !this.showForecasting;
  }

  toggleComparison(): void {
    this.showComparison = !this.showComparison;
  }

  exportData(): void {
    // Export analysis data
    console.log('Exporting analysis data...');
  }

  generateReport(): void {
    // Generate comprehensive analysis report
    console.log('Generating analysis report...');
  }

  applyRecommendation(recommendation: AIRecommendation): void {
    if (confirm(`Apply recommendation: ${recommendation.title}?`)) {
      console.log('Applying recommendation:', recommendation);
      // Implement recommendation logic
    }
  }

  dismissRecommendation(recommendation: AIRecommendation): void {
    const index = this.aiRecommendations.indexOf(recommendation);
    if (index > -1) {
      this.aiRecommendations.splice(index, 1);
    }
  }

  getTrendClass(trend: string): string {
    const classes: { [key: string]: string } = {
      'up': 'trend-up',
      'down': 'trend-down',
      'stable': 'trend-stable'
    };
    return classes[trend] || 'trend-stable';
  }

  getTrendIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      'up': 'trending_up',
      'down': 'trending_down',
      'stable': 'trending_flat'
    };
    return icons[trend] || 'trending_flat';
  }

  getImpactClass(impact: string): string {
    const classes: { [key: string]: string } = {
      'high': 'impact-high',
      'medium': 'impact-medium',
      'low': 'impact-low'
    };
    return classes[impact] || 'impact-low';
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return classes[priority] || 'priority-low';
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.6) return 'confidence-medium';
    return 'confidence-low';
  }

  getMetricTrendClass(trend: string): string {
    const classes: { [key: string]: string } = {
      'up': 'trend-up',
      'down': 'trend-down',
      'stable': 'trend-stable'
    };
    return classes[trend] || 'trend-stable';
  }

  getChangeClass(changePercentage: number): string {
    if (changePercentage > 0) return 'change-positive';
    if (changePercentage < 0) return 'change-negative';
    return 'change-neutral';
  }

  getChangeIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      'up': 'trending_up',
      'down': 'trending_down',
      'stable': 'trending_flat'
    };
    return icons[trend] || 'trending_flat';
  }

  formatValue(value: number, unit: string): string {
    if (unit === 'SEK') {
      return this.formatCurrency(value);
    }
    return `${value.toLocaleString('sv-SE')} ${unit}`;
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatNumber(value: number, unit: string): string {
    return `${value.toLocaleString('sv-SE')} ${unit}`;
  }

  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  formatConfidence(confidence: number): string {
    return `${Math.round(confidence * 100)}%`;
  }

  getRecommendationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'cost_optimization': 'savings',
      'demand_forecast': 'trending_up',
      'inventory_management': 'inventory',
      'supplier_optimization': 'business'
    };
    return icons[type] || 'lightbulb';
  }

  getRecommendationTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'cost_optimization': 'Cost Optimization',
      'demand_forecast': 'Demand Forecast',
      'inventory_management': 'Inventory Management',
      'supplier_optimization': 'Supplier Optimization'
    };
    return labels[type] || 'General';
  }

  getPerformanceClass(current: number, industry: number): string {
    if (current > industry) return 'performance-above';
    if (current < industry) return 'performance-below';
    return 'performance-average';
  }

  getPerformanceIcon(current: number, industry: number): string {
    if (current > industry) return 'trending_up';
    if (current < industry) return 'trending_down';
    return 'trending_flat';
  }

  getPerformanceText(current: number, industry: number): string {
    const percentage = ((current - industry) / industry) * 100;
    if (percentage > 0) return `${Math.abs(percentage).toFixed(1)}% above industry average`;
    if (percentage < 0) return `${Math.abs(percentage).toFixed(1)}% below industry average`;
    return 'At industry average';
  }

  private loadAnalysisData(): void {
    // Load analysis data from API based on selected time range
    console.log('Loading analysis data for:', this.selectedTimeRange);
  }

  private filterData(): void {
    // Filter data based on selected metric and category
    console.log('Filtering data:', this.selectedMetric, this.selectedCategory);
  }
}
