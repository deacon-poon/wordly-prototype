/**
 * One-shot script to merge dark-mode values into the Figma tokens JSON.
 * Reads the Figma-exported light-only JSON + the dark values dump,
 * writes a merged JSON with both Light (801:1) and Dark (3336:0) modes.
 */
const fs = require('fs');
const path = require('path');

const SOURCE = '/Users/deacon/Documents/Deacon/Design/Wordly/Design system/Variables/wordly-design-tokens-rebrand.json';
const DARK = path.resolve(__dirname, '_dark-mode-values.json');

const src = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const dark = JSON.parse(fs.readFileSync(DARK, 'utf8'));

// Backup
const backup = SOURCE.replace('.json', `.backup-${Date.now()}.json`);
fs.writeFileSync(backup, fs.readFileSync(SOURCE));
console.log(`📦 Backup saved: ${backup}`);

// Add Dark mode
src.modes = { ...src.modes, '3336:0': 'Dark' };

// Merge dark values into each variable
let merged = 0;
let missingDark = 0;
for (const v of src.variables) {
  const d = dark[v.id];
  if (!d) {
    missingDark++;
    // Mirror light value to dark for safety
    v.valuesByMode['3336:0'] = v.valuesByMode['801:1'];
    continue;
  }
  if (d.alias) {
    v.valuesByMode['3336:0'] = { type: 'VARIABLE_ALIAS', id: d.alias };
  } else if (d.rgba) {
    v.valuesByMode['3336:0'] = { r: d.rgba[0], g: d.rgba[1], b: d.rgba[2], a: d.rgba[3] };
  }
  merged++;
}

// Add new text/on-primary token if missing from source
const hasOnPrimary = src.variables.some(v => v.id === 'VariableID:3454:2');
if (!hasOnPrimary) {
  src.variables.push({
    id: 'VariableID:3454:2',
    name: 'semantic/color/text/on-primary',
    description: 'Text color for placement on primary/blue/dark backgrounds. Stays pure white in both Light and Dark modes.',
    type: 'COLOR',
    valuesByMode: {
      '801:1': { type: 'VARIABLE_ALIAS', id: 'VariableID:767:81' },
      '3336:0': { type: 'VARIABLE_ALIAS', id: 'VariableID:767:81' },
    },
    scopes: ['TEXT_FILL', 'SHAPE_FILL'],
    hiddenFromPublishing: false,
    codeSyntax: {},
  });
  src.variableIds.push('VariableID:3454:2');
  console.log('✨ Added semantic/color/text/on-primary');
}

// Also add dark-surface primitives if not present (they exist in Figma as VariableID:3377:*)
const darkSurfaceIds = ['VariableID:3377:2','VariableID:3377:3','VariableID:3377:4','VariableID:3377:5','VariableID:3377:6','VariableID:3377:7','VariableID:3377:8','VariableID:3377:9','VariableID:3377:10','VariableID:3377:11','VariableID:3377:12'];
const darkSurfaceNames = {
  'VariableID:3377:2': 'primitives/color/dark-surface/base',
  'VariableID:3377:3': 'primitives/color/dark-surface/elevated-1',
  'VariableID:3377:4': 'primitives/color/dark-surface/elevated-2',
  'VariableID:3377:5': 'primitives/color/dark-surface/elevated-3',
  'VariableID:3377:6': 'primitives/color/dark-surface/elevated-4',
  'VariableID:3377:7': 'primitives/color/gray/gray-25',
  'VariableID:3377:8': 'primitives/color/dark-overlay/border',
  'VariableID:3377:9': 'primitives/color/dark-overlay/divider',
  'VariableID:3377:10': 'primitives/color/dark-overlay/focus-brand',
  'VariableID:3377:11': 'primitives/color/transparent',
  'VariableID:3377:12': 'primitives/color/gray/gray-150',
};
for (const id of darkSurfaceIds) {
  if (src.variables.some(v => v.id === id)) continue;
  const d = dark[id];
  if (!d || !d.rgba) continue;
  src.variables.push({
    id, name: darkSurfaceNames[id] || `primitives/unknown/${id}`,
    description: '',
    type: 'COLOR',
    valuesByMode: {
      '801:1': { r: d.rgba[0], g: d.rgba[1], b: d.rgba[2], a: d.rgba[3] },
      '3336:0': { r: d.rgba[0], g: d.rgba[1], b: d.rgba[2], a: d.rgba[3] },
    },
    scopes: ['ALL_SCOPES'],
    hiddenFromPublishing: false,
    codeSyntax: {},
  });
  src.variableIds.push(id);
}

fs.writeFileSync(SOURCE, JSON.stringify(src, null, 0));
console.log(`✅ Merged ${merged} variables with dark-mode values`);
if (missingDark) console.log(`⚠  ${missingDark} variables had no dark value (mirrored light → dark)`);
console.log(`📝 Saved: ${SOURCE}`);
console.log(`   Total modes now: ${Object.keys(src.modes).join(', ')}`);
console.log(`   Total variables now: ${src.variables.length}`);
