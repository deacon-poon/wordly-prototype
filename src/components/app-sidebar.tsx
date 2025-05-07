"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";

import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

export function AppSidebar() {
  const pathname = usePathname();
  const isCollapsed = useSelector(selectSidebarCollapsed);

  return (
    <Sidebar className="flex flex-col">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarNav className="flex-grow">
        <NavMain pathname={pathname} />
        <NavProjects pathname={pathname} />
      </SidebarNav>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
