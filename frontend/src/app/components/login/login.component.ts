import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      companyName: ['', Validators.required],
      role: ['buyer', Validators.required]
    });
  }

  ngOnInit(): void {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  async onSubmit() {
    if (this.isLoading) return;

    if (this.isLoginMode) {
      await this.login();
    } else {
      await this.register();
    }
  }

  private async login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBar.open(error.message || 'Login failed', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  private async register() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    try {
      await this.authService.register(this.registerForm.value);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBar.open(error.message || 'Registration failed', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } finally {
      this.isLoading = false;
    }
  }

  getErrorMessage(field: string) {
    const form = this.isLoginMode ? this.loginForm : this.registerForm;
    const control = form.get(field);
    
    if (control?.hasError('required')) {
      return `${field} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `${field} must be at least 6 characters`;
    }
    return '';
  }
}
