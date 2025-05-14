"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ListFilter, X } from "lucide-react";
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
}

export function AppShell({
  children,
  sidebar,
  header,
  rightPanel,
  showRightPanel = false,
}: AppShellProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const isMobile = useIsMobile();
  const [showMobileRightPanel, setShowMobileRightPanel] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Hydration fix - only enable client-side features after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Toggle mobile right panel visibility
  const toggleMobileRightPanel = () => {
    setShowMobileRightPanel(!showMobileRightPanel);
  };

  // Close mobile panel on resize to desktop
  useEffect(() => {
    if (!isMobile) {
      setShowMobileRightPanel(false);
    }
  }, [isMobile]);

  // Dynamic layout calculation for main grid
  const getGridTemplateColumns = () => {
    if (isMobile) {
      return "1fr";
    }

    const sidebarWidth = isCollapsed ? "70px" : "240px";

    // Always just use the sidebar and main content in the grid
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
      {/* Sidebar - hidden on mobile */}
      <div
        className={cn(
          "row-span-2 h-screen transition-all duration-300",
          isMobile ? "hidden" : "block"
        )}
      >
        {sidebar}
      </div>

      {/* Header - spans main content */}
      <div className="sticky top-0 z-20">{header}</div>

      {/* Main content area with resizable functionality */}
      <div className="overflow-hidden bg-[#f8f9fa] relative">
        {isClient && !isMobile && showRightPanel && rightPanel ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={65} minSize={30}>
              <div className="h-full overflow-auto">{children}</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={35}
              minSize={30}
              style={{ minWidth: "350px" }}
            >
              <div className="h-full overflow-auto bg-white border-l">
                {rightPanel}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full overflow-auto">{children}</div>
        )}

        {/* Mobile right panel toggle button */}
        {isMobile && rightPanel && showRightPanel && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobileRightPanel}
            className="fixed bottom-6 right-6 z-50 bg-white shadow-md rounded-full h-12 w-12 p-0 flex justify-center items-center"
          >
            <ListFilter className="h-5 w-5 text-brand-teal" />
          </Button>
        )}
      </div>

      {/* Mobile right panel slide-in (or static overlay on narrow viewports) */}
      {rightPanel && showRightPanel && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-50 transition-opacity",
            showMobileRightPanel && isMobile
              ? "opacity-100"
              : !isMobile && !isClient
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          onClick={isMobile ? toggleMobileRightPanel : undefined}
        >
          <div
            className={cn(
              "absolute right-0 top-0 h-full bg-white border-l min-w-[350px] max-w-[450px] w-[85%] transform transition-transform overflow-auto",
              (showMobileRightPanel && isMobile) || (!isMobile && !isClient)
                ? "translate-x-0"
                : "translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-semibold">Details</h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                  onClick={toggleMobileRightPanel}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="overflow-auto">{rightPanel}</div>
          </div>
        </div>
      )}
    </div>
  );
}
