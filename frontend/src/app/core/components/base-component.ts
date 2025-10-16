import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

/**
 * Base component that provides common functionality for all components
 * Handles subscription management, loading states, error handling, and utility methods
 */
@Component({
  template: '' // Abstract component, no template
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  
  // Loading states
  loading = false;
  saving = false;
  deleting = false;
  
  // Error states
  error: string | null = null;
  validationErrors: Record<string, string> = {};
  
  // Success states
  successMessage: string | null = null;

  constructor(protected utils: UtilsService) {}

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.onDestroy();
  }

  // ============================================================================
  // ABSTRACT METHODS (to be implemented by subclasses)
  // ============================================================================

  /**
   * Initialize component (called after ngOnInit)
   */
  protected onInit(): void {
    // Override in subclasses
  }

  /**
   * Cleanup component (called before ngOnDestroy)
   */
  protected onDestroy(): void {
    // Override in subclasses
  }

  // ============================================================================
  // LOADING STATE MANAGEMENT
  // ============================================================================

  /**
   * Set loading state
   */
  protected setLoading(loading: boolean): void {
    this.loading = loading;
  }

  /**
   * Set saving state
   */
  protected setSaving(saving: boolean): void {
    this.saving = saving;
  }

  /**
   * Set deleting state
   */
  protected setDeleting(deleting: boolean): void {
    this.deleting = deleting;
  }

  /**
   * Check if any operation is in progress
   */
  get isOperationInProgress(): boolean {
    return this.loading || this.saving || this.deleting;
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  /**
   * Set error message
   */
  protected setError(error: string | null): void {
    this.error = error;
  }

  /**
   * Set validation errors
   */
  protected setValidationErrors(errors: Record<string, string>): void {
    this.validationErrors = errors;
  }

  /**
   * Clear all errors
   */
  protected clearErrors(): void {
    this.error = null;
    this.validationErrors = {};
  }

  /**
   * Get error for specific field
   */
  getFieldError(fieldName: string): string | null {
    return this.validationErrors[fieldName] || null;
  }

  /**
   * Check if field has error
   */
  hasFieldError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  /**
   * Get all error messages
   */
  getAllErrors(): string[] {
    const errors: string[] = [];
    
    if (this.error) {
      errors.push(this.error);
    }
    
    Object.values(this.validationErrors).forEach(error => {
      if (error) {
        errors.push(error);
      }
    });
    
    return errors;
  }

  // ============================================================================
  // SUCCESS HANDLING
  // ============================================================================

  /**
   * Set success message
   */
  protected setSuccess(message: string | null): void {
    this.successMessage = message;
  }

  /**
   * Clear success message
   */
  protected clearSuccess(): void {
    this.successMessage = null;
  }

  /**
   * Show success message and auto-clear after delay
   */
  protected showSuccess(message: string, duration: number = 3000): void {
    this.setSuccess(message);
    setTimeout(() => {
      this.clearSuccess();
    }, duration);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Format date
   */
  formatDate(date: Date | string, format?: string): string {
    return this.utils.formatDate(date, format);
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency?: string): string {
    return this.utils.formatCurrency(amount, currency);
  }

  /**
   * Format number
   */
  formatNumber(value: number, digits?: string): string {
    return this.utils.formatNumber(value, digits);
  }

  /**
   * Capitalize text
   */
  capitalize(text: string): string {
    return this.utils.capitalize(text);
  }

  /**
   * Truncate text
   */
  truncate(text: string, length: number, suffix?: string): string {
    return this.utils.truncate(text, length, suffix);
  }

  /**
   * Check if object is empty
   */
  isEmpty(obj: any): boolean {
    return this.utils.isEmpty(obj);
  }

  /**
   * Deep clone object
   */
  deepClone<T>(obj: T): T {
    return this.utils.deepClone(obj);
  }

  // ============================================================================
  // VALIDATION HELPERS
  // ============================================================================

  /**
   * Validate required fields
   */
  protected validateRequired(obj: any, requiredFields: string[]): boolean {
    const validation = this.utils.validateRequired(obj, requiredFields);
    
    if (!validation.valid) {
      const errors: Record<string, string> = {};
      validation.missing.forEach(field => {
        errors[field] = `${this.capitalize(field)} es requerido`;
      });
      this.setValidationErrors(errors);
    } else {
      this.clearErrors();
    }
    
    return validation.valid;
  }

  /**
   * Validate email
   */
  protected validateEmail(email: string): boolean {
    if (!email) return false;
    
    const isValid = this.utils.isValidEmail(email);
    if (!isValid) {
      this.setValidationErrors({ email: 'Email inválido' });
    }
    
    return isValid;
  }

  /**
   * Validate phone
   */
  protected validatePhone(phone: string): boolean {
    if (!phone) return false;
    
    const isValid = this.utils.isValidPhone(phone);
    if (!isValid) {
      this.setValidationErrors({ phone: 'Teléfono inválido' });
    }
    
    return isValid;
  }

  /**
   * Validate string length
   */
  protected validateLength(value: string, min: number, max: number, fieldName: string): boolean {
    const isValid = this.utils.validateLength(value, min, max);
    
    if (!isValid) {
      const errors: Record<string, string> = {};
      if (value.length < min) {
        errors[fieldName] = `Mínimo ${min} caracteres`;
      } else if (value.length > max) {
        errors[fieldName] = `Máximo ${max} caracteres`;
      }
      this.setValidationErrors(errors);
    }
    
    return isValid;
  }

  // ============================================================================
  // SUBSCRIPTION HELPERS
  // ============================================================================

  /**
   * Safe subscribe that automatically unsubscribes on destroy
   */
  protected safeSubscribe<T>(
    observable: any,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): void {
    observable
      .pipe(takeUntil(this.destroy$))
      .subscribe(next, error, complete);
  }

  // ============================================================================
  // DEBOUNCE HELPERS
  // ============================================================================

  /**
   * Debounce function calls
   */
  protected debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: any;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ============================================================================
  // SCROLL HELPERS
  // ============================================================================

  /**
   * Scroll to top of page
   */
  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Scroll to element
   */
  protected scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ============================================================================
  // COPY TO CLIPBOARD
  // ============================================================================

  /**
   * Copy text to clipboard
   */
  protected async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      this.showSuccess('Copiado al portapapeles');
      return true;
    } catch (error) {
      this.setError('Error al copiar al portapapeles');
      return false;
    }
  }

  // ============================================================================
  // DOWNLOAD HELPERS
  // ============================================================================

  /**
   * Download file from blob
   */
  protected downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ============================================================================
  // CONFIRMATION HELPERS
  // ============================================================================

  /**
   * Show confirmation dialog
   */
  protected confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(message);
      resolve(confirmed);
    });
  }

  // ============================================================================
  // TRACKING HELPERS
  // ============================================================================

  /**
   * Track user action (for analytics)
   */
  protected trackAction(action: string, category: string, label?: string, value?: number): void {
    // Implement analytics tracking here
    console.log('Track action:', { action, category, label, value });
  }

  /**
   * Track page view
   */
  protected trackPageView(pageName: string, pageTitle?: string): void {
    // Implement page view tracking here
    console.log('Track page view:', { pageName, pageTitle });
  }
}
