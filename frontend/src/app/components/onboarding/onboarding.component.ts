import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { BaseComponent } from '../../core/components/base-component';
import { User } from '../../../shared/types/common.types';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface BusinessInfo {
  businessType: string;
  industry: string;
  companySize: string;
  annualRevenue: string;
  primaryCategories: string[];
  deliveryAreas: string[];
  paymentTerms: string;
  preferredSuppliers: string[];
}

interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  units: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketing: boolean;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent extends BaseComponent implements OnInit, OnDestroy {
  currentStep = 0;
  totalSteps = 5;
  isCompleted = false;
  isLoading = false;

  // Properties from BaseComponent
  notificationService: any = { 
    error: (msg: string) => console.error(msg),
    info: (msg: string) => console.log(msg)
  };
  setLoading: (loading: boolean) => void = (loading: boolean) => { this.isLoading = loading; };

  showError(message: string): void {
    this.notificationService.error(message);
  }

  showInfo(message: string): void {
    this.notificationService.info(message);
  }

  // Step forms
  basicInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  preferencesForm: FormGroup;
  verificationForm: FormGroup;
  welcomeForm: FormGroup;

  // Step data
  steps: OnboardingStep[] = [
    { id: 'basic', title: 'Basic Information', description: 'Tell us about yourself', completed: false, required: true },
    { id: 'business', title: 'Business Details', description: 'Help us understand your business', completed: false, required: true },
    { id: 'preferences', title: 'Preferences', description: 'Customize your experience', completed: false, required: false },
    { id: 'verification', title: 'Verification', description: 'Verify your business', completed: false, required: true },
    { id: 'welcome', title: 'Welcome', description: 'You\'re all set!', completed: false, required: false }
  ];

  businessTypes = [
    'Restaurant',
    'Cafe',
    'Hotel',
    'Catering',
    'Retail Store',
    'Supermarket',
    'Food Service',
    'Other'
  ];

  industries = [
    'Food & Beverage',
    'Hospitality',
    'Retail',
    'Healthcare',
    'Education',
    'Corporate',
    'Events',
    'Other'
  ];

  companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  revenueRanges = [
    'Under $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M - $10M',
    'Over $10M'
  ];

  productCategories = [
    'Dairy',
    'Fruits & Vegetables',
    'Meat & Poultry',
    'Seafood',
    'Beverages',
    'Bakery',
    'Frozen Foods',
    'Packaged Goods',
    'Health & Beauty',
    'Cleaning Supplies'
  ];

  constructor(
    protected fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super(fb);
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  protected onInit(): void {
    this.loadUserData();
  }

  protected onDestroy(): void {
    // Additional cleanup if needed
  }

  protected initializeForms(): void {
    // Basic Information Form
    this.basicInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      jobTitle: ['', Validators.required],
      department: [''],
      experience: ['', Validators.required]
    });

    // Business Information Form
    this.businessInfoForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      businessType: ['', Validators.required],
      industry: ['', Validators.required],
      companySize: ['', Validators.required],
      annualRevenue: ['', Validators.required],
      website: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      taxId: [''],
      primaryCategories: [[], Validators.required],
      deliveryAreas: [[]],
      paymentTerms: ['', Validators.required],
      preferredSuppliers: [[]]
    });

    // Preferences Form
    this.preferencesForm = this.fb.group({
      language: ['en', Validators.required],
      timezone: ['UTC', Validators.required],
      currency: ['USD', Validators.required],
      units: ['metric', Validators.required],
      notifications: this.fb.group({
        email: [true],
        sms: [false],
        push: [true]
      }),
      marketing: [false]
    });

    // Verification Form
    this.verificationForm = this.fb.group({
      businessLicense: [''],
      taxCertificate: [''],
      insuranceDocument: [''],
      bankStatement: [''],
      additionalDocuments: [''],
      verificationMethod: ['email', Validators.required],
      verificationCode: [''],
      termsAccepted: [false, Validators.requiredTrue],
      privacyAccepted: [false, Validators.requiredTrue]
    });

    // Welcome Form
    this.welcomeForm = this.fb.group({
      tourCompleted: [false],
      notificationsEnabled: [true],
      marketingOptIn: [false]
    });
  }

  private loadUserData(): void {
    // Load existing user data if available
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.basicInfoForm.patchValue({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        jobTitle: currentUser.jobTitle || '',
        department: currentUser.department || ''
      });
    }
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.markCurrentStepCompleted();
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep++;
      } else {
        this.completeOnboarding();
      }
    } else {
      this.markFormGroupTouched(this.getCurrentForm());
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  skipStep(): void {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    } else {
      this.completeOnboarding();
    }
  }

  private isCurrentStepValid(): boolean {
    const form = this.getCurrentForm();
    return form ? form.valid : true;
  }

  private getCurrentForm(): FormGroup | null {
    switch (this.currentStep) {
      case 0: return this.basicInfoForm;
      case 1: return this.businessInfoForm;
      case 2: return this.preferencesForm;
      case 3: return this.verificationForm;
      case 4: return this.welcomeForm;
      default: return null;
    }
  }

  private markCurrentStepCompleted(): void {
    this.steps[this.currentStep].completed = true;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private async completeOnboarding(): Promise<void> {
    this.setLoading(true);
    try {
      // Save onboarding data
      const onboardingData = {
        basicInfo: this.basicInfoForm.value,
        businessInfo: this.businessInfoForm.value,
        preferences: this.preferencesForm.value,
        verification: this.verificationForm.value,
        welcome: this.welcomeForm.value,
        completedAt: new Date().toISOString()
      };

      // Update user profile with basic info from onboarding
      const userUpdateData: Partial<User> = {
        firstName: this.basicInfoForm.value.firstName,
        lastName: this.basicInfoForm.value.lastName,
        companyName: this.businessInfoForm.value.companyName,
        phone: this.basicInfoForm.value.phone,
        address: this.businessInfoForm.value.address,
        city: this.businessInfoForm.value.city,
        country: this.businessInfoForm.value.country,
        postalCode: this.businessInfoForm.value.postalCode
      };

      await this.authService.updateProfile(userUpdateData).toPromise();
      
      this.isCompleted = true;
      this.showSuccess('Onboarding completed successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      this.showError('Failed to complete onboarding. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  getStepProgress(): number {
    return ((this.currentStep + 1) / this.totalSteps) * 100;
  }

  getCurrentStepTitle(): string {
    return this.steps[this.currentStep]?.title || '';
  }

  getCurrentStepDescription(): string {
    return this.steps[this.currentStep]?.description || '';
  }

  canGoNext(): boolean {
    return this.isCurrentStepValid();
  }

  canSkip(): boolean {
    return !this.steps[this.currentStep]?.required;
  }

  onFileSelected(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload
      console.log('File selected for', field, ':', file);
      // You would typically upload the file to your backend here
    }
  }

  resendVerificationCode(): void {
    // Implement resend verification code logic
    this.showInfo('Verification code sent to your email');
  }
}

