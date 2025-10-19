import { Component, OnInit } from '@angular/core';
import { ColorConfigService, ColorPalette } from '../../core/services/color-config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-color-config',
  templateUrl: './color-config.component.html',
  styleUrls: ['./color-config.component.scss']
})
export class ColorConfigComponent implements OnInit {
  colorForm: FormGroup;
  currentPalette: ColorPalette;

  constructor(
    private colorConfigService: ColorConfigService,
    private fb: FormBuilder
  ) {
    this.colorForm = this.createForm();
  }

  ngOnInit(): void {
    this.currentPalette = this.colorConfigService.getPalette();
    this.loadCurrentPalette();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      primaryMain: ['', Validators.required],
      primaryLight: ['', Validators.required],
      primaryDark: ['', Validators.required],
      primaryContrast: ['', Validators.required],
      
      secondaryMain: ['', Validators.required],
      secondaryLight: ['', Validators.required],
      secondaryDark: ['', Validators.required],
      secondaryContrast: ['', Validators.required],
      
      accentMain: ['', Validators.required],
      accentLight: ['', Validators.required],
      accentDark: ['', Validators.required],
      accentContrast: ['', Validators.required],
      
      backgroundPrimary: ['', Validators.required],
      backgroundSecondary: ['', Validators.required],
      backgroundTertiary: ['', Validators.required],
      
      surfacePrimary: ['', Validators.required],
      surfaceSecondary: ['', Validators.required],
      surfaceElevated: ['', Validators.required],
      
      textPrimary: ['', Validators.required],
      textSecondary: ['', Validators.required],
      textDisabled: ['', Validators.required],
      textHint: ['', Validators.required],
      
      statusSuccess: ['', Validators.required],
      statusWarning: ['', Validators.required],
      statusError: ['', Validators.required],
      statusInfo: ['', Validators.required],
      
      borderPrimary: ['', Validators.required],
      borderSecondary: ['', Validators.required],
      borderFocus: ['', Validators.required]
    });
  }

  private loadCurrentPalette(): void {
    this.colorForm.patchValue({
      primaryMain: this.currentPalette.primary.main,
      primaryLight: this.currentPalette.primary.light,
      primaryDark: this.currentPalette.primary.dark,
      primaryContrast: this.currentPalette.primary.contrast,
      
      secondaryMain: this.currentPalette.secondary.main,
      secondaryLight: this.currentPalette.secondary.light,
      secondaryDark: this.currentPalette.secondary.dark,
      secondaryContrast: this.currentPalette.secondary.contrast,
      
      accentMain: this.currentPalette.accent.main,
      accentLight: this.currentPalette.accent.light,
      accentDark: this.currentPalette.accent.dark,
      accentContrast: this.currentPalette.accent.contrast,
      
      backgroundPrimary: this.currentPalette.background.primary,
      backgroundSecondary: this.currentPalette.background.secondary,
      backgroundTertiary: this.currentPalette.background.tertiary,
      
      surfacePrimary: this.currentPalette.surface.primary,
      surfaceSecondary: this.currentPalette.surface.secondary,
      surfaceElevated: this.currentPalette.surface.elevated,
      
      textPrimary: this.currentPalette.text.primary,
      textSecondary: this.currentPalette.text.secondary,
      textDisabled: this.currentPalette.text.disabled,
      textHint: this.currentPalette.text.hint,
      
      statusSuccess: this.currentPalette.status.success,
      statusWarning: this.currentPalette.status.warning,
      statusError: this.currentPalette.status.error,
      statusInfo: this.currentPalette.status.info,
      
      borderPrimary: this.currentPalette.border.primary,
      borderSecondary: this.currentPalette.border.secondary,
      borderFocus: this.currentPalette.border.focus
    });
  }

  onColorChange(): void {
    if (this.colorForm.valid) {
      const formValue = this.colorForm.value;
      
      const newPalette: Partial<ColorPalette> = {
        primary: {
          main: formValue.primaryMain,
          light: formValue.primaryLight,
          dark: formValue.primaryDark,
          contrast: formValue.primaryContrast
        },
        secondary: {
          main: formValue.secondaryMain,
          light: formValue.secondaryLight,
          dark: formValue.secondaryDark,
          contrast: formValue.secondaryContrast
        },
        accent: {
          main: formValue.accentMain,
          light: formValue.accentLight,
          dark: formValue.accentDark,
          contrast: formValue.accentContrast
        },
        background: {
          primary: formValue.backgroundPrimary,
          secondary: formValue.backgroundSecondary,
          tertiary: formValue.backgroundTertiary
        },
        surface: {
          primary: formValue.surfacePrimary,
          secondary: formValue.surfaceSecondary,
          elevated: formValue.surfaceElevated
        },
        text: {
          primary: formValue.textPrimary,
          secondary: formValue.textSecondary,
          disabled: formValue.textDisabled,
          hint: formValue.textHint
        },
        status: {
          success: formValue.statusSuccess,
          warning: formValue.statusWarning,
          error: formValue.statusError,
          info: formValue.statusInfo
        },
        border: {
          primary: formValue.borderPrimary,
          secondary: formValue.borderSecondary,
          focus: formValue.borderFocus
        }
      };

      this.colorConfigService.updatePalette(newPalette);
    }
  }

  resetToDefault(): void {
    this.colorConfigService.resetToDefault();
    this.currentPalette = this.colorConfigService.getPalette();
    this.loadCurrentPalette();
  }

  applyPreset(preset: 'default' | 'dark' | 'light' | 'green-dark' | 'green-light'): void {
    let presetPalette: Partial<ColorPalette>;

    switch (preset) {
      case 'default':
        this.resetToDefault();
        return;
        
      case 'dark':
        presetPalette = {
          primary: { main: '#4CAF50', light: '#66BB6A', dark: '#2E7D32', contrast: '#FFFFFF' },
          secondary: { main: '#9E9E9E', light: '#BDBDBD', dark: '#616161', contrast: '#FFFFFF' },
          accent: { main: '#81C784', light: '#A5D6A7', dark: '#4CAF50', contrast: '#000000' },
          background: { primary: '#121212', secondary: '#1E1E1E', tertiary: '#2C2C2C' },
          surface: { primary: '#1E1E1E', secondary: '#2C2C2C', elevated: '#333333' },
          text: { primary: '#FFFFFF', secondary: '#B3B3B3', disabled: '#666666', hint: '#4D4D4D' },
          status: { success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' },
          border: { primary: 'rgba(76, 175, 80, 0.3)', secondary: 'rgba(255, 255, 255, 0.1)', focus: '#4CAF50' }
        };
        break;
        
      case 'light':
        presetPalette = {
          primary: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20', contrast: '#FFFFFF' },
          secondary: { main: '#757575', light: '#9E9E9E', dark: '#424242', contrast: '#FFFFFF' },
          accent: { main: '#66BB6A', light: '#81C784', dark: '#4CAF50', contrast: '#000000' },
          background: { primary: '#FAFAFA', secondary: '#F5F5F5', tertiary: '#EEEEEE' },
          surface: { primary: '#FFFFFF', secondary: '#FAFAFA', elevated: '#FFFFFF' },
          text: { primary: '#212121', secondary: '#757575', disabled: '#BDBDBD', hint: '#E0E0E0' },
          status: { success: '#4CAF50', warning: '#FF9800', error: '#F44336', info: '#2196F3' },
          border: { primary: 'rgba(76, 175, 80, 0.2)', secondary: 'rgba(0, 0, 0, 0.1)', focus: '#4CAF50' }
        };
        break;
        
      case 'green-dark':
        presetPalette = {
          primary: { main: '#1B5E20', light: '#2E7D32', dark: '#0D3E0F', contrast: '#FFFFFF' },
          secondary: { main: '#4CAF50', light: '#66BB6A', dark: '#388E3C', contrast: '#000000' },
          accent: { main: '#66BB6A', light: '#81C784', dark: '#4CAF50', contrast: '#000000' },
          background: { primary: '#0A1F0A', secondary: '#1B2E1B', tertiary: '#2A3F2A' },
          surface: { primary: '#1B2E1B', secondary: '#2A3F2A', elevated: '#3A4F3A' },
          text: { primary: '#E8F5E8', secondary: '#C8E6C9', disabled: '#81C784', hint: '#4CAF50' },
          status: { success: '#4CAF50', warning: '#8BC34A', error: '#2E7D32', info: '#66BB6A' },
          border: { primary: 'rgba(76, 175, 80, 0.4)', secondary: 'rgba(76, 175, 80, 0.2)', focus: '#4CAF50' }
        };
        break;
        
      case 'green-light':
        presetPalette = {
          primary: { main: '#4CAF50', light: '#66BB6A', dark: '#2E7D32', contrast: '#FFFFFF' },
          secondary: { main: '#8BC34A', light: '#A5D6A7', dark: '#689F38', contrast: '#000000' },
          accent: { main: '#81C784', light: '#A5D6A7', dark: '#4CAF50', contrast: '#000000' },
          background: { primary: '#F1F8E9', secondary: '#E8F5E8', tertiary: '#DCEDC8' },
          surface: { primary: '#FFFFFF', secondary: '#F1F8E9', elevated: '#FFFFFF' },
          text: { primary: '#1B5E20', secondary: '#2E7D32', disabled: '#81C784', hint: '#C8E6C9' },
          status: { success: '#4CAF50', warning: '#8BC34A', error: '#2E7D32', info: '#66BB6A' },
          border: { primary: 'rgba(76, 175, 80, 0.3)', secondary: 'rgba(76, 175, 80, 0.1)', focus: '#4CAF50' }
        };
        break;
    }

    if (presetPalette) {
      this.colorConfigService.updatePalette(presetPalette);
      this.currentPalette = this.colorConfigService.getPalette();
      this.loadCurrentPalette();
    }
  }
}
