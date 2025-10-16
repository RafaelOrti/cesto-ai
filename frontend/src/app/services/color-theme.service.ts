import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ColorTheme, ColorConfig, DEFAULT_CESTO_THEME } from '../core/interfaces/color-theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ColorThemeService {
  private currentThemeSubject = new BehaviorSubject<ColorConfig>(DEFAULT_CESTO_THEME);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private readonly API_URL = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {
    this.loadThemeFromStorage();
    this.applyThemeToDocument(DEFAULT_CESTO_THEME);
  }

  /**
   * Get all available themes
   */
  getThemes(): Observable<ColorTheme[]> {
    return this.http.get<ColorTheme[]>(`${this.API_URL}/color-themes`);
  }

  /**
   * Get current active theme
   */
  getActiveTheme(): Observable<ColorTheme> {
    return this.http.get<ColorTheme>(`${this.API_URL}/color-themes/active`);
  }

  /**
   * Create a new theme
   */
  createTheme(theme: Partial<ColorTheme>): Observable<ColorTheme> {
    return this.http.post<ColorTheme>(`${this.API_URL}/color-themes`, theme);
  }

  /**
   * Update an existing theme
   */
  updateTheme(themeId: string, theme: Partial<ColorTheme>): Observable<ColorTheme> {
    return this.http.put<ColorTheme>(`${this.API_URL}/color-themes/${themeId}`, theme);
  }

  /**
   * Set active theme
   */
  setActiveTheme(themeId: string): Observable<ColorTheme> {
    return this.http.post<ColorTheme>(`${this.API_URL}/color-themes/${themeId}/activate`, {});
  }

  /**
   * Delete a theme
   */
  deleteTheme(themeId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/color-themes/${themeId}`);
  }

  /**
   * Apply theme to the application
   */
  applyTheme(theme: ColorConfig): void {
    this.currentThemeSubject.next(theme);
    this.applyThemeToDocument(theme);
    this.saveThemeToStorage(theme);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): ColorConfig {
    return this.currentThemeSubject.value;
  }

  /**
   * Reset to default theme
   */
  resetToDefault(): void {
    this.applyTheme(DEFAULT_CESTO_THEME);
  }

  /**
   * Apply theme colors to CSS custom properties
   */
  private applyThemeToDocument(theme: ColorConfig): void {
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--color-primary-main', theme.primary.main);
    root.style.setProperty('--color-primary-light', theme.primary.light);
    root.style.setProperty('--color-primary-dark', theme.primary.dark);
    root.style.setProperty('--color-primary-contrast', theme.primary.contrast);
    
    // Secondary colors
    root.style.setProperty('--color-secondary-main', theme.secondary.main);
    root.style.setProperty('--color-secondary-light', theme.secondary.light);
    root.style.setProperty('--color-secondary-dark', theme.secondary.dark);
    root.style.setProperty('--color-secondary-contrast', theme.secondary.contrast);
    
    // Accent colors
    root.style.setProperty('--color-accent-main', theme.accent.main);
    root.style.setProperty('--color-accent-light', theme.accent.light);
    root.style.setProperty('--color-accent-dark', theme.accent.dark);
    root.style.setProperty('--color-accent-contrast', theme.accent.contrast);
    
    // Background colors
    root.style.setProperty('--color-background-primary', theme.background.primary);
    root.style.setProperty('--color-background-secondary', theme.background.secondary);
    root.style.setProperty('--color-background-tertiary', theme.background.tertiary);
    
    // Surface colors
    root.style.setProperty('--color-surface-primary', theme.surface.primary);
    root.style.setProperty('--color-surface-secondary', theme.surface.secondary);
    root.style.setProperty('--color-surface-elevated', theme.surface.elevated);
    
    // Text colors
    root.style.setProperty('--color-text-primary', theme.text.primary);
    root.style.setProperty('--color-text-secondary', theme.text.secondary);
    root.style.setProperty('--color-text-disabled', theme.text.disabled);
    root.style.setProperty('--color-text-hint', theme.text.hint);
    
    // Border colors
    root.style.setProperty('--color-border-primary', theme.border.primary);
    root.style.setProperty('--color-border-secondary', theme.border.secondary);
    root.style.setProperty('--color-border-focus', theme.border.focus);
    
    // Status colors
    root.style.setProperty('--color-status-success', theme.status.success);
    root.style.setProperty('--color-status-warning', theme.status.warning);
    root.style.setProperty('--color-status-error', theme.status.error);
    root.style.setProperty('--color-status-info', theme.status.info);
  }

  /**
   * Save theme to localStorage
   */
  private saveThemeToStorage(theme: ColorConfig): void {
    localStorage.setItem('cesto-color-theme', JSON.stringify(theme));
  }

  /**
   * Load theme from localStorage
   */
  private loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem('cesto-color-theme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        this.currentThemeSubject.next(theme);
        this.applyThemeToDocument(theme);
      } catch (error) {
        console.error('Error loading theme from storage:', error);
        this.resetToDefault();
      }
    }
  }

  /**
   * Generate color variations for a given color
   */
  generateColorVariations(baseColor: string): { light: string; dark: string; contrast: string } {
    // Simple color manipulation - in a real app you might want to use a color library
    const light = this.lightenColor(baseColor, 20);
    const dark = this.darkenColor(baseColor, 20);
    const contrast = this.getContrastColor(baseColor);
    
    return { light, dark, contrast };
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  private darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }

  private getContrastColor(color: string): string {
    // Simple contrast calculation - returns black or white
    const rgb = parseInt(color.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 128 ? '#000000' : '#FFFFFF';
  }
}

