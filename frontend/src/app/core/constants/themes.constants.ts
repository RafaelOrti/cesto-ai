export const THEMES = {
  // Light theme
  LIGHT: {
    name: 'Light',
    colors: {
      primary: '#2196f3',
      secondary: '#9c27b0',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#03a9f4',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#212121',
      textSecondary: '#757575',
      textDisabled: '#bdbdbd',
      border: '#e0e0e0',
      shadow: 'rgba(0, 0, 0, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.5)',
      backdrop: 'rgba(0, 0, 0, 0.3)',
      divider: '#e0e0e0',
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
      disabled: 'rgba(0, 0, 0, 0.12)',
      focus: 'rgba(33, 150, 243, 0.2)',
      active: 'rgba(33, 150, 243, 0.1)',
      pressed: 'rgba(33, 150, 243, 0.2)',
      ripple: 'rgba(0, 0, 0, 0.1)',
      elevation: {
        0: 'none',
        1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)'
      }
    },
    typography: {
      fontFamily: {
        primary: '"Roboto", "Helvetica", "Arial", sans-serif',
        secondary: '"Roboto", "Helvetica", "Arial", sans-serif',
        mono: '"Roboto Mono", "Courier New", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      '5xl': '8rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out'
    },
    zIndex: {
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skiplink: 1600,
      toast: 1700,
      tooltip: 1800
    }
  },

  // Dark theme
  DARK: {
    name: 'Dark',
    colors: {
      primary: '#90caf9',
      secondary: '#ce93d8',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#f48fb1',
      info: '#64b5f6',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      textDisabled: '#666666',
      border: '#333333',
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.7)',
      backdrop: 'rgba(0, 0, 0, 0.5)',
      divider: '#333333',
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.08)',
      disabled: 'rgba(255, 255, 255, 0.12)',
      focus: 'rgba(144, 202, 249, 0.2)',
      active: 'rgba(144, 202, 249, 0.1)',
      pressed: 'rgba(144, 202, 249, 0.2)',
      ripple: 'rgba(255, 255, 255, 0.1)',
      elevation: {
        0: 'none',
        1: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
        2: '0 3px 6px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.5)',
        3: '0 10px 20px rgba(0, 0, 0, 0.5), 0 6px 6px rgba(0, 0, 0, 0.6)',
        4: '0 14px 28px rgba(0, 0, 0, 0.6), 0 10px 10px rgba(0, 0, 0, 0.7)',
        5: '0 19px 38px rgba(0, 0, 0, 0.7), 0 15px 12px rgba(0, 0, 0, 0.8)'
      }
    },
    typography: {
      fontFamily: {
        primary: '"Roboto", "Helvetica", "Arial", sans-serif',
        secondary: '"Roboto", "Helvetica", "Arial", sans-serif',
        mono: '"Roboto Mono", "Courier New", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      '5xl': '8rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out'
    },
    zIndex: {
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skiplink: 1600,
      toast: 1700,
      tooltip: 1800
    }
  },

  // High contrast theme
  HIGH_CONTRAST: {
    name: 'High Contrast',
    colors: {
      primary: '#0000ff',
      secondary: '#ff00ff',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      textSecondary: '#000000',
      textDisabled: '#808080',
      border: '#000000',
      shadow: 'rgba(0, 0, 0, 0.5)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      backdrop: 'rgba(0, 0, 0, 0.6)',
      divider: '#000000',
      hover: 'rgba(0, 0, 0, 0.1)',
      selected: 'rgba(0, 0, 0, 0.2)',
      disabled: 'rgba(0, 0, 0, 0.3)',
      focus: 'rgba(0, 0, 255, 0.3)',
      active: 'rgba(0, 0, 255, 0.2)',
      pressed: 'rgba(0, 0, 255, 0.3)',
      ripple: 'rgba(0, 0, 0, 0.2)',
      elevation: {
        0: 'none',
        1: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.6)',
        2: '0 3px 6px rgba(0, 0, 0, 0.6), 0 3px 6px rgba(0, 0, 0, 0.7)',
        3: '0 10px 20px rgba(0, 0, 0, 0.7), 0 6px 6px rgba(0, 0, 0, 0.8)',
        4: '0 14px 28px rgba(0, 0, 0, 0.8), 0 10px 10px rgba(0, 0, 0, 0.9)',
        5: '0 19px 38px rgba(0, 0, 0, 0.9), 0 15px 12px rgba(0, 0, 0, 1)'
      }
    },
    typography: {
      fontFamily: {
        primary: '"Arial", "Helvetica", sans-serif',
        secondary: '"Arial", "Helvetica", sans-serif',
        mono: '"Courier New", monospace'
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      '5xl': '8rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.7)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.7)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.7)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.7)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out'
    },
    zIndex: {
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skiplink: 1600,
      toast: 1700,
      tooltip: 1800
    }
  }
};
