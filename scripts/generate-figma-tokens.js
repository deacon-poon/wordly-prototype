/**
 * Figma Token Generator
 *
 * This script reads Figma design tokens and generates:
 * 1. CSS custom properties (figma-tokens.css)
 * 2. Tailwind config extension (figma-tailwind.js)
 * 3. Variable mapping for HTML-to-Figma import (figma-variable-map.json)
 *
 * Usage:
 *   node scripts/generate-figma-tokens.js
 *
 * The generated files ensure that:
 * - CSS values exactly match Figma
 * - When importing HTML back to Figma, variables can be detected
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Input: Figma tokens JSON file (absolute path to your Figma exports)
  figmaTokensPath: '/Users/deacon/Documents/Deacon/Design/Wordly/Design system/Variables/wordly-design-tokens-rebrand.json',

  // Output paths
  outputDir: path.resolve(__dirname, '../src/styles/generated'),
  cssOutputFile: 'figma-tokens.css',
  tailwindOutputFile: 'figma-tailwind.js',
  mappingOutputFile: 'figma-variable-map.json',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert Figma RGBA (0-1 range) to hex color
 */
function rgbaToHex(rgba) {
  const r = Math.round(rgba.r * 255);
  const g = Math.round(rgba.g * 255);
  const b = Math.round(rgba.b * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

/**
 * Convert Figma variable name to CSS variable name
 * "primitives/color/action-teal/action-teal-50" → "color-action-teal-50"
 * "semantic/color/text/text-secondary" → "semantic-text-secondary"
 */
function figmaNameToCssVar(name) {
  return name
    // Remove "primitives/" prefix, keep "semantic/"
    .replace(/^primitives\//, '')
    // Convert semantic/color/x/y to semantic-x-y (remove redundant "color")
    .replace(/^semantic\/color\//, 'semantic-')
    // Remove duplicate segments like "action-teal/action-teal-50" → "action-teal-50"
    .replace(/([^\/]+)\/\1-/g, '$1-')
    // Replace slashes with dashes
    .replace(/\//g, '-')
    // Remove spaces (invalid in CSS variable names)
    .replace(/\s+/g, '-')
    // Remove any characters not valid in CSS variable names
    .replace(/[^a-zA-Z0-9-_]/g, '')
    // Clean up any double dashes
    .replace(/--+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert Figma variable name to Tailwind key
 * "primitives/color/action-teal/action-teal-50" → { "action-teal": { "50": "#hex" } }
 */
function figmaNameToTailwindPath(name) {
  const parts = name.split('/');

  // Handle primitives/color/palette/shade format
  if (parts[0] === 'primitives' && parts[1] === 'color') {
    const palette = parts[2]; // e.g., "action-teal"
    const shade = parts[3]?.replace(`${palette}-`, '') || 'DEFAULT'; // e.g., "50"
    return { palette, shade };
  }

  // Handle semantic/color/category/name format
  if (parts[0] === 'semantic' && parts[1] === 'color') {
    const category = parts[2]; // e.g., "text"
    const colorName = parts[3]; // e.g., "text-secondary"
    return { palette: `semantic-${category}`, shade: colorName };
  }

  return null;
}

// ============================================================================
// MAIN GENERATION FUNCTIONS
// ============================================================================

function generateTokens() {
  console.log('🎨 Figma Token Generator\n');

  // Read Figma tokens
  console.log(`📖 Reading Figma tokens from:\n   ${CONFIG.figmaTokensPath}\n`);

  if (!fs.existsSync(CONFIG.figmaTokensPath)) {
    console.error('❌ Figma tokens file not found!');
    console.error('   Please ensure the file exists at the configured path.');
    process.exit(1);
  }

  const figmaData = JSON.parse(fs.readFileSync(CONFIG.figmaTokensPath, 'utf8'));
  const variables = figmaData.variables || [];
  const modeId = Object.keys(figmaData.modes || {})[0] || '801:1';

  console.log(`📊 Found ${variables.length} variables\n`);

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${CONFIG.outputDir}\n`);
  }

  // Process variables
  const cssVariables = [];
  const tailwindColors = {};
  const tailwindSpacing = {};
  const tailwindFontSize = {};
  const variableMap = {
    colors: {},
    spacing: {},
    fontSize: {},
    fontWeight: {},
  };

  // Build a lookup for resolving aliases
  const variableLookup = {};
  for (const v of variables) {
    variableLookup[v.id] = v;
  }

  // Resolve alias to get actual value
  function resolveValue(value, type) {
    if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
      const referenced = variableLookup[value.id];
      if (referenced) {
        const refValue = referenced.valuesByMode?.[modeId];
        return resolveValue(refValue, referenced.type);
      }
    }
    return { value, type };
  }

  for (const variable of variables) {
    const name = variable.name;
    const id = variable.id;
    const type = variable.type;
    const rawValue = variable.valuesByMode?.[modeId];

    // Resolve aliases
    const resolved = resolveValue(rawValue, type);
    const value = resolved.value;
    const resolvedType = resolved.type;

    // Skip if no value
    if (value === undefined || value === null) continue;

    const cssVarName = figmaNameToCssVar(name);

    // Handle different types
    if (resolvedType === 'COLOR' && typeof value === 'object' && 'r' in value) {
      const hex = rgbaToHex(value);

      cssVariables.push({
        name: cssVarName,
        value: hex,
        figmaName: name,
        figmaId: id,
        type: 'color',
      });

      // Add to variable map
      variableMap.colors[hex] = id;
      variableMap.colors[hex.toLowerCase()] = id;

      // Add to Tailwind colors
      const twPath = figmaNameToTailwindPath(name);
      if (twPath) {
        if (!tailwindColors[twPath.palette]) {
          tailwindColors[twPath.palette] = {};
        }
        tailwindColors[twPath.palette][twPath.shade] = hex;
      }
    }
    else if (resolvedType === 'FLOAT' && typeof value === 'number') {
      const pxValue = `${value}px`;

      cssVariables.push({
        name: cssVarName,
        value: pxValue,
        figmaName: name,
        figmaId: id,
        type: 'size',
      });

      // Categorize by name
      if (name.includes('spacing')) {
        variableMap.spacing[pxValue] = id;
        variableMap.spacing[`${value}`] = id;
        const key = name.split('/').pop();
        tailwindSpacing[key] = pxValue;
      }
      else if (name.includes('font/scale')) {
        variableMap.fontSize[pxValue] = id;
        variableMap.fontSize[`${value}`] = id;
        // Extract size name like "250-14" → use "14" as key
        const match = name.match(/(\d+)-(\d+)$/);
        if (match) {
          tailwindFontSize[match[2]] = pxValue;
        }
      }
    }
    else if (resolvedType === 'STRING' && typeof value === 'string') {
      cssVariables.push({
        name: cssVarName,
        value: value,
        figmaName: name,
        figmaId: id,
        type: 'string',
      });

      if (name.includes('font/weight')) {
        const weightName = name.split('/').pop();
        variableMap.fontWeight[value] = id;
        variableMap.fontWeight[weightName] = id;
      }
    }
  }

  // ============================================================================
  // GENERATE CSS FILE
  // ============================================================================

  let cssContent = `/**
 * Figma Design Tokens - Auto-generated
 *
 * DO NOT EDIT THIS FILE DIRECTLY!
 *
 * Generated from: ${path.basename(CONFIG.figmaTokensPath)}
 * Generated at: ${new Date().toISOString()}
 *
 * To regenerate, run: npm run tokens:generate
 */

:root {
`;

  // Group by type for organization
  const colorVars = cssVariables.filter(v => v.type === 'color');
  const sizeVars = cssVariables.filter(v => v.type === 'size');
  const stringVars = cssVariables.filter(v => v.type === 'string');

  cssContent += '  /* ====== COLOR TOKENS ====== */\n';
  for (const v of colorVars) {
    cssContent += `  --${v.name}: ${v.value}; /* ${v.figmaName} */\n`;
  }

  cssContent += '\n  /* ====== SIZE TOKENS ====== */\n';
  for (const v of sizeVars) {
    cssContent += `  --${v.name}: ${v.value}; /* ${v.figmaName} */\n`;
  }

  cssContent += '\n  /* ====== STRING TOKENS ====== */\n';
  for (const v of stringVars) {
    cssContent += `  --${v.name}: ${v.value}; /* ${v.figmaName} */\n`;
  }

  cssContent += '}\n';

  const cssPath = path.join(CONFIG.outputDir, CONFIG.cssOutputFile);
  fs.writeFileSync(cssPath, cssContent);
  console.log(`✅ Generated CSS: ${cssPath}`);
  console.log(`   ${colorVars.length} colors, ${sizeVars.length} sizes, ${stringVars.length} strings\n`);

  // ============================================================================
  // GENERATE TAILWIND CONFIG EXTENSION
  // ============================================================================

  const tailwindContent = `/**
 * Figma Tailwind Extension - Auto-generated
 *
 * DO NOT EDIT THIS FILE DIRECTLY!
 *
 * Usage in tailwind.config.js:
 *   const figmaTokens = require('./src/styles/generated/figma-tailwind.js');
 *   module.exports = {
 *     theme: {
 *       extend: {
 *         colors: figmaTokens.colors,
 *         spacing: figmaTokens.spacing,
 *         fontSize: figmaTokens.fontSize,
 *       }
 *     }
 *   }
 *
 * Generated at: ${new Date().toISOString()}
 */

module.exports = {
  colors: ${JSON.stringify(tailwindColors, null, 4)},
  spacing: ${JSON.stringify(tailwindSpacing, null, 4)},
  fontSize: ${JSON.stringify(tailwindFontSize, null, 4)},
};
`;

  const tailwindPath = path.join(CONFIG.outputDir, CONFIG.tailwindOutputFile);
  fs.writeFileSync(tailwindPath, tailwindContent);
  console.log(`✅ Generated Tailwind config: ${tailwindPath}\n`);

  // ============================================================================
  // GENERATE VARIABLE MAP FOR FIGMA IMPORT
  // ============================================================================

  const mappingContent = {
    _meta: {
      description: 'Mapping of CSS values to Figma Variable IDs for HTML-to-Figma import',
      generatedAt: new Date().toISOString(),
      source: path.basename(CONFIG.figmaTokensPath),
      usage: 'Use this file to configure your HTML-to-Figma import tool to map raw values back to Figma variables',
    },
    ...variableMap,
  };

  const mappingPath = path.join(CONFIG.outputDir, CONFIG.mappingOutputFile);
  fs.writeFileSync(mappingPath, JSON.stringify(mappingContent, null, 2));
  console.log(`✅ Generated variable map: ${mappingPath}`);
  console.log(`   ${Object.keys(variableMap.colors).length / 2} colors mapped`);
  console.log(`   ${Object.keys(variableMap.spacing).length / 2} spacing values mapped`);
  console.log(`   ${Object.keys(variableMap.fontSize).length / 2} font sizes mapped\n`);

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Token generation complete!\n');
  console.log('Next steps:');
  console.log('1. Import the generated CSS in your globals.css:');
  console.log('   @import "./generated/figma-tokens.css";\n');
  console.log('2. (Optional) Use Tailwind extension in tailwind.config.js');
  console.log('3. Use figma-variable-map.json when importing HTML to Figma');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the generator
generateTokens();
