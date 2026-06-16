"use client";

/**
 * Accordion
 *
 * Port of the wordly-react-components-lib `Accordion` (MUI 6 + Emotion `styled`)
 * onto this repo's shadcn/Tailwind foundation. The original is a single
 * collapsible section (summary row + revealed content) with controlled and
 * uncontrolled modes, customizable summary/icon styling, an optional divider
 * between summary and content, and configurable content padding.
 *
 * Migration notes:
 * - MUI `Accordion`/`AccordionSummary`/`AccordionDetails` + Emotion styled
 *   helpers are folded into plain elements + Tailwind utilities here. There is
 *   no Radix dependency: the source is a single-section toggle, so a button +
 *   region is a closer 1:1 than the multi-item `@/components/ui/accordion`.
 * - The expand affordance swapped MUI's KeyboardArrowDown/Up for lucide
 *   ChevronDown/ChevronUp (the source literally swaps the icon rather than
 *   rotating it, so we do the same).
 * - Theme mapping: the lib's `theme.palette.primary.main` (Brand Blue) → our
 *   `primary` token (border-primary / text-primary). The default divider color
 *   (`theme.palette.background.variant`, a light gray) → `border-gray-200`.
 *   Summary text → `text-gray-900`. No raw hex.
 * - `summaryStyles`/`iconStyles`/`dividerColor`/`contentPadding` accept free
 *   values in the source (CSS strings, hex). We keep that escape hatch via
 *   inline `style`, but every default is a token-based Tailwind class.
 *
 * Data is driven by props; the demo defaults are inline mocks (in production
 * the summary/content would be composed by the consuming feature).
 */

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AccordionSummaryStyles {
  /** Padding for the summary row (CSS value). Default: none. */
  padding?: number | string;
  /** Font size for the summary text (CSS value). */
  fontSize?: number | string;
  /** Font weight for the summary text. Default: "bold". */
  fontWeight?: "normal" | "bold" | "lighter" | "bolder" | number;
  /**
   * Typography variant for the summary text. Mirrors the lib's MUI Typography
   * variant prop; mapped to a matching Tailwind type scale here.
   */
  variant?:
    | "body1"
    | "body2"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2";
  /** Color for the summary text (CSS value). Default: gray-900 token. */
  color?: string;
}

// Mirrors MUI's Typography variant scale onto Tailwind type utilities.
const VARIANT_CLASS: Record<
  NonNullable<AccordionSummaryStyles["variant"]>,
  string
> = {
  h1: "text-5xl",
  h2: "text-4xl",
  h3: "text-3xl",
  h4: "text-2xl",
  h5: "text-xl",
  h6: "text-lg",
  subtitle1: "text-base",
  subtitle2: "text-sm font-medium",
  body1: "text-base",
  body2: "text-sm",
};

export interface AccordionIconStyles {
  /** Size for the expand/collapse icon (CSS value). Default: 1rem. */
  size?: number | string;
  /** Color for the icon (CSS value). Default: the `primary` (Brand Blue) token. */
  color?: string;
}

export interface AccordionProps {
  /** Summary row content, shown whether open or closed. */
  summaryText: React.ReactNode;
  /** Content revealed when expanded. */
  children: React.ReactNode;
  /** Controlled expanded state. When set, the component is controlled. */
  expanded?: boolean;
  /** Initial expanded state for uncontrolled mode. Default: false. */
  defaultExpanded?: boolean;
  /** Styles for the summary row. */
  summaryStyles?: AccordionSummaryStyles;
  /** Styles for the expand/collapse icon. */
  iconStyles?: AccordionIconStyles;
  /** Show a divider between the summary and content when expanded. */
  showDivider?: boolean;
  /** Divider color (CSS value). Default: gray-200 token. */
  dividerColor?: string;
  /** Padding for the content area (CSS value). Default: 1rem vertical. */
  contentPadding?: number | string;
  /** Fired when the expand/collapse state changes. */
  onChange?: (expanded: boolean) => void;
  /** Extra classes for the root element. */
  className?: string;
}

const toCss = (v?: number | string): string | undefined =>
  typeof v === "number" ? `${v}px` : v;

export function Accordion({
  summaryText,
  children,
  expanded: controlledExpanded,
  defaultExpanded = false,
  summaryStyles = { fontWeight: "bold" },
  iconStyles = {},
  showDivider = false,
  dividerColor,
  contentPadding = "16px 0 16px 0",
  onChange,
  className,
}: AccordionProps) {
  const reactId = React.useId();
  const contentId = `accordion-content-${reactId}`;
  const triggerId = `accordion-trigger-${reactId}`;

  const [internalExpanded, setInternalExpanded] =
    React.useState(defaultExpanded);
  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const next = !expanded;
    if (!isControlled) setInternalExpanded(next);
    onChange?.(next);
  };

  // Icon defaults to the Brand Blue `primary` token; an explicit color overrides.
  const iconColorClass = iconStyles.color ? undefined : "text-primary";
  const iconSize = toCss(iconStyles.size);
  const ChevronIcon = expanded ? ChevronUp : ChevronDown;

  const dividerActive = showDivider && expanded;

  return (
    <div
      className={cn(
        // The source shows a brand-colored top border on mobile only; we keep
        // the brand accent but as a subtle full-width top rule.
        "border-t-2 border-primary md:border-t-0",
        className
      )}
    >
      <h3 className="m-0">
        <button
          id={triggerId}
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={handleToggle}
          className={cn(
            "flex w-full items-center justify-between gap-2 bg-transparent text-left outline-none",
            "transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            dividerActive && "border-b border-gray-200"
          )}
          style={{
            padding: toCss(summaryStyles.padding) ?? 0,
            ...(dividerActive && dividerColor
              ? { borderBottomColor: dividerColor }
              : {}),
          }}
        >
          <span
            className={cn(
              "py-3 text-gray-900",
              summaryStyles.variant && VARIANT_CLASS[summaryStyles.variant],
              !summaryStyles.color && "text-gray-900"
            )}
            style={{
              fontSize: toCss(summaryStyles.fontSize),
              fontWeight: summaryStyles.fontWeight ?? "bold",
              color: summaryStyles.color,
            }}
          >
            {summaryText}
          </span>
          <ChevronIcon
            aria-hidden="true"
            className={cn("h-4 w-4 shrink-0", iconColorClass)}
            style={{
              color: iconStyles.color,
              width: iconSize,
              height: iconSize,
            }}
          />
        </button>
      </h3>

      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!expanded}
        className="overflow-hidden text-sm text-gray-700"
        style={{ padding: expanded ? toCss(contentPadding) : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
