"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, Settings } from "lucide-react";

// Fix imports for UI components
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../components/ui/dropdown-menu";

export function NavUser() {
  const isCollapsed = useSelector(selectSidebarCollapsed);

  // This would come from your user auth state in a real app
  const user = {
    name: "Deacon Poon",
    email: "deacon@wordly.ai",
    avatar: "/avatars/01.png",
    role: "Administrator",
    permissions: ["Full Access"],
  };

  return (
    <div className="w-full">
      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "flex cursor-pointer items-center py-1 px-1 gap-3 rounded-md hover:bg-gray-100 w-full",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-brand-teal/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-brand-teal/10 text-brand-teal font-medium">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{user.role}</span>
                    <Badge
                      variant="outline"
                      className="h-4 px-1 text-[10px] bg-brand-teal/5 text-brand-teal border-brand-teal/20"
                    >
                      Admin
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown className="h-4 w-4 text-brand-teal" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 shadow-lg">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <Badge
                  variant="outline"
                  className="h-5 text-[10px] bg-brand-teal/5 text-brand-teal border-brand-teal/20"
                >
                  Admin
                </Badge>
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4 text-brand-teal" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4 text-brand-teal" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
