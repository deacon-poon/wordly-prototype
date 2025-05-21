"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/store/slices/sidebarSlice";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavUser } from "@/components/nav-user";

interface AppHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ title = "Dashboard", actions }: AppHeaderProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  // Get the title from the pathname if not provided
  const pageTitle =
    title ||
    (pathname.split("/").pop()
      ? pathname.split("/").pop()!.charAt(0).toUpperCase() +
        pathname.split("/").pop()!.slice(1)
      : "Dashboard");

  return (
    <header
      className="flex sticky top-0 h-16 shrink-0 items-center gap-2 px-4 z-20 shadow-sm bg-gradient-to-r from-brand-teal/15 via-brand-teal/5 to-brand-pink/5 w-full"
      style={{ height: "var(--header-height, 56px)" }}
    >
      {/* Left Section - Mobile menu trigger */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu className="h-4 w-4 text-brand-teal" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <Breadcrumb className="flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile title display - removed in favor of consistent breadcrumb */}
      </div>

      {/* Actions slot */}
      {actions && (
        <div className="flex-1 flex justify-center md:justify-start">
          {actions}
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Bell */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-brand-teal"></span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>

        {/* User Profile - using NavUser component */}
        <NavUser />
      </div>
    </header>
  );
}
