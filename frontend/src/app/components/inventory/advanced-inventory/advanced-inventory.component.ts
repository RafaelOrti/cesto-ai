import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AdvancedInventoryService, InventoryAnalytics, InventoryAlert, RestockRecommendation } from '../../../services/advanced-inventory.service';
import { I18nService } from '../../../core/services/i18n.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BaseComponent } from '../../../core/components/base-component';

@Component({
  selector: 'app-advanced-inventory',
  templateUrl: './advanced-inventory.component.html',
  styleUrls: ['./advanced-inventory.component.scss']
})
export class AdvancedInventoryComponent extends BaseComponent implements OnInit, OnDestroy {
  // Data
  analytics: InventoryAnalytics | null = null;
  alerts: InventoryAlert[] = [];
  restockRecommendations: RestockRecommendation[] = [];
  
  // UI State
  selectedTab = 0;
  selectedAlert: InventoryAlert | null = null;
  showAlertDetails = false;
  showRestockModal = false;
  isLoading = false;
  loading = false;

  // Properties from BaseComponent
  i18n: any = { translate: (key: string) => key };
  notificationService: any = { error: (msg: string) => console.error(msg) };
  setLoading: (loading: boolean) => void = (loading: boolean) => { this.isLoading = loading; };

  // Forms
  alertSettingsForm!: FormGroup;
  movementForm!: FormGroup;

  // Filter options
  alertTypes = [
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'overstock', label: 'Overstock' },
    { value: 'price_change', label: 'Price Change' },
    { value: 'expiry_warning', label: 'Expiry Warning' },
    { value: 'seasonal_demand', label: 'Seasonal Demand' },
    { value: 'supplier_issue', label: 'Supplier Issue' }
  ];

  movementTypes = [
    { value: 'inbound', label: 'Inbound' },
    { value: 'outbound', label: 'Outbound' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'return', label: 'Return' },
    { value: 'damage', label: 'Damage' },
    { value: 'expired', label: 'Expired' },
    { value: 'theft', label: 'Theft' },
    { value: 'cycle_count', label: 'Cycle Count' }
  ];

  movementReasons = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'sale', label: 'Sale' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'return', label: 'Return' },
    { value: 'damage', label: 'Damage' },
    { value: 'expiry', label: 'Expiry' },
    { value: 'theft', label: 'Theft' },
    { value: 'cycle_count', label: 'Cycle Count' },
    { value: 'correction', label: 'Correction' },
    { value: 'initial_stock', label: 'Initial Stock' }
  ];

  constructor(
    protected fb: FormBuilder,
    private advancedInventoryService: AdvancedInventoryService
  ) {
    super(fb);
  }

  showError(message: string): void {
    console.error(message);
  }

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  ngOnDestroy(): void {
    // Additional cleanup if needed
  }

  initForms(): void {
    this.alertSettingsForm = this.fb.group({
      lowStockThreshold: [10, [Validators.required, Validators.min(0)]],
      overstockThreshold: [100, [Validators.required, Validators.min(0)]],
      priceChangeThreshold: [10, [Validators.required, Validators.min(0)]],
      expiryWarningDays: [30, [Validators.required, Validators.min(1)]],
      enableEmailAlerts: [true],
      enableSmsAlerts: [false],
      enablePushAlerts: [true],
      alertFrequency: ['immediate', Validators.required],
      departmentAlerts: [[]],
      categoryAlerts: [[]],
      flavorAlerts: [[]],
      offerAlerts: [true],
      campaignAlerts: [true]
    });

    this.movementForm = this.fb.group({
      inventoryId: ['', Validators.required],
      type: ['', Validators.required],
      reason: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      notes: [''],
      location: [''],
      batchNumber: [''],
      expiryDate: ['']
    });
  }

  loadData(): void {
    this.setLoading(true);
    
    // Load analytics
    this.advancedInventoryService.getInventoryAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analytics) => {
          this.analytics = analytics;
        },
        error: (err) => {
          this.showError(this.i18n.translate('inventory.analyticsLoadError'));
          console.error('Error loading analytics:', err);
        }
      });

    // Load alerts
    this.advancedInventoryService.getActiveAlerts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (alerts) => {
          this.alerts = alerts;
        },
        error: (err) => {
          this.showError(this.i18n.translate('inventory.alertsLoadError'));
          console.error('Error loading alerts:', err);
        }
      });

    // Load restock recommendations
    this.advancedInventoryService.getRestockRecommendations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recommendations) => {
          this.restockRecommendations = recommendations;
          this.setLoading(false);
        },
        error: (err) => {
          this.showError(this.i18n.translate('inventory.recommendationsLoadError'));
          console.error('Error loading recommendations:', err);
          this.setLoading(false);
        }
      });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  selectAlert(alert: InventoryAlert): void {
    this.selectedAlert = alert;
    this.showAlertDetails = true;
  }

  acknowledgeAlert(alert: InventoryAlert): void {
    const notes = prompt(this.i18n.translate('inventory.acknowledgeNotes'));
    if (notes !== null) {
      this.advancedInventoryService.acknowledgeAlert(alert.id, notes)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success(this.i18n.translate('inventory.alertAcknowledged'));
            this.loadData();
            this.showAlertDetails = false;
          },
          error: (err) => {
            this.notificationService.error(this.i18n.translate('inventory.acknowledgeError'));
            console.error('Error acknowledging alert:', err);
          }
        });
    }
  }

  resolveAlert(alert: InventoryAlert): void {
    const notes = prompt(this.i18n.translate('inventory.resolveNotes'));
    if (notes !== null) {
      this.advancedInventoryService.resolveAlert(alert.id, notes)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success(this.i18n.translate('inventory.alertResolved'));
            this.loadData();
            this.showAlertDetails = false;
          },
          error: (err) => {
            this.notificationService.error(this.i18n.translate('inventory.resolveError'));
            console.error('Error resolving alert:', err);
          }
        });
    }
  }

  saveAlertSettings(): void {
    if (this.alertSettingsForm.invalid) {
      this.notificationService.error(this.i18n.translate('common.formInvalid'));
      return;
    }

    // This would need to be implemented with a specific product ID
    // For now, showing a placeholder
    this.notificationService.info(this.i18n.translate('inventory.alertSettingsSaved'));
  }

  recordMovement(): void {
    if (this.movementForm.invalid) {
      this.notificationService.error(this.i18n.translate('common.formInvalid'));
      return;
    }

    const movementData = this.movementForm.value;
    this.advancedInventoryService.recordMovement(movementData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.translate('inventory.movementRecorded'));
          this.movementForm.reset();
          this.loadData();
        },
        error: (err) => {
          this.notificationService.error(this.i18n.translate('inventory.movementError'));
          console.error('Error recording movement:', err);
        }
      });
  }

  updateAiInsights(): void {
    this.loading = true;
    this.advancedInventoryService.updateAiInsights()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.translate('inventory.aiInsightsUpdated'));
          this.loadData();
        },
        error: (err) => {
          this.notificationService.error(this.i18n.translate('inventory.aiInsightsError'));
          console.error('Error updating AI insights:', err);
          this.loading = false;
        }
      });
  }

  getAlertPriorityClass(priority: string): string {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  }

  getUrgencyClass(urgency: string): string {
    switch (urgency) {
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      case 'low': return 'urgency-low';
      default: return 'urgency-medium';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }
}

