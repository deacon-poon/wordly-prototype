"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";

import {
  Sidebar,
  SidebarHeader,
  SidebarNav,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { NavWorkspace } from "@/components/nav-workspace";
import { NavUser } from "@/components/nav-user";
import Image from "next/image";

export function AppSidebar() {
  const pathname = usePathname();
  const isCollapsed = useSelector(selectSidebarCollapsed);

  return (
    <Sidebar className="flex flex-col">
      <SidebarHeader className="flex items-center justify-start px-4">
        <div className="flex items-center">
          <Image
            src="/logo/wordly-logo.svg"
            alt="Wordly Logo"
            width={36}
            height={36}
          />
          {!isCollapsed && (
            <span className="text-xl font-bold text-brand-teal ml-2">
              wordly
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarNav className="flex-grow">
        <NavWorkspace pathname={pathname} />
      </SidebarNav>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
