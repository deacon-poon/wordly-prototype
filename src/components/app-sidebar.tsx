"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import {
  LayoutDashboard,
  Monitor,
  ActivitySquare,
  FileText,
  CreditCard,
  Book,
  Users,
  ShoppingCart,
  LifeBuoy,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const collapsed = useSelector(selectSidebarCollapsed);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Sessions",
      href: "/sessions",
      icon: Monitor,
    },
    {
      name: "Activity",
      href: "/activity",
      icon: ActivitySquare,
    },
    {
      name: "Transcripts",
      href: "/transcripts",
      icon: FileText,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: CreditCard,
    },
    {
      name: "Glossaries",
      href: "/glossaries",
      icon: Book,
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: Users,
    },
    {
      name: "Purchase",
      href: "/purchase",
      icon: ShoppingCart,
    },
    {
      name: "Support",
      href: "/support",
      icon: LifeBuoy,
    },
  ];

  if (collapsed) {
    return (
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-10 h-full w-[70px] flex-col border-r bg-[#00B8D9]">
        <div className="flex h-16 items-center justify-center border-b border-b-white/10">
          <Link href="/" className="flex items-center justify-center">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white">
              <span className="font-semibold">W</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center rounded-lg p-2 text-white transition-all hover:bg-white/10",
                    pathname === item.href && "bg-white/10 font-medium"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 h-full flex-col border-r bg-[#00B8D9]",
        collapsed ? "hidden md:hidden" : "flex md:flex w-[220px]"
      )}
    >
      <div className="flex h-16 items-center border-b border-b-white/10 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white">
            <span className="font-semibold">W</span>
          </div>
          <span className="font-semibold text-xl text-white">wordly</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:bg-white/10",
                  pathname === item.href && "bg-white/10 font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
