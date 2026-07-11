"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "./nav";
import { cn } from "@/lib/utils";

export function DocSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Component documentation"
      className="flex flex-col gap-6 p-4"
    >
      <Link
        href="/doc"
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname === "/doc"
            ? "bg-primary-blue-50 text-primary-blue-800"
            : "text-foreground hover:bg-muted"
        )}
      >
        Overview
      </Link>

      {navGroups.map((group) => {
        const groupActive = group.items.some((item) =>
          pathname.startsWith(item.href.split("#")[0])
        );
        return (
          <div key={group.title} className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const itemPath = item.href.split("#")[0];
                const active = groupActive && pathname === itemPath;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-md px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "text-primary-blue-700"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
