"use client";

import * as React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectSidebarCollapsed } from "@/store/slices/sidebarSlice";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Clock,
  LifeBuoy,
  Settings,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { SidebarSection, SidebarItem } from "@/components/ui/sidebar";

interface NavMainProps {
  pathname: string;
}

export function NavMain({ pathname }: NavMainProps) {
  const isCollapsed = useSelector(selectSidebarCollapsed);

  const mainItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Sessions",
      href: "/sessions",
      icon: Clock,
    },
  ];

  const systemItems = [
    {
      title: "Billing",
      href: "/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
    },
    {
      title: "Support",
      href: "/support",
      icon: LifeBuoy,
    },
  ];

  return (
    <>
      <SidebarSection title="Menu">
        {mainItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <SidebarItem
              icon={<item.icon className="h-4 w-4" />}
              title={item.title}
              isActive={pathname === item.href}
            />
          </Link>
        ))}
      </SidebarSection>

      <SidebarSection title="System">
        {systemItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <SidebarItem
              icon={<item.icon className="h-4 w-4" />}
              title={item.title}
              isActive={pathname === item.href}
            />
          </Link>
        ))}
      </SidebarSection>
    </>
  );
}
