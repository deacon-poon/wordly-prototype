/**
 * Color utility functions for the Wordly design system
 */

/**
 * Converts HSL values to hexadecimal color code
 * 
 * @param h - Hue value (0-360)
 * @param s - Saturation value (0-100)
 * @param l - Lightness value (0-100)
 * @returns Hexadecimal color code (e.g., #ff0000)
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Converts CSS HSL variable notation to hexadecimal color code
 * 
 * @param hslString - HSL values in CSS variable format (e.g., "187 76% 33%")
 * @returns Hexadecimal color code
 */
export function cssHslToHex(hslString: string): string {
  const parts = hslString.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!parts) return '#000000';
  
  const h = parseInt(parts[1], 10);
  const s = parseInt(parts[2], 10);
  const l = parseInt(parts[3], 10);
  
  return hslToHex(h, s, l);
}

/**
 * Determines if text on a given background color should be light or dark
 * 
 * @param hexColor - Hexadecimal color code to check
 * @returns 'light' if text should be light-colored, 'dark' if text should be dark
 */
export function getTextColorForBackground(hexColor: string): 'light' | 'dark' {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (hexColor.length === 7) {
    r = parseInt(hexColor.substring(1, 3), 16);
    g = parseInt(hexColor.substring(3, 5), 16);
    b = parseInt(hexColor.substring(5, 7), 16);
  } else if (hexColor.length === 4) {
    r = parseInt(hexColor.substring(1, 2), 16);
    g = parseInt(hexColor.substring(2, 3), 16);
    b = parseInt(hexColor.substring(3, 4), 16);
    r = r * 17;
    g = g * 17;
    b = b * 17;
  }
  
  // Compute luminance using the WCAG formula
  // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  // Use a threshold of 128 (out of 255) for determining light vs dark
  return luminance > 128 ? 'dark' : 'light';
}

/**
 * Gets the CSS variable value for a specified color in HSL format
 * 
 * @param colorName - The name of the color variable (e.g., "primary", "brand-teal-500")
 * @returns HSL value as a string (e.g., "187 76% 33%")
 */
export function getCssColorValue(colorName: string): string {
  if (typeof window === 'undefined') return '';
  
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(`--${colorName}`).trim();
}

/**
 * Gets a CSS color in hex format from a CSS variable
 * 
 * @param colorName - The name of the color variable (e.g., "primary", "brand-teal-500")
 * @returns Hexadecimal color code
 */
export function getCssColorHex(colorName: string): string {
  const hslValue = getCssColorValue(colorName);
  return hslValue ? cssHslToHex(hslValue) : '#000000';
}

/**
 * Gets appropriate text color (black or white) for a given background color variable
 * 
 * @param colorName - The name of the background color variable
 * @returns 'text-black' or 'text-white' Tailwind class
 */
export function getTextColorClass(colorName: string): string {
  const hexColor = getCssColorHex(colorName);
  return getTextColorForBackground(hexColor) === 'light' ? 'text-white' : 'text-black';
}

/**
 * Color palette mapping objects for the Wordly design system
 * 2026 Rebrand: Brand Blue 500 is PRIMARY, Accent Green 500 is SECONDARY
 */
export const brandColors = {
  // Primary brand color - Brand Blue
  blue: {
    25: 'primary-blue-25',
    50: 'primary-blue-50',
    100: 'primary-blue-100',
    200: 'primary-blue-200',
    300: 'primary-blue-300',
    400: 'primary-blue-400',
    500: 'primary-blue-500',
    600: 'primary-blue-600',
    700: 'primary-blue-700',
    800: 'primary-blue-800',
    900: 'primary-blue-900',
  },
  // Action Teal - For buttons and interactive elements
  actionTeal: {
    50: 'action-teal-50',
    100: 'action-teal-100',
    200: 'action-teal-200',
    300: 'action-teal-300',
    400: 'action-teal-400',
    500: 'action-teal-500',
    600: 'action-teal-600',
    700: 'action-teal-700',
    800: 'action-teal-800',
    900: 'action-teal-900',
  },
  // Secondary brand color - Accent Green
  green: {
    50: 'accent-green-50',
    100: 'accent-green-100',
    200: 'accent-green-200',
    300: 'accent-green-300',
    400: 'accent-green-400',
    500: 'accent-green-500',
    600: 'accent-green-600',
    700: 'accent-green-700',
    800: 'accent-green-800',
    900: 'accent-green-900',
  },
  // Legacy teal (now maps to Brand Blue) - for backward compatibility
  teal: {
    50: 'primary-blue-50',
    100: 'primary-blue-100',
    200: 'primary-blue-200',
    300: 'primary-blue-300',
    400: 'primary-blue-400',
    500: 'primary-blue-500',
    600: 'primary-blue-600',
    700: 'primary-blue-700',
    800: 'primary-blue-800',
    900: 'primary-blue-900',
  },
  // Legacy navy (now maps to Brand Blue) - for backward compatibility
  navy: {
    20: 'primary-blue-25',
    50: 'primary-blue-50',
    100: 'primary-blue-100',
    200: 'primary-blue-200',
    300: 'primary-blue-300',
    400: 'primary-blue-400',
    500: 'primary-blue-500',
    600: 'primary-blue-600',
    700: 'primary-blue-700',
  },
  // Legacy pink (deprecated)
  pink: {
    50: 'pink-50',
    100: 'pink-100',
    200: 'pink-200',
    300: 'pink-300',
    400: 'pink-400',
    500: 'pink-500',
    600: 'pink-600',
    700: 'pink-700',
    800: 'pink-800',
    900: 'pink-900',
  },
};

export const semanticColors = {
  success: 'success',
  error: 'destructive',
};

export const grayScale = {
  50: 'gray-50',
  100: 'gray-100',
  200: 'gray-200',
  300: 'gray-300',
  400: 'gray-400',
  500: 'gray-500',
  600: 'gray-600',
  700: 'gray-700',
  800: 'gray-800',
  900: 'gray-900',
}; 