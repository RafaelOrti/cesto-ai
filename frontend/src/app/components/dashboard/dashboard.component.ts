import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { 
  AnalyticsService, 
  ChartDataPoint, 
  CustomerData, 
  SummaryTotals, 
  LegendItem, 
  FilterOptions, 
  AnalyticsFilters 
} from '../../core/services/analytics.service';

interface AdditionalFilter {
  key: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: any = null;
  isClient = false;
  isSupplier = false;

  selectedFilter = 'Sales';
  filters: FilterOptions[] = [];
  availableFilters: FilterOptions[] = [];
  showFilterDropdown = false;

  // Material Table columns
  displayedColumns: string[] = ['customer', 'sales', 'orders', 'averageOrder', 'frequency'];

  dateRange = {
    from: '2022-02-01',
    to: '2023-01-31'
  };

  additionalFilters: AdditionalFilter[] = [
    { key: 'highVolume', label: 'High Volume', active: false },
    { key: 'highFrequency', label: 'High Frequency', active: false },
    { key: 'newCustomers', label: 'New Customers', active: false }
  ];

  showComparison = false;
  comparisonFilters: Partial<AnalyticsFilters> = {};
  isLoading = false;

  analyticsData: ChartDataPoint[] = [];
  customerData: CustomerData[] = [];
  summaryTotals: SummaryTotals = {
    totalStores: 0,
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    averageFrequency: 0
  };
  legendData: LegendItem[] = [];

  yAxisLabels = ['2.00M', '1.50M', '1.00M', '0.50M', '0.00M'];

  private readonly CHART_WIDTH = 800;
  private readonly CHART_HEIGHT = 200;
  private readonly MAX_VALUE = 2500000;

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService
  ) {
    console.log('[DASHBOARD] Constructor called');
  }

  ngOnInit() {
    console.log('[DASHBOARD] Component initialized');
    
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      console.log('[DASHBOARD] Current user:', user);
      this.currentUser = user;
      if (user) {
        this.isClient = user.role === 'client';
        this.isSupplier = user.role === 'supplier';
        console.log('[DASHBOARD] User role - Client:', this.isClient, 'Supplier:', this.isSupplier);
      }
    });

    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData(): void {
    console.log('[DASHBOARD] Loading initial data...');
    
    // For now, load mock data to test if the component renders
    this.loadMockData();
    
    // Original code commented out for debugging
    /*
    forkJoin({
      filters: this.analyticsService.getFilters(),
      analytics: this.analyticsService.getAnalyticsData(this.getCurrentFilters())
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ filters, analytics }) => {
        console.log('[DASHBOARD] Data loaded successfully:', { filters, analytics });
        this.availableFilters = filters;
        this.filters = filters.filter(f => f.type === 'primary');
        this.updateAnalyticsData(analytics);
        console.log('[DASHBOARD] Data processed and assigned to component properties');
      },
      error: (error) => {
        console.error('[DASHBOARD] Error loading initial data:', error);
      }
    });
    */
  }

  private loadMockData(): void {
    console.log('[DASHBOARD] Loading mock data...');
    
    // Mock data for testing
    this.analyticsData = [
      { month: 'Jan', value: 2000000, date: new Date('2023-01-01') },
      { month: 'Feb', value: 2200000, date: new Date('2023-02-01') },
      { month: 'Mar', value: 1800000, date: new Date('2023-03-01') },
      { month: 'Apr', value: 2100000, date: new Date('2023-04-01') },
      { month: 'May', value: 2500000, date: new Date('2023-05-01') },
      { month: 'Jun', value: 2800000, date: new Date('2023-06-01') }
    ];

    this.customerData = [
      {
        name: 'StockNet Microdistribution',
        color: 'red',
        sales: 1000000,
        orders: 100,
        averageOrder: 10000,
        frequency: 1,
        dateRange: { from: new Date('2023-01-01'), to: new Date('2023-12-31') }
      },
      {
        name: 'StockNet Macrodistribution',
        color: 'orange',
        sales: 1200000,
        orders: 120,
        averageOrder: 10000,
        frequency: 1,
        dateRange: { from: new Date('2023-01-01'), to: new Date('2023-12-31') }
      }
    ];

    this.summaryTotals = {
      totalStores: 21,
      totalSales: 10657910,
      totalOrders: 1065,
      averageOrder: 10000,
      averageFrequency: 1
    };

    this.legendData = [
      { color: 'red', value: 78, label: 'StockNet Microdistribution' },
      { color: 'orange', value: 65, label: 'StockNet Macrodistribution' },
      { color: 'yellow', value: 45, label: 'Deep Green Wholesalers' },
      { color: 'green', value: 32, label: 'Deep Green Retailers' },
      { color: 'blue', value: 28, label: 'City Ware Merchants' }
    ];

    console.log('[DASHBOARD] Mock data loaded successfully');
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.loadAnalyticsData();
  }

  onDateRangeChange(): void {
    this.loadAnalyticsData();
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  addFilter(filter: FilterOptions): void {
    if (!this.filters.find(f => f.value === filter.value)) {
      this.filters.push(filter);
      this.showFilterDropdown = false;
    }
  }

  removeFilter(filterValue: string): void {
    this.filters = this.filters.filter(f => f.value !== filterValue);
    if (this.selectedFilter === filterValue && this.filters.length > 0) {
      this.selectedFilter = this.filters[0].value;
    }
    this.loadAnalyticsData();
  }

  toggleAdditionalFilter(filter: AdditionalFilter): void {
    filter.active = !filter.active;
    this.loadAnalyticsData();
  }

  generateReport(): void {
    this.isLoading = true;
    this.analyticsService.generateReport(this.getCurrentFilters()).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (report) => {
        console.log('Report generated:', report);
        this.isLoading = false;
        // Here you could show a success message or navigate to the report
      },
      error: (error) => {
        console.error('Error generating report:', error);
        this.isLoading = false;
      }
    });
  }

  addComparison(): void {
    this.showComparison = !this.showComparison;
    if (this.showComparison) {
      // Set default comparison filters
      this.comparisonFilters = {
        dateRange: {
          from: '2021-02-01',
          to: '2022-01-31'
        }
      };
    }
  }

  applyComparison(): void {
    if (this.showComparison) {
      this.analyticsService.addComparison(
        this.getCurrentFilters(), 
        this.comparisonFilters
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (comparisonData) => {
          console.log('Comparison data:', comparisonData);
          // Handle comparison data display
        },
        error: (error) => {
          console.error('Error loading comparison:', error);
        }
      });
    }
  }

  getChartPoints(): string {
    return this.analyticsData
      .map((data, index) => this.calculateChartPoint(data, index))
      .map(point => `${point.x},${point.y}`)
      .join(' ');
  }

  getChartPointsArray(): { x: number; y: number }[] {
    return this.analyticsData
      .map((data, index) => this.calculateChartPoint(data, index));
  }

  private loadAnalyticsData(): void {
    this.isLoading = true;
    this.analyticsService.getAnalyticsData(this.getCurrentFilters()).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.updateAnalyticsData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
        this.isLoading = false;
      }
    });
  }

  private getCurrentFilters(): AnalyticsFilters {
    return {
      selectedFilter: this.selectedFilter,
      dateRange: this.dateRange,
      additionalFilters: this.additionalFilters
        .filter(f => f.active)
        .map(f => f.key)
    };
  }

  private updateAnalyticsData(data: { chartData: ChartDataPoint[], customerData: CustomerData[], summaryTotals: SummaryTotals, legendData: LegendItem[] }): void {
    this.analyticsData = data.chartData;
    this.customerData = data.customerData;
    this.summaryTotals = data.summaryTotals;
    this.legendData = data.legendData;
    
    // Update analytics service with current filters
    this.analyticsService.updateFilters(this.getCurrentFilters());
  }

  private calculateChartPoint(data: ChartDataPoint, index: number): { x: number; y: number } {
    const x = (index / (this.analyticsData.length - 1)) * this.CHART_WIDTH;
    const y = this.CHART_HEIGHT - ((data.value / this.MAX_VALUE) * this.CHART_HEIGHT);
    return { x, y };
  }

  trackByCustomer(index: number, customer: CustomerData): string {
    return customer.name;
  }

  trackByLegend(index: number, item: LegendItem): string {
    return item.color;
  }

  onComparisonDateFromChange(date: string): void {
    if (!this.comparisonFilters.dateRange) {
      this.comparisonFilters.dateRange = { from: '', to: '' };
    }
    this.comparisonFilters.dateRange.from = date;
  }

  onComparisonDateToChange(date: string): void {
    if (!this.comparisonFilters.dateRange) {
      this.comparisonFilters.dateRange = { from: '', to: '' };
    }
    this.comparisonFilters.dateRange.to = date;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    if (filterDropdown && !filterDropdown.contains(target)) {
      this.showFilterDropdown = false;
    }
  }
}