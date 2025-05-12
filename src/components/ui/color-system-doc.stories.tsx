import type { Meta, StoryObj } from "@storybook/react";
import { ColorSystemDoc } from "./color-system-doc";
import { ColorPalette } from "./color-palette";
import { colorCombinations } from "../../lib/color-combinations";
import {
  oceanTealPalette,
  azureTealPalette,
  mintTealPalette,
  deepTealPalette,
  royalPaintPalette,
  coralPaintPalette,
  berryPaintPalette,
  slatePaintPalette,
  brandBlue,
} from "../../lib/color-exploration";

/**
 * Consolidated color system documentation that combines all color explorations,
 * combinations, and accessibility information into a single, comprehensive view.
 */
const meta: Meta<typeof ColorSystemDoc> = {
  title: "Design System/Colors",
  component: ColorSystemDoc,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColorSystemDoc>;

/**
 * The main color system documentation with a tabbed interface for all color-related
 * information. This provides a single source of truth for our color system.
 */
export const ColorSystemOverview: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "The comprehensive color system documentation with all color-related information organized in tabs. This is the single source of truth for color information.",
      },
    },
  },
};

// Include key individual color stories for direct reference
type ColorPaletteStory = StoryObj<typeof ColorPalette>;

/**
 * The brand colors provide the foundation for our color system.
 */
export const BrandColors: ColorPaletteStory = {
  args: {
    title: "Brand Colors",
    description:
      "The primary brand colors that define Wordly's visual identity.",
    colors: [
      {
        name: "Brand Blue",
        value: brandBlue,
        textColor: "text-white",
      },
      {
        name: "Teal 500",
        value: oceanTealPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Pink 500",
        value: colorCombinations[0].secondary[5].value,
        textColor: "text-white",
      },
    ],
  },
};

/**
 * Primary and secondary color combinations for the Wordly brand.
 */
export const ColorCombinations: ColorPaletteStory = {
  args: {
    title: "Color Combinations",
    description:
      "Four primary/secondary color combinations for the Wordly brand.",
    colors: colorCombinations.map((combo) => ({
      name: combo.name,
      value: combo.primary[5].value,
      textColor: "text-white",
    })),
  },
};

/**
 * Teal exploration variants based on the brand blue.
 */
export const TealVariants: ColorPaletteStory = {
  args: {
    title: "Teal Variants",
    description: "Different teal variations derived from the brand blue.",
    colors: [
      {
        name: "Ocean Teal 500",
        value: oceanTealPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Azure Teal 500",
        value: azureTealPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Mint Teal 500",
        value: mintTealPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Deep Teal 500",
        value: deepTealPalette[5].value,
        textColor: "text-white",
      },
    ],
  },
};

/**
 * Pink exploration variants based on the brand blue.
 */
export const PinkVariants: ColorPaletteStory = {
  args: {
    title: "Pink Variants",
    description: "Different pink variations derived from the brand blue.",
    colors: [
      {
        name: "Royal Paint 500",
        value: royalPaintPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Coral Paint 500",
        value: coralPaintPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Berry Paint 500",
        value: berryPaintPalette[5].value,
        textColor: "text-white",
      },
      {
        name: "Slate Paint 500",
        value: slatePaintPalette[5].value,
        textColor: "text-white",
      },
    ],
  },
};
