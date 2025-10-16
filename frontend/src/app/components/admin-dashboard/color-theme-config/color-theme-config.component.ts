import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ColorThemeService } from '../../../services/color-theme.service';
import { ColorTheme, ColorConfig, DEFAULT_CESTO_THEME } from '../../../core/interfaces/color-theme.interface';

@Component({
  selector: 'app-color-theme-config',
  templateUrl: './color-theme-config.component.html',
  styleUrls: ['./color-theme-config.component.scss']
})
export class ColorThemeConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  themes: ColorTheme[] = [];
  activeTheme: ColorTheme | null = null;
  currentTheme: ColorConfig = DEFAULT_CESTO_THEME;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  // Forms
  newThemeForm: FormGroup;
  editThemeForm: FormGroup;
  colorPickerForm: FormGroup;

  // UI State
  showNewThemeForm = false;
  showEditForm = false;
  editingTheme: ColorTheme | null = null;
  previewMode = false;

  // Color categories for organization
  colorCategories = [
    { key: 'primary', label: 'Primary Colors', description: 'Main brand colors' },
    { key: 'secondary', label: 'Secondary Colors', description: 'Supporting colors' },
    { key: 'accent', label: 'Accent Colors', description: 'Highlight colors' },
    { key: 'background', label: 'Background Colors', description: 'Page and section backgrounds' },
    { key: 'surface', label: 'Surface Colors', description: 'Card and component backgrounds' },
    { key: 'text', label: 'Text Colors', description: 'Text and typography colors' },
    { key: 'border', label: 'Border Colors', description: 'Border and divider colors' },
    { key: 'status', label: 'Status Colors', description: 'Success, warning, error colors' }
  ];

  constructor(
    private colorThemeService: ColorThemeService,
    private fb: FormBuilder
  ) {
    this.newThemeForm = this.createNewThemeForm();
    this.editThemeForm = this.createEditThemeForm();
    this.colorPickerForm = this.createColorPickerForm();
  }

  ngOnInit(): void {
    this.loadThemes();
    this.loadActiveTheme();
    this.subscribeToCurrentTheme();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createNewThemeForm(): FormGroup {
    return this.fb.group({
      theme_name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      color_config: this.fb.group({
        primary: this.createColorGroup(),
        secondary: this.createColorGroup(),
        accent: this.createColorGroup(),
        background: this.createBackgroundGroup(),
        surface: this.createSurfaceGroup(),
        text: this.createTextGroup(),
        border: this.createBorderGroup(),
        status: this.createStatusGroup()
      })
    });
  }

  private createEditThemeForm(): FormGroup {
    return this.fb.group({
      theme_name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      color_config: this.fb.group({
        primary: this.createColorGroup(),
        secondary: this.createColorGroup(),
        accent: this.createColorGroup(),
        background: this.createBackgroundGroup(),
        surface: this.createSurfaceGroup(),
        text: this.createTextGroup(),
        border: this.createBorderGroup(),
        status: this.createStatusGroup()
      })
    });
  }

  private createColorPickerForm(): FormGroup {
    return this.fb.group({
      color: ['#008080', Validators.required]
    });
  }

  private createColorGroup(): FormGroup {
    return this.fb.group({
      main: ['#008080', Validators.required],
      light: ['#20B2AA', Validators.required],
      dark: ['#006666', Validators.required],
      contrast: ['#FFFFFF', Validators.required]
    });
  }

  private createBackgroundGroup(): FormGroup {
    return this.fb.group({
      primary: ['#F5F5F5', Validators.required],
      secondary: ['#FFFFFF', Validators.required],
      tertiary: ['#FAFAFA', Validators.required]
    });
  }

  private createSurfaceGroup(): FormGroup {
    return this.fb.group({
      primary: ['#FFFFFF', Validators.required],
      secondary: ['#F8F8F8', Validators.required],
      elevated: ['#FFFFFF', Validators.required]
    });
  }

  private createTextGroup(): FormGroup {
    return this.fb.group({
      primary: ['#333333', Validators.required],
      secondary: ['#666666', Validators.required],
      disabled: ['#999999', Validators.required],
      hint: ['#CCCCCC', Validators.required]
    });
  }

  private createBorderGroup(): FormGroup {
    return this.fb.group({
      primary: ['#E0E0E0', Validators.required],
      secondary: ['#F0F0F0', Validators.required],
      focus: ['#008080', Validators.required]
    });
  }

  private createStatusGroup(): FormGroup {
    return this.fb.group({
      success: ['#008080', Validators.required],
      warning: ['#FF6347', Validators.required],
      error: ['#FF0000', Validators.required],
      info: ['#ADD8E6', Validators.required]
    });
  }

  private loadThemes(): void {
    this.loading = true;
    this.colorThemeService.getThemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (themes) => {
          this.themes = themes;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading themes: ' + error.message;
          this.loading = false;
        }
      });
  }

  private loadActiveTheme(): void {
    this.colorThemeService.getActiveTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (theme) => {
          this.activeTheme = theme;
          if (theme) {
            this.colorThemeService.applyTheme(theme.color_config);
          }
        },
        error: (error) => {
          this.error = 'Error loading active theme: ' + error.message;
        }
      });
  }

  private subscribeToCurrentTheme(): void {
    this.colorThemeService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  // Theme Management Methods
  createNewTheme(): void {
    if (this.newThemeForm.valid) {
      this.loading = true;
      const formData = this.newThemeForm.value;
      
      this.colorThemeService.createTheme(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (theme) => {
            this.themes.unshift(theme);
            this.success = 'Theme created successfully!';
            this.showNewThemeForm = false;
            this.newThemeForm.reset();
            this.loading = false;
            this.clearMessages();
          },
          error: (error) => {
            this.error = 'Error creating theme: ' + error.message;
            this.loading = false;
            this.clearMessages();
          }
        });
    }
  }

  editTheme(theme: ColorTheme): void {
    this.editingTheme = theme;
    this.editThemeForm.patchValue({
      theme_name: theme.theme_name,
      description: theme.description,
      color_config: theme.color_config
    });
    this.showEditForm = true;
  }

  updateTheme(): void {
    if (this.editThemeForm.valid && this.editingTheme) {
      this.loading = true;
      const formData = this.editThemeForm.value;
      
      this.colorThemeService.updateTheme(this.editingTheme.id, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedTheme) => {
            const index = this.themes.findIndex(t => t.id === updatedTheme.id);
            if (index !== -1) {
              this.themes[index] = updatedTheme;
            }
            
            if (this.activeTheme?.id === updatedTheme.id) {
              this.activeTheme = updatedTheme;
              this.colorThemeService.applyTheme(updatedTheme.color_config);
            }
            
            this.success = 'Theme updated successfully!';
            this.showEditForm = false;
            this.editingTheme = null;
            this.loading = false;
            this.clearMessages();
          },
          error: (error) => {
            this.error = 'Error updating theme: ' + error.message;
            this.loading = false;
            this.clearMessages();
          }
        });
    }
  }

  setActiveTheme(theme: ColorTheme): void {
    this.loading = true;
    this.colorThemeService.setActiveTheme(theme.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (activeTheme) => {
          this.activeTheme = activeTheme;
          this.colorThemeService.applyTheme(activeTheme.color_config);
          this.success = 'Theme activated successfully!';
          this.loading = false;
          this.clearMessages();
        },
        error: (error) => {
          this.error = 'Error activating theme: ' + error.message;
          this.loading = false;
          this.clearMessages();
        }
      });
  }

  deleteTheme(theme: ColorTheme): void {
    if (confirm(`Are you sure you want to delete "${theme.theme_name}"?`)) {
      this.loading = true;
      this.colorThemeService.deleteTheme(theme.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.themes = this.themes.filter(t => t.id !== theme.id);
            this.success = 'Theme deleted successfully!';
            this.loading = false;
            this.clearMessages();
          },
          error: (error) => {
            this.error = 'Error deleting theme: ' + error.message;
            this.loading = false;
            this.clearMessages();
          }
        });
    }
  }

  duplicateTheme(theme: ColorTheme): void {
    const duplicatedTheme = {
      theme_name: `${theme.theme_name} (Copy)`,
      description: theme.description,
      color_config: { ...theme.color_config }
    };
    
    this.newThemeForm.patchValue(duplicatedTheme);
    this.showNewThemeForm = true;
  }

  // Preview Methods
  togglePreview(): void {
    this.previewMode = !this.previewMode;
  }

  previewTheme(theme: ColorTheme): void {
    this.colorThemeService.applyTheme(theme.color_config);
    this.previewMode = true;
  }

  exitPreview(): void {
    if (this.activeTheme) {
      this.colorThemeService.applyTheme(this.activeTheme.color_config);
    }
    this.previewMode = false;
  }

  // Utility Methods
  generateColorVariations(baseColor: string): { light: string; dark: string; contrast: string } {
    return this.colorThemeService.generateColorVariations(baseColor);
  }

  onColorChange(category: string, property: string, color: string): void {
    const variations = this.generateColorVariations(color);
    const colorGroup = this.editThemeForm.get(`color_config.${category}`) as FormGroup;
    
    if (colorGroup) {
      colorGroup.patchValue({
        main: color,
        light: variations.light,
        dark: variations.dark,
        contrast: variations.contrast
      });
    }
  }

  onColorChangeEvent(category: string, property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onColorChange(category, property, target.value);
  }

  resetToDefault(): void {
    this.colorThemeService.resetToDefault();
    this.success = 'Reset to default theme!';
    this.clearMessages();
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.error = null;
      this.success = null;
    }, 5000);
  }

  // Form Helpers
  toggleNewThemeForm(): void {
    this.showNewThemeForm = !this.showNewThemeForm;
    if (!this.showNewThemeForm) {
      this.newThemeForm.reset();
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingTheme = null;
    this.editThemeForm.reset();
  }

  // Validation Helpers
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  getColorProperties(category: string): { key: string; label: string }[] {
    const properties: { [key: string]: { key: string; label: string }[] } = {
      primary: [
        { key: 'main', label: 'Main' },
        { key: 'light', label: 'Light' },
        { key: 'dark', label: 'Dark' },
        { key: 'contrast', label: 'Contrast' }
      ],
      secondary: [
        { key: 'main', label: 'Main' },
        { key: 'light', label: 'Light' },
        { key: 'dark', label: 'Dark' },
        { key: 'contrast', label: 'Contrast' }
      ],
      accent: [
        { key: 'main', label: 'Main' },
        { key: 'light', label: 'Light' },
        { key: 'dark', label: 'Dark' },
        { key: 'contrast', label: 'Contrast' }
      ],
      background: [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'tertiary', label: 'Tertiary' }
      ],
      surface: [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'elevated', label: 'Elevated' }
      ],
      text: [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'disabled', label: 'Disabled' },
        { key: 'hint', label: 'Hint' }
      ],
      border: [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'focus', label: 'Focus' }
      ],
      status: [
        { key: 'success', label: 'Success' },
        { key: 'warning', label: 'Warning' },
        { key: 'error', label: 'Error' },
        { key: 'info', label: 'Info' }
      ]
    };
    
    return properties[category] || [];
  }

  getThemeColors(theme: ColorTheme): string[] {
    const config = theme.color_config;
    return [
      config.primary.main,
      config.secondary.main,
      config.accent.main,
      config.background.primary,
      config.background.secondary,
      config.surface.primary,
      config.text.primary,
      config.status.success,
      config.status.warning,
      config.status.error
    ];
  }
}
