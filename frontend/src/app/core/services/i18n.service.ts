import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { translations, Language, TranslationKey } from '../i18n/translations';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<Language>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor() {
    // Try to get language from localStorage or browser settings
    const savedLanguage = localStorage.getItem('language') as Language;
    const browserLanguage = navigator.language.split('-')[0] as Language;
    
    if (savedLanguage && translations[savedLanguage]) {
      this.setLanguage(savedLanguage);
    } else if (translations[browserLanguage]) {
      this.setLanguage(browserLanguage);
    } else {
      this.setLanguage('en'); // Default to English
    }
  }

  setLanguage(language: Language): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('language', language);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  translate(key: string, params?: Record<string, any>): string {
    const currentLang = this.getCurrentLanguage();
    const translation = this.getNestedValue(translations[currentLang], key);
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
      return key;
    }

    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  getTranslation(key: string): Observable<string> {
    return new Observable(observer => {
      this.currentLanguage$.subscribe(() => {
        observer.next(this.translate(key));
      });
    });
  }

  private getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private interpolate(template: string, params: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  // Convenience methods for common translations
  getSuppliersTitle(): string {
    return this.translate('suppliers.title');
  }

  getExploreSuppliers(): string {
    return this.translate('suppliers.exploreSuppliers');
  }

  getSearchPlaceholder(): string {
    return this.translate('suppliers.searchPlaceholder');
  }

  getAddSupplier(): string {
    return this.translate('suppliers.addSupplier');
  }

  getSendInquiry(): string {
    return this.translate('suppliers.sendInquiry');
  }

  getInquirySent(): string {
    return this.translate('suppliers.inquirySent');
  }

  getClearFilters(): string {
    return this.translate('suppliers.clearFilters');
  }

  getNoResults(): string {
    return this.translate('suppliers.noResults');
  }

  getTryAdjusting(): string {
    return this.translate('suppliers.tryAdjusting');
  }

  getLoading(): string {
    return this.translate('suppliers.loading');
  }

  getCategoryName(category: string): string {
    return this.translate(`suppliers.categories.${category}`);
  }

  getRecommendationName(recommendation: string): string {
    return this.translate(`suppliers.recommendations.${recommendation}`);
  }

  getFilterName(filter: string): string {
    return this.translate(`suppliers.filters.${filter}`);
  }

  getFeatureName(feature: string): string {
    return this.translate(`suppliers.features.${feature}`);
  }
}
