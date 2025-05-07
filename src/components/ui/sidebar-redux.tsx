"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  selectSidebarCollapsed,
} from "@/store/slices/sidebarSlice";

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  return (
    <div className="grid md:grid-cols-[auto_1fr] min-h-screen">{children}</div>
  );
}

interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const dispatch = useDispatch();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      onClick={() => dispatch(toggleSidebar())}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarInset({ children, className }: SidebarInsetProps) {
  const collapsed = useSelector(selectSidebarCollapsed);

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen",
        collapsed ? "md:ml-0" : "md:ml-[220px]",
        className
      )}
    >
      {children}
    </div>
  );
}
