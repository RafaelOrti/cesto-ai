import { Injectable, OnInit } from '@angular/core';
import { ColorThemeService } from '../../services/color-theme.service';
import { DEFAULT_CESTO_THEME } from '../../core/interfaces/color-theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService implements OnInit {

  constructor(private colorThemeService: ColorThemeService) {}

  ngOnInit(): void {
    this.initializeDefaultTheme();
  }

  /**
   * Initialize the default Cesto theme
   */
  private initializeDefaultTheme(): void {
    // Check if there's already a theme applied
    const savedTheme = localStorage.getItem('cesto-color-theme');
    
    if (!savedTheme) {
      // Apply the default Cesto theme
      this.colorThemeService.applyTheme(DEFAULT_CESTO_THEME);
      console.log('Applied default Cesto theme');
    } else {
      console.log('Using saved theme from localStorage');
    }
  }

  /**
   * Initialize theme on app startup
   */
  initializeTheme(): void {
    this.initializeDefaultTheme();
  }
}
