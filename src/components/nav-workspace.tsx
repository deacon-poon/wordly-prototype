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
  AlertCircle,
  Signal,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Tag,
  Bell,
  Archive,
  BarChart,
  Bookmark,
  Calendar,
  FolderClosed,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { SidebarSection, SidebarItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { useState } from "react";

interface NavWorkspaceProps {
  pathname: string;
}

// Add interface for nested item
interface NestedItem {
  title: string;
  href: string;
  badge?: string;
}

interface WorkspaceItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  expandable?: boolean;
  badge?: string;
  nested?: NestedItem[];
}

export function NavWorkspace({ pathname }: NavWorkspaceProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    sessions: true,
    history: false,
    workspace: false,
    organization: false,
    notifications: false,
  });
  const [activeWorkspace, setActiveWorkspace] =
    React.useState("Marketing Team");

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Workspaces
  const workspaces = [
    { id: 1, name: "Marketing Team", role: "Admin" },
    { id: 2, name: "Sales Department", role: "Member" },
    { id: 3, name: "Product Development", role: "Viewer" },
  ];

  // Workspace features
  const workspaceItems: WorkspaceItem[] = [
    {
      id: "sessions",
      title: "Sessions",
      href: "/sessions",
      icon: Clock,
      expandable: true,
      nested: [
        {
          title: "All Sessions",
          href: "/sessions",
        },
        {
          title: "Active Sessions",
          href: "/sessions/active",
          badge: "3",
        },
        {
          title: "Completed",
          href: "/sessions/completed",
        },
        {
          title: "Scheduled",
          href: "/sessions/scheduled",
        },
      ],
    },
    {
      id: "history",
      title: "History",
      href: "/history",
      icon: History,
      expandable: true,
      nested: [
        {
          title: "Recent Activities",
          href: "/history/recent",
        },
        {
          title: "Archives",
          href: "/history/archives",
        },
        {
          title: "Usage Reports",
          href: "/history/reports",
        },
      ],
    },
    {
      id: "transcripts",
      title: "Transcripts",
      href: "/transcripts",
      icon: FileText,
    },
    {
      id: "glossaries",
      title: "Glossaries",
      href: "/glossaries",
      icon: Book,
    },
    {
      id: "team",
      title: "Team",
      href: "/team",
      icon: Users,
    },
    {
      id: "notifications",
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
      expandable: true,
      badge: "3",
      nested: [
        {
          title: "Unread",
          href: "/notifications/unread",
          badge: "3",
        },
        {
          title: "All Notifications",
          href: "/notifications/all",
        },
        {
          title: "Settings",
          href: "/notifications/settings",
        },
      ],
    },
  ];

  // Workspace settings items
  const workspaceSettingsItems = [
    {
      title: "General",
      href: "/workspace/settings/general",
    },
    {
      title: "Team Members",
      href: "/workspace/settings/team",
    },
    {
      title: "Default Settings",
      href: "/workspace/settings/defaults",
    },
    {
      title: "Sharing",
      href: "/workspace/settings/sharing",
    },
  ];

  // Organization settings items
  const orgSettingsItems = [
    {
      title: "Organization Profile",
      href: "/organization/profile",
    },
    {
      title: "Workspaces",
      href: "/organization/workspaces",
    },
    {
      title: "Custom Fields",
      href: "/organization/fields",
    },
    {
      title: "Billing",
      href: "/organization/billing",
    },
  ];

  // Support items
  const supportItems = [
    {
      title: "Help Center",
      href: "/help",
      icon: HelpCircle,
    },
    {
      title: "Support",
      href: "/support",
      icon: AlertCircle,
    },
    {
      title: "Status",
      href: "/status",
      icon: Signal,
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
                      {activeWorkspace}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
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

      {/* Workspace Features Section */}
      <SidebarSection title="Workspace">
        <div className="space-y-1">
          {workspaceItems.map((item) => (
            <div key={item.id}>
              {item.expandable ? (
                <div className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-800 transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={(e) => {
                      if (item.expandable) {
                        e.preventDefault();
                        toggleExpanded(item.id);
                      }
                    }}
                  >
                    <item.icon className="h-4 w-4 text-brand-teal shrink-0" />
                    {!isCollapsed && (
                      <span className="mr-auto truncate font-medium text-gray-800">
                        {item.title}
                      </span>
                    )}
                    {!isCollapsed && item.badge && (
                      <Badge
                        variant="outline"
                        className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-brand-teal text-[10px] text-brand-teal"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {!isCollapsed && item.expandable && (
                      <div className="ml-auto">
                        {expandedItems[item.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-800 transition-colors",
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4 text-brand-teal shrink-0" />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "truncate font-medium",
                        pathname === item.href
                          ? "text-gray-900"
                          : "text-gray-700"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <Badge
                      variant="outline"
                      className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-brand-teal text-[10px] text-brand-teal"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}

              {/* Nested items if expanded */}
              {!isCollapsed &&
                item.expandable &&
                expandedItems[item.id] &&
                item.nested && (
                  <div className="mt-1 pl-7 space-y-1">
                    {item.nested.map((nestedItem, index) => (
                      <Link
                        key={index}
                        href={nestedItem.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm text-gray-700 transition-colors",
                          pathname === nestedItem.href
                            ? "bg-gray-50 text-gray-900 font-medium"
                            : "hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <span
                          className={cn(
                            "truncate font-medium",
                            pathname === nestedItem.href
                              ? "text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          {nestedItem.title}
                        </span>
                        {nestedItem.badge && (
                          <Badge
                            variant="outline"
                            className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-brand-teal text-[10px] text-brand-teal"
                          >
                            {nestedItem.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </SidebarSection>

      {/* Management Section */}
      <SidebarSection title="Management">
        <div className="space-y-1">
          {/* Workspace Settings */}
          <div className="relative">
            <div
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              onClick={() => toggleExpanded("workspace")}
            >
              <Settings className="h-4 w-4 text-brand-teal shrink-0" />
              {!isCollapsed && (
                <span className="truncate mr-auto font-medium text-gray-800">
                  Workspace Settings
                </span>
              )}
              {!isCollapsed && (
                <div className="ml-auto">
                  {expandedItems.workspace ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Workspace Settings Nested */}
          {!isCollapsed && expandedItems.workspace && (
            <div className="mt-1 pl-7 space-y-1">
              {workspaceSettingsItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm text-gray-700 transition-colors",
                    pathname === item.href
                      ? "bg-gray-50 text-gray-900 font-medium"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span
                    className={cn(
                      "truncate font-medium",
                      pathname === item.href ? "text-gray-900" : "text-gray-700"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Organization Settings */}
          <div className="relative">
            <div
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              onClick={() => toggleExpanded("organization")}
            >
              <Building2 className="h-4 w-4 text-brand-teal shrink-0" />
              {!isCollapsed && (
                <span className="truncate mr-auto font-medium text-gray-800">
                  Organization Settings
                </span>
              )}
              {!isCollapsed && (
                <div className="ml-auto">
                  {expandedItems.organization ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Organization Settings Nested */}
          {!isCollapsed && expandedItems.organization && (
            <div className="mt-1 pl-7 space-y-1">
              {orgSettingsItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm text-gray-700 transition-colors",
                    pathname === item.href
                      ? "bg-gray-50 text-gray-900 font-medium"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span
                    className={cn(
                      "truncate font-medium",
                      pathname === item.href ? "text-gray-900" : "text-gray-700"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SidebarSection>

      {/* Support Section */}
      <SidebarSection title="Help">
        {supportItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <SidebarItem
              icon={<item.icon className="h-4 w-4" />}
              title={item.title}
              isActive={pathname === item.href}
            />
          </Link>
        ))}
      </SidebarSection>
    </>
  );
}
