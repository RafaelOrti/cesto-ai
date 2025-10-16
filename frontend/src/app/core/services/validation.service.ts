import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ValidationError } from '../../../shared/types/common.types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Advanced validation service with custom validators and error handling
 * Provides comprehensive validation functionality for forms and data
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // ============================================================================
  // CUSTOM VALIDATORS
  // ============================================================================

  /**
   * Email validator
   */
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { email: { message: 'Email inválido' } };
    };
  }

  /**
   * Password strength validator
   */
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const password = control.value;
      const errors: ValidationErrors = {};
      
      if (password.length < 8) {
        errors['minLength'] = { message: 'Mínimo 8 caracteres' };
      }
      
      if (!/[A-Z]/.test(password)) {
        errors['uppercase'] = { message: 'Debe contener al menos una mayúscula' };
      }
      
      if (!/[a-z]/.test(password)) {
        errors['lowercase'] = { message: 'Debe contener al menos una minúscula' };
      }
      
      if (!/\d/.test(password)) {
        errors['number'] = { message: 'Debe contener al menos un número' };
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors['special'] = { message: 'Debe contener al menos un carácter especial' };
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Phone number validator
   */
  phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = control.value.replace(/[\s\-\(\)]/g, '');
      
      return phoneRegex.test(cleanPhone) ? null : { phone: { message: 'Teléfono inválido' } };
    };
  }

  /**
   * URL validator
   */
  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      try {
        new URL(control.value);
        return null;
      } catch {
        return { url: { message: 'URL inválida' } };
      }
    };
  }

  /**
   * Date validator (not in future)
   */
  dateNotFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      return date <= today ? null : { futureDate: { message: 'La fecha no puede ser futura' } };
    };
  }

  /**
   * Date range validator
   */
  dateRangeValidator(minDate?: Date, maxDate?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const date = new Date(control.value);
      const errors: ValidationErrors = {};
      
      if (minDate && date < minDate) {
        errors['minDate'] = { message: `La fecha debe ser posterior a ${minDate.toLocaleDateString()}` };
      }
      
      if (maxDate && date > maxDate) {
        errors['maxDate'] = { message: `La fecha debe ser anterior a ${maxDate.toLocaleDateString()}` };
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * File size validator
   */
  fileSizeValidator(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      return file.size <= maxSizeInBytes ? null : { 
        fileSize: { message: `El archivo no puede superar ${maxSizeInMB}MB` } 
      };
    };
  }

  /**
   * File type validator
   */
  fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      const isValidType = allowedTypes.some(type => file.type.includes(type));
      
      return isValidType ? null : { 
        fileType: { message: `Tipo de archivo no permitido. Tipos válidos: ${allowedTypes.join(', ')}` } 
      };
    };
  }

  /**
   * Match fields validator
   */
  matchFieldsValidator(fieldToMatch: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const form = control.parent;
      if (!form) return null;
      
      const matchingField = form.get(fieldToMatch);
      if (!matchingField) return null;
      
      return control.value === matchingField.value ? null : { 
        matchFields: { message: 'Los campos no coinciden' } 
      };
    };
  }

  /**
   * Unique value validator (for async validation)
   */
  uniqueValueValidator(checkFn: (value: any) => Observable<boolean>): ValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      
      return checkFn(control.value).pipe(
        map(isUnique => isUnique ? null : { unique: { message: 'Este valor ya existe' } })
      );
    };
  }

  /**
   * Credit card validator
   */
  creditCardValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const cardNumber = control.value.replace(/\s/g, '');
      const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
      
      return cardRegex.test(cardNumber) ? null : { creditCard: { message: 'Número de tarjeta inválido' } };
    };
  }

  /**
   * CVV validator
   */
  cvvValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const cvvRegex = /^[0-9]{3,4}$/;
      return cvvRegex.test(control.value) ? null : { cvv: { message: 'CVV inválido' } };
    };
  }

  /**
   * Postal code validator
   */
  postalCodeValidator(countryCode?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const postalCode = control.value.toString().trim();
      let regex: RegExp;
      
      switch (countryCode) {
        case 'ES': // Spain
          regex = /^[0-9]{5}$/;
          break;
        case 'US': // United States
          regex = /^[0-9]{5}(-[0-9]{4})?$/;
          break;
        case 'CA': // Canada
          regex = /^[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]$/;
          break;
        case 'GB': // United Kingdom
          regex = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}$/i;
          break;
        default: // Generic
          regex = /^[0-9A-Za-z\s-]{3,10}$/;
      }
      
      return regex.test(postalCode) ? null : { postalCode: { message: 'Código postal inválido' } };
    };
  }

  // ============================================================================
  // FORM VALIDATION HELPERS
  // ============================================================================

  /**
   * Get all validation errors from a form
   */
  getFormErrors(form: FormGroup): ValidationError[] {
    const errors: ValidationError[] = [];
    
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          errors.push({
            field: key,
            message: control.errors![errorKey]?.message || 'Error de validación',
            code: errorKey
          });
        });
      }
    });
    
    return errors;
  }

  /**
   * Check if form has any errors
   */
  hasFormErrors(form: FormGroup): boolean {
    return Object.keys(form.controls).some(key => {
      const control = form.get(key);
      return control ? control.invalid && control.touched : false;
    });
  }

  /**
   * Mark all form fields as touched
   */
  markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Get first error message from a control
   */
  getFirstError(control: AbstractControl): string | null {
    if (!control.errors) return null;
    
    const firstErrorKey = Object.keys(control.errors)[0];
    const firstError = control.errors[firstErrorKey];
    
    return firstError?.message || 'Error de validación';
  }

  /**
   * Get all error messages from a control
   */
  getAllErrors(control: AbstractControl): string[] {
    if (!control.errors) return [];
    
    return Object.keys(control.errors).map(key => {
      const error = control.errors![key];
      return error?.message || 'Error de validación';
    });
  }

  // ============================================================================
  // DATA VALIDATION
  // ============================================================================

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate password strength
   */
  getPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isValid: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Mínimo 8 caracteres');
    }
    
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos una mayúscula');
    }
    
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos una minúscula');
    }
    
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos un número');
    }
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Al menos un carácter especial');
    }
    
    if (password.length >= 12) {
      score += 1;
    }
    
    return {
      score,
      feedback,
      isValid: score >= 4
    };
  }

  /**
   * Validate credit card number
   */
  isValidCreditCard(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
    return cardRegex.test(cleanNumber);
  }

  /**
   * Validate CVV
   */
  isValidCVV(cvv: string): boolean {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
  }

  /**
   * Validate date range
   */
  isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }

  /**
   * Validate file size
   */
  isValidFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  /**
   * Validate file type
   */
  isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => file.type.includes(type));
  }

  // ============================================================================
  // SANITIZATION
  // ============================================================================

  /**
   * Sanitize HTML content
   */
  sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Sanitize filename
   */
  sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  /**
   * Sanitize phone number
   */
  sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Sanitize email
   */
  sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // ============================================================================
  // VALIDATION RULES
  // ============================================================================

  /**
   * Get validation rules for common fields
   */
  getValidationRules(fieldType: string): any {
    const rules: Record<string, any> = {
      email: {
        required: true,
        email: true,
        maxLength: 254
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      },
      phone: {
        required: true,
        pattern: /^[\+]?[1-9][\d]{0,15}$/
      },
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/
      },
      company: {
        required: true,
        minLength: 2,
        maxLength: 100
      },
      address: {
        required: true,
        minLength: 10,
        maxLength: 200
      },
      city: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s]+$/
      },
      postalCode: {
        required: true,
        pattern: /^[0-9A-Za-z\s-]{3,10}$/
      },
      website: {
        required: false,
        pattern: /^https?:\/\/.+\..+/
      }
    };

    return rules[fieldType] || {};
  }

  /**
   * Create form control with validation rules
   */
  createFormControl(value: any = '', fieldType: string): FormControl {
    const rules = this.getValidationRules(fieldType);
    const validators = [];

    if (rules.required) {
      validators.push(Validators.required);
    }

    if (rules.minLength) {
      validators.push(Validators.minLength(rules.minLength));
    }

    if (rules.maxLength) {
      validators.push(Validators.maxLength(rules.maxLength));
    }

    if (rules.email) {
      validators.push(this.emailValidator());
    }

    if (rules.pattern) {
      validators.push(Validators.pattern(rules.pattern));
    }

    return new FormControl(value, validators);
  }
}
