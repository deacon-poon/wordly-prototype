"use client";

/**
 * AutoScrollListView
 *
 * Faithful 1:1 port of the production library component
 * `wordly-react-components-lib/src/components/app/meeting/transcript/AutoScrollListView.tsx`
 * (MUI 6 + Emotion + `simplebar-react`) onto our Tailwind/shadcn stack.
 *
 * Renders a scrollable list (e.g. live transcript bubbles) that automatically
 * sticks to the bottom as new items arrive — UNLESS the user has manually
 * scrolled up. When scrolled away and new items arrive, a clickable "N new"
 * notification appears; clicking it (or scrolling back to the bottom) re-enables
 * auto-scroll and clears the count.
 *
 * Port decisions:
 *   - Emotion `styled` Root / ListContainer / Notification / BottomAnchor →
 *     plain divs + Tailwind utilities (geometry preserved: relative full-size
 *     Root; ListContainer flex column with `0 11px 0 0` default padding; the
 *     `role/aria-live/aria-label="transcript"` log container; 1px BottomAnchor).
 *   - `simplebar-react` custom scrollbar → a native `overflow-y-auto` container.
 *     SimpleBar was purely cosmetic; the scroll/auto-scroll math is unchanged.
 *     The 11px right padding the original used to clear SimpleBar's track is
 *     preserved as the default `listPadding`.
 *   - MUI `Chip` notification (icon + subtitle2 label, clickable) → a clickable
 *     button styled with our Brand Blue `primary-blue-*` tokens (no raw hex).
 *   - MUI `VerticalAlignBottom` icon → lucide `ArrowDownToLine`.
 *   - The lib's owner-styling escape hatches (`customStyle`,
 *     `unseenNotificationStyle`, `unseenNotificationIconStyle`) keep the same
 *     names; their MUI `sx` type becomes `React.CSSProperties` here.
 *   - All scroll math (unseen-count tracking, manual scroll-up detection, resize
 *     debouncing, smooth vs. instant scroll for iframes) is ported 1:1, and the
 *     scroll listener is attached via `useLayoutEffect` as in the lib.
 *   - Exports `React.memo(AutoScrollListView)` as default, identical to the lib.
 */

import * as React from "react";
import { ArrowDownToLine } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AutoScrollListViewProps {
  /**
   * Returns the localized label shown in the unseen-items notification. Only
   * called while auto-scroll is OFF and there are unseen items.
   */
  getUnseenNotificationText: (unseenCount: number) => string;

  /** Custom style applied to the scroll container (lib `customStyle`). */
  customStyle?: React.CSSProperties;

  /** Custom style for the notification chip (lib `unseenNotificationStyle`). */
  unseenNotificationStyle?: React.CSSProperties;

  /** Custom style for the notification icon (lib `unseenNotificationIconStyle`). */
  unseenNotificationIconStyle?: React.CSSProperties;

  /**
   * Disable smooth scrolling and avoid `scrollIntoView()`. Required when the
   * list is rendered inside an iframe (instant scroll instead).
   */
  disableSmoothScrolling?: boolean;

  /** Optional padding for the inner list container. */
  listPadding?: string;

  /** List items — anything renderable. */
  children?: React.ReactNode[];
}

interface ScrollState {
  lastScrollTopPosition: number;
  lastScrollHeight: number;
  listCount: number;
  isAutoScrolling: boolean;
  isResizing: boolean;
}

/** Wait this long after the last resize event before clearing the resize flag. */
const resizeTimeoutMillis = 200;

export const AutoScrollListView: React.FC<AutoScrollListViewProps> = ({
  customStyle,
  getUnseenNotificationText,
  unseenNotificationStyle,
  unseenNotificationIconStyle,
  disableSmoothScrolling,
  listPadding = "",
  children,
  ...otherProps
}) => {
  // Anchor at the very end of the list — the scroll-to target.
  const anchorRef = React.useRef<HTMLDivElement>(null);
  // The scrollable container — used to measure scrollTop / scrollHeight.
  const listRef = React.useRef<HTMLDivElement>(null);
  // Number of child elements that have not been "seen."
  const [unseenCount, setUnseenCount] = React.useState<number>(0);
  // Handle to the resize debounce timer.
  const resizeTimeout = React.useRef<ReturnType<typeof setTimeout>>();

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
      }, resizeTimeoutMillis);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimeout.current);
    };
  }, []);

  // Update the unseen count per scroll amount whenever children update.
  React.useEffect(() => {
    const numChildren = React.Children.toArray(children).length;

    if (!scrollState.current.isAutoScrolling) {
      setUnseenCount(
        (prevUnseenCount) =>
          numChildren - scrollState.current.listCount + prevUnseenCount
      );
    } else {
      setUnseenCount(0);
    }

    scrollState.current.listCount = numChildren;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when children count changes
  }, [children?.length]);

  // After every render, if auto-scroll is on, stick to the bottom anchor.
  React.useEffect(() => {
    const anchor = anchorRef.current;
    if (
      scrollState.current.isAutoScrolling &&
      anchor != null &&
      anchor.scrollIntoView != null
    ) {
      const list = listRef.current;
      if (disableSmoothScrolling && list != null) {
        list.scrollTop = list.scrollHeight - list.clientHeight;
      } else {
        anchor.scrollIntoView({ behavior: "smooth" });
      }
    }
  });

  // Jump to the bottom and re-enable auto-scroll (notification click).
  function onUpdateNotificationClick() {
    const list = listRef.current;
    if (disableSmoothScrolling && list != null) {
      list.scrollTop = list.scrollHeight - list.clientHeight;
    } else {
      anchorRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
    scrollState.current.isAutoScrolling = true;
    setUnseenCount(0);
  }

  // Detect whether the user is at the bottom (re-enable auto-scroll) or has
  // manually scrolled up (disable it), ignoring resize-driven changes.
  const onScroll = (event: React.UIEvent<HTMLDivElement> | Event) => {
    const target = event.target as HTMLDivElement;

    if (
      target.scrollHeight - Math.ceil(target.scrollTop) <=
      (listRef?.current?.clientHeight || 0)
    ) {
      scrollState.current.isAutoScrolling = true;
      setUnseenCount(0);
    } else if (!scrollState.current.isResizing) {
      const delta =
        Math.ceil(target.scrollTop) - scrollState.current.lastScrollTopPosition;
      if (
        delta < 0 &&
        scrollState.current.lastScrollHeight === target.scrollHeight
      ) {
        scrollState.current.isAutoScrolling = false;
      }
    }

    scrollState.current.lastScrollHeight = target.scrollHeight;
    scrollState.current.lastScrollTopPosition = Math.ceil(target.scrollTop);
  };

  // Attach the scroll listener to the scrollable element (lib useLayoutEffect).
  React.useLayoutEffect(() => {
    const el = listRef?.current;
    el?.addEventListener("scroll", onScroll);
    return () => {
      el?.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- attach once, matches lib
  }, []);

  return (
    <div className="relative h-full w-full" {...otherProps}>
      <div
        ref={listRef}
        className="h-full w-full overflow-y-auto overflow-x-hidden focus-visible:outline-none"
        style={customStyle}
      >
        <div
          role="log"
          aria-live="polite"
          aria-label="transcript"
          className="flex flex-col"
          style={{
            padding: listPadding !== "" ? listPadding : "0px 11px 0px 0px",
          }}
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
            onClick={onUpdateNotificationClick}
            style={unseenNotificationStyle}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-primary-blue-500 bg-primary-blue-500 py-1 pl-2 pr-3 text-white shadow-md transition-colors duration-200 hover:border-primary-blue-600 hover:bg-primary-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-500 focus-visible:ring-offset-1"
            )}
          >
            <ArrowDownToLine
              className="h-4 w-4 shrink-0"
              style={unseenNotificationIconStyle}
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
};

export default React.memo(AutoScrollListView);
