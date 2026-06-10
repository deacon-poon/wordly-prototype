"use client";

/**
 * InfiniteScroll
 *
 * React migration of the production Angular `app-wordly-infinite-scroll`
 * (wordly_portal: libs/components/core/infinite-scroll).
 *
 * The Angular original is a scroll-container wrapper that emits `(visible)` when
 * the scroll position comes within `threshold` px of the bottom, gating cascade
 * loads behind a `[loading]` flag and appending a spinner while a fetch is in
 * flight. Here we keep the same public behavior — fire a load callback as the
 * bottom approaches, suppress it while loading, show a spinner — but swap the
 * manual scroll/wheel listeners for an IntersectionObserver watching a sentinel
 * element (the idiomatic React approach). `threshold` is mapped to the
 * observer's `rootMargin` so the load still fires that many px before the end.
 *
 * The Angular DI/RxJS/forms layer is dropped: data and the load handler arrive
 * via props (`children`, `onLoadMore`). A `hasMore` prop stops observing once
 * the list is exhausted, matching the table integration's `[hasMore]` input.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Two-tone ring spinner, a 1:1 port of the portal's `hlm-spinner`
 * (libs/ui/spinner). The portal renders this exact SVG with a muted track
 * (`currentColor` path → `text-foreground/30`) and a brand-colored arc
 * (`currentFill` path → spartan `fill-accent`, which resolves to the portal
 * brand primary). Per the brand mapping the portal primary Teal maps to our
 * Brand Blue, so the arc uses the `primary` token, never teal. Sized to
 * `size-5` (20px) to match the portal template's `<hlm-spinner class="size-5">`.
 */
function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "[&>svg]:text-foreground/30 [&>svg]:fill-primary inline-block size-5",
        className
      )}
    >
      <svg
        aria-hidden="true"
        className="motion-safe:animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </span>
  );
}

export interface InfiniteScrollProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Content to render above the sentinel (the scrollable list). */
  children: React.ReactNode;
  /**
   * Whether more items can be loaded. When `false`, the observer disconnects
   * and `onLoadMore` will not fire. Mirrors the Angular `[hasMore]` input.
   */
  hasMore?: boolean;
  /**
   * When `true`, the load callback is suppressed and a spinner is appended
   * below the content. Set this while a fetch is in progress to prevent
   * duplicate emissions (Angular `[loading]`).
   */
  loading?: boolean;
  /** Fired when the sentinel scrolls into view (Angular `(visible)`). */
  onLoadMore?: () => void;
  /**
   * How many px before the absolute bottom the load fires. Mapped to the
   * IntersectionObserver `rootMargin`. Defaults to 200 (Angular `threshold`).
   */
  threshold?: number;
  /** Optional node rendered in place of the default spinner while loading. */
  loadingIndicator?: React.ReactNode;
  /** Optional node rendered when there is nothing more to load. */
  endMessage?: React.ReactNode;
}

export function InfiniteScroll({
  children,
  hasMore = true,
  loading = false,
  onLoadMore,
  threshold = 200,
  loadingIndicator,
  endMessage,
  className,
  ...props
}: InfiniteScrollProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // Keep the latest callback without re-creating the observer each render.
  const onLoadMoreRef = React.useRef(onLoadMore);
  React.useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  React.useEffect(() => {
    // Detached while loading or exhausted — matches the Angular `loading` gate
    // and `hasMore` guard that prevent cascade / duplicate loads.
    if (loading || !hasMore) return;

    const sentinel = sentinelRef.current;
    const root = rootRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMoreRef.current?.();
      },
      {
        // The host div is always the scroll root (it sets `overflow-y-auto`),
        // matching the Angular host. A positive bottom `rootMargin` grows the
        // root's intersection box so the sentinel registers `threshold` px
        // before the absolute bottom — i.e. the load fires early.
        root,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, threshold]);

  return (
    <div
      ref={rootRef}
      // The host IS the scroll container — consumers give it a bounded height
      // (e.g. `className="flex-1 min-h-0"` in a flex-column layout).
      className={cn("block overflow-y-auto", className)}
      {...props}
    >
      {children}

      {/* Zero-height sentinel the observer watches. */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {loading
        ? (loadingIndicator ?? (
            // Portal anatomy: `<div class="flex justify-center py-3">` wrapping a
            // `size-5` two-tone ring spinner (wordly-infinite-scroll.component.html).
            <div
              className="flex justify-center py-3"
              role="status"
              aria-live="polite"
            >
              <Spinner />
              <span className="sr-only">Loading more…</span>
            </div>
          ))
        : null}

      {!hasMore && !loading && endMessage ? (
        <div className="py-3 text-center text-sm text-gray-500">
          {endMessage}
        </div>
      ) : null}
    </div>
  );
}
