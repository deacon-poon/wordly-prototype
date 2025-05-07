"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { ChevronDown, Building } from "lucide-react";

export function TeamSwitcher() {
  const isCollapsed = useSelector(selectSidebarCollapsed);

  return (
    <div className="flex w-full items-center">
      <div
        className={cn(
          "flex items-center gap-3",
          isCollapsed ? "justify-center w-full" : ""
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-teal/10">
          <Building className="h-5 w-5 text-brand-teal" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              Acme Inc.
            </span>
            <span className="text-xs text-gray-500">Enterprise</span>
          </div>
        )}
      </div>
    </div>
  );
}
