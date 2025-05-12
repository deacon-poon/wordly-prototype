import { ColorVariant } from "../components/ui/color-palette";

// Helper to calculate approximate contrast ratio (simplified version)
// More accurate algorithms exist but this gives us reasonable estimates
const calculateContrastRatio = (colorHex: string, against: 'white' | 'black'): number => {
  // Convert hex to RGB
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  
  // Calculate relative luminance
  const getRelativeLuminance = (color: number): number => {
    const sRGB = color / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  
  const luminance = 0.2126 * getRelativeLuminance(r) + 
                    0.7152 * getRelativeLuminance(g) + 
                    0.0722 * getRelativeLuminance(b);
  
  // Calculate contrast against white or black
  const contrastRatio = against === 'white'
    ? (1.05) / (luminance + 0.05) // White has luminance of 1
    : (luminance + 0.05) / (0.05); // Black has luminance of 0
  
  return parseFloat(contrastRatio.toFixed(2));
};

// Helper to check WCAG compliance
const checkWCAG = (contrast: number): { aa: boolean; aaa: boolean } => {
  return {
    aa: contrast >= 4.5,
    aaa: contrast >= 7.0
  };
};

// Create a color variant with calculated contrast values
const createVariant = (name: string, hex: string): ColorVariant => {
  const whiteContrast = calculateContrastRatio(hex, 'white');
  const blackContrast = calculateContrastRatio(hex, 'black');
  
  return {
    name,
    value: hex,
    contrast: {
      white: whiteContrast,
      black: blackContrast
    },
    wcag: {
      aa: whiteContrast >= 4.5 || blackContrast >= 4.5,
      aaa: whiteContrast >= 7.0 || blackContrast >= 7.0
    }
  };
};

// Brand Teal - 10 shades
export const tealPalette: ColorVariant[] = [
  createVariant('Teal 50', '#E6F4F7'),
  createVariant('Teal 100', '#C5E8EE'),
  createVariant('Teal 200', '#9ED2DC'),
  createVariant('Teal 300', '#5CB9CA'),
  createVariant('Teal 400', '#30A3B7'),
  createVariant('Teal 500', '#118197'), // Base brand teal
  createVariant('Teal 600', '#0C687A'),
  createVariant('Teal 700', '#08505D'),
  createVariant('Teal 800', '#063840'),
  createVariant('Teal 900', '#021F24'),
];

// Brand Pink - 10 shades
export const pinkPalette: ColorVariant[] = [
  createVariant('Pink 50', '#FCE6F1'),
  createVariant('Pink 100', '#F9BFD9'),
  createVariant('Pink 200', '#F693C1'),
  createVariant('Pink 300', '#F367A9'),
  createVariant('Pink 400', '#F13B91'),
  createVariant('Pink 500', '#E0007B'), // Base brand pink
  createVariant('Pink 600', '#B30062'),
  createVariant('Pink 700', '#85004A'),
  createVariant('Pink 800', '#570031'),
  createVariant('Pink 900', '#290019'),
];

// Green for affirmative actions - 10 shades
export const greenPalette: ColorVariant[] = [
  createVariant('Green 50', '#E6F6EC'),
  createVariant('Green 100', '#C5E8D2'),
  createVariant('Green 200', '#9CD7B0'),
  createVariant('Green 300', '#66C188'),
  createVariant('Green 400', '#34AD67'),
  createVariant('Green 500', '#0C9A4E'), // Base affirmative green
  createVariant('Green 600', '#0A7B3F'),
  createVariant('Green 700', '#085D2F'),
  createVariant('Green 800', '#053E20'),
  createVariant('Green 900', '#021F10'),
];

// Red for destructive actions - 10 shades
export const redPalette: ColorVariant[] = [
  createVariant('Red 50', '#FCEBEA'),
  createVariant('Red 100', '#F9CFCC'),
  createVariant('Red 200', '#F5A8A2'),
  createVariant('Red 300', '#F07870'),
  createVariant('Red 400', '#EA4F45'),
  createVariant('Red 500', '#E62D21'), // Base destructive red
  createVariant('Red 600', '#B8221A'),
  createVariant('Red 700', '#8A1A13'),
  createVariant('Red 800', '#5C110D'),
  createVariant('Red 900', '#2E0906'),
];

// Gray - 10 shades for UI elements
export const grayPalette: ColorVariant[] = [
  createVariant('Gray 50', '#F8F9FA'),
  createVariant('Gray 100', '#EEF0F2'),
  createVariant('Gray 200', '#E3E6E8'),
  createVariant('Gray 300', '#CDD2D7'),
  createVariant('Gray 400', '#9BA3AB'),
  createVariant('Gray 500', '#646E78'),
  createVariant('Gray 600', '#495057'),
  createVariant('Gray 700', '#343A40'),
  createVariant('Gray 800', '#212529'),
  createVariant('Gray 900', '#121416'),
];

// Export all palettes
export const colorPalettes = {
  teal: tealPalette,
  pink: pinkPalette,
  green: greenPalette,
  red: redPalette,
  gray: grayPalette
};

// Utility function to convert HSL to Hex
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Recommended WCAG-compliant combinations
export const wcagRecommendedCombinations = [
  {
    background: "white",
    text: "Teal-700",
    value: "#0A4D5C",
    purpose: "Primary text on white background",
    contrast: 7.42,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "white",
    text: "Teal-600",
    value: "#0E677A",
    purpose: "Secondary text on white background",
    contrast: 5.85,
    wcag: {
      aa: true,
      aaa: false,
    },
  },
  {
    background: "Teal-100",
    text: "Teal-900",
    value: "#031A1F",
    purpose: "Primary text on light teal background",
    contrast: 12.71, // Black contrast against Teal-100
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "Teal-700",
    text: "white",
    value: "#FFFFFF",
    purpose: "White text on dark teal background",
    contrast: 7.42,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "white",
    text: "Pink-700",
    value: "#85004A",
    purpose: "Primary pink text on white background",
    contrast: 6.56,
    wcag: {
      aa: true,
      aaa: false,
    },
  },
  {
    background: "Pink-100",
    text: "Pink-900",
    value: "#2C0019",
    purpose: "Primary text on light pink background",
    contrast: 11.82, // Black contrast against Pink-100
    wcag: {
      aa: true,
      aaa: true,
    },
  },
]; 