export const SIZES = {
  // Font sizes
  FONT: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    '2XL': '1.5rem',  // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem', // 36px
    '5XL': '3rem',    // 48px
    '6XL': '3.75rem', // 60px
    '7XL': '4.5rem',  // 72px
    '8XL': '6rem',    // 96px
    '9XL': '8rem'     // 128px
  },

  // Spacing
  SPACING: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    9: '2.25rem',   // 36px
    10: '2.5rem',   // 40px
    11: '2.75rem',  // 44px
    12: '3rem',     // 48px
    14: '3.5rem',   // 56px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    28: '7rem',     // 112px
    32: '8rem',     // 128px
    36: '9rem',     // 144px
    40: '10rem',    // 160px
    44: '11rem',    // 176px
    48: '12rem',    // 192px
    52: '13rem',    // 208px
    56: '14rem',    // 224px
    60: '15rem',    // 240px
    64: '16rem',    // 256px
    72: '18rem',    // 288px
    80: '20rem',    // 320px
    96: '24rem'     // 384px
  },

  // Border radius
  BORDER_RADIUS: {
    NONE: '0',
    SM: '0.125rem',  // 2px
    BASE: '0.25rem', // 4px
    MD: '0.375rem',  // 6px
    LG: '0.5rem',    // 8px
    XL: '0.75rem',   // 12px
    '2XL': '1rem',   // 16px
    '3XL': '1.5rem', // 24px
    FULL: '9999px'
  },

  // Shadows
  SHADOW: {
    NONE: 'none',
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    BASE: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },

  // Z-index
  Z_INDEX: {
    HIDE: -1,
    AUTO: 'auto',
    BASE: 0,
    DOCKED: 10,
    DROPDOWN: 1000,
    STICKY: 1100,
    BANNER: 1200,
    OVERLAY: 1300,
    MODAL: 1400,
    POPOVER: 1500,
    SKIPLINK: 1600,
    TOAST: 1700,
    TOOLTIP: 1800
  },

  // Breakpoints
  BREAKPOINTS: {
    XS: '0px',
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  },

  // Container sizes
  CONTAINER: {
    XS: '20rem',    // 320px
    SM: '24rem',    // 384px
    MD: '28rem',    // 448px
    LG: '32rem',    // 512px
    XL: '36rem',    // 576px
    '2XL': '42rem', // 672px
    '3XL': '48rem', // 768px
    '4XL': '56rem', // 896px
    '5XL': '64rem', // 1024px
    '6XL': '72rem', // 1152px
    '7XL': '80rem', // 1280px
    FULL: '100%',
    SCREEN: '100vw'
  },

  // Grid columns
  GRID_COLUMNS: {
    1: 'repeat(1, minmax(0, 1fr))',
    2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))',
    4: 'repeat(4, minmax(0, 1fr))',
    5: 'repeat(5, minmax(0, 1fr))',
    6: 'repeat(6, minmax(0, 1fr))',
    7: 'repeat(7, minmax(0, 1fr))',
    8: 'repeat(8, minmax(0, 1fr))',
    9: 'repeat(9, minmax(0, 1fr))',
    10: 'repeat(10, minmax(0, 1fr))',
    11: 'repeat(11, minmax(0, 1fr))',
    12: 'repeat(12, minmax(0, 1fr))'
  },

  // Animation durations
  ANIMATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
    SLOWER: '700ms',
    SLOWEST: '1000ms'
  },

  // Line heights
  LINE_HEIGHT: {
    NONE: '1',
    TIGHT: '1.25',
    SNUG: '1.375',
    NORMAL: '1.5',
    RELAXED: '1.625',
    LOOSE: '2'
  },

  // Letter spacing
  LETTER_SPACING: {
    TIGHTER: '-0.05em',
    TIGHT: '-0.025em',
    NORMAL: '0em',
    WIDE: '0.025em',
    WIDER: '0.05em',
    WIDEST: '0.1em'
  },

  // Opacity
  OPACITY: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1'
  }
};
