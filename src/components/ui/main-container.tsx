"use client";

/**
 * MainContainer
 *
 * React migration of the production Angular `app-wordly-main-container`
 * (wordly_portal: libs/components/core/main-container).
 *
 * A Card-based page layout container:
 *   - optional header (breadcrumb + title + actions slot + description)
 *   - an optional "extra actions" row
 *   - a separator, then a scrollable content region with padding
 *   - an alignable footer
 *   - an optional loading overlay (spinner + text)
 *   - an optional resizable right side panel with a drag handle
 *
 * The Angular version uses content projection (`ng-content select="[slot=...]"`).
 * Here those slots become explicit React props (`title`, `action`, `description`,
 * `breadcrumb`, `extraActions`, `children` for the content, `footer`,
 * `sidePanel`). The Angular DI/RxJS/NgZone layer is dropped; the side-panel
 * open state is controllable via `sidePanelOpen` + `onSidePanelToggle`, and the
 * drag-to-resize behavior is reimplemented with plain React refs + listeners.
 *
 * Built on the shared shadcn primitives (Card, Separator, Button) to match the
 * product look.
 */

import * as React from "react";
import { ChevronLeft, ChevronRight, GripVertical, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Sizing constants (mirror the Angular component)
// ---------------------------------------------------------------------------

const SIDE_PANEL_DEFAULT_WIDTH_PX = 400;
const LG_BREAKPOINT_PX = 1024;
const TABLET_MAIN_WIDTH_PCT = 50;
const MIN_DRAG_MAIN_WIDTH_PCT = 35;

export type FooterAlignment = "left" | "center" | "right";

const footerAlignClass: Record<FooterAlignment, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

// ---------------------------------------------------------------------------
// Props (mirror the Angular @Inputs / @Outputs + projected slots)
// ---------------------------------------------------------------------------

export interface MainContainerProps {
  // --- Header slots ---
  /** Page title (Angular `[slot=title]`). */
  title?: React.ReactNode;
  /** Header action area, right-aligned (Angular `[slot=action]`). */
  action?: React.ReactNode;
  /** Sub-title / description text (Angular `[slot=description]`). */
  description?: React.ReactNode;
  /** Breadcrumb node, shown above the title when `showBreadcrumb`. */
  breadcrumb?: React.ReactNode;
  /** Full-width row under the header (Angular `[slot=extra-actions]`). */
  extraActions?: React.ReactNode;

  /** Main content (Angular `[slot=content]`). */
  children?: React.ReactNode;
  /** Footer content (Angular `[slot=footer]`). */
  footer?: React.ReactNode;
  /** Right side-panel content (Angular `[slot=side-panel]`). */
  sidePanel?: React.ReactNode;

  // --- Layout flags ---
  /** Alignment of the footer content. */
  footerAlignment?: FooterAlignment;
  /** Apply content padding (gaps + py). */
  showContentPadding?: boolean;
  /** Apply padding inside the side panel. */
  showSidePanelPadding?: boolean;
  /** Show the collapse (close) toggle inside the side panel. */
  showSidePanelToggle?: boolean;
  /** Render the card border + shadow + rounding. */
  showBorders?: boolean;
  /** Show the breadcrumb slot. */
  showBreadcrumb?: boolean;
  /** Keep the header fixed and only scroll the body. */
  stickyHeader?: boolean;
  /** Extra classes applied to the scrollable body. */
  bodyClass?: string;

  // --- Loading ---
  loading?: boolean;
  /** Render the dimming overlay while loading. */
  displayLoadingOverlay?: boolean;
  loadingText?: string;

  // --- Side panel ---
  hasSidePanel?: boolean;
  /** Controlled open state of the side panel. */
  sidePanelOpen?: boolean;
  /** Fired when the side panel is toggled (e.g. via the close button). */
  onSidePanelToggle?: (open: boolean) => void;
  /** Allow drag-to-resize of the right panel. */
  resizableRightPanel?: boolean;
  /** Minimum right-panel width as a % of the container. */
  minRightPanelWidthPct?: number | null;

  className?: string;
}

export function MainContainer({
  title,
  action,
  description,
  breadcrumb,
  extraActions,
  children,
  footer,
  sidePanel,

  footerAlignment = "left",
  showContentPadding = true,
  showSidePanelPadding = true,
  showSidePanelToggle = true,
  showBorders = true,
  showBreadcrumb = false,
  stickyHeader = false,
  bodyClass = "",

  loading = false,
  displayLoadingOverlay = true,
  loadingText = "",

  hasSidePanel = false,
  sidePanelOpen = false,
  onSidePanelToggle,
  resizableRightPanel = true,
  minRightPanelWidthPct = null,

  className,
}: MainContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [mainWidthPercent, setMainWidthPercent] = React.useState(66.67);
  const [isDragging, setIsDragging] = React.useState(false);
  const lastMainWidthPctRef = React.useRef<number | null>(null);

  const panelActive = hasSidePanel && sidePanelOpen;
  const resizableActive = panelActive && resizableRightPanel;

  // Max main-content % — drag constraint + initial open width.
  const defaultMainWidthPct = React.useCallback((): number => {
    if (minRightPanelWidthPct !== null) {
      return 100 - minRightPanelWidthPct;
    }
    if (
      typeof window !== "undefined" &&
      window.innerWidth >= LG_BREAKPOINT_PX
    ) {
      const containerWidth =
        containerRef.current?.offsetWidth ||
        (typeof window !== "undefined" ? window.innerWidth : 1024);
      return Math.max(
        MIN_DRAG_MAIN_WIDTH_PCT,
        ((containerWidth - SIDE_PANEL_DEFAULT_WIDTH_PX) / containerWidth) * 100
      );
    }
    return TABLET_MAIN_WIDTH_PCT;
  }, [minRightPanelWidthPct]);

  // When the panel opens, restore last drag width or compute the default.
  React.useEffect(() => {
    if (sidePanelOpen) {
      setMainWidthPercent(lastMainWidthPctRef.current ?? defaultMainWidthPct());
    }
  }, [sidePanelOpen, defaultMainWidthPct]);

  // Recompute default width on resize (only if the user hasn't dragged).
  React.useEffect(() => {
    const onResize = () => {
      if (!resizableActive || lastMainWidthPctRef.current !== null) return;
      setMainWidthPercent(defaultMainWidthPct());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resizableActive, defaultMainWidthPct]);

  function handleDividerMouseDown(event: React.MouseEvent) {
    event.preventDefault();
    setIsDragging(true);
    document.body.style.userSelect = "none";

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const onMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const { left, width } = container.getBoundingClientRect();
        const pct = ((e.clientX - left) / width) * 100;
        setMainWidthPercent(
          Math.min(
            defaultMainWidthPct(),
            Math.max(MIN_DRAG_MAIN_WIDTH_PCT, pct)
          )
        );
      });
    };

    const onUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      setMainWidthPercent((w) => {
        lastMainWidthPctRef.current = w;
        return w;
      });
      document.body.style.userSelect = "";
      setIsDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function handleToggle() {
    onSidePanelToggle?.(!sidePanelOpen);
  }

  // --- Derived classes ---

  const mainContentStyle: React.CSSProperties | undefined = resizableActive
    ? { width: `${mainWidthPercent}%` }
    : undefined;

  const sidePanelStyle: React.CSSProperties | undefined = resizableActive
    ? { width: `${100 - mainWidthPercent}%` }
    : undefined;

  // Mirrors Angular get sidePanelClass(): open states supply the visual
  // separator via !border-l (removed below md in overlay mode); the closed
  // state drops the border entirely so the 1px doesn't overflow the flex row
  // and trigger a page-level horizontal scrollbar on mobile.
  const sidePanelClass = sidePanelOpen
    ? resizableRightPanel
      ? "translate-x-0 opacity-100 !border-l max-md:!border-l-0"
      : "translate-x-0 w-full lg:w-1/3 lg:max-w-[400px] md:w-1/2 opacity-100 !border-l max-md:!border-l-0"
    : "translate-x-full w-0 opacity-0";

  const mainContentWidthClass =
    panelActive && !resizableRightPanel
      ? "w-full lg:flex-1 md:w-1/2"
      : "w-full";

  const loadingOverlayBg = bodyClass.trim() || "bg-white";

  const LoadingOverlay = ({ spinner }: { spinner: boolean }) =>
    loading ? (
      <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center">
        <div className={cn("absolute inset-0 opacity-75", loadingOverlayBg)} />
        {spinner ? (
          <div className="relative flex flex-col items-center gap-2">
            {loadingText ? (
              <div className="font-normal text-muted-foreground">
                {loadingText}
              </div>
            ) : null}
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}
      </div>
    ) : null;

  return (
    <Card
      ref={containerRef}
      className={cn(
        // Portal helm card: rounded-xl + py-6, here overridden to !pt-0 !pb-0.
        "relative h-full w-full rounded-xl !pb-0 !pt-0",
        !showContentPadding && "gap-0 pb-0",
        !showBorders && "rounded-none border-0 shadow-none",
        className
      )}
    >
      <div className="relative flex h-full w-full flex-row">
        {/* Main content column */}
        <div
          style={mainContentStyle}
          className={cn(
            "flex h-full flex-col transition-all duration-300 ease-in-out @container max-md:!w-full",
            mainContentWidthClass,
            showContentPadding ? "gap-6" : "pb-6",
            isDragging && "transition-none",
            !stickyHeader && "overflow-y-auto"
          )}
        >
          {/* Header */}
          <CardHeader
            className={cn(
              "flex-col gap-4 pb-6 pt-6",
              !showContentPadding && "pb-6"
            )}
          >
            {showBreadcrumb && breadcrumb ? <div>{breadcrumb}</div> : null}

            <div className="flex w-full justify-between">
              <CardTitle className="min-w-0 flex-1">{title}</CardTitle>
              {action ? (
                <div className="flex shrink-0 items-center gap-2">{action}</div>
              ) : null}
            </div>

            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>

          {/* Extra actions row (hidden when empty) */}
          {extraActions ? (
            // Portal SCSS: [data-slot='extra-actions'] { height: 2rem } and hides when empty.
            <div className="h-8 w-full px-6" data-slot="extra-actions">
              {extraActions}
            </div>
          ) : null}

          {/* Body: separator + content + footer */}
          <div
            className={cn(
              "flex flex-1 flex-col",
              bodyClass,
              showContentPadding && !stickyHeader && "pb-6",
              stickyHeader &&
                "min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
            )}
          >
            <Separator />

            <CardContent
              className={cn(
                "relative min-h-[100px] flex-1",
                showContentPadding ? "pt-6" : "p-0"
              )}
            >
              {displayLoadingOverlay && loading ? (
                <LoadingOverlay spinner />
              ) : null}
              {children}
            </CardContent>

            {footer ? (
              <CardFooter
                className={cn(
                  "relative pt-6",
                  "mt-auto",
                  footerAlignClass[footerAlignment]
                )}
              >
                {displayLoadingOverlay && loading ? (
                  <LoadingOverlay spinner={false} />
                ) : null}
                {footer}
              </CardFooter>
            ) : null}
          </div>
        </div>

        {/* Drag handle: desktop only, panel open + resizable */}
        {resizableActive ? (
          <div className="relative z-10 hidden w-0 select-none overflow-visible md:block">
            <div className="sticky top-1/2 -translate-y-1/2">
              <div className="absolute left-0 -translate-x-1/2 -translate-y-1/2">
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize side panel"
                  onMouseDown={handleDividerMouseDown}
                  className={cn(
                    // Portal: pill is hidden below lg (tablet) where the panel is
                    // fixed at 50% and resizing would be confusing.
                    "inline-flex cursor-ew-resize items-center justify-center rounded-md border border-border bg-background py-1 shadow-sm transition-colors max-lg:hidden",
                    isDragging && "!border-muted-foreground/50"
                  )}
                >
                  <GripVertical className="pointer-events-none h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Side panel column */}
        {hasSidePanel ? (
          <aside
            style={sidePanelStyle}
            className={cn(
              "absolute right-0 top-0 z-50 h-full overflow-hidden rounded-xl border-solid border-border bg-background transition-all duration-300 ease-in-out md:relative md:z-auto md:rounded-l-none max-md:!w-full",
              sidePanelClass,
              isDragging && "transition-none"
            )}
          >
            {resizableRightPanel ? (
              <div
                onMouseDown={handleDividerMouseDown}
                className="absolute left-0 top-0 z-20 h-full w-1 cursor-ew-resize"
              />
            ) : null}

            {sidePanelOpen ? (
              <div
                className={cn(
                  "h-full overflow-y-auto",
                  showSidePanelPadding && "p-6"
                )}
              >
                {showSidePanelToggle ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close side panel"
                    title="Close side panel"
                    onClick={handleToggle}
                    className="mb-2"
                  >
                    {sidePanelOpen ? (
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    )}
                  </Button>
                ) : null}
                {sidePanel}
              </div>
            ) : null}
          </aside>
        ) : null}
      </div>
    </Card>
  );
}
