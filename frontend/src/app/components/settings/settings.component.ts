import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: any = null;
  settingsForm: FormGroup;
  isLoading = false;
  
  // Language options
  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
  ];
  
  // Theme options
  themes = [
    { name: 'Light', value: 'light', icon: 'light_mode' },
    { name: 'Dark', value: 'dark', icon: 'dark_mode' },
    { name: 'Auto', value: 'auto', icon: 'auto_mode' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public i18n: I18nService,
    private notificationService: NotificationService
  ) {
    this.settingsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      language: ['es'],
      theme: ['light'],
      notifications: this.fb.group({
        email: [true],
        push: [true],
        sms: [false]
      }),
      privacy: this.fb.group({
        profileVisibility: ['private'],
        dataSharing: [false],
        analytics: [true]
      })
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.setupLanguageSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.settingsForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            language: localStorage.getItem('selectedLanguage') || 'en',
            theme: localStorage.getItem('theme') || 'light'
          });
        }
      });
  }

  private setupLanguageSubscription(): void {
    this.settingsForm.get('language')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        if (language) {
          this.i18n.setLanguage(language);
        }
      });
  }

  onSave(): void {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      const formData = this.settingsForm.value;
      
      // Save theme preference
      localStorage.setItem('theme', formData.theme);
      
      // Here you would typically save to backend
      setTimeout(() => {
        this.isLoading = false;
        this.notificationService.success('Settings saved successfully');
      }, 1000);
    } else {
      this.notificationService.error('Please fill in all required fields');
    }
  }

  onReset(): void {
    this.loadUserData();
    this.notificationService.info('Settings reset to default values');
  }

  onExportData(): void {
    this.notificationService.info('Data export started. You will receive an email when ready.');
  }

  onDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.notificationService.warning('Account deletion requested. Please contact support.');
    }
  }
}
