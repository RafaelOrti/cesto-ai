import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  formatCurrency(amount: number, currency: string = 'SEK'): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: string | Date, format: string = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('sv-SE');
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}