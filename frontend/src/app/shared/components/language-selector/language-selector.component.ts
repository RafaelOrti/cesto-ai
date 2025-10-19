import { Component, OnInit, OnDestroy } from '@angular/core';
import { I18nService, LanguageConfig } from '../../../core/services/i18n.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  availableLanguages: LanguageConfig[] = [];
  currentLanguage: string = 'en';
  currentLanguageConfig: LanguageConfig | undefined;
  isOpen = false;
  
  private subscription: Subscription = new Subscription();

  constructor(private i18nService: I18nService) {}

  ngOnInit(): void {
    this.availableLanguages = this.i18nService.getAvailableLanguages();
    this.currentLanguage = this.i18nService.getCurrentLanguage();
    this.currentLanguageConfig = this.i18nService.getCurrentLanguageConfig();

    // Subscribe to language changes
    this.subscription.add(
      this.i18nService.currentLanguage$.subscribe(language => {
        this.currentLanguage = language;
        this.currentLanguageConfig = this.i18nService.getCurrentLanguageConfig();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectLanguage(languageCode: string): void {
    this.i18nService.setLanguage(languageCode);
    this.isOpen = false;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  getDisplayText(): string {
    if (this.currentLanguageConfig) {
      return `${this.currentLanguageConfig.flag} ${this.currentLanguageConfig.name}`;
    }
    return '🇺🇸 English';
  }
}

