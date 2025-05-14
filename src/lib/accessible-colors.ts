import { ColorVariant } from "../components/ui/color-palette";
import { contrastRatio, passesWCAG } from 'wcag-contrast-utils';

// Helper functions for contrast calculations
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

// Calculate contrast between two colors
const calculateColorContrast = (color1: string, color2: string): number => {
  // Convert hex to RGB for first color
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  // Convert hex to RGB for second color
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  // Calculate relative luminance for both colors
  const getRelativeLuminance = (r: number, g: number, b: number): number => {
    const sR = r / 255;
    const sG = g / 255;
    const sB = b / 255;
    
    const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
    const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
    const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  
  const L1 = getRelativeLuminance(r1, g1, b1);
  const L2 = getRelativeLuminance(r2, g2, b2);
  
  // Calculate contrast ratio
  const ratio = L1 > L2 
    ? (L1 + 0.05) / (L2 + 0.05)
    : (L2 + 0.05) / (L1 + 0.05);
  
  return parseFloat(ratio.toFixed(2));
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
  const whiteContrast = contrastRatio(hex, '#FFFFFF');
  const blackContrast = contrastRatio(hex, '#000000');
  
  // Check WCAG compliance for better contrast (either with white or black)
  const wcagLevel = passesWCAG(Math.max(whiteContrast, blackContrast));
  const aa = wcagLevel === 'AA' || wcagLevel === 'AAA';
  const aaa = wcagLevel === 'AAA';
  
  return {
    name,
    value: hex,
    contrast: {
      white: whiteContrast,
      black: blackContrast
    },
    wcag: { aa, aaa }
  };
};

export interface AccessibleColorCombination {
  name: string;
  description: string;
  primary: ColorVariant[];
  secondary: ColorVariant[];
  contrast: {
    primarySecondary: number; // Contrast between primary[5] and secondary[5]
    onLight: number; // Contrast of primary[5] on white
    onDark: number; // Contrast of primary[5] on black
  };
  wcag: {
    primarySecondary: { aa: boolean; aaa: boolean };
    onLight: { aa: boolean; aaa: boolean };
    onDark: { aa: boolean; aaa: boolean };
  };
}

// =======================================
// ACCESSIBLE COMBINATION 1: WORDLY TEAL & MAGENTA
// =======================================
// Based on the brand colors #118197 (primary teal) and #E0007B (secondary magenta)

// Primary: Wordly Teal palette
const wordlyTealPalette: ColorVariant[] = [
  createVariant('Wordly Teal 50', '#E6F1F3'),
  createVariant('Wordly Teal 100', '#CCE3E8'),
  createVariant('Wordly Teal 200', '#99C7D0'),
  createVariant('Wordly Teal 300', '#66ABB9'),
  createVariant('Wordly Teal 400', '#338FA1'),
  createVariant('Wordly Teal 500', '#118197'), // Brand Primary - Original
  createVariant('Wordly Teal 600', '#0E6879'), // Darker for better AA compliance
  createVariant('Wordly Teal 700', '#0B4F5B'), // WCAG AAA compliant
  createVariant('Wordly Teal 800', '#07353D'),
  createVariant('Wordly Teal 900', '#041A1E'),
];

// Secondary: Wordly Magenta palette
const wordlyMagentaPalette: ColorVariant[] = [
  createVariant('Wordly Magenta 50', '#FCE6F2'),
  createVariant('Wordly Magenta 100', '#F9CCE5'),
  createVariant('Wordly Magenta 200', '#F399CA'),
  createVariant('Wordly Magenta 300', '#ED66B0'),
  createVariant('Wordly Magenta 400', '#E73395'),
  createVariant('Wordly Magenta 500', '#E0007B'), // Brand Secondary - Original
  createVariant('Wordly Magenta 600', '#B30062'), // Darker for better AA compliance
  createVariant('Wordly Magenta 700', '#86004A'), // WCAG AAA compliant
  createVariant('Wordly Magenta 800', '#5A0031'),
  createVariant('Wordly Magenta 900', '#2D0019'),
];

// =======================================
// ACCESSIBLE COMBINATION 2: DEEP TEAL & FUCHSIA
// =======================================
// Deeper variations that maintain the brand identity but enhance accessibility

// Primary: Deep Teal (darker, more accessible version)
const deepTealPalette: ColorVariant[] = [
  createVariant('Deep Teal 50', '#E6EDEF'),
  createVariant('Deep Teal 100', '#CCDBDF'),
  createVariant('Deep Teal 200', '#99B7BF'),
  createVariant('Deep Teal 300', '#66939F'),
  createVariant('Deep Teal 400', '#336F7F'),
  createVariant('Deep Teal 500', '#005A6C'), // Darker, more accessible version of primary
  createVariant('Deep Teal 600', '#00485A'),
  createVariant('Deep Teal 700', '#003643'), // WCAG AAA compliant
  createVariant('Deep Teal 800', '#00242D'),
  createVariant('Deep Teal 900', '#001216'),
];

// Secondary: Fuchsia (deeper, more accessible pink)
const fuchsiaPalette: ColorVariant[] = [
  createVariant('Fuchsia 50', '#FCE6F0'),
  createVariant('Fuchsia 100', '#F9CCE1'),
  createVariant('Fuchsia 200', '#F399C3'),
  createVariant('Fuchsia 300', '#ED66A5'),
  createVariant('Fuchsia 400', '#E73387'),
  createVariant('Fuchsia 500', '#CA0060'), // Darker, more accessible version of secondary
  createVariant('Fuchsia 600', '#A2004D'),
  createVariant('Fuchsia 700', '#790039'), // WCAG AAA compliant
  createVariant('Fuchsia 800', '#520026'),
  createVariant('Fuchsia 900', '#290013'),
];

// =======================================
// ACCESSIBLE COMBINATION 3: PETROL BLUE & RASPBERRY
// =======================================
// A blue-leaning variation of the teal paired with a red-leaning variation of the magenta

// Primary: Petrol Blue (blue-leaning teal)
const petrolBluePalette: ColorVariant[] = [
  createVariant('Petrol Blue 50', '#E6ECF0'),
  createVariant('Petrol Blue 100', '#CCDAE1'),
  createVariant('Petrol Blue 200', '#99B5C3'),
  createVariant('Petrol Blue 300', '#6690A5'),
  createVariant('Petrol Blue 400', '#336B87'),
  createVariant('Petrol Blue 500', '#0E5574'), // Blue-leaning version of primary
  createVariant('Petrol Blue 600', '#0B445E'),
  createVariant('Petrol Blue 700', '#083347'), // WCAG AAA compliant
  createVariant('Petrol Blue 800', '#052231'),
  createVariant('Petrol Blue 900', '#031118'),
];

// Secondary: Raspberry (red-leaning magenta)
const raspberryPalette: ColorVariant[] = [
  createVariant('Raspberry 50', '#FCE6EB'),
  createVariant('Raspberry 100', '#F9CCD7'),
  createVariant('Raspberry 200', '#F399AF'),
  createVariant('Raspberry 300', '#ED6687'),
  createVariant('Raspberry 400', '#E7335F'),
  createVariant('Raspberry 500', '#D10044'), // Red-leaning version of secondary
  createVariant('Raspberry 600', '#A80037'),
  createVariant('Raspberry 700', '#7E0029'), // WCAG AAA compliant
  createVariant('Raspberry 800', '#55001C'),
  createVariant('Raspberry 900', '#2A000E'),
];

// =======================================
// ACCESSIBLE COMBINATION 4: JADE & PLUM
// =======================================
// A green-leaning variation of the teal paired with a purple-leaning variation of the magenta

// Primary: Jade (green-leaning teal)
const jadePalette: ColorVariant[] = [
  createVariant('Jade 50', '#E6F0EE'),
  createVariant('Jade 100', '#CCE1DD'),
  createVariant('Jade 200', '#99C4BB'),
  createVariant('Jade 300', '#66A799'),
  createVariant('Jade 400', '#338976'),
  createVariant('Jade 500', '#006C5A'), // Green-leaning version of primary
  createVariant('Jade 600', '#005748'),
  createVariant('Jade 700', '#004135'), // WCAG AAA compliant
  createVariant('Jade 800', '#002C23'),
  createVariant('Jade 900', '#001611'),
];

// Secondary: Plum (purple-leaning magenta)
const plumPalette: ColorVariant[] = [
  createVariant('Plum 50', '#F8E6F0'),
  createVariant('Plum 100', '#F1CCE1'),
  createVariant('Plum 200', '#E399C3'),
  createVariant('Plum 300', '#D566A5'),
  createVariant('Plum 400', '#C73387'),
  createVariant('Plum 500', '#A90066'), // Purple-leaning version of secondary
  createVariant('Plum 600', '#870052'),
  createVariant('Plum 700', '#65003D'), // WCAG AAA compliant
  createVariant('Plum 800', '#430029'),
  createVariant('Plum 900', '#220014'),
];

// Helper function to convert passesWCAG result to aa/aaa object format
const getWCAGCompliance = (contrastValue: number): { aa: boolean; aaa: boolean } => {
  const level = passesWCAG(contrastValue);
  return {
    aa: level.includes('AA') || level.includes('AAA'),
    aaa: level.includes('AAA') && !level.includes('Large Text')
  };
};

// Create color combinations using the wcag-contrast-utils library
export const accessibleColorCombinations: AccessibleColorCombination[] = [
  {
    name: "Wordly Teal & Magenta",
    description: "The original brand colors optimized for accessibility while preserving brand identity",
    primary: wordlyTealPalette,
    secondary: wordlyMagentaPalette,
    contrast: {
      primarySecondary: contrastRatio(wordlyTealPalette[5].value, wordlyMagentaPalette[5].value),
      onLight: wordlyTealPalette[5].contrast?.black || 0,
      onDark: wordlyTealPalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: getWCAGCompliance(contrastRatio(wordlyTealPalette[5].value, wordlyMagentaPalette[5].value)),
      onLight: getWCAGCompliance(wordlyTealPalette[5].contrast?.black || 0),
      onDark: getWCAGCompliance(wordlyTealPalette[5].contrast?.white || 0),
    },
  },
  {
    name: "Deep Teal & Fuchsia",
    description: "Darker variations of the brand colors with enhanced accessibility and a sophisticated feel",
    primary: deepTealPalette,
    secondary: fuchsiaPalette,
    contrast: {
      primarySecondary: contrastRatio(deepTealPalette[5].value, fuchsiaPalette[5].value),
      onLight: deepTealPalette[5].contrast?.black || 0,
      onDark: deepTealPalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: getWCAGCompliance(contrastRatio(deepTealPalette[5].value, fuchsiaPalette[5].value)),
      onLight: getWCAGCompliance(deepTealPalette[5].contrast?.black || 0),
      onDark: getWCAGCompliance(deepTealPalette[5].contrast?.white || 0),
    },
  },
  {
    name: "Petrol Blue & Raspberry",
    description: "Blue-leaning teal and red-leaning magenta for a more vibrant, contrasting palette",
    primary: petrolBluePalette,
    secondary: raspberryPalette,
    contrast: {
      primarySecondary: contrastRatio(petrolBluePalette[5].value, raspberryPalette[5].value),
      onLight: petrolBluePalette[5].contrast?.black || 0,
      onDark: petrolBluePalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: getWCAGCompliance(contrastRatio(petrolBluePalette[5].value, raspberryPalette[5].value)),
      onLight: getWCAGCompliance(petrolBluePalette[5].contrast?.black || 0),
      onDark: getWCAGCompliance(petrolBluePalette[5].contrast?.white || 0),
    },
  },
  {
    name: "Jade & Plum",
    description: "Green-leaning teal and purple-leaning magenta for a balanced, natural harmony",
    primary: jadePalette,
    secondary: plumPalette,
    contrast: {
      primarySecondary: contrastRatio(jadePalette[5].value, plumPalette[5].value),
      onLight: jadePalette[5].contrast?.black || 0,
      onDark: jadePalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: getWCAGCompliance(contrastRatio(jadePalette[5].value, plumPalette[5].value)),
      onLight: getWCAGCompliance(jadePalette[5].contrast?.black || 0),
      onDark: getWCAGCompliance(jadePalette[5].contrast?.white || 0),
    },
  },
];

// Individual accessible palettes for flexible usage
export const accessiblePalettes = {
  wordlyTeal: wordlyTealPalette,
  wordlyMagenta: wordlyMagentaPalette,
  deepTeal: deepTealPalette,
  fuchsia: fuchsiaPalette,
  petrolBlue: petrolBluePalette,
  raspberry: raspberryPalette,
  jade: jadePalette,
  plum: plumPalette,
}; 