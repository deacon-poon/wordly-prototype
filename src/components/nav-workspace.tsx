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
  CalendarDays,
} from "lucide-react";
import { SidebarSection, SidebarItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/contexts/workspace-context";

interface NavWorkspaceProps {
  pathname: string;
  onClick?: () => void;
}

interface WorkspaceItem {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
}

export function NavWorkspace({ pathname, onClick }: NavWorkspaceProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);
  const { activeWorkspace, setActiveWorkspace, workspaces } = useWorkspace();

  // Main navigation items
  const mainItems: WorkspaceItem[] = [
    {
      id: "sessions",
      title: "Sessions",
      href: "/sessions",
      icon: Clock,
    },
    {
      id: "events",
      title: "Events",
      href: "/events",
      icon: CalendarDays,
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

  // Organization admin items (renamed from Org-wide admin)
  const organizationAdminItems: WorkspaceItem[] = [
    {
      id: "all-users",
      title: "All Users",
      href: "/organization/users",
      icon: UserCog,
    },
    {
      id: "custom-fields",
      title: "Custom Fields",
      href: "/organization/custom-fields",
      icon: Settings,
    },
    {
      id: "billing",
      title: "Billing",
      href: "/organization/billing",
      icon: CreditCard,
    },
  ];

  return (
    <>
      {/* Workspace Selector with Main Navigation underneath */}
      <SidebarSection>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between p-3 mb-3 rounded-md border border-accent-green-200 cursor-pointer hover:border-accent-green-300 transition-all duration-200 shadow-sm bg-gradient-to-r from-primary-teal-25 to-secondary-navy-25">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary-teal-600" />
                {!isCollapsed && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-secondary-navy-600">
                      Workspace:
                    </span>
                    <span className="text-sm font-bold text-secondary-navy-700">
                      {activeWorkspace}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-secondary-navy-500 ml-1" />
                  </div>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          {!isCollapsed && (
            <DropdownMenuContent className="w-56 border border-accent-green-200">
              <DropdownMenuLabel className="text-secondary-navy-600">
                Switch workspace
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="flex items-center gap-2 hover:bg-primary-teal-50 focus:bg-primary-teal-50 border border-transparent hover:border-accent-green-300 focus:border-accent-green-300"
                  onClick={() => setActiveWorkspace(workspace.name)}
                >
                  <div className="h-6 w-6 rounded bg-gradient-to-br from-primary-teal-400 to-primary-teal-600 flex items-center justify-center text-white text-xs font-medium">
                    {workspace.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-secondary-navy-700 font-medium">
                      {workspace.name}
                    </div>
                    <div className="text-secondary-navy-500 text-xs">
                      {workspace.role}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Building2 className="mr-2 h-4 w-4 text-primary-teal-600" />
                <span className="font-medium text-secondary-navy-700">
                  Create New Workspace
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>

        {/* Main Navigation under workspace */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={onClick}>
              <SidebarItem
                icon={<item.icon className="h-4 w-4" />}
                title={item.title}
                isActive={pathname === item.href}
              />
            </Link>
          ))}
        </div>
      </SidebarSection>

      {/* Workspace Settings */}
      <SidebarSection title={isCollapsed ? "" : "Workspace Settings"}>
        <div className="space-y-1">
          {workspaceAdminItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={onClick}>
              <SidebarItem
                icon={<item.icon className="h-4 w-4" />}
                title={item.title}
                isActive={pathname === item.href}
              />
            </Link>
          ))}
        </div>
      </SidebarSection>

      {/* Organization Section with Enhanced Visual Distinction */}
      <SidebarSection title={isCollapsed ? "" : "Organization"}>
        <div className="border border-primary-teal-200 hover:border-accent-green-300 rounded-lg space-y-1 p-1 bg-gradient-to-r from-primary-teal-25/50 to-accent-green-25 transition-colors">
          {organizationAdminItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={onClick}>
              <SidebarItem
                icon={<item.icon className="h-4 w-4" />}
                title={item.title}
                isActive={pathname === item.href}
                variant="organization"
              />
            </Link>
          ))}
        </div>
      </SidebarSection>
    </>
  );
}
