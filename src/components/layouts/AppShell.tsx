"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { useViewportSize } from "@/hooks/use-mobile";
import {
  ListFilter,
  X,
  MoreVertical,
  Users,
  User,
  Trash,
  Copy,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { width } = useViewportSize();
  const [isClient, setIsClient] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // Check if screen is mobile/tablet (< 1028px) - matching organization layout
  const isMobile = width < 1028;

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
    if (width >= 1028) {
      setShowMobilePanel(false);
    }
  }, [width]);

  // Dynamic layout calculation for main grid
  const getGridTemplateColumns = () => {
    if (isMobile) {
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
          isMobile ? "hidden" : "block"
        )}
      >
        {sidebar}
      </div>

      {/* Header - spans main content */}
      <div className="sticky top-0 z-20">{header}</div>

      {/* Main content area with resizable functionality on desktop */}
      <div className="overflow-hidden bg-[#f8f9fa] relative">
        {isClient && showRightPanel && rightPanel ? (
          !isMobile ? (
            // Desktop: Use resizable panels
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={60} minSize={45}>
                <div className="h-full overflow-auto">{children}</div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={40} minSize={25} maxSize={55}>
                <div className="h-full overflow-auto bg-white border-l">
                  <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
                    <h2 className="font-semibold">{rightPanelTitle}</h2>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Video className="h-4 w-4 mr-2" />
                            <span>Join with meeting bot</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="h-4 w-4 mr-2" />
                            <span>Join as a speaker</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            <span>Join as an attendee</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            <span>Clone session</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Delete session</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                  <div className="overflow-auto p-4 pb-20">{rightPanel}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-end">
                    <Button
                      variant="default"
                      className="bg-brand-teal hover:bg-brand-teal/90 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            // Mobile/Tablet: Overlapping resizable panel
            <>
              {/* Main content takes full width */}
              <div className="h-full overflow-auto">{children}</div>

              {/* Overlapping resizable panel */}
              <div className="absolute inset-0 z-40 pointer-events-none">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel
                    defaultSize={30}
                    minSize={20}
                    className="pointer-events-none"
                  >
                    {/* Empty panel to take up space - content shows through */}
                    <div className="h-full"></div>
                  </ResizablePanel>

                  <ResizableHandle withHandle className="pointer-events-auto" />

                  <ResizablePanel
                    defaultSize={70}
                    minSize={50}
                    maxSize={80}
                    className="pointer-events-auto"
                  >
                    <div className="h-full overflow-auto bg-white border-l shadow-lg">
                      <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
                        <h2 className="font-semibold">{rightPanelTitle}</h2>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Video className="h-4 w-4 mr-2" />
                                <span>Join with meeting bot</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="h-4 w-4 mr-2" />
                                <span>Join as a speaker</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                <span>Join as an attendee</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                <span>Clone session</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash className="h-4 w-4 mr-2" />
                                <span>Delete session</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              if (onRightPanelClose) onRightPanelClose();
                              // Optional: notify parent components
                              const closeEvent = new CustomEvent(
                                "rightpanel-close"
                              );
                              window.dispatchEvent(closeEvent);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="overflow-auto p-4 pb-20 h-[calc(100%-56px)]">
                        {rightPanel}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white flex justify-end">
                        <Button
                          variant="default"
                          className="bg-brand-teal hover:bg-brand-teal/90 text-white"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </>
          )
        ) : (
          // Always render the main content (on mobile it will be visible behind the overlay)
          <div className="h-full overflow-auto">{children}</div>
        )}

        {/* Mobile view toggle button - only show if no overlay panel is active */}
        {isClient &&
          showRightPanel &&
          rightPanel &&
          isMobile &&
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
