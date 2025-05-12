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
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";

export default function WorkspaceSettingsLayout({
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
      case "defaults":
        return "session-defaults";
      case "custom-fields":
        return "custom-fields";
      case "users":
        return "users";
      default:
        return "session-defaults";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Workspace Settings</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold tracking-tight">
                  Workspace Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure your workspace settings and preferences.
                </p>
              </div>

              <Tabs defaultValue={getActiveTab()} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="session-defaults" asChild>
                    <a href="/workspace/defaults">Session Defaults</a>
                  </TabsTrigger>
                  <TabsTrigger value="custom-fields" asChild>
                    <a href="/workspace/custom-fields">Custom Fields</a>
                  </TabsTrigger>
                  <TabsTrigger value="users" asChild>
                    <a href="/workspace/users">Users</a>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={getActiveTab()} className="space-y-4">
                  {children}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
