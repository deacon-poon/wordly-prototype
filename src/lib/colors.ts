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

// Primary Brand Blue - NEW PRIMARY COLOR (Figma Variables Source of Truth - 2026 Rebrand)
export const brandBluePalette: ColorVariant[] = [
  createVariant('Blue 25', '#F0F7FF'), // primitives/color/brand-blue/brand-blue-25 from Figma
  createVariant('Blue 50', '#D6E8FF'), // primitives/color/brand-blue/brand-blue-50 from Figma
  createVariant('Blue 100', '#B2D8FF'), // primitives/color/brand-blue/brand-blue-100 from Figma
  createVariant('Blue 200', '#75B8FF'), // primitives/color/brand-blue/brand-blue-200 from Figma
  createVariant('Blue 300', '#3396FF'), // primitives/color/brand-blue/brand-blue-300 from Figma
  createVariant('Blue 400', '#017CFF'), // primitives/color/brand-blue/brand-blue-400 from Figma
  createVariant('Blue 500', '#0063CC'), // primitives/color/brand-blue/brand-blue-500 from Figma (BASE PRIMARY)
  createVariant('Blue 600', '#0051A8'), // primitives/color/brand-blue/brand-blue-600 from Figma
  createVariant('Blue 700', '#00458F'), // primitives/color/brand-blue/brand-blue-700 from Figma
  createVariant('Blue 800', '#002C5C'), // primitives/color/brand-blue/brand-blue-800 from Figma
  createVariant('Blue 900', '#001E3D'), // primitives/color/brand-blue/brand-blue-900 from Figma
];

// Action Teal - For buttons and interactive elements
export const actionTealPalette: ColorVariant[] = [
  createVariant('Teal 50', '#DBF5F9'), // action-teal-50 from Figma
  createVariant('Teal 100', '#BBEDFA'), // action-teal-100 from Figma
  createVariant('Teal 200', '#84DFF0'), // action-teal-200 from Figma
  createVariant('Teal 300', '#49CFE9'), // action-teal-300 from Figma
  createVariant('Teal 400', '#1BC4E4'), // action-teal-400 from Figma
  createVariant('Teal 500', '#169CB6'), // action-teal-500 from Figma
  createVariant('Teal 600', '#128197'), // action-teal-600 from Figma (BASE ACTION)
  createVariant('Teal 700', '#0F6D80'), // action-teal-700 from Figma
  createVariant('Teal 800', '#0A4652'), // action-teal-800 from Figma
  createVariant('Teal 900', '#072F37'), // action-teal-900 from Figma
];

// Accent Green - NEW SECONDARY COLOR (Figma Variables Source of Truth - 2026 Rebrand)
export const accentGreenPalette: ColorVariant[] = [
  createVariant('Accent Green 50', '#DAF8E5'), // accent-green-50 from Figma
  createVariant('Accent Green 100', '#BBF7CB'), // accent-green-100 from Figma (calculated)
  createVariant('Accent Green 200', '#84F1A2'), // accent-green-200 from Figma
  createVariant('Accent Green 300', '#48EA76'), // accent-green-300 from Figma
  createVariant('Accent Green 400', '#1BE454'), // accent-green-400 from Figma
  createVariant('Accent Green 500', '#15B743'), // accent-green-500 from Figma (BASE SECONDARY)
  createVariant('Accent Green 600', '#129737'), // accent-green-600 from Figma
  createVariant('Accent Green 700', '#0F802F'), // accent-green-700 from Figma
  createVariant('Accent Green 800', '#0A522E'), // accent-green-800 from Figma
  createVariant('Accent Green 900', '#063716'), // accent-green-900 from Figma
];

// Legacy Teal - now maps to Brand Blue for backward compatibility
export const tealPalette: ColorVariant[] = [
  createVariant('Teal 50', '#D6E8FF'), // Now maps to brand-blue-50
  createVariant('Teal 100', '#B2D8FF'), // Now maps to brand-blue-100
  createVariant('Teal 200', '#75B8FF'), // Now maps to brand-blue-200
  createVariant('Teal 300', '#3396FF'), // Now maps to brand-blue-300
  createVariant('Teal 400', '#017CFF'), // Now maps to brand-blue-400
  createVariant('Teal 500', '#0063CC'), // Now maps to brand-blue-500 (PRIMARY)
  createVariant('Teal 600', '#0051A8'), // Now maps to brand-blue-600
  createVariant('Teal 700', '#00458F'), // Now maps to brand-blue-700
  createVariant('Teal 800', '#002C5C'), // Now maps to brand-blue-800
  createVariant('Teal 900', '#001E3D'), // Now maps to brand-blue-900
];

// Legacy Navy - now maps to Brand Blue for backward compatibility
export const navyPalette: ColorVariant[] = [
  createVariant('Navy 20', '#F0F7FF'), // Now maps to brand-blue-25
  createVariant('Navy 50', '#D6E8FF'), // Now maps to brand-blue-50
  createVariant('Navy 100', '#B2D8FF'), // Now maps to brand-blue-100
  createVariant('Navy 200', '#75B8FF'), // Now maps to brand-blue-200
  createVariant('Navy 300', '#3396FF'), // Now maps to brand-blue-300
  createVariant('Navy 400', '#017CFF'), // Now maps to brand-blue-400
  createVariant('Navy 500', '#0063CC'), // Now maps to brand-blue-500
  createVariant('Navy 600', '#0051A8'), // Now maps to brand-blue-600
  createVariant('Navy 700', '#00458F'), // Now maps to brand-blue-700
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

// Blue for informational purposes (links, info states) - 10 shades
export const bluePalette: ColorVariant[] = [
  createVariant('Blue 50', '#EBF5FF'),
  createVariant('Blue 100', '#D1E7FF'),
  createVariant('Blue 200', '#B3D4FF'),
  createVariant('Blue 300', '#84C5FF'),
  createVariant('Blue 400', '#53B1FD'),
  createVariant('Blue 500', '#2563EB'), // Base informational blue
  createVariant('Blue 600', '#1D4ED8'),
  createVariant('Blue 700', '#1E40AF'),
  createVariant('Blue 800', '#1E3A8A'),
  createVariant('Blue 900', '#1E2F60'),
];

// Orange for warnings - 10 shades
export const orangePalette: ColorVariant[] = [
  createVariant('Orange 50', '#FFF7ED'),
  createVariant('Orange 100', '#FFEDD5'),
  createVariant('Orange 200', '#FED7AA'),
  createVariant('Orange 300', '#FDBA74'),
  createVariant('Orange 400', '#FB923C'),
  createVariant('Orange 500', '#F97316'), // Base warning orange
  createVariant('Orange 600', '#EA580C'),
  createVariant('Orange 700', '#C2410C'),
  createVariant('Orange 800', '#9A3412'),
  createVariant('Orange 900', '#7C2D12'),
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
  // Primary brand palette (2026 Rebrand)
  brandBlue: brandBluePalette,
  actionTeal: actionTealPalette,
  // Secondary brand palette
  accentGreen: accentGreenPalette,
  // Legacy aliases
  navy: navyPalette,
  teal: tealPalette,
  pink: pinkPalette,
  // Semantic palettes
  blue: bluePalette,
  orange: orangePalette,
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

// Recommended WCAG-compliant combinations - Updated for Brand Blue/Accent Green (2026 Rebrand)
export const wcagRecommendedCombinations = [
  {
    background: "white",
    text: "Brand Blue-500",
    value: "#0063CC",
    purpose: "Primary text on white background (brand primary)",
    contrast: 6.8,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "white",
    text: "Brand Blue-600",
    value: "#0051A8",
    purpose: "Primary interactive elements on white background",
    contrast: 8.2,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "Brand Blue-500",
    text: "white",
    value: "#FFFFFF",
    purpose: "White text on brand blue background",
    contrast: 6.8,
    wcag: {
      aa: true,
      aaa: false,
    },
  },
  {
    background: "Brand Blue-500",
    text: "Accent Green-500",
    value: "#15B743",
    purpose: "Secondary brand highlight on brand blue background",
    contrast: 2.8,
    wcag: {
      aa: false,
      aaa: false,
    },
  },
  {
    background: "white",
    text: "Blue-600",
    value: "#1D4ED8",
    purpose: "Links and informational text on white background",
    contrast: 5.12,
    wcag: {
      aa: true,
      aaa: false,
    },
  },
  {
    background: "white",
    text: "Blue-700",
    value: "#1E40AF",
    purpose: "Strong informational text on white background",
    contrast: 6.85,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "Blue-50",
    text: "Blue-800",
    value: "#1E3A8A",
    purpose: "Text on light blue background",
    contrast: 8.42,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "white",
    text: "Orange-600",
    value: "#EA580C",
    purpose: "Warning text on white background",
    contrast: 4.89,
    wcag: {
      aa: true,
      aaa: false,
    },
  },
  {
    background: "Orange-50",
    text: "Orange-800",
    value: "#9A3412",
    purpose: "Text on light orange background",
    contrast: 7.12,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
  {
    background: "Navy-50",
    text: "Navy-700",
    value: "#030811",
    purpose: "Primary text on light navy background",
    contrast: 14.5,
    wcag: {
      aa: true,
      aaa: true,
    },
  },
]; 