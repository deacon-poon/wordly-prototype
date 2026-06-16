import { cva, type VariantProps } from "class-variance-authority";

/**
 * Shared design variants for all wordly-* components.
 *
 * Faithful 1:1 port of the production Angular source of truth:
 *   wordly_portal: libs/components/shared/design-variants/design-variants.ts
 *
 * These variants ensure consistent layout and styling across all form
 * components. The `layout` "default" variant is the responsive
 * label-beside-control grid that the portal uses everywhere; "stacked"
 * forces the vertical column. Variant names/values are kept verbatim so the
 * React FormControlWrapper can drive itself from the same presets the Angular
 * base class feeds through `generateWordlyClasses`.
 */

// Container variants - Context-first approach
export const wordlyContainerVariants = cva(
  // Base classes for all contexts
  "w-full",
  {
    variants: {
      layout: {
        // default: 'flex flex-col gap-4 md:flex-row md:gap-4', // Stay horizontal after tablet, no grid
        default:
          "flex flex-col gap-4 md:flex-row md:gap-4 lg:grid lg:grid-cols-[minmax(200px,_1fr)_2fr] lg:gap-4 xl:grid-cols-[minmax(200px,_1fr)_2fr] 2xl:grid-cols-[minmax(200px,_1fr)_2fr]", // Responsive fallback with stable grid
        dialog: "flex flex-col gap-4", // Always vertical in dialogs
        modal: "flex flex-col gap-3", // Tighter spacing in modals
        card: "flex flex-col gap-2", // Very compact for cards
        sidebar: "flex flex-col gap-2", // Compact for narrow sidebars
        stacked: "flex flex-col gap-4", // Force vertical layout
        compact: "flex flex-col gap-2 sm:w-fit", // Full-width on mobile, fit-content on sm+
        horizontal: "flex flex-row gap-4 items-center", // Force horizontal layout

        grid: "grid grid-cols-[200px_1fr] gap-4", // Force grid layout
      },
    },
    defaultVariants: {
      layout: "default",
    },
  }
);

// Label variants - Context-first approach
export const wordlyLabelVariants = cva(
  // Base classes for all contexts
  "flex items-center gap-2.5 font-roboto font-bold text-sm tracking-wider text-black",
  {
    variants: {
      style: {
        default: "",
        subtle: "font-medium text-gray-700",
        emphasis: "font-extrabold text-black",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      // Context defines the complete sizing and positioning
      context: {
        // default: 'pt-2 w-full md:min-w-[200px] md:max-w-[350px] md:h-7 md:shrink-0', // Responsive fallback
        default:
          "pt-2 w-full md:min-w-[200px] md:max-w-[260px] md:h-7 md:shrink-0", // Responsive fallback
        dialog: "w-full pt-0", // Always full width in dialogs
        modal: "w-full pt-0", // Always full width in modals
        card: "w-full pt-1", // Always full width in cards
        sidebar: "w-full pt-1", // Always full width in sidebars
        stacked: "w-full pt-0", // Always full width when stacked
        horizontal: "min-w-[200px] max-w-[200px] h-7 shrink-0 pt-0", // Fixed width when horizontal
        grid: "min-w-[200px] max-w-[200px] h-7 shrink-0 pt-0", // Fixed width in grid
        inline: "flex-1 pt-0", // Inline: grows to fill row, no fixed width, no shrink
      },
    },
    defaultVariants: {
      style: "default",
      size: "md",
      context: "default",
    },
  }
);

// Content wrapper variants - Context-first approach
export const wordlyContentVariants = cva(
  // Base classes that apply to all contexts
  "w-full",
  {
    variants: {
      spacing: {
        tight: "gap-1",
        normal: "gap-3",
        loose: "gap-5",
      },
      // Context defines the complete layout - these override everything
      context: {
        // default: 'flex flex-col gap-3 md:flex-1 md:min-w-56', // Stay flexible after tablet, no grid
        default:
          "flex flex-col gap-3 md:flex-1 md:min-w-56 lg:col-span-1 xl:col-span-1 2xl:col-span-1", // Responsive fallback - stays in column 1
        defaultNoMin:
          "flex flex-col gap-3 md:flex-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1", // Responsive fallback - stays in column 1
        dialog: "flex flex-col gap-3 flex-1", // Clean stacking in dialogs
        modal: "flex flex-col gap-2 flex-1", // Tighter spacing in modals
        card: "flex flex-col gap-2", // Compact spacing in cards
        sidebar: "flex flex-col gap-2", // Compact for sidebars
        stacked: "flex flex-col gap-3", // Always vertical stacking
        horizontal: "flex flex-col gap-3 flex-1 min-w-56", // Flexible but with min width
        grid: "flex flex-col gap-3 flex-1 min-w-0", // Grid cell behavior
        inline: "flex flex-col gap-3 w-auto flex-none", // Shrinks to content width (e.g. checkbox-only)
      },
    },
    defaultVariants: {
      spacing: "normal",
      context: "default",
    },
  }
);

// Helper text variants - Simple context-aware sizing
export const wordlyHelperTextVariants = cva(
  "flex items-center gap-2.5 w-full font-inter font-normal text-sm text-muted-foreground",
  {
    variants: {
      error: {
        false: "text-muted-foreground",
        true: "text-destructive",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
      },
      context: {
        default: "",
        dialog: "text-sm leading-5",
        modal: "text-sm leading-5",
        card: "text-xs leading-4",
        sidebar: "text-xs leading-4",
        stacked: "text-sm leading-5",
        horizontal: "text-sm leading-5",
        grid: "text-sm leading-5",
      },
    },
    defaultVariants: {
      error: false,
      size: "sm",
      context: "default",
    },
  }
);

// Error message variants - Simple context-aware sizing
export const wordlyErrorVariants = cva(
  "font-inter font-normal text-sm flex items-center gap-2 leading-5 text-destructive",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
      },
      severity: {
        error: "text-destructive",
        warning: "text-yellow-600",
        info: "text-blue-500",
      },
      context: {
        default: "",
        dialog: "text-sm leading-5",
        modal: "text-sm leading-5",
        card: "text-xs leading-4",
        sidebar: "text-xs leading-4",
        stacked: "text-sm leading-5",
        horizontal: "text-sm leading-5",
        grid: "text-sm leading-5",
      },
    },
    defaultVariants: {
      size: "sm",
      severity: "error",
      context: "default",
    },
  }
);

// Extra info variants
export const wordlyExtraInfoVariants = cva(
  [
    "flex items-center gap-2 rounded-lg p-4 w-full border",
    "font-roboto text-sm font-medium text-info-foreground",
  ],
  {
    variants: {
      theme: {
        info: "!border-info-border bg-info text-info-foreground",
        success: "bg-green-50 border-green-100 text-green-700",
        warning: "bg-yellow-50 border-yellow-100 text-yellow-700",
        error: "bg-red-50 border-red-100 text-red-700",
      },
      size: {
        sm: "p-2 text-xs",
        md: "p-4 text-sm",
        lg: "p-6 text-base",
      },
    },
    defaultVariants: {
      theme: "info",
      size: "md",
    },
  }
);

// Export types for components that want to use the variants
export type WordlyContainerVariants = VariantProps<
  typeof wordlyContainerVariants
>;
export type WordlyLabelVariants = VariantProps<typeof wordlyLabelVariants>;
export type WordlyContentVariants = VariantProps<typeof wordlyContentVariants>;
export type WordlyHelperTextVariants = VariantProps<
  typeof wordlyHelperTextVariants
>;
export type WordlyErrorVariants = VariantProps<typeof wordlyErrorVariants>;
export type WordlyExtraInfoVariants = VariantProps<
  typeof wordlyExtraInfoVariants
>;

// Utility function to generate all classes for a component
export interface WordlyDesignVariants {
  // Container variants
  layout?: WordlyContainerVariants["layout"];

  // Label variants
  labelStyle?: WordlyLabelVariants["style"];
  labelSize?: WordlyLabelVariants["size"];
  labelContext?: WordlyLabelVariants["context"];

  // Content variants
  spacing?: WordlyContentVariants["spacing"];
  contentContext?: WordlyContentVariants["context"];

  // Helper text variants
  error?: WordlyHelperTextVariants["error"];
  helperSize?: WordlyHelperTextVariants["size"];
  helperTextContext?: WordlyHelperTextVariants["context"];

  // Error variants
  errorSize?: WordlyErrorVariants["size"];
  severity?: WordlyErrorVariants["severity"];
  errorContext?: WordlyErrorVariants["context"];

  // Extra info variants
  theme?: WordlyExtraInfoVariants["theme"];
  extraInfoSize?: WordlyExtraInfoVariants["size"];
}

export function generateWordlyClasses(
  variants: Partial<WordlyDesignVariants> = {}
) {
  return {
    container: wordlyContainerVariants({ layout: variants.layout }),
    label: wordlyLabelVariants({
      style: variants.labelStyle,
      size: variants.labelSize,
      context: variants.labelContext,
    }),
    content: wordlyContentVariants({
      spacing: variants.spacing,
      context: variants.contentContext,
    }),
    helperText: wordlyHelperTextVariants({
      error: variants.error,
      size: variants.helperSize,
      context: variants.helperTextContext,
    }),
    error: wordlyErrorVariants({
      size: variants.errorSize,
      severity: variants.severity,
      context: variants.errorContext,
    }),
    extraInfo: wordlyExtraInfoVariants({
      theme: variants.theme,
      size: variants.extraInfoSize,
    }),
  };
}
