"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWorkspace } from "@/contexts/workspace-context";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspace();

  // Generate breadcrumb items from pathname
  const getBreadcrumbItems = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: activeWorkspace, href: "/", active: true }];
    }

    const items = [{ label: activeWorkspace, href: "/", active: false }];

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format the segment label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Special cases for specific segments
      if (segment === "organization" && index === 0) {
        label = "Organization Management";
      } else if (segments[0] === "organization") {
        // Format organization sub-pages
        switch (segment) {
          case "users":
            label = "All Users";
            break;
          case "custom-fields":
            label = "Custom Fields";
            break;
          case "workspace":
            label = "Workspace";
            break;
          // Keep defaults for others
        }
      } else if (segments[0] === "workspace") {
        // Format workspace sub-pages
        switch (segment) {
          case "users":
            label = "Users";
            break;
          case "defaults":
            label = "Session Defaults";
            break;
          // Keep defaults for others
        }
      }

      items.push({
        label,
        href: currentPath,
        active: index === segments.length - 1,
      });
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Get the title from the pathname if not provided
  const pageTitle =
    title ||
    (pathname.split("/").pop()
      ? pathname.split("/").pop()!.charAt(0).toUpperCase() +
        pathname.split("/").pop()!.slice(1)
      : "Dashboard");

  return (
    <header className="flex sticky top-0 h-14 shrink-0 items-center gap-2 px-6 z-20 shadow-sm bg-gradient-to-r from-primary-teal-50 via-primary-teal-200 to-primary-teal-600 w-full">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList className="text-secondary-navy-700">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.active ? (
                  <BreadcrumbPage className="font-medium text-secondary-navy-900">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="text-secondary-navy-600 hover:text-secondary-navy-900 transition-colors duration-200"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator className="text-secondary-navy-500" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-white/20"
          >
            <Bell className="h-5 w-5 text-white hover:text-white/90 transition-colors" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-accent-light-blue-400"></span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
