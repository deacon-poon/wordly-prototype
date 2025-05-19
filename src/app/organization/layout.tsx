"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [detailsPanel, setDetailsPanel] = useState<React.ReactNode | null>(
    null
  );
  const [showPanel, setShowPanel] = useState(false);

  // Custom event listener to handle field selection from child components
  useEffect(() => {
    const handleFieldSelect = (e: CustomEvent) => {
      setSelectedFieldId(e.detail.fieldId);
      setDetailsPanel(e.detail.content);
      setShowPanel(!!e.detail.content);
    };

    window.addEventListener("field-selected" as any, handleFieldSelect);
    return () => {
      window.removeEventListener("field-selected" as any, handleFieldSelect);
    };
  }, []);

  // Reset panel when navigating away from custom-fields
  useEffect(() => {
    if (!pathname.includes("/organization/custom-fields")) {
      setShowPanel(false);
      setDetailsPanel(null);
      setSelectedFieldId(null);
    }
  }, [pathname]);

  const closePanel = () => {
    setShowPanel(false);
    setDetailsPanel(null);
    setSelectedFieldId(null);

    // Dispatch event to notify child components
    window.dispatchEvent(
      new CustomEvent("field-deselected", {
        detail: { fieldId: selectedFieldId },
      })
    );
  };

  // Only use resizable panel on the custom fields page
  const isCustomFieldsPage = pathname.includes("/organization/custom-fields");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Organization Management" />
        <main className="flex-1 overflow-auto bg-[#f8f9fa]">
          {isCustomFieldsPage && showPanel ? (
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={70} minSize={50}>
                <div className="h-full overflow-auto">
                  <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
                    {children}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                <div className="h-full overflow-auto bg-white border-l">
                  <div className="p-4 border-b sticky top-0 bg-white z-10 flex items-center justify-between">
                    <h2 className="font-semibold">Field Details</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={closePanel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {detailsPanel}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
              {children}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
