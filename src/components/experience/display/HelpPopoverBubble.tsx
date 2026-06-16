/**
 * HelpPopoverBubble
 *
 * React/shadcn migration of the production MUI component
 * (wordly-react-components-lib: src/components/library/display/HelpPopoverBubble.tsx).
 *
 * The original was a tiny presentational container built on MUI `styled` +
 * `Typography` + `Divider`: a padded, column-flex bubble that renders an optional
 * title (with a divider beneath it) above arbitrary children, and flips to
 * right-to-left layout when `rtl` is set. It is the inner content rendered inside
 * a help popover.
 *
 * This port drops MUI/Emotion entirely:
 * - MUI `styled('div')` Root/Children → Tailwind utility classes
 * - MUI `Typography variant="subtitle1"` (title) → semantic heading + Tailwind type
 * - MUI `Divider` → shared `@/components/ui/separator`
 * - RTL direction handled with the native `dir` attribute + text alignment
 *
 * Pure presentation, no data fetching — content arrives via `children`.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface HelpPopoverBubbleProps {
  /** The content displayed inside the help popover bubble. Anything renderable. */
  children?: React.ReactNode;

  /** Optional title shown above the content, followed by a divider. */
  title?: string;

  /** When true, lays the bubble out for right-to-left languages. */
  rtl?: boolean;

  /** Optional extra classes on the root container. */
  className?: string;
}

/**
 * Inner content for a help popover: an optional titled header (with divider)
 * above arbitrary children, with LTR/RTL layout support.
 */
export function HelpPopoverBubble({
  title = "",
  rtl = false,
  children,
  className,
}: HelpPopoverBubbleProps) {
  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={cn(
        "relative flex flex-col px-[15px] pb-[15px] pt-2.5",
        rtl ? "text-right" : "text-left",
        className
      )}
    >
      {title ? (
        <>
          <h6
            data-testid="title"
            className="pb-3.5 text-base font-medium leading-tight text-gray-900"
          >
            {title}
          </h6>
          <Separator data-testid="divider" />
        </>
      ) : null}
      <div className="w-full overflow-auto pt-[5px] text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
}

export default HelpPopoverBubble;
