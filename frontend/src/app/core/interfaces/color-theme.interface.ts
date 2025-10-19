export interface ColorTheme {
  id: string;
  theme_name: string;
  description?: string;
  is_active: boolean;
  is_default: boolean;
  color_config: ColorConfig;
  created_by?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ColorConfig {
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
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ColorCategory {
  PRIMARY: 'primary';
  SECONDARY: 'secondary';
  ACCENT: 'accent';
  BACKGROUND: 'background';
  SURFACE: 'surface';
  TEXT: 'text';
  BORDER: 'border';
  STATUS: 'status';
}

// Default Cesto theme based on the green design from images
export const DEFAULT_CESTO_THEME: ColorConfig = {
  primary: {
    main: '#2E7D32',      // Forest green (main brand color)
    light: '#4CAF50',     // Medium green
    dark: '#1B5E20',      // Dark green
    contrast: '#FFFFFF'   // White text on green
  },
  secondary: {
    main: '#E8F5E8',      // Very light green (sidebar background)
    light: '#F1F8E9',     // Lighter green
    dark: '#C8E6C9',      // Light green
    contrast: '#2E7D32'   // Dark green text
  },
  accent: {
    main: '#66BB6A',      // Light green (accent elements)
    light: '#81C784',     // Lighter green
    dark: '#4CAF50',      // Medium green
    contrast: '#FFFFFF'   // White text
  },
  background: {
    primary: '#F5F5F5',   // Light gray (main content area)
    secondary: '#FFFFFF', // White (card backgrounds)
    tertiary: '#FAFAFA'   // Very light gray
  },
  surface: {
    primary: '#FFFFFF',   // White (cards, buttons)
    secondary: '#F8F8F8', // Very light gray
    elevated: '#FFFFFF'   // White (elevated surfaces)
  },
  text: {
    primary: '#2E7D32',   // Dark green (main text)
    secondary: '#4CAF50', // Medium green
    disabled: '#9E9E9E',  // Light gray (disabled text)
    hint: '#BDBDBD'       // Very light gray (hints)
  },
  border: {
    primary: '#C8E6C9',   // Light green borders
    secondary: '#E8F5E8', // Very light green borders
    focus: '#2E7D32'      // Dark green for focus states
  },
  status: {
    success: '#4CAF50',   // Green for success
    warning: '#8BC34A',   // Light green for warnings
    error: '#2E7D32',     // Dark green for errors
    info: '#66BB6A'       // Medium green for info
  }
};

