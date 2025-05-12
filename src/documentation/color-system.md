# Wordly Design System: Color Palette

This document outlines the color system for the Wordly design system. The color palette is designed to be accessible, consistent, and flexible for all UI needs.

## Color Palette Structure

The Wordly color system is organized into the following categories:

### Brand Colors

- **Teal**: Primary brand color used for UI elements, buttons, and links
- **Pink**: Secondary brand color used for accents and highlights

### Semantic Colors

- **Green**: Used for affirmative actions, success states, and approvals
- **Red**: Used for destructive actions, errors, and warnings

### UI Colors

- **Gray**: Used for UI elements, backgrounds, borders, and text

## Color Scales

Each color in our system has 10 shades, ranging from 50 (lightest) to 900 (darkest):

- **50**: Lightest shade, typically used for subtle backgrounds
- **100**: Very light shade, used for hover states on light backgrounds
- **200**: Light shade
- **300**: Medium-light shade
- **400**: Medium shade
- **500**: Base color (the primary brand color)
- **600**: Medium-dark shade
- **700**: Dark shade
- **800**: Very dark shade
- **900**: Darkest shade, typically used for text or deep accents

## WCAG Compliance

Our color system is designed with accessibility in mind. Each color is tested for contrast against both white and black backgrounds to ensure compliance with the Web Content Accessibility Guidelines (WCAG):

- **AA**: Requires a contrast ratio of at least 4.5:1 for normal text
- **AAA**: Requires a contrast ratio of at least 7:1 for normal text

## Color Values

### Teal Palette

| Name     | Hex     | WCAG AA | WCAG AAA |
| -------- | ------- | ------- | -------- |
| teal-50  | #E6F4F7 | ❌      | ❌       |
| teal-100 | #C5E8EE | ❌      | ❌       |
| teal-200 | #9ED2DC | ❌      | ❌       |
| teal-300 | #5CB9CA | ❌      | ❌       |
| teal-400 | #30A3B7 | ❌      | ❌       |
| teal-500 | #118197 | ✅      | ❌       |
| teal-600 | #0C687A | ✅      | ❌       |
| teal-700 | #08505D | ✅      | ✅       |
| teal-800 | #063840 | ✅      | ✅       |
| teal-900 | #021F24 | ✅      | ✅       |

### Pink Palette

| Name     | Hex     | WCAG AA | WCAG AAA |
| -------- | ------- | ------- | -------- |
| pink-50  | #FCE6F1 | ❌      | ❌       |
| pink-100 | #F9BFD9 | ❌      | ❌       |
| pink-200 | #F693C1 | ❌      | ❌       |
| pink-300 | #F367A9 | ❌      | ❌       |
| pink-400 | #F13B91 | ❌      | ❌       |
| pink-500 | #E0007B | ✅      | ❌       |
| pink-600 | #B30062 | ✅      | ❌       |
| pink-700 | #85004A | ✅      | ❌       |
| pink-800 | #570031 | ✅      | ✅       |
| pink-900 | #290019 | ✅      | ✅       |

### Green Palette

| Name      | Hex     | WCAG AA | WCAG AAA |
| --------- | ------- | ------- | -------- |
| green-50  | #E6F6EC | ❌      | ❌       |
| green-100 | #C5E8D2 | ❌      | ❌       |
| green-200 | #9CD7B0 | ❌      | ❌       |
| green-300 | #66C188 | ❌      | ❌       |
| green-400 | #34AD67 | ❌      | ❌       |
| green-500 | #0C9A4E | ✅      | ❌       |
| green-600 | #0A7B3F | ✅      | ❌       |
| green-700 | #085D2F | ✅      | ✅       |
| green-800 | #053E20 | ✅      | ✅       |
| green-900 | #021F10 | ✅      | ✅       |

### Red Palette

| Name    | Hex     | WCAG AA | WCAG AAA |
| ------- | ------- | ------- | -------- |
| red-50  | #FCEBEA | ❌      | ❌       |
| red-100 | #F9CFCC | ❌      | ❌       |
| red-200 | #F5A8A2 | ❌      | ❌       |
| red-300 | #F07870 | ❌      | ❌       |
| red-400 | #EA4F45 | ❌      | ❌       |
| red-500 | #E62D21 | ✅      | ❌       |
| red-600 | #B8221A | ✅      | ❌       |
| red-700 | #8A1A13 | ✅      | ✅       |
| red-800 | #5C110D | ✅      | ✅       |
| red-900 | #2E0906 | ✅      | ✅       |

### Gray Palette

| Name     | Hex     | WCAG AA | WCAG AAA |
| -------- | ------- | ------- | -------- |
| gray-50  | #F8F9FA | ❌      | ❌       |
| gray-100 | #EEF0F2 | ❌      | ❌       |
| gray-200 | #E3E6E8 | ❌      | ❌       |
| gray-300 | #CDD2D7 | ❌      | ❌       |
| gray-400 | #9BA3AB | ❌      | ❌       |
| gray-500 | #646E78 | ✅      | ❌       |
| gray-600 | #495057 | ✅      | ✅       |
| gray-700 | #343A40 | ✅      | ✅       |
| gray-800 | #212529 | ✅      | ✅       |
| gray-900 | #121416 | ✅      | ✅       |

## Usage Guidelines

### Brand Colors

- Use **teal-500** (#118197) as the primary action color for buttons, links, and interactive elements
- Use **pink-500** (#E0007B) for secondary actions, highlights, or to create visual interest
- For text on dark backgrounds, use lighter shades (50-300)
- For text on light backgrounds, use darker shades (600-900)

### Semantic Colors

- Use **green-500** (#0C9A4E) for success messages, confirmations, and positive indicators
- Use **red-500** (#E62D21) for error messages, destructive actions, and warnings
- Avoid using semantic colors for non-semantic purposes to maintain clear communication

### UI Colors

- Use **gray-50** to **gray-200** for backgrounds
- Use **gray-300** to **gray-400** for borders and dividers
- Use **gray-500** to **gray-700** for secondary text
- Use **gray-800** to **gray-900** for primary text

## Implementing the Color System

To use the color palette in your components, import the color values from our library:

```typescript
import {
  tealPalette,
  pinkPalette,
  greenPalette,
  redPalette,
  grayPalette,
} from "@/lib/colors";
```

For Tailwind CSS, our colors are mapped to the following variables:

```css
--brand-teal: #118197;
--brand-pink: #e0007b;
```

## Storybook Documentation

For a visual reference of our color system, run the Storybook documentation:

```bash
npm run storybook
```

And navigate to the "Atoms/Colors" section.

## Accessibility Best Practices

- Always ensure text has sufficient contrast with its background (minimum WCAG AA compliance)
- Use darker shades (500-900) for text on light backgrounds
- Use lighter shades (50-300) for text on dark backgrounds
- Test your color combinations with accessibility tools
- Never rely on color alone to convey information

## Extending the Color System

When creating new colors or variants:

1. Follow the same structure of 10 shades (50-900)
2. Calculate contrast ratios against white and black backgrounds
3. Verify WCAG compliance
4. Document the new colors in Storybook and this guide
