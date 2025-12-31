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
      <Image
        src="/logo/wordly-logo-rebrand-blue.svg"
        alt="Wordly Logo"
        width={120}
        height={36}
        className={cn(
          "h-9 w-auto transition-opacity duration-300",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}
        priority
      />
    </div>
  );
}
