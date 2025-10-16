import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError } from '../../../shared/types/common.types';

/**
 * Advanced validation service for backend
 * Provides comprehensive validation functionality for data and business rules
 */
@Injectable()
export class ValidationService {
  // ============================================================================
  // BASIC VALIDATION METHODS
  // ============================================================================

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Validate URL format
   */
  validateUrl(url: string): boolean {
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
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
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
      isValid: score >= 4,
      score,
      feedback,
    };
  }

  /**
   * Validate credit card number
   */
  validateCreditCard(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/;
    return cardRegex.test(cleanNumber);
  }

  /**
   * Validate CVV
   */
  validateCVV(cvv: string): boolean {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
  }

  /**
   * Validate postal code
   */
  validatePostalCode(postalCode: string, countryCode?: string): boolean {
    const code = postalCode.toString().trim();
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

    return regex.test(code);
  }

  // ============================================================================
  // DATA VALIDATION
  // ============================================================================

  /**
   * Validate required fields
   */
  validateRequired(data: any, requiredFields: string[]): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push({
          field,
          message: `${field} es requerido`,
          code: 'REQUIRED',
        });
      }
    }

    return errors;
  }

  /**
   * Validate field types
   */
  validateTypes(data: any, typeMap: Record<string, string>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [field, expectedType] of Object.entries(typeMap)) {
      if (data[field] !== undefined) {
        const actualType = typeof data[field];
        if (actualType !== expectedType) {
          errors.push({
            field,
            message: `${field} debe ser de tipo ${expectedType}`,
            code: 'INVALID_TYPE',
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validate string length
   */
  validateStringLength(data: any, lengthMap: Record<string, { min?: number; max?: number }>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [field, { min, max }] of Object.entries(lengthMap)) {
      if (data[field] !== undefined) {
        const value = data[field].toString();
        if (min !== undefined && value.length < min) {
          errors.push({
            field,
            message: `${field} debe tener al menos ${min} caracteres`,
            code: 'MIN_LENGTH',
          });
        }
        if (max !== undefined && value.length > max) {
          errors.push({
            field,
            message: `${field} no puede tener más de ${max} caracteres`,
            code: 'MAX_LENGTH',
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validate numeric ranges
   */
  validateNumericRange(data: any, rangeMap: Record<string, { min?: number; max?: number }>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [field, { min, max }] of Object.entries(rangeMap)) {
      if (data[field] !== undefined) {
        const value = Number(data[field]);
        if (isNaN(value)) {
          errors.push({
            field,
            message: `${field} debe ser un número válido`,
            code: 'INVALID_NUMBER',
          });
        } else {
          if (min !== undefined && value < min) {
            errors.push({
              field,
              message: `${field} debe ser mayor o igual a ${min}`,
              code: 'MIN_VALUE',
            });
          }
          if (max !== undefined && value > max) {
            errors.push({
              field,
              message: `${field} debe ser menor o igual a ${max}`,
              code: 'MAX_VALUE',
            });
          }
        }
      }
    }

    return errors;
  }

  /**
   * Validate enum values
   */
  validateEnum(data: any, enumMap: Record<string, string[]>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [field, allowedValues] of Object.entries(enumMap)) {
      if (data[field] !== undefined && !allowedValues.includes(data[field])) {
        errors.push({
          field,
          message: `${field} debe ser uno de: ${allowedValues.join(', ')}`,
          code: 'INVALID_ENUM',
        });
      }
    }

    return errors;
  }

  // ============================================================================
  // BUSINESS RULE VALIDATION
  // ============================================================================

  /**
   * Validate date ranges
   */
  validateDateRange(startDate: Date, endDate: Date): ValidationError[] {
    const errors: ValidationError[] = [];

    if (startDate >= endDate) {
      errors.push({
        field: 'dateRange',
        message: 'La fecha de inicio debe ser anterior a la fecha de fin',
        code: 'INVALID_DATE_RANGE',
      });
    }

    return errors;
  }

  /**
   * Validate file upload
   */
  validateFileUpload(file: any, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): ValidationError[] {
    const errors: ValidationError[] = [];

    if (options.maxSize && file.size > options.maxSize) {
      errors.push({
        field: 'file',
        message: `El archivo no puede superar ${options.maxSize} bytes`,
        code: 'FILE_TOO_LARGE',
      });
    }

    if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
      errors.push({
        field: 'file',
        message: `Tipo de archivo no permitido. Tipos válidos: ${options.allowedTypes.join(', ')}`,
        code: 'INVALID_FILE_TYPE',
      });
    }

    if (options.allowedExtensions) {
      const extension = file.originalname.split('.').pop()?.toLowerCase();
      if (!extension || !options.allowedExtensions.includes(extension)) {
        errors.push({
          field: 'file',
          message: `Extensión de archivo no permitida. Extensiones válidas: ${options.allowedExtensions.join(', ')}`,
          code: 'INVALID_FILE_EXTENSION',
        });
      }
    }

    return errors;
  }

  /**
   * Validate unique constraint
   */
  async validateUnique(
    field: string,
    value: any,
    repository: any,
    excludeId?: string
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    try {
      const whereClause = { [field]: value };
      if (excludeId) {
        whereClause['id'] = { $ne: excludeId };
      }

      const existing = await repository.findOne({ where: whereClause });
      if (existing) {
        errors.push({
          field,
          message: `${field} ya existe`,
          code: 'DUPLICATE_VALUE',
        });
      }
    } catch (error) {
      errors.push({
        field,
        message: 'Error validando unicidad',
        code: 'VALIDATION_ERROR',
      });
    }

    return errors;
  }

  // ============================================================================
  // COMPREHENSIVE VALIDATION
  // ============================================================================

  /**
   * Validate entity data
   */
  async validateEntity(
    entityType: string,
    data: any,
    rules: ValidationRules,
    repository?: any
  ): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Required fields
    if (rules.required) {
      errors.push(...this.validateRequired(data, rules.required));
    }

    // Field types
    if (rules.types) {
      errors.push(...this.validateTypes(data, rules.types));
    }

    // String lengths
    if (rules.stringLengths) {
      errors.push(...this.validateStringLength(data, rules.stringLengths));
    }

    // Numeric ranges
    if (rules.numericRanges) {
      errors.push(...this.validateNumericRange(data, rules.numericRanges));
    }

    // Enum values
    if (rules.enums) {
      errors.push(...this.validateEnum(data, rules.enums));
    }

    // Custom validations
    if (rules.custom) {
      for (const validation of rules.custom) {
        const customErrors = await validation(data, repository);
        errors.push(...customErrors);
      }
    }

    return errors;
  }

  /**
   * Validate and throw if errors
   */
  async validateAndThrow(
    entityType: string,
    data: any,
    rules: ValidationRules,
    repository?: any
  ): Promise<void> {
    const errors = await this.validateEntity(entityType, data, rules, repository);
    
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }
  }

  // ============================================================================
  // SANITIZATION
  // ============================================================================

  /**
   * Sanitize string input
   */
  sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Sanitize email
   */
  sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Sanitize phone number
   */
  sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  /**
   * Sanitize object data
   */
  sanitizeObject(data: any, sanitizers: Record<string, (value: any) => any>): any {
    const sanitized = { ...data };

    for (const [field, sanitizer] of Object.entries(sanitizers)) {
      if (sanitized[field] !== undefined) {
        sanitized[field] = sanitizer(sanitized[field]);
      }
    }

    return sanitized;
  }
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface ValidationRules {
  required?: string[];
  types?: Record<string, string>;
  stringLengths?: Record<string, { min?: number; max?: number }>;
  numericRanges?: Record<string, { min?: number; max?: number }>;
  enums?: Record<string, string[]>;
  custom?: Array<(data: any, repository?: any) => Promise<ValidationError[]>>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
