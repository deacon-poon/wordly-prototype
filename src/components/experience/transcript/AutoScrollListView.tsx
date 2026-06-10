"use client";

/**
 * AutoScrollListView
 *
 * React/shadcn migration of the production library component
 * (wordly-react-components-lib: components/app/meeting/transcript/AutoScrollListView).
 *
 * Renders a scrollable list (e.g. live transcript bubbles) that automatically
 * sticks to the bottom as new items arrive — UNLESS the user has manually
 * scrolled up. When the user is scrolled away from the bottom and new items
 * come in, a clickable "N new" notification chip appears; clicking it (or
 * scrolling back to the bottom) re-enables auto-scroll and clears the count.
 *
 * Migration notes vs. the MUI 6 + Emotion original:
 * - Emotion `styled` Root / ListContainer / Notification / BottomAnchor →
 *   plain divs with Tailwind utility classes.
 * - MUI `Chip` notification → a clickable button styled to match the project's
 *   shadcn chip "selected" variant (Brand Blue primary-blue-500 fill/border,
 *   white text), inlined here since the chip is a one-off clickable CTA.
 * - MUI icons-material VerticalAlignBottom → `ArrowDownToLine`
 *   (lucide-react), rendered as the chip's leading icon.
 * - `simplebar-react` custom scrollbar → a native overflow-y scroll container.
 *   SimpleBar was purely cosmetic (styled scrollbar) and not required for the
 *   scroll/auto-scroll logic; dropping it avoids adding a runtime dependency.
 *   See note in the structured summary. The right padding the original used to
 *   clear SimpleBar's 11px track is preserved as the default `listPadding`.
 * - All scroll math (unseen-count tracking, manual scroll-up detection, resize
 *   debouncing, smooth vs. instant scroll for iframes) is ported faithfully.
 *
 * Theme mapping: the library's brand blue maps to OUR Brand Blue primary; the
 * notification chip uses the shared `selected` chip variant (primary-blue-500).
 *
 * Data arrives via `children` props (in production, transcript bubbles are
 * streamed from the meeting/transcription API).
 */

import * as React from "react";
import { ArrowDownToLine } from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface AutoScrollListViewProps {
  /**
   * Returns the localized label shown in the unseen-items notification chip.
   * Only invoked while auto-scroll is OFF and there are unseen items.
   */
  getUnseenNotificationText?: (unseenCount: number) => string;

  /** Extra classes for the scroll container (e.g. to override sizing). */
  className?: string;

  /** Extra classes for the notification chip. */
  unseenNotificationClassName?: string;

  /** Extra classes for the chip's leading arrow icon. */
  unseenNotificationIconClassName?: string;

  /**
   * Disable smooth scrolling and avoid `scrollIntoView()`. Required when the
   * list is rendered inside an iframe (instant scroll instead).
   */
  disableSmoothScrolling?: boolean;

  /**
   * Padding for the inner list container. Defaults to right padding that, in
   * the original, cleared the custom scrollbar track.
   */
  listPadding?: string;

  /** List items — anything renderable. */
  children?: React.ReactNode;
}

interface ScrollState {
  lastScrollTopPosition: number;
  lastScrollHeight: number;
  listCount: number;
  isAutoScrolling: boolean;
  isResizing: boolean;
}

/** Wait this long after the last resize event before clearing the resize flag. */
const RESIZE_TIMEOUT_MS = 200;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AutoScrollListView({
  getUnseenNotificationText = (count) => `${count} new`,
  className,
  unseenNotificationClassName,
  unseenNotificationIconClassName,
  disableSmoothScrolling = false,
  listPadding,
  children,
}: AutoScrollListViewProps) {
  // Anchor at the very end of the list — the scroll-to target.
  const anchorRef = React.useRef<HTMLDivElement>(null);
  // The scrollable container — used to measure scrollTop / scrollHeight.
  const listRef = React.useRef<HTMLDivElement>(null);
  // Handle to the resize debounce timer.
  const resizeTimeout = React.useRef<ReturnType<typeof setTimeout>>();

  const [unseenCount, setUnseenCount] = React.useState(0);

  const scrollState = React.useRef<ScrollState>({
    lastScrollTopPosition: 0,
    lastScrollHeight: 0,
    listCount: 0,
    isAutoScrolling: true,
    isResizing: false,
  });

  // While the window is resizing, set a flag (cleared after a quiet period) so
  // resize-driven scrollTop changes are not mistaken for a manual scroll-up.
  React.useEffect(() => {
    const onResize = () => {
      scrollState.current.isResizing = true;
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        scrollState.current.isResizing = false;
      }, RESIZE_TIMEOUT_MS);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimeout.current);
    };
  }, []);

  const childCount = React.Children.toArray(children).length;

  // Whenever the child count changes, accumulate unseen items (when not
  // auto-scrolling), or reset to 0 (when pinned to the bottom).
  React.useEffect(() => {
    if (!scrollState.current.isAutoScrolling) {
      setUnseenCount(
        (prev) => childCount - scrollState.current.listCount + prev
      );
    } else {
      setUnseenCount(0);
    }
    scrollState.current.listCount = childCount;
  }, [childCount]);

  // After every render, if auto-scroll is on, stick to the bottom anchor.
  React.useEffect(() => {
    const anchor = anchorRef.current;
    if (scrollState.current.isAutoScrolling && anchor?.scrollIntoView != null) {
      const list = listRef.current;
      if (disableSmoothScrolling && list != null) {
        list.scrollTop = list.scrollHeight - list.clientHeight;
      } else {
        anchor.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  // Jump to the bottom and re-enable auto-scroll (notification click).
  function scrollToBottom() {
    const list = listRef.current;
    if (disableSmoothScrolling && list != null) {
      list.scrollTop = list.scrollHeight - list.clientHeight;
    } else {
      anchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollState.current.isAutoScrolling = true;
    setUnseenCount(0);
  }

  // Detect whether the user is at the bottom (re-enable auto-scroll) or has
  // manually scrolled up (disable it), ignoring resize-driven changes.
  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement> | Event) => {
      const target = event.target as HTMLDivElement;
      const clientHeight = listRef.current?.clientHeight || 0;

      if (target.scrollHeight - Math.ceil(target.scrollTop) <= clientHeight) {
        scrollState.current.isAutoScrolling = true;
        setUnseenCount(0);
      } else if (!scrollState.current.isResizing) {
        const delta =
          Math.ceil(target.scrollTop) -
          scrollState.current.lastScrollTopPosition;
        if (
          delta < 0 &&
          scrollState.current.lastScrollHeight === target.scrollHeight
        ) {
          scrollState.current.isAutoScrolling = false;
        }
      }

      scrollState.current.lastScrollHeight = target.scrollHeight;
      scrollState.current.lastScrollTopPosition = Math.ceil(target.scrollTop);
    },
    []
  );

  return (
    <div className="relative h-full w-full">
      <div
        ref={listRef}
        onScroll={onScroll}
        className={cn(
          "h-full w-full overflow-y-auto overflow-x-hidden focus-visible:outline-none",
          className
        )}
      >
        <div
          role="log"
          aria-live="polite"
          aria-label="transcript"
          className="flex flex-col"
          style={{ padding: listPadding ?? "0px 11px 0px 0px" }}
        >
          {children}
          <div
            id="transcript-anchor"
            ref={anchorRef}
            className="m-0 h-px w-full p-0"
          />
        </div>
      </div>

      {unseenCount > 0 ? (
        <div
          role="alert"
          className="absolute bottom-[10%] flex w-full justify-center"
        >
          <button
            type="button"
            onClick={scrollToBottom}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-primary-blue-500 bg-primary-blue-500 py-1 pl-2 pr-3 text-white shadow-md transition-colors duration-200 hover:border-primary-blue-600 hover:bg-primary-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-500 focus-visible:ring-offset-1",
              unseenNotificationClassName
            )}
          >
            <ArrowDownToLine
              className={cn(
                "h-4 w-4 shrink-0",
                unseenNotificationIconClassName
              )}
              aria-hidden="true"
            />
            <span className="text-sm font-medium leading-6">
              {getUnseenNotificationText(unseenCount)}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(AutoScrollListView);
