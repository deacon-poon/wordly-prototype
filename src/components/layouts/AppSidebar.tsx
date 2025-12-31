"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { X } from "lucide-react";
import {
  selectSidebarCollapsed,
  toggleSidebar,
  setSidebarCollapsed,
} from "@/store/slices/sidebarSlice";
import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavWorkspace } from "@/components/nav-workspace";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const isMobile = useIsMobile();

  // Close the sidebar when clicking a link on mobile
  const handleNavClick = () => {
    if (isMobile) {
      dispatch(setSidebarCollapsed(true));
    }
  };

  // Desktop sidebar
  const DesktopSidebar = (
    <Sidebar className="flex flex-col h-screen z-30">
      <SidebarHeader className="flex items-center justify-start px-4 pt-3">
        <Image
          src="/logo/wordly-logo-rebrand-blue.svg"
          alt="Wordly Logo"
          width={120}
          height={36}
          className={cn(
            "h-9 w-auto transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}
          priority
        />
      </SidebarHeader>
      <SidebarNav className="flex-grow overflow-y-auto">
        <NavWorkspace pathname={pathname} onClick={handleNavClick} />
      </SidebarNav>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );

  // Mobile sidebar (uses Sheet component for slide-in effect)
  const MobileSidebar = (
    <Sheet
      open={!isCollapsed}
      onOpenChange={(open) => dispatch(setSidebarCollapsed(!open))}
    >
      <SheetContent
        side="left"
        className="p-0 w-[280px] sm:max-w-none bg-muted/40 border-0"
      >
        <SheetHeader className="px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo/wordly-logo-rebrand-blue.svg"
                alt="Wordly Logo"
                width={100}
                height={28}
                className="h-7 w-auto"
              />
            </div>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="px-2 py-4 overflow-y-auto h-[calc(100vh-60px)]">
          <NavWorkspace pathname={pathname} onClick={handleNavClick} />
          <div className="mt-auto pt-6 border-t">
            <NavUser />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return <>{isMobile ? MobileSidebar : DesktopSidebar}</>;
}
