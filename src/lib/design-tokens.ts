/**
 * Design Tokens - Extracted from Figma (Source of Truth)
 * 
 * This file contains all design variables extracted directly from Figma.
 * These tokens serve as the single source of truth for the design system.
 * 
 * Generated: ${new Date().toISOString()}
 * Source: Figma Brand Colors Frame (706:1511)
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colorTokens = {
  // Primary Brand Colors
  primitives: {
    color: {
      'primary-teal': {
        'teal-50': '#e8f9fc',
        'teal-100': '#bbedf7',
        'teal-200': '#84def0',
        'teal-300': '#56d2eb',
        'teal-400': '#1bc3e4',
        'teal-500': '#128197', // Base primary
        'teal-600': '#0f6d80',
        'teal-700': '#0d5d6d',
        'teal-800': '#0a4652',
        'teal-900': '#072f37',
      },
      'secondary-navy': {
        'navy-50': '#d4e1f7',
        'navy-100': '#94b3eb',
        'navy-200': '#5486de',
        'navy-300': '#255dc1',
        'navy-400': '#183e81',
        'navy-500': '#0b1c3a', // Base secondary
        'navy-600': '#0a1933',
        'navy-700': '#030811',
      },
      'accent-green': {
        'green-500': '#28e6b6', // Base accent
      },
      gray: {
        'gray-100': '#eef0f2',
        'gray-500': '#646e78',
      },
      white: '#ffffff',
    },
  },

  // Semantic Colors
  color: {
    // Success/Spring Green
    'spring-green': {
      6: '#021f10',
      13: '#053e20', 
      20: '#085d2f',
      26: '#0a7b3f',
      33: '#0c9a4e',
      44: '#34ad67',
      54: '#33e1a1',
      58: '#66c188',
      73: '#9cd7b0',
      84: '#c5e8d2',
      93: '#e6f6ec',
    },

    // Warning Orange
    orange: {
      28: '#7c2d12',
      34: '#9a3412',
      40: '#c03f0c',
      48: '#e9590c',
      53: '#f97316',
      61: '#fb923c',
      72: '#fdba74',
      83: '#fed7aa',
      92: '#ffedd5',
      96: '#fff6eb',
    },

    // Informational Blue/Azure
    azure: {
      5: '#020817',
      8: '#121416',
      15: '#212529',
      23: '#343a40',
      25: '#1e2f60',
      33: '#1e3a8a',
      48: '#1d4fd7',
      53: '#2463eb',
      66: '#53b1fd',
      76: '#84c5ff',
      82: '#cdd2d7',
    },

    blue: {
      40: '#1e3fae',
    },

    // Error Red
    red: {
      10: '#2e0906',
      21: '#5c110d',
      31: '#8a1a13',
      41: '#b8221a',
      52: '#e62d21',
      59: '#ea4f45',
      69: '#f07870',
      80: '#f5a8a2',
    },

    // UI Grays
    grey: {
      31: '#495057',
      43: '#646e78',
      64: '#9ba3ab',
      90: '#e3e6e8',
      91: '#e2e8f0',
      94: '#eef0f2',
      98: '#f6f9fc',
    },

    // Accent Colors
    cyan: {
      33: '#167592',
    },

    // Base Colors
    black: {
      solid: '#000000',
    },
    white: {
      solid: '#ffffff',
    },
  },
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typographyTokens = {
  fontSize: {
    14: '14px',
    18: '18px',
    24: '24px',
  },
  fontWeight: {
    400: '400', // Regular
    500: '500', // Medium
    600: '600', // Semi-bold
    700: '700', // Bold
  },
  fontFamily: {
    'Font 3': 'Roboto',
  },
  lineHeight: {
    12: '12px',
    16: '16px',
    32: '32px',
  },
} as const;

// ============================================================================
// SPACING & DIMENSION TOKENS
// ============================================================================

export const spacingTokens = {
  itemSpacing: {
    xxs: '4px',
    '7_75': '7.75px',
    xs: '8px',
    l: '48px',
  },
} as const;

export const dimensionTokens = {
  width: {
    16: '16px',
  },
  height: {
    20: '20px',
    28: '28px',
  },
  strokeWeight: {
    1: '1px',
  },
} as const;

// ============================================================================
// SEMANTIC COLOR MAPPING
// ============================================================================

export const semanticColors = {
  // Brand
  brand: {
    primary: colorTokens.primitives.color['primary-teal']['teal-500'],
    secondary: colorTokens.primitives.color['secondary-navy']['navy-500'],
    accent: colorTokens.primitives.color['accent-green']['green-500'],
  },

  // States
  success: colorTokens.color['spring-green'][33], // #0c9a4e
  warning: colorTokens.color.orange[53], // #f97316
  error: colorTokens.color.red[52], // #e62d21
  info: colorTokens.color.azure[53], // #2463eb

  // UI
  text: {
    primary: colorTokens.color.azure[8], // #121416
    secondary: colorTokens.color.grey[43], // #646e78
    muted: colorTokens.color.grey[64], // #9ba3ab
  },
  
  background: {
    primary: colorTokens.color.white.solid, // #ffffff
    secondary: colorTokens.color.grey[98], // #f6f9fc
    muted: colorTokens.color.grey[94], // #eef0f2
  },

  border: {
    default: colorTokens.color.grey[90], // #e3e6e8
    muted: colorTokens.color.grey[91], // #e2e8f0
  },
} as const;

// ============================================================================
// DESIGN SYSTEM EXPORT
// ============================================================================

export const designSystem = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  dimensions: dimensionTokens,
  semantic: semanticColors,
} as const;

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ColorToken = typeof colorTokens;
export type TypographyToken = typeof typographyTokens;
export type SpacingToken = typeof spacingTokens;
export type SemanticColor = typeof semanticColors;
export type DesignSystem = typeof designSystem;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a color value by its path
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let current: any = colorTokens;
  
  for (const part of parts) {
    current = current[part];
    if (!current) {
      console.warn(`Color token not found: ${path}`);
      return '#000000';
    }
  }
  
  return current;
}

/**
 * Get a semantic color
 */
export function getSemanticColor(key: keyof typeof semanticColors | string): string {
  const parts = key.split('.');
  let current: any = semanticColors;
  
  for (const part of parts) {
    current = current[part];
    if (!current) {
      console.warn(`Semantic color not found: ${key}`);
      return '#000000';
    }
  }
  
  return current;
}

/**
 * Convert hex to CSS custom property format
 */
export function hexToHsl(hex: string): string {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Find the maximum and minimum values
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
