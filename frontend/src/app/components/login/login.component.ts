import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RoleRedirectService } from '../../core/services/role-redirect.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  passwordStrengthLabel = '';
  hasMinLength = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private roleRedirectService: RoleRedirectService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.setupPasswordStrengthMonitoring();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.nameValidator]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), this.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      role: ['client', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  private setupPasswordStrengthMonitoring(): void {
    this.registerForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(password => {
        this.calculatePasswordStrength(password);
        this.checkPasswordRequirements(password);
      });
  }


  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearFormErrors();
  }


  setForgotPasswordMode(): void {
    // TODO: Implement forgot password functionality
    this.snackBar.open('Forgot password functionality coming soon', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading) return;

    if (this.isLoginMode) {
      await this.login();
    } else {
      await this.register();
    }
  }

  private async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    if (this.isLoading) {
      console.log('[LOGIN] Login already in progress, ignoring duplicate request');
      return;
    }

    this.isLoading = true;
    console.log('[LOGIN] Starting login process');
    
    try {
      const credentials = {
        email: this.loginForm.get('email')?.value?.toLowerCase().trim(),
        password: this.loginForm.get('password')?.value
      };

      console.log('[LOGIN] Attempting login for:', credentials.email);
      await this.authService.login(credentials.email, credentials.password).toPromise();
      
      console.log('[LOGIN] Login successful');
      this.snackBar.open('Welcome back!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      
      // Redirect to role-specific dashboard
      this.roleRedirectService.redirectToRoleDashboard();
    } catch (error: any) {
      console.error('[LOGIN] Login error:', error);
      this.handleLoginError(error);
    } finally {
      this.isLoading = false;
      console.log('[LOGIN] Login process completed');
    }
  }

  private async register(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    try {
      const userData = {
        ...this.registerForm.value,
        email: this.registerForm.get('email')?.value?.toLowerCase().trim()
      };
      
      // Remove confirmPassword from the data sent to backend
      delete userData.confirmPassword;

      await this.authService.register(userData).toPromise();
      
      this.snackBar.open('Account created successfully! Welcome to CESTO!', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.handleRegistrationError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private handleLoginError(error: any): void {
    console.log('[LOGIN] Handling error:', error);
    let errorMessage = 'Login failed. Please check your credentials.';
    
    if (error.status === 401) {
      errorMessage = 'Invalid email or password.';
    } else if (error.status === 429) {
      errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again in a moment.';
    }

    console.log('[LOGIN] Showing error message:', errorMessage);
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private handleRegistrationError(error: any): void {
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.status === 409) {
      errorMessage = 'An account with this email already exists.';
    } else if (error.status === 400) {
      errorMessage = 'Please check all required fields and try again.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check your internet connection.';
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private clearFormErrors(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.setErrors(null);
    });
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.setErrors(null);
    });
  }

  getErrorMessage(field: string): string {
    const form = this.isLoginMode ? this.loginForm : this.registerForm;
    const control = form.get(field);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    const errors = control.errors;
    
    if (errors['required']) {
      return this.getFieldLabel(field) + ' is required';
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return this.getFieldLabel(field) + ` must be at least ${requiredLength} characters`;
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return this.getFieldLabel(field) + ` cannot exceed ${maxLength} characters`;
    }
    if (errors['passwordMismatch']) {
      return 'Passwords do not match';
    }
    if (errors['weakPassword']) {
      return 'Password is too weak. Please use a stronger password';
    }
    if (errors['invalidName']) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password',
      firstName: 'First name',
      lastName: 'Last name',
      companyName: 'Company name',
      confirmPassword: 'Confirm password'
    };
    return labels[field] || field;
  }

  private calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordStrengthLabel = '';
      return;
    }

    let strength = 0;
    let label = '';

    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    // Common patterns penalty
    if (/(.)\1{2,}/.test(password)) strength -= 10; // Repeated characters
    if (/123|abc|qwe/i.test(password)) strength -= 10; // Common sequences

    this.passwordStrength = Math.max(0, Math.min(100, strength));

    if (this.passwordStrength < 30) {
      label = 'Weak';
    } else if (this.passwordStrength < 60) {
      label = 'Fair';
    } else if (this.passwordStrength < 80) {
      label = 'Good';
    } else {
      label = 'Strong';
    }

    this.passwordStrengthLabel = label;
  }

  private checkPasswordRequirements(password: string): void {
    if (!password) {
      this.hasMinLength = false;
      this.hasUppercase = false;
      this.hasLowercase = false;
      this.hasNumber = false;
      return;
    }

    this.hasMinLength = password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasLowercase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
  }

  private passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    if (!password) return null;

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return score < 3 ? { weakPassword: true } : null;
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  private nameValidator(control: AbstractControl): { [key: string]: any } | null {
    const name = control.value;
    if (!name) return null;

    const validNamePattern = /^[a-zA-Z\s\-']+$/;
    return validNamePattern.test(name) ? null : { invalidName: true };
  }

  get isFormDisabled(): boolean {
    return this.isLoading;
  }
}