"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSidebarCollapsed,
  setSidebarCollapsed,
} from "@/store/slices/sidebarSlice";
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
  const dispatch = useDispatch();
  const { width } = useViewportSize();
  const [isClient, setIsClient] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile/tablet (< 1028px)
  const isMobile = width < 1028;

  // Hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle sidebar drag to collapse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 100) {
        dispatch(setSidebarCollapsed(true));
        setIsDragging(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dispatch]);

  // Close mobile panel on resize to desktop
  useEffect(() => {
    if (width >= 1028) {
      setShowMobilePanel(false);
    }
  }, [width]);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "relative z-20 transition-all duration-300 ease-out overflow-hidden",
          isMobile ? "hidden" : "block",
          isCollapsed ? "w-0" : "w-[240px]"
        )}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="w-[240px] h-full bg-muted/40">{sidebar}</div>
      </div>

      {/* Main content area - unified elevated container */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header integrated into the elevated container */}
          <div className="border-b border-gray-200">{header}</div>

          {/* Content area with optional right panel */}
          <div className="flex-1 overflow-hidden">
            {isClient && showRightPanel && rightPanel ? (
              !isMobile ? (
                // Desktop: Use resizable panels
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={60} minSize={45}>
                    <div className="h-full overflow-auto">{children}</div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  <ResizablePanel defaultSize={40} minSize={25} maxSize={55}>
                    <div className="h-full bg-white border-l flex flex-col">
                      <div className="p-4 border-b bg-white z-10 flex items-center justify-between shrink-0">
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
                      <div className="flex-1 overflow-auto p-4">
                        {rightPanel}
                      </div>
                      <div className="p-4 border-t bg-white flex justify-end shrink-0">
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
                // Mobile: Overlapping panel (keeping existing mobile logic)
                <>
                  <div className="h-full overflow-auto">{children}</div>
                  <div className="absolute inset-0 z-40 pointer-events-none">
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        className="pointer-events-none"
                      >
                        <div className="h-full"></div>
                      </ResizablePanel>
                      <ResizableHandle
                        withHandle
                        className="pointer-events-auto"
                      />
                      <ResizablePanel
                        defaultSize={70}
                        minSize={50}
                        maxSize={80}
                        className="pointer-events-auto"
                      >
                        <div className="h-full bg-white border-l shadow-lg flex flex-col">
                          <div className="p-4 border-b bg-white z-10 flex items-center justify-between shrink-0">
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
                          <div className="flex-1 overflow-auto p-4">
                            {rightPanel}
                          </div>
                          <div className="p-4 border-t bg-white flex justify-end shrink-0">
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
              // No right panel - just main content
              <div className="h-full overflow-auto">{children}</div>
            )}

            {/* Mobile toggle button */}
            {isClient &&
              showRightPanel &&
              rightPanel &&
              isMobile &&
              !showMobilePanel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobilePanel(true)}
                  className="fixed bottom-6 right-6 z-30 bg-white shadow-md rounded-full h-12 w-12 p-0 flex justify-center items-center"
                >
                  <ListFilter className="h-5 w-5 text-gray-600" />
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
