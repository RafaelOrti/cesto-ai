import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { I18nService } from '../../core/services/i18n.service';

interface SystemConfig {
  general: {
    platformName: string;
    platformDescription: string;
    timezone: string;
    language: string;
    currency: string;
    dateFormat: string;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    notificationFrequency: string;
  };
  integrations: {
    ediEnabled: boolean;
    apiEnabled: boolean;
    webhookUrl: string;
    apiKey: string;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    scheduledMaintenance: string;
  };
}

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentTab = 'general';
  isLoading = false;
  isSaving = false;
  
  systemConfig: SystemConfig = {
    general: {
      platformName: 'CESTO AI Platform',
      platformDescription: 'Advanced AI-powered supply chain management platform',
      timezone: 'UTC',
      language: 'en',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY'
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      sessionTimeout: 30,
      twoFactorAuth: false,
      ipWhitelist: []
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notificationFrequency: 'immediate'
    },
    integrations: {
      ediEnabled: true,
      apiEnabled: true,
      webhookUrl: '',
      apiKey: ''
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'System is currently under maintenance. Please try again later.',
      scheduledMaintenance: ''
    }
  };
  
  generalForm: FormGroup;
  securityForm: FormGroup;
  notificationsForm: FormGroup;
  integrationsForm: FormGroup;
  maintenanceForm: FormGroup;
  
  timezones = [
    'UTC', 'GMT', 'EST', 'PST', 'CET', 'EET', 'JST', 'AEST'
  ];
  
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'sv', name: 'Svenska' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];
  
  currencies = [
    'EUR', 'USD', 'GBP', 'SEK', 'NOK', 'DKK', 'CHF'
  ];
  
  dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY'
  ];
  
  notificationFrequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    public i18n: I18nService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSystemConfig();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.generalForm = this.fb.group({
      platformName: ['', [Validators.required, Validators.minLength(3)]],
      platformDescription: ['', [Validators.required, Validators.minLength(10)]],
      timezone: ['', [Validators.required]],
      language: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      dateFormat: ['', [Validators.required]]
    });

    this.securityForm = this.fb.group({
      passwordMinLength: [8, [Validators.required, Validators.min(6), Validators.max(20)]],
      passwordRequireSpecialChars: [false],
      sessionTimeout: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
      twoFactorAuth: [false],
      ipWhitelist: [[]]
    });

    this.notificationsForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      pushNotifications: [true],
      notificationFrequency: ['immediate', [Validators.required]]
    });

    this.integrationsForm = this.fb.group({
      ediEnabled: [true],
      apiEnabled: [true],
      webhookUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      apiKey: ['']
    });

    this.maintenanceForm = this.fb.group({
      maintenanceMode: [false],
      maintenanceMessage: ['', [Validators.required]],
      scheduledMaintenance: ['']
    });
  }

  private loadSystemConfig(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.generalForm.patchValue(this.systemConfig.general);
      this.securityForm.patchValue(this.systemConfig.security);
      this.notificationsForm.patchValue(this.systemConfig.notifications);
      this.integrationsForm.patchValue(this.systemConfig.integrations);
      this.maintenanceForm.patchValue(this.systemConfig.maintenance);
      
      this.isLoading = false;
    }, 1000);
  }

  setTab(tab: string): void {
    this.currentTab = tab;
  }

  saveGeneralSettings(): void {
    if (this.generalForm.valid) {
      this.isSaving = true;
      this.systemConfig.general = this.generalForm.value;
      
      setTimeout(() => {
        this.isSaving = false;
        this.notificationService.success('General settings saved successfully');
      }, 1000);
    }
  }

  saveSecuritySettings(): void {
    if (this.securityForm.valid) {
      this.isSaving = true;
      this.systemConfig.security = this.securityForm.value;
      
      setTimeout(() => {
        this.isSaving = false;
        this.notificationService.success('Security settings saved successfully');
      }, 1000);
    }
  }

  saveNotificationSettings(): void {
    if (this.notificationsForm.valid) {
      this.isSaving = true;
      this.systemConfig.notifications = this.notificationsForm.value;
      
      setTimeout(() => {
        this.isSaving = false;
        this.notificationService.success('Notification settings saved successfully');
      }, 1000);
    }
  }

  saveIntegrationSettings(): void {
    if (this.integrationsForm.valid) {
      this.isSaving = true;
      this.systemConfig.integrations = this.integrationsForm.value;
      
      setTimeout(() => {
        this.isSaving = false;
        this.notificationService.success('Integration settings saved successfully');
      }, 1000);
    }
  }

  saveMaintenanceSettings(): void {
    if (this.maintenanceForm.valid) {
      this.isSaving = true;
      this.systemConfig.maintenance = this.maintenanceForm.value;
      
      setTimeout(() => {
        this.isSaving = false;
        this.notificationService.success('Maintenance settings saved successfully');
      }, 1000);
    }
  }

  saveAllSettings(): void {
    this.isSaving = true;
    
    // Save all forms
    this.systemConfig.general = this.generalForm.value;
    this.systemConfig.security = this.securityForm.value;
    this.systemConfig.notifications = this.notificationsForm.value;
    this.systemConfig.integrations = this.integrationsForm.value;
    this.systemConfig.maintenance = this.maintenanceForm.value;
    
    setTimeout(() => {
      this.isSaving = false;
      this.notificationService.success('All settings saved successfully');
    }, 2000);
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.loadSystemConfig();
      this.notificationService.info('Settings reset to default values');
    }
  }

  exportSettings(): void {
    const settings = {
      general: this.generalForm.value,
      security: this.securityForm.value,
      notifications: this.notificationsForm.value,
      integrations: this.integrationsForm.value,
      maintenance: this.maintenanceForm.value
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-settings.json';
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.notificationService.info('Settings exported successfully');
  }

  importSettings(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          
          if (settings.general) this.generalForm.patchValue(settings.general);
          if (settings.security) this.securityForm.patchValue(settings.security);
          if (settings.notifications) this.notificationsForm.patchValue(settings.notifications);
          if (settings.integrations) this.integrationsForm.patchValue(settings.integrations);
          if (settings.maintenance) this.maintenanceForm.patchValue(settings.maintenance);
          
          this.notificationService.success('Settings imported successfully');
        } catch (error) {
          this.notificationService.error('Invalid settings file format');
        }
      };
      reader.readAsText(file);
    }
  }

  generateApiKey(): void {
    const apiKey = 'cesto_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.integrationsForm.patchValue({ apiKey });
    this.notificationService.info('New API key generated');
  }

  testWebhook(): void {
    const webhookUrl = this.integrationsForm.get('webhookUrl')?.value;
    if (webhookUrl) {
      // Simulate webhook test
      setTimeout(() => {
        this.notificationService.success('Webhook test successful');
      }, 1000);
    } else {
      this.notificationService.error('Please enter a webhook URL first');
    }
  }

  addIpAddress(): void {
    const ipList = this.securityForm.get('ipWhitelist')?.value || [];
    const newIp = prompt('Enter IP address:');
    if (newIp && this.isValidIp(newIp)) {
      ipList.push(newIp);
      this.securityForm.patchValue({ ipWhitelist: ipList });
    } else if (newIp) {
      this.notificationService.error('Invalid IP address format');
    }
  }

  removeIpAddress(ip: string): void {
    const ipList = this.securityForm.get('ipWhitelist')?.value || [];
    const index = ipList.indexOf(ip);
    if (index > -1) {
      ipList.splice(index, 1);
      this.securityForm.patchValue({ ipWhitelist: ipList });
    }
  }

  private isValidIp(ip: string): boolean {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  }
}
