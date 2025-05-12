import { ColorVariant } from "../components/ui/color-palette";
import { brandBlue } from "./color-exploration";

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

// =======================================
// COLOR COMBINATIONS
// =======================================

export interface ColorCombination {
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
// COMBINATION 1: DEEP BLUE & MAGENTA PINK
// =======================================

// Primary: Deep Blue (based on brand blue with teal undertones)
const deepBluePalette: ColorVariant[] = [
  createVariant('Deep Blue 50', '#E6EDFA'),
  createVariant('Deep Blue 100', '#C5D3F0'),
  createVariant('Deep Blue 200', '#9BAEE2'),
  createVariant('Deep Blue 300', '#6C84D3'),
  createVariant('Deep Blue 400', '#4663C5'),
  createVariant('Deep Blue 500', '#1B44BB'), // Base Deep Blue
  createVariant('Deep Blue 600', '#163694'),
  createVariant('Deep Blue 700', '#102970'),
  createVariant('Deep Blue 800', '#0A1B4D'),
  createVariant('Deep Blue 900', '#050E26'),
];

// Secondary: Magenta Pink
const magentaPinkPalette: ColorVariant[] = [
  createVariant('Magenta Pink 50', '#FCE4F3'),
  createVariant('Magenta Pink 100', '#F9C0E3'),
  createVariant('Magenta Pink 200', '#F394CF'),
  createVariant('Magenta Pink 300', '#ED63B9'),
  createVariant('Magenta Pink 400', '#E63BA5'),
  createVariant('Magenta Pink 500', '#D1198F'), // Base Magenta Pink
  createVariant('Magenta Pink 600', '#A81472'),
  createVariant('Magenta Pink 700', '#7E0F56'),
  createVariant('Magenta Pink 800', '#550A39'),
  createVariant('Magenta Pink 900', '#2A051D'),
];

// =======================================
// COMBINATION 2: TEAL AZURE & VIOLET
// =======================================

// Primary: Teal Azure
const tealAzurePalette: ColorVariant[] = [
  createVariant('Teal Azure 50', '#E0F7FB'),
  createVariant('Teal Azure 100', '#B8ECF6'),
  createVariant('Teal Azure 200', '#85DFEF'),
  createVariant('Teal Azure 300', '#4FD1E8'),
  createVariant('Teal Azure 400', '#23C4E1'),
  createVariant('Teal Azure 500', '#0CA8C5'), // Base Teal Azure
  createVariant('Teal Azure 600', '#09869D'),
  createVariant('Teal Azure 700', '#076576'),
  createVariant('Teal Azure 800', '#04434E'),
  createVariant('Teal Azure 900', '#022227'),
];

// Secondary: Violet
const violetPalette: ColorVariant[] = [
  createVariant('Violet 50', '#F3E6FA'),
  createVariant('Violet 100', '#E1C4F2'),
  createVariant('Violet 200', '#CA9CE8'),
  createVariant('Violet 300', '#B36FDD'),
  createVariant('Violet 400', '#9C42D3'),
  createVariant('Violet 500', '#8021C8'), // Base Violet
  createVariant('Violet 600', '#651A9F'),
  createVariant('Violet 700', '#4C1477'),
  createVariant('Violet 800', '#320E4F'),
  createVariant('Violet 900', '#190728'),
];

// =======================================
// COMBINATION 3: OCEAN BLUE & CORAL PINK
// =======================================

// Primary: Ocean Blue
const oceanBluePalette: ColorVariant[] = [
  createVariant('Ocean Blue 50', '#E6F0FA'),
  createVariant('Ocean Blue 100', '#CCDFEF'),
  createVariant('Ocean Blue 200', '#99C0E0'),
  createVariant('Ocean Blue 300', '#66A0D0'),
  createVariant('Ocean Blue 400', '#3381C0'),
  createVariant('Ocean Blue 500', '#0062B0'), // Base Ocean Blue
  createVariant('Ocean Blue 600', '#004E8D'),
  createVariant('Ocean Blue 700', '#003B6A'),
  createVariant('Ocean Blue 800', '#002747'),
  createVariant('Ocean Blue 900', '#001323'),
];

// Secondary: Coral Pink
const coralPinkPalette: ColorVariant[] = [
  createVariant('Coral Pink 50', '#FEEAED'),
  createVariant('Coral Pink 100', '#FCD4DB'),
  createVariant('Coral Pink 200', '#FAACB7'),
  createVariant('Coral Pink 300', '#F78393'),
  createVariant('Coral Pink 400', '#F4596F'),
  createVariant('Coral Pink 500', '#F13050'), // Base Coral Pink
  createVariant('Coral Pink 600', '#C12640'),
  createVariant('Coral Pink 700', '#911D30'),
  createVariant('Coral Pink 800', '#611320'),
  createVariant('Coral Pink 900', '#300A10'),
];

// =======================================
// COMBINATION 4: TEAL GREEN & FUCHSIA
// =======================================

// Primary: Teal Green
const tealGreenPalette: ColorVariant[] = [
  createVariant('Teal Green 50', '#E7F6F2'),
  createVariant('Teal Green 100', '#C6EAE0'),
  createVariant('Teal Green 200', '#A1DBCB'),
  createVariant('Teal Green 300', '#72C9B2'),
  createVariant('Teal Green 400', '#4BB99B'),
  createVariant('Teal Green 500', '#18A884'), // Base Teal Green
  createVariant('Teal Green 600', '#13866A'),
  createVariant('Teal Green 700', '#0E654F'),
  createVariant('Teal Green 800', '#094335'),
  createVariant('Teal Green 900', '#04221A'),
];

// Secondary: Fuchsia
const fuchsiaPalette: ColorVariant[] = [
  createVariant('Fuchsia 50', '#FBE4F2'),
  createVariant('Fuchsia 100', '#F7C9E5'),
  createVariant('Fuchsia 200', '#F194CB'),
  createVariant('Fuchsia 300', '#EB5FB1'),
  createVariant('Fuchsia 400', '#E52A97'),
  createVariant('Fuchsia 500', '#C41281'), // Base Fuchsia
  createVariant('Fuchsia 600', '#9D0E67'),
  createVariant('Fuchsia 700', '#750A4D'),
  createVariant('Fuchsia 800', '#4E0733'),
  createVariant('Fuchsia 900', '#27031A'),
];

// Create all color combinations with contrast information
export const colorCombinations: ColorCombination[] = [
  {
    name: "Deep Blue & Magenta Pink",
    description: "A bold, professional combination with a deep blue primary and vibrant magenta pink accent",
    primary: deepBluePalette,
    secondary: magentaPinkPalette,
    contrast: {
      primarySecondary: calculateColorContrast(deepBluePalette[5].value, magentaPinkPalette[5].value),
      onLight: deepBluePalette[5].contrast?.black || 0,
      onDark: deepBluePalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: checkWCAG(calculateColorContrast(deepBluePalette[5].value, magentaPinkPalette[5].value)),
      onLight: checkWCAG(deepBluePalette[5].contrast?.black || 0),
      onDark: checkWCAG(deepBluePalette[5].contrast?.white || 0),
    }
  },
  {
    name: "Teal Azure & Violet",
    description: "A fresh, modern combination with a bright teal azure primary and rich violet accent",
    primary: tealAzurePalette,
    secondary: violetPalette,
    contrast: {
      primarySecondary: calculateColorContrast(tealAzurePalette[5].value, violetPalette[5].value),
      onLight: tealAzurePalette[5].contrast?.black || 0,
      onDark: tealAzurePalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: checkWCAG(calculateColorContrast(tealAzurePalette[5].value, violetPalette[5].value)),
      onLight: checkWCAG(tealAzurePalette[5].contrast?.black || 0),
      onDark: checkWCAG(tealAzurePalette[5].contrast?.white || 0),
    }
  },
  {
    name: "Ocean Blue & Coral Pink",
    description: "A calming yet energetic combination with a deep ocean blue primary and warm coral pink accent",
    primary: oceanBluePalette,
    secondary: coralPinkPalette,
    contrast: {
      primarySecondary: calculateColorContrast(oceanBluePalette[5].value, coralPinkPalette[5].value),
      onLight: oceanBluePalette[5].contrast?.black || 0,
      onDark: oceanBluePalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: checkWCAG(calculateColorContrast(oceanBluePalette[5].value, coralPinkPalette[5].value)),
      onLight: checkWCAG(oceanBluePalette[5].contrast?.black || 0),
      onDark: checkWCAG(oceanBluePalette[5].contrast?.white || 0),
    }
  },
  {
    name: "Teal Green & Fuchsia",
    description: "A natural yet vibrant combination with a rich teal green primary and bold fuchsia accent",
    primary: tealGreenPalette,
    secondary: fuchsiaPalette,
    contrast: {
      primarySecondary: calculateColorContrast(tealGreenPalette[5].value, fuchsiaPalette[5].value),
      onLight: tealGreenPalette[5].contrast?.black || 0,
      onDark: tealGreenPalette[5].contrast?.white || 0,
    },
    wcag: {
      primarySecondary: checkWCAG(calculateColorContrast(tealGreenPalette[5].value, fuchsiaPalette[5].value)),
      onLight: checkWCAG(tealGreenPalette[5].contrast?.black || 0),
      onDark: checkWCAG(tealGreenPalette[5].contrast?.white || 0),
    }
  }
]; 