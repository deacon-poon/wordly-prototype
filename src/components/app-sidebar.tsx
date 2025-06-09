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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  const isCollapsed = useSelector(selectSidebarCollapsed);

  // This would come from your user auth state in a real app
  const user = {
    displayName: "Deacon Poon",
    email: "deacon@wordly.ai",
    avatar: "/avatars/01.png",
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="flex items-center justify-start px-4">
        <div className="flex items-center">
          <Image
            src="/logo/wordly-logo.svg"
            alt="Wordly Logo"
            width={36}
            height={36}
          />
          {!isCollapsed && (
            <span className="text-xl font-bold text-primary-teal-600 ml-2">
              wordly
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarNav className="flex-grow overflow-y-auto">
        <NavWorkspace pathname={pathname} />
      </SidebarNav>
      <SidebarFooter className="p-0 m-0 mt-2">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-teal-25 to-secondary-navy-25 hover:bg-gradient-to-r hover:from-primary-teal-50 hover:to-secondary-navy-50 rounded-lg transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user?.displayName} />
            <AvatarFallback className="bg-primary-teal-100 text-secondary-navy-700">
              {user?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-secondary-navy-700">
                {user?.displayName}
              </span>
              <span className="text-xs text-secondary-navy-500">
                {user?.email}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
