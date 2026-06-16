/**
 * Toolbar
 *
 * React migration of the production library's
 * `app/meeting/settings/Toolbar.tsx` (MUI 6 + Emotion).
 *
 * The original is a simple layout primitive: a left-aligned `Typography
 * variant="h5"` title, a right-aligned actions slot whose children are spaced
 * apart, and a `<Divider />` underneath. It is rendered at the top of every
 * meeting-settings view.
 *
 * This port replaces:
 *  - MUI emotion-styled Root/Content   → Tailwind flex utilities
 *  - MUI `Typography variant="h5"`     → semantic `<h2>` with token classes
 *  - MUI `Divider`                     → `@/components/ui/separator`
 *
 * The original walked `React.Children.toArray` purely to flatten the children
 * into the spaced content row; here the `gap` utility handles spacing, so the
 * children are rendered directly. Colors map to our tokens (no raw hex).
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface ToolbarProps {
  /**
   * Title to display in the toolbar.
   */
  title?: string;

  /**
   * Actions to render on the right side of the toolbar (icon buttons, menus,
   * etc.). Spaced apart automatically.
   */
  children?: React.ReactNode;

  /**
   * Optional extra classes applied to the toolbar row.
   */
  className?: string;
}

/**
 * Toolbar displayed at the top of every meeting-settings view: a title on the
 * left, action items on the right, and a divider underneath.
 */
export function Toolbar({
  title = "",
  children = null,
  className,
}: ToolbarProps) {
  return (
    <>
      <div
        aria-label={title || undefined}
        className={cn("flex min-h-12 items-center", className)}
      >
        <h2 className="text-xl font-medium text-gray-900">{title}</h2>
        <div className="ml-auto flex items-center gap-2.5">{children}</div>
      </div>
      <Separator />
    </>
  );
}

export default Toolbar;
