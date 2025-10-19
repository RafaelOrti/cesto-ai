import { Injectable } from '@angular/core';

export interface ColorPalette {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  accent: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ColorConfigService {
  private currentPalette: ColorPalette;

  constructor() {
    this.currentPalette = this.getDefaultPalette();
    this.applyPaletteToCSS();
  }

  private getDefaultPalette(): ColorPalette {
    return {
      primary: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
        contrast: '#FFFFFF'
      },
      secondary: {
        main: '#5f6368',
        light: '#9aa0a6',
        dark: '#3c4043',
        contrast: '#FFFFFF'
      },
      accent: {
        main: '#66BB6A',
        light: '#81C784',
        dark: '#4CAF50',
        contrast: '#333333'
      },
      background: {
        primary: '#f7fafc',
        secondary: '#edf2f7',
        tertiary: '#e2e8f0'
      },
      surface: {
        primary: 'rgba(255, 255, 255, 0.95)',
        secondary: 'rgba(248, 250, 252, 0.9)',
        elevated: 'rgba(255, 255, 255, 0.98)'
      },
      text: {
        primary: '#2d3748',
        secondary: '#4a5568',
        disabled: '#a0aec0',
        hint: '#cbd5e0'
      },
      status: {
        success: '#4CAF50',
        warning: '#8BC34A',
        error: '#2E7D32',
        info: '#66BB6A'
      },
      border: {
        primary: 'rgba(76, 175, 80, 0.2)',
        secondary: 'rgba(232, 245, 232, 0.8)',
        focus: '#4CAF50'
      }
    };
  }

  private applyPaletteToCSS(): void {
    const root = document.documentElement;
    const palette = this.currentPalette;

    // Primary colors
    root.style.setProperty('--mat-primary-main', palette.primary.main);
    root.style.setProperty('--mat-primary-light', palette.primary.light);
    root.style.setProperty('--mat-primary-dark', palette.primary.dark);
    root.style.setProperty('--mat-primary-contrast', palette.primary.contrast);

    // Secondary colors
    root.style.setProperty('--mat-secondary-main', palette.secondary.main);
    root.style.setProperty('--mat-secondary-light', palette.secondary.light);
    root.style.setProperty('--mat-secondary-dark', palette.secondary.dark);
    root.style.setProperty('--mat-secondary-contrast', palette.secondary.contrast);

    // Accent colors
    root.style.setProperty('--mat-accent-main', palette.accent.main);
    root.style.setProperty('--mat-accent-light', palette.accent.light);
    root.style.setProperty('--mat-accent-dark', palette.accent.dark);
    root.style.setProperty('--mat-accent-contrast', palette.accent.contrast);

    // Background colors
    root.style.setProperty('--mat-background-primary', palette.background.primary);
    root.style.setProperty('--mat-background-secondary', palette.background.secondary);
    root.style.setProperty('--mat-background-tertiary', palette.background.tertiary);

    // Surface colors
    root.style.setProperty('--mat-surface-primary', palette.surface.primary);
    root.style.setProperty('--mat-surface-secondary', palette.surface.secondary);
    root.style.setProperty('--mat-surface-elevated', palette.surface.elevated);

    // Text colors
    root.style.setProperty('--mat-text-primary', palette.text.primary);
    root.style.setProperty('--mat-text-secondary', palette.text.secondary);
    root.style.setProperty('--mat-text-disabled', palette.text.disabled);
    root.style.setProperty('--mat-text-hint', palette.text.hint);

    // Status colors
    root.style.setProperty('--mat-status-success', palette.status.success);
    root.style.setProperty('--mat-status-warning', palette.status.warning);
    root.style.setProperty('--mat-status-error', palette.status.error);
    root.style.setProperty('--mat-status-info', palette.status.info);

    // Border colors
    root.style.setProperty('--mat-border-primary', palette.border.primary);
    root.style.setProperty('--mat-border-secondary', palette.border.secondary);
    root.style.setProperty('--mat-border-focus', palette.border.focus);

    // Gradients
    root.style.setProperty('--mat-primary-gradient', `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`);
    root.style.setProperty('--mat-secondary-gradient', `linear-gradient(135deg, ${palette.background.primary} 0%, ${palette.background.secondary} 100%)`);
    root.style.setProperty('--mat-accent-gradient', `linear-gradient(135deg, ${palette.accent.main} 0%, ${palette.accent.light} 100%)`);

    // Status gradients
    root.style.setProperty('--mat-success-gradient', `linear-gradient(135deg, ${palette.status.success} 0%, ${palette.accent.main} 100%)`);
    root.style.setProperty('--mat-warning-gradient', `linear-gradient(135deg, ${palette.status.warning} 0%, ${palette.accent.light} 100%)`);
    root.style.setProperty('--mat-error-gradient', `linear-gradient(135deg, ${palette.status.error} 0%, ${palette.primary.main} 100%)`);
    root.style.setProperty('--mat-info-gradient', `linear-gradient(135deg, ${palette.status.info} 0%, ${palette.accent.light} 100%)`);
  }

  public getPalette(): ColorPalette {
    return this.currentPalette;
  }

  public updatePalette(newPalette: Partial<ColorPalette>): void {
    this.currentPalette = { ...this.currentPalette, ...newPalette };
    this.applyPaletteToCSS();
  }

  public getColor(colorPath: string): string {
    const keys = colorPath.split('.');
    let value: any = this.currentPalette;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        console.warn(`Color path "${colorPath}" not found in palette`);
        return '#000000';
      }
    }
    
    return value;
  }

  public getGradient(gradientName: string): string {
    const gradients = {
      'primary': `linear-gradient(135deg, ${this.currentPalette.primary.main} 0%, ${this.currentPalette.primary.light} 100%)`,
      'secondary': `linear-gradient(135deg, ${this.currentPalette.background.primary} 0%, ${this.currentPalette.background.secondary} 100%)`,
      'accent': `linear-gradient(135deg, ${this.currentPalette.accent.main} 0%, ${this.currentPalette.accent.light} 100%)`,
      'success': `linear-gradient(135deg, ${this.currentPalette.status.success} 0%, ${this.currentPalette.accent.main} 100%)`,
      'warning': `linear-gradient(135deg, ${this.currentPalette.status.warning} 0%, ${this.currentPalette.accent.light} 100%)`,
      'error': `linear-gradient(135deg, ${this.currentPalette.status.error} 0%, ${this.currentPalette.primary.main} 100%)`,
      'info': `linear-gradient(135deg, ${this.currentPalette.status.info} 0%, ${this.currentPalette.accent.light} 100%)`
    };

    return gradients[gradientName] || gradients['primary'];
  }

  public resetToDefault(): void {
    this.currentPalette = this.getDefaultPalette();
    this.applyPaletteToCSS();
  }
}
