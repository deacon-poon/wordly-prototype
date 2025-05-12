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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Determine active tab based on URL
  const getActiveTab = () => {
    const lastSegment = segments[segments.length - 1];
    switch (lastSegment) {
      case "users":
        return "users";
      case "accounts":
        return "accounts";
      case "billing":
        return "billing";
      default:
        return "users";
    }
  };

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

            <Tabs defaultValue={getActiveTab()} className="space-y-4">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="users" asChild>
                  <a href="/organization/users">Organization Users</a>
                </TabsTrigger>
                <TabsTrigger value="accounts" asChild>
                  <a href="/organization/accounts">Accounts</a>
                </TabsTrigger>
                <TabsTrigger value="billing" asChild>
                  <a href="/organization/billing">Billing & Usage</a>
                </TabsTrigger>
              </TabsList>
              <TabsContent value={getActiveTab()} className="space-y-4">
                {children}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
