"use client";

/**
 * LoadMore
 *
 * React migration of the production Angular `app-wordly-load-more`
 * (wordly_portal: libs/components/core/load-more).
 *
 * Renders a "Show More" button plus a "Showing X of Y" caption for paginated
 * lists. The Angular original derives its labels (remaining count, next batch
 * size, has-more visibility) from `count`/`limit`/`loadedCount` inputs and emits
 * a `showMore` event. We keep that same public surface, drop the i18next/ng-icons
 * DI layer, and reuse the shared shadcn Button + lucide-react icons.
 *
 * When there is nothing more to load (`hasMore === false`) the component renders
 * nothing, matching the Angular host `[style.display]` behavior.
 */

import * as React from "react";
import { ChevronDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface LoadMoreProps {
  /** Total number of items available across all pages. */
  count: number;
  /** Number of items fetched per "Show More" click. */
  limit: number;
  /** How many items are currently loaded. */
  loadedCount: number;
  /** Lowercase noun for the items (e.g. "sessions"). Capitalized in copy. */
  entityLabel?: string;
  /** Show the spinner and disable the button while the next batch loads. */
  loading?: boolean;
  /** Fired when the user clicks "Show More". */
  onShowMore?: () => void;
  className?: string;
}

function capitalize(label: string) {
  if (!label) return "";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function LoadMore({
  count,
  limit,
  loadedCount,
  entityLabel = "",
  loading = false,
  onShowMore,
  className,
}: LoadMoreProps) {
  const remaining = Math.max(count - loadedCount, 0);
  const hasMore = remaining > 0;
  const nextBatch = Math.min(limit, remaining);

  // Matches the Angular host display:none — render nothing when fully loaded.
  if (!hasMore) return null;

  const entity = capitalize(entityLabel);

  const showMoreText = entity
    ? `Show More ${entity} (${nextBatch} of ${remaining} remaining)`
    : `Show More (${nextBatch} of ${remaining} remaining)`;

  const showingText = entityLabel
    ? `Showing ${loadedCount} of ${count} ${entityLabel}`
    : `Showing ${loadedCount} of ${count}`;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 pt-2",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        // Portal anatomy (wordly-button .variant-outline.size-sm): font-family
        // Roboto, min-h 36px, padding 8px 12px, radius 6px, font 14px/20px
        // weight 500, gap 8px, white bg, gray-800 text, 1px gray-200 border.
        // Hover/active use the portal's Teal ramp — remapped here to OUR Brand
        // Blue primary (primary-blue-50 / primary-blue-100). Loading dims to
        // 0.7 opacity with a wait cursor; disabled drops to 0.5 (Button base).
        className={cn(
          "min-h-9 gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium leading-5 text-gray-800",
          "hover:border-gray-200 hover:bg-primary-blue-50 hover:text-gray-800",
          "active:bg-primary-blue-100",
          loading && "cursor-wait opacity-70"
        )}
        disabled={loading}
        aria-busy={loading}
        onClick={() => onShowMore?.()}
      >
        {/* Portal load-more wraps the icon in <span class="mr-1.5 inline-flex">
            with a size="xs" (14px) icon. The loading spinner swaps in
            (lucideLoader → Loader2) matching the proxied wordly-button. */}
        <span className="mr-1.5 inline-flex">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
        {showMoreText}
      </Button>
      <span className="text-xs text-muted-foreground">{showingText}</span>
    </div>
  );
}
