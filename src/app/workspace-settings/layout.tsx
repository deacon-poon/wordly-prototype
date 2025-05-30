"use client";

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

export default function WorkspaceSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Get the active tab based on current pathname
  const getActiveTab = () => {
    if (pathname.includes("/workspace/session-defaults"))
      return "session-defaults";
    if (pathname.includes("/workspace/custom-fields")) return "custom-fields";
    if (pathname.includes("/workspace/users")) return "users";
    return "session-defaults";
  };

  return (
    <main className="flex-1 p-6 h-full">
      <div className="flex flex-col gap-6 h-full">
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

        <Tabs value={getActiveTab()} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="session-defaults" asChild>
              <a href="/workspace/session-defaults">Session Defaults</a>
            </TabsTrigger>
            <TabsTrigger value="custom-fields" asChild>
              <a href="/workspace/custom-fields">Custom Fields</a>
            </TabsTrigger>
            <TabsTrigger value="users" asChild>
              <a href="/workspace/users">Users</a>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={getActiveTab()} className="space-y-4 flex-1">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
