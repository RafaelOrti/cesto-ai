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

// Default Cesto theme based on the image description
export const DEFAULT_CESTO_THEME: ColorConfig = {
  primary: {
    main: '#008080',      // Dark teal/green (header background)
    light: '#20B2AA',     // Lighter teal
    dark: '#006666',      // Darker teal
    contrast: '#FFFFFF'   // White text on teal
  },
  secondary: {
    main: '#E0E0E0',      // Light gray (sidebar background)
    light: '#EDEDED',     // Lighter gray
    dark: '#BDBDBD',      // Darker gray
    contrast: '#333333'   // Dark gray text
  },
  accent: {
    main: '#ADD8E6',      // Light blue (heart icon)
    light: '#B8DCE8',     // Lighter light blue
    dark: '#8BC4D6',      // Darker light blue
    contrast: '#333333'   // Dark text
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
    primary: '#333333',   // Dark gray (main text)
    secondary: '#666666', // Medium gray
    disabled: '#999999',  // Light gray (disabled text)
    hint: '#CCCCCC'       // Very light gray (hints)
  },
  border: {
    primary: '#E0E0E0',   // Light gray borders
    secondary: '#F0F0F0', // Very light gray borders
    focus: '#008080'      // Teal for focus states
  },
  status: {
    success: '#008080',   // Teal for success
    warning: '#FF6347',   // Orange/red (notification icon)
    error: '#FF0000',     // Red for errors
    info: '#ADD8E6'       // Light blue for info
  }
};

