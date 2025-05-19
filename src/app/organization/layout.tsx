"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  const tabs = [
    { id: "users", label: "All Users", href: "/organization/users" },
    {
      id: "custom-fields",
      label: "Custom Fields",
      href: "/organization/custom-fields",
    },
    { id: "accounts", label: "Accounts", href: "/organization/accounts" },
    { id: "billing", label: "Billing", href: "/organization/billing" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto bg-[#f8f9fa]">
          <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Organization Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Organization Management
              </h1>
              <p className="text-muted-foreground">
                Manage organization-wide settings, users, and billing.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                  {tabs.map((tab) => {
                    const isActive =
                      (tab.id === "users" && lastSegment === "users") ||
                      (tab.id === "custom-fields" &&
                        lastSegment === "custom-fields") ||
                      (tab.id === "accounts" && lastSegment === "accounts") ||
                      (tab.id === "billing" && lastSegment === "billing");

                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        className={`
                          py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                          ${
                            isActive
                              ? "border-[#006064] text-[#006064]"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }
                        `}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
