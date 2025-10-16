import { Injectable } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

/**
 * Utility service that provides common helper functions and formatters
 * Used across the application for consistent data formatting and manipulation
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private datePipe = new DatePipe('es-ES');
  private currencyPipe = new CurrencyPipe('es-ES', 'EUR');
  private decimalPipe = new DecimalPipe('es-ES');

  // ============================================================================
  // DATE FORMATTING
  // ============================================================================

  /**
   * Format date to Spanish locale
   */
  formatDate(date: Date | string, format: string = 'dd/MM/yyyy'): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, format) || '';
  }

  /**
   * Format date with time
   */
  formatDateTime(date: Date | string): string {
    return this.formatDate(date, 'dd/MM/yyyy HH:mm');
  }

  /**
   * Format relative time (e.g., "hace 2 horas")
   */
  formatRelativeTime(date: Date | string): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `Hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `Hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
  }

  /**
   * Check if date is today
   */
  isToday(date: Date | string): boolean {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    return dateObj.toDateString() === today.toDateString();
  }

  /**
   * Check if date is in the past
   */
  isPast(date: Date | string): boolean {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  }

  /**
   * Check if date is in the future
   */
  isFuture(date: Date | string): boolean {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj > new Date();
  }

  // ============================================================================
  // CURRENCY FORMATTING
  // ============================================================================

  /**
   * Format currency in EUR
   */
  formatCurrency(amount: number, currency: string = 'EUR'): string {
    if (amount === null || amount === undefined) return '€0,00';
    
    return this.currencyPipe.transform(amount, currency, 'symbol', '1.2-2') || '€0,00';
  }

  /**
   * Format currency without symbol
   */
  formatCurrencyAmount(amount: number): string {
    if (amount === null || amount === undefined) return '0,00';
    
    return this.decimalPipe.transform(amount, '1.2-2') || '0,00';
  }

  /**
   * Parse currency string to number
   */
  parseCurrency(currencyString: string): number {
    if (!currencyString) return 0;
    
    // Remove currency symbols and spaces
    const cleanString = currencyString.replace(/[€$£\s]/g, '');
    
    // Replace comma with dot for decimal parsing
    const normalizedString = cleanString.replace(',', '.');
    
    return parseFloat(normalizedString) || 0;
  }

  // ============================================================================
  // NUMBER FORMATTING
  // ============================================================================

  /**
   * Format number with Spanish locale
   */
  formatNumber(value: number, digits: string = '1.0-2'): string {
    if (value === null || value === undefined) return '0';
    
    return this.decimalPipe.transform(value, digits) || '0';
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number, digits: string = '1.0-1'): string {
    if (value === null || value === undefined) return '0%';
    
    const formatted = this.decimalPipe.transform(value, digits) || '0';
    return `${formatted}%`;
  }

  /**
   * Format large numbers with K, M, B suffixes
   */
  formatCompactNumber(value: number): string {
    if (value === null || value === undefined) return '0';
    
    const absValue = Math.abs(value);
    
    if (absValue >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    
    return value.toString();
  }

  // ============================================================================
  // STRING UTILITIES
  // ============================================================================

  /**
   * Capitalize first letter of string
   */
  capitalize(text: string): string {
    if (!text) return '';
    
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Capitalize all words in string
   */
  capitalizeWords(text: string): string {
    if (!text) return '';
    
    return text.split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }

  /**
   * Truncate string to specified length
   */
  truncate(text: string, length: number, suffix: string = '...'): string {
    if (!text || text.length <= length) return text;
    
    return text.substring(0, length) + suffix;
  }

  /**
   * Remove HTML tags from string
   */
  stripHtml(html: string): string {
    if (!html) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  /**
   * Generate slug from string
   */
  generateSlug(text: string): string {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Check if string is email
   */
  isValidEmail(email: string): boolean {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if string is phone number
   */
  isValidPhone(phone: string): boolean {
    if (!phone) return false;
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // ============================================================================
  // ARRAY UTILITIES
  // ============================================================================

  /**
   * Remove duplicates from array
   */
  removeDuplicates<T>(array: T[], key?: keyof T): T[] {
    if (!array) return [];
    
    if (key) {
      const seen = new Set();
      return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
        return true;
      });
    }
    
    return [...new Set(array)];
  }

  /**
   * Group array by key
   */
  groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    if (!array) return {};
    
    return array.reduce((groups, item) => {
      const value = String(item[key]);
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  /**
   * Sort array by key
   */
  sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    if (!array) return [];
    
    return [...array].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Chunk array into smaller arrays
   */
  chunk<T>(array: T[], size: number): T[][] {
    if (!array || size <= 0) return [];
    
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // ============================================================================
  // OBJECT UTILITIES
  // ============================================================================

  /**
   * Deep clone object
   */
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => this.deepClone(item)) as T;
    if (typeof obj === 'object') {
      const cloned = {} as T;
      Object.keys(obj).forEach(key => {
        cloned[key as keyof T] = this.deepClone(obj[key as keyof T]);
      });
      return cloned;
    }
    return obj;
  }

  /**
   * Check if object is empty
   */
  isEmpty(obj: any): boolean {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  }

  /**
   * Get nested object property safely
   */
  getNestedProperty(obj: any, path: string, defaultValue: any = undefined): any {
    if (!obj || !path) return defaultValue;
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  }

  // ============================================================================
  // VALIDATION UTILITIES
  // ============================================================================

  /**
   * Validate required fields
   */
  validateRequired(obj: any, requiredFields: string[]): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    
    for (const field of requiredFields) {
      const value = this.getNestedProperty(obj, field);
      if (value === null || value === undefined || value === '') {
        missing.push(field);
      }
    }
    
    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Validate number range
   */
  validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * Validate string length
   */
  validateLength(value: string, min: number, max: number): boolean {
    if (!value) return min === 0;
    return value.length >= min && value.length <= max;
  }

  // ============================================================================
  // FILE UTILITIES
  // ============================================================================

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    if (!filename) return '';
    
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file type is image
   */
  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = this.getFileExtension(filename);
    return imageExtensions.includes(extension);
  }

  /**
   * Check if file type is document
   */
  isDocumentFile(filename: string): boolean {
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    const extension = this.getFileExtension(filename);
    return documentExtensions.includes(extension);
  }

  // ============================================================================
  // COLOR UTILITIES
  // ============================================================================

  /**
   * Generate random color
   */
  generateRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }

  /**
   * Lighten color
   */
  lightenColor(color: string, amount: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16)
      .slice(1)}`;
  }

  /**
   * Darken color
   */
  darkenColor(color: string, amount: number): string {
    return this.lightenColor(color, -amount);
  }
}
