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
    <Sidebar className="">
      <SidebarHeader className="flex items-center justify-center px-4 h-16">
        <div className="flex items-center">
          <Image
            src="/logo/wordly-logo-primary-with-radius-border.png"
            alt="Wordly Logo"
            width={36}
            height={36}
          />
          {!isCollapsed && (
            <span className="text-xl font-bold text-primary-blue-700 ml-2">
              wordly
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarNav className="flex-grow overflow-y-auto">
        <NavWorkspace pathname={pathname} />
      </SidebarNav>
      <SidebarFooter className="p-0 m-0 mt-2">
        <div className="flex items-center gap-3 p-4 bg-primary-blue-50 hover:bg-primary-blue-100 rounded-lg transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user?.displayName} />
            <AvatarFallback className="bg-primary-blue-200 text-primary-blue-800">
              {user?.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-primary-blue-800">
                {user?.displayName}
              </span>
              <span className="text-xs text-gray-600">
                {user?.email}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
