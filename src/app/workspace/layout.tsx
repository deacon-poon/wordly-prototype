"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function WorkspaceLayout({
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
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Workspace Settings" />
        <main className="flex-1 overflow-auto bg-[#f8f9fa]">
          <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold tracking-tight">
                Workspace Settings
              </h1>
              <p className="text-muted-foreground">
                Configure your workspace settings and preferences.
              </p>
            </div>

            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
