import { ColorVariant } from "../components/ui/color-palette";

// Helper functions from colors.ts
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
    wcag: checkWCAG(whiteContrast > blackContrast ? whiteContrast : blackContrast)
  };
};

// Base brand blue: #0D1E3C
export const brandBlue = "#0D1E3C";

// =======================================
// Teal Variants - 4 different options
// =======================================

// Teal Variant 1: Ocean Teal (Cooler, deeper)
export const oceanTealPalette: ColorVariant[] = [
  createVariant('Ocean Teal 50', '#E5F4F7'),
  createVariant('Ocean Teal 100', '#CCE9EF'),
  createVariant('Ocean Teal 200', '#99D3DF'),
  createVariant('Ocean Teal 300', '#66BCCF'),
  createVariant('Ocean Teal 400', '#33A6BF'),
  createVariant('Ocean Teal 500', '#0090AF'), // Base Ocean Teal
  createVariant('Ocean Teal 600', '#00738C'),
  createVariant('Ocean Teal 700', '#005668'),
  createVariant('Ocean Teal 800', '#003945'),
  createVariant('Ocean Teal 900', '#001C23'),
];

// Teal Variant 2: Azure Teal (Brighter, more vibrant)
export const azureTealPalette: ColorVariant[] = [
  createVariant('Azure Teal 50', '#E3F8FA'),
  createVariant('Azure Teal 100', '#B9EDF2'),
  createVariant('Azure Teal 200', '#8FE2EA'),
  createVariant('Azure Teal 300', '#66D7E3'),
  createVariant('Azure Teal 400', '#3CCBDB'),
  createVariant('Azure Teal 500', '#12C0D3'), // Base Azure Teal
  createVariant('Azure Teal 600', '#0E9AA9'),
  createVariant('Azure Teal 700', '#0B747F'),
  createVariant('Azure Teal 800', '#074D54'),
  createVariant('Azure Teal 900', '#04272A'),
];

// Teal Variant 3: Mint Teal (More green-leaning)
export const mintTealPalette: ColorVariant[] = [
  createVariant('Mint Teal 50', '#E8F7F3'),
  createVariant('Mint Teal 100', '#D1F0E7'),
  createVariant('Mint Teal 200', '#A3E0CF'),
  createVariant('Mint Teal 300', '#76D1B7'),
  createVariant('Mint Teal 400', '#48C19F'),
  createVariant('Mint Teal 500', '#1BB287'), // Base Mint Teal
  createVariant('Mint Teal 600', '#158E6C'),
  createVariant('Mint Teal 700', '#106B51'),
  createVariant('Mint Teal 800', '#0A4736'),
  createVariant('Mint Teal 900', '#05241B'),
];

// Teal Variant 4: Deep Teal (Darker, blue-black undertones)
export const deepTealPalette: ColorVariant[] = [
  createVariant('Deep Teal 50', '#E6EFEF'),
  createVariant('Deep Teal 100', '#CCDFDF'),
  createVariant('Deep Teal 200', '#99BFBF'),
  createVariant('Deep Teal 300', '#669F9F'),
  createVariant('Deep Teal 400', '#337F7F'),
  createVariant('Deep Teal 500', '#005F5F'), // Base Deep Teal
  createVariant('Deep Teal 600', '#004C4C'),
  createVariant('Deep Teal 700', '#003939'),
  createVariant('Deep Teal 800', '#002626'),
  createVariant('Deep Teal 900', '#001313'),
];

// =======================================
// Paint Variants - 4 different options
// =======================================

// Paint Variant 1: Royal Paint (Purple-leaning)
export const royalPaintPalette: ColorVariant[] = [
  createVariant('Royal Paint 50', '#F1E9F5'),
  createVariant('Royal Paint 100', '#E3D3EB'),
  createVariant('Royal Paint 200', '#C7A7D7'),
  createVariant('Royal Paint 300', '#AB7BC3'),
  createVariant('Royal Paint 400', '#8F4FAF'),
  createVariant('Royal Paint 500', '#73239B'), // Base Royal Paint
  createVariant('Royal Paint 600', '#5C1C7C'),
  createVariant('Royal Paint 700', '#45155D'),
  createVariant('Royal Paint 800', '#2E0E3E'),
  createVariant('Royal Paint 900', '#17071F'),
];

// Paint Variant 2: Coral Paint (Warm, reddish)
export const coralPaintPalette: ColorVariant[] = [
  createVariant('Coral Paint 50', '#FCEDEA'),
  createVariant('Coral Paint 100', '#F9DAD5'),
  createVariant('Coral Paint 200', '#F4B5AB'),
  createVariant('Coral Paint 300', '#EF9080'),
  createVariant('Coral Paint 400', '#EA6B56'),
  createVariant('Coral Paint 500', '#E5462C'), // Base Coral Paint
  createVariant('Coral Paint 600', '#B73823'),
  createVariant('Coral Paint 700', '#892A1A'),
  createVariant('Coral Paint 800', '#5C1C11'),
  createVariant('Coral Paint 900', '#2E0E09'),
];

// Paint Variant 3: Berry Paint (Cooler, more blue-purple)
export const berryPaintPalette: ColorVariant[] = [
  createVariant('Berry Paint 50', '#F5E6F0'),
  createVariant('Berry Paint 100', '#EBCCE0'),
  createVariant('Berry Paint 200', '#D799C2'),
  createVariant('Berry Paint 300', '#C366A3'),
  createVariant('Berry Paint 400', '#AF3385'),
  createVariant('Berry Paint 500', '#9B0066'), // Base Berry Paint
  createVariant('Berry Paint 600', '#7C0052'),
  createVariant('Berry Paint 700', '#5D003D'),
  createVariant('Berry Paint 800', '#3E0029'),
  createVariant('Berry Paint 900', '#1F0014'),
];

// Paint Variant 4: Slate Paint (Neutral, gray-blue)
export const slatePaintPalette: ColorVariant[] = [
  createVariant('Slate Paint 50', '#EBEEF2'),
  createVariant('Slate Paint 100', '#D7DDE5'),
  createVariant('Slate Paint 200', '#AFBBCB'),
  createVariant('Slate Paint 300', '#8799B1'),
  createVariant('Slate Paint 400', '#5F7797'),
  createVariant('Slate Paint 500', '#37557D'), // Base Slate Paint
  createVariant('Slate Paint 600', '#2C4464'),
  createVariant('Slate Paint 700', '#21334B'),
  createVariant('Slate Paint 800', '#162232'),
  createVariant('Slate Paint 900', '#0B1119'),
];

// Export all exploration palettes
export const colorExplorationPalettes = {
  // Teal variants
  oceanTeal: oceanTealPalette,
  azureTeal: azureTealPalette,
  mintTeal: mintTealPalette,
  deepTeal: deepTealPalette,
  
  // Paint variants
  royalPaint: royalPaintPalette,
  coralPaint: coralPaintPalette,
  berryPaint: berryPaintPalette,
  slatePaint: slatePaintPalette
}; 