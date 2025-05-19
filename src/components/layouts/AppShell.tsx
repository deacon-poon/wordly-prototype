"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { useIsMobile, useIsTablet, useViewportSize } from "@/hooks/use-mobile";
import { ListFilter, X, Edit, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface AppShellProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
  rightPanelTitle?: string;
  onRightPanelClose?: () => void;
}

export function AppShell({
  children,
  sidebar,
  header,
  rightPanel,
  showRightPanel = false,
  rightPanelTitle = "Details",
  onRightPanelClose,
}: AppShellProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { width } = useViewportSize();
  const [isClient, setIsClient] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // Calculate responsive right panel width based on viewport
  const getRightPanelMinWidth = () => {
    // For desktop resizable panel mode
    if (width >= 1440) return 450; // Larger screens get wider panel
    if (width >= 1024) return 400; // Medium desktop
    return 350; // Default minimum
  };

  // Calculate overlay panel width for mobile
  const getMobilePanelWidth = () => {
    if (width < 480) return Math.min(350, width * 0.9);
    return 380; // Tablet size
  };

  // Maximum panel size for desktop (prevents panel from getting too large)
  const getMaxPanelSize = () => {
    if (width >= 1440) return 40; // 40% maximum on large screens
    if (width >= 1024) return 45; // 45% maximum on medium desktop
    return 50; // 50% maximum on smaller screens
  };

  // Hydration fix - only enable client-side features after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Toggle mobile panel
  const toggleMobilePanel = () => {
    setShowMobilePanel(!showMobilePanel);
  };

  // Listen for custom events to show the mobile panel
  useEffect(() => {
    const handleShowMobilePanel = () => {
      setShowMobilePanel(true);
    };

    window.addEventListener(
      "appshell-show-mobile-panel",
      handleShowMobilePanel
    );

    return () => {
      window.removeEventListener(
        "appshell-show-mobile-panel",
        handleShowMobilePanel
      );
    };
  }, []);

  // Close mobile panel on resize to desktop
  useEffect(() => {
    if (width >= 768) {
      setShowMobilePanel(false);
    }
  }, [width]);

  // Determine if we're in mobile view
  const isMobileView = width < 768;

  // Dynamic layout calculation for main grid
  const getGridTemplateColumns = () => {
    if (isMobile || isTablet) {
      return "1fr";
    }

    const sidebarWidth = isCollapsed ? "70px" : "240px";
    return `${sidebarWidth} minmax(0, 1fr)`;
  };

  return (
    <div
      className="h-screen w-full overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: getGridTemplateColumns(),
        gridTemplateRows: "auto 1fr",
        transition: "grid-template-columns 300ms ease-in-out",
      }}
    >
      {/* Sidebar - hidden on mobile and tablet */}
      <div
        className={cn(
          "row-span-2 h-screen transition-all duration-300",
          isMobile || isTablet ? "hidden" : "block"
        )}
      >
        {sidebar}
      </div>

      {/* Header - spans main content */}
      <div className="sticky top-0 z-20">{header}</div>

      {/* Main content area with resizable functionality on desktop */}
      <div className="overflow-hidden bg-[#f8f9fa] relative">
        {isClient && showRightPanel && rightPanel && !isMobileView ? (
          // Desktop: Use resizable panels
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={65} minSize={50}>
              <div className="h-full overflow-auto">{children}</div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={35}
              minSize={30}
              maxSize={getMaxPanelSize()}
              style={{
                minWidth: `${getRightPanelMinWidth()}px`,
                transition: "min-width 0.2s ease-in-out",
              }}
            >
              <div className="h-full overflow-auto bg-white border-l">
                <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
                  <h2 className="font-semibold">{rightPanelTitle}</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={onRightPanelClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-auto p-4">{rightPanel}</div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          // Always render the main content (on mobile it will be visible behind the overlay)
          <div className="h-full overflow-auto">{children}</div>
        )}

        {/* Mobile view overlay panel */}
        {isClient && showRightPanel && rightPanel && isMobileView && (
          <div
            className={cn(
              "fixed inset-x-0 top-[var(--header-height,56px)] bottom-0 z-10 transition-opacity duration-300 pointer-events-none",
              showMobilePanel ? "opacity-100" : "opacity-0"
            )}
            style={{
              height: "calc(100vh - var(--header-height,56px))",
            }}
          >
            <div
              className={cn(
                "absolute right-0 top-0 h-full bg-white border-l transform transition-transform duration-300 overflow-hidden pointer-events-auto",
                showMobilePanel ? "translate-x-0" : "translate-x-full"
              )}
              style={{ width: `${getMobilePanelWidth()}px`, maxWidth: "90vw" }}
            >
              <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
                <h2 className="font-semibold">{rightPanelTitle}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      toggleMobilePanel();
                      if (onRightPanelClose) onRightPanelClose();
                      // Optional: notify parent components
                      const closeEvent = new CustomEvent("rightpanel-close");
                      window.dispatchEvent(closeEvent);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-auto p-4 h-[calc(100%-56px)]">
                {rightPanel}
              </div>
            </div>
          </div>
        )}

        {/* Mobile view toggle button */}
        {isClient &&
          showRightPanel &&
          rightPanel &&
          isMobileView &&
          !showMobilePanel && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMobilePanel}
              className="fixed bottom-6 right-6 z-30 bg-white shadow-md rounded-full h-12 w-12 p-0 flex justify-center items-center"
            >
              <ListFilter className="h-5 w-5 text-brand-teal" />
            </Button>
          )}
      </div>
    </div>
  );
}
