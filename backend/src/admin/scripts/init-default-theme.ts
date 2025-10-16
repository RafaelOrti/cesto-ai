import { DataSource } from 'typeorm';
import { ColorTheme } from '../entities/color-theme.entity';

/**
 * Initialize the default Cesto theme in the database
 */
export async function initializeDefaultCestoTheme(dataSource: DataSource): Promise<void> {
  const colorThemeRepository = dataSource.getRepository(ColorTheme);
  
  // Check if default theme already exists
  const existingDefaultTheme = await colorThemeRepository.findOne({
    where: { is_default: true }
  });

  if (existingDefaultTheme) {
    console.log('Default Cesto theme already exists');
    return;
  }

  // Create default Cesto theme
  const defaultTheme = colorThemeRepository.create({
    theme_name: 'Cesto Default',
    description: 'Default Cesto theme with teal and gray colors matching the application design',
    is_active: true,
    is_default: true,
    color_config: {
      primary: {
        main: '#008080',      // Dark teal (header background)
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
    },
    created_by: 'system',
    updated_by: 'system'
  });

  await colorThemeRepository.save(defaultTheme);
  console.log('Default Cesto theme created successfully');
}

/**
 * Run the initialization if this script is executed directly
 */
if (require.main === module) {
  // This would be called during application startup
  console.log('Initializing default Cesto theme...');
}
