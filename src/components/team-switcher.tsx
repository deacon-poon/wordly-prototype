"use client";

import * as React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

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
        <div className="flex  items-center justify-center">
          <Image
            src="/logo/wordly-logo-primary-with-radius-border.png"
            alt="Wordly Logo"
            width={40}
            height={40}
          />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold text-primary-teal-600">
              Wordly
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
