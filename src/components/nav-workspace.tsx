"use client";

import * as React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Clock,
  FileText,
  Book,
  History,
  Users,
  Settings,
  Building2,
  HelpCircle,
  ChevronDown,
  CreditCard,
  ListChecks,
  UserCog,
} from "lucide-react";
import { SidebarSection, SidebarItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface NavWorkspaceProps {
  pathname: string;
}

interface WorkspaceItem {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
}

export function NavWorkspace({ pathname }: NavWorkspaceProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const [activeWorkspace, setActiveWorkspace] = React.useState("Main HQ");

  // Workspaces
  const workspaces = [
    { id: 1, name: "Main HQ", role: "Admin" },
    { id: 2, name: "Marketing Team", role: "Member" },
    { id: 3, name: "Sales Department", role: "Viewer" },
  ];

  // Main navigation items
  const mainItems: WorkspaceItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "sessions",
      title: "Sessions",
      href: "/sessions",
      icon: Clock,
    },
    {
      id: "glossaries",
      title: "Glossaries",
      href: "/glossaries",
      icon: Book,
    },
    {
      id: "transcripts",
      title: "Transcripts",
      href: "/transcripts",
      icon: FileText,
    },
    {
      id: "history",
      title: "History",
      href: "/history",
      icon: History,
    },
    {
      id: "support",
      title: "Support",
      href: "/support",
      icon: HelpCircle,
    },
  ];

  // Workspace admin items
  const workspaceAdminItems: WorkspaceItem[] = [
    {
      id: "session-defaults",
      title: "Session Defaults",
      href: "/workspace/defaults",
      icon: ListChecks,
    },
    {
      id: "users",
      title: "Users",
      href: "/workspace/users",
      icon: Users,
    },
  ];

  // Org-wide admin items
  const orgAdminItems: WorkspaceItem[] = [
    {
      id: "all-users",
      title: "All Users",
      href: "/org/users",
      icon: UserCog,
    },
    {
      id: "custom-fields",
      title: "Custom Fields",
      href: "/org/fields",
      icon: Settings,
    },
    {
      id: "billing",
      title: "Billing",
      href: "/org/billing",
      icon: CreditCard,
    },
  ];

  return (
    <>
      {/* Workspace Selector */}
      <SidebarSection>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between p-3 mb-2 rounded-md bg-gray-100/80 cursor-pointer">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-teal" />
                {!isCollapsed && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-800">
                      Workspace:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {activeWorkspace}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500 ml-1" />
                  </div>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          {!isCollapsed && (
            <DropdownMenuContent align="start" className="w-[220px]">
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="cursor-pointer"
                  onClick={() => setActiveWorkspace(workspace.name)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{workspace.name}</span>
                    <span className="text-xs text-gray-500">
                      {workspace.role}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Building2 className="mr-2 h-4 w-4 text-brand-teal" />
                <span className="font-medium">Create New Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarSection>

      {/* Main Navigation */}
      <SidebarSection>
        <div className="space-y-1">
          {mainItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <SidebarItem
                icon={<item.icon className="h-4 w-4" />}
                title={item.title}
                isActive={pathname === item.href}
              />
            </Link>
          ))}
        </div>
      </SidebarSection>

      {/* Workspace Admin */}
      <SidebarSection title="Workspace Admin">
        <div className="space-y-1">
          {workspaceAdminItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <SidebarItem
                icon={<item.icon className="h-4 w-4" />}
                title={item.title}
                isActive={pathname === item.href}
              />
            </Link>
          ))}
        </div>
      </SidebarSection>

      {/* Org-wide Admin */}
      <SidebarSection title="Org-wide Admin">
        <div className="space-y-1">
          {orgAdminItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <SidebarItem
                icon={<item.icon className="h-4 w-4" />}
                title={item.title}
                isActive={pathname === item.href}
              />
            </Link>
          ))}
        </div>
      </SidebarSection>
    </>
  );
}
