/**
 * Adds missing semantic tokens (surface/*, input/*, divider, card/*) that were
 * created in Figma after the original JSON export.
 */
const fs = require('fs');
const path = require('path');

const SOURCE = '/Users/deacon/Documents/Deacon/Design/Wordly/Design system/Variables/wordly-design-tokens-rebrand.json';
const DARK = path.resolve(__dirname, '_dark-mode-values.json');

const src = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const dark = JSON.parse(fs.readFileSync(DARK, 'utf8'));

// Missing semantic tokens to add
const newTokens = [
  { id: 'VariableID:3341:2',  name: 'semantic/color/surface/base',       light: 'VariableID:767:81' /* white */,       dark: 'VariableID:3377:2' /* dark-surface/base */ },
  { id: 'VariableID:3341:3',  name: 'semantic/color/surface/elevated-1', light: 'VariableID:721:89' /* gray-50 */,     dark: 'VariableID:3377:3' },
  { id: 'VariableID:3341:4',  name: 'semantic/color/surface/elevated-2', light: 'VariableID:721:89' /* gray-50 */,     dark: 'VariableID:3377:4' },
  { id: 'VariableID:3341:5',  name: 'semantic/color/surface/elevated-3', light: 'VariableID:721:90' /* gray-100 */,    dark: 'VariableID:3377:5' },
  { id: 'VariableID:3341:6',  name: 'semantic/color/surface/elevated-4', light: 'VariableID:721:91' /* gray-200 */,    dark: 'VariableID:3377:6' },
  { id: 'VariableID:3341:7',  name: 'semantic/color/input/background',   light: 'VariableID:767:81' /* white */,       dark: 'VariableID:3377:4' },
  { id: 'VariableID:3341:8',  name: 'semantic/color/input/border',       light: 'VariableID:3377:12' /* gray-150 */,   dark: 'VariableID:721:93' /* gray-400 */ },
  { id: 'VariableID:3341:9',  name: 'semantic/color/divider',            light: 'VariableID:721:90' /* gray-100 */,    dark: 'VariableID:721:96' /* gray-700 */ },
  { id: 'VariableID:3341:10', name: 'semantic/color/card/background',    light: 'VariableID:767:81' /* white */,       dark: 'VariableID:3377:3' },
];

// Ensure each referenced primitive exists in the JSON
function ensurePrimitive(id, name, lightRgba, darkRgba) {
  if (src.variables.some(v => v.id === id)) return;
  src.variables.push({
    id, name, description: '', type: 'COLOR',
    valuesByMode: {
      '801:1': { r: lightRgba[0], g: lightRgba[1], b: lightRgba[2], a: lightRgba[3] },
      '3336:0': { r: darkRgba[0], g: darkRgba[1], b: darkRgba[2], a: darkRgba[3] },
    },
    scopes: ['ALL_SCOPES'], hiddenFromPublishing: false, codeSyntax: {},
  });
  src.variableIds.push(id);
  console.log(`✨ Added primitive: ${name}`);
}

// Add dark-surface primitives if missing
const darkSurfacePrims = {
  'VariableID:3377:2':  { name: 'primitives/color/dark-surface/base',       dark: dark['VariableID:3377:2'].rgba },
  'VariableID:3377:3':  { name: 'primitives/color/dark-surface/elevated-1', dark: dark['VariableID:3377:3'].rgba },
  'VariableID:3377:4':  { name: 'primitives/color/dark-surface/elevated-2', dark: dark['VariableID:3377:4'].rgba },
  'VariableID:3377:5':  { name: 'primitives/color/dark-surface/elevated-3', dark: dark['VariableID:3377:5'].rgba },
  'VariableID:3377:6':  { name: 'primitives/color/dark-surface/elevated-4', dark: dark['VariableID:3377:6'].rgba },
  'VariableID:3377:7':  { name: 'primitives/color/gray/gray-25',            dark: dark['VariableID:3377:7'].rgba },
  'VariableID:3377:12': { name: 'primitives/color/gray/gray-150',           dark: dark['VariableID:3377:12'].rgba },
};
for (const [id, info] of Object.entries(darkSurfacePrims)) {
  // For dark-surface primitives, light value is same as dark (they represent dark-only colors)
  // For gray-25/gray-150, they're neutral grays with same value in both modes
  ensurePrimitive(id, info.name, info.dark, info.dark);
}

// Add missing semantic tokens
let addedCount = 0;
for (const t of newTokens) {
  if (src.variables.some(v => v.id === t.id)) continue;
  src.variables.push({
    id: t.id, name: t.name, description: '', type: 'COLOR',
    valuesByMode: {
      '801:1': { type: 'VARIABLE_ALIAS', id: t.light },
      '3336:0': { type: 'VARIABLE_ALIAS', id: t.dark },
    },
    scopes: ['ALL_SCOPES'], hiddenFromPublishing: false, codeSyntax: {},
  });
  src.variableIds.push(t.id);
  addedCount++;
  console.log(`✨ Added semantic: ${t.name}`);
}

fs.writeFileSync(SOURCE, JSON.stringify(src, null, 0));
console.log(`\n✅ Added ${addedCount} semantic tokens`);
console.log(`   Total variables: ${src.variables.length}`);
