"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";
import { AppHeader } from "../app-header";
import { AppSidebar } from "../app-sidebar";

interface RightPanelState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
}

interface AppShellContextType {
  rightPanel: RightPanelState;
  setRightPanel: (panel: Partial<RightPanelState>) => void;
  openRightPanel: (title: string, content: React.ReactNode) => void;
  closeRightPanel: () => void;
}

const AppShellContext = createContext<AppShellContextType | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within AppShellProvider");
  }
  return context;
}

interface AppShellProviderProps {
  children: React.ReactNode;
}

export function AppShellProvider({ children }: AppShellProviderProps) {
  const pathname = usePathname();
  const [rightPanel, setRightPanelState] = useState<RightPanelState>({
    isOpen: false,
    title: "",
    content: null,
  });

  // Determine if we should show AppShell (skip for auth pages)
  const shouldShowAppShell =
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup");

  // Get page title based on pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return "Dashboard";

    switch (segments[0]) {
      case "transcripts":
        return "Transcripts";
      case "glossaries":
        return "Glossaries";
      case "sessions":
        return "Sessions";
      case "history":
        return "History";
      case "organization":
        return "Organization Management";
      case "workspace":
      case "workspace-settings":
        return "Workspace Settings";
      default:
        return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    }
  };

  const setRightPanel = (panel: Partial<RightPanelState>) => {
    setRightPanelState((prev) => ({ ...prev, ...panel }));
  };

  const openRightPanel = (title: string, content: React.ReactNode) => {
    setRightPanelState({
      isOpen: true,
      title,
      content,
    });
  };

  const closeRightPanel = () => {
    setRightPanelState((prev) => ({ ...prev, isOpen: false }));
  };

  const contextValue: AppShellContextType = {
    rightPanel,
    setRightPanel,
    openRightPanel,
    closeRightPanel,
  };

  if (!shouldShowAppShell) {
    return <>{children}</>;
  }

  return (
    <AppShellContext.Provider value={contextValue}>
      <AppShell
        sidebar={<AppSidebar />}
        header={<AppHeader title={getPageTitle()} />}
        rightPanel={rightPanel.content}
        showRightPanel={rightPanel.isOpen}
        rightPanelTitle={rightPanel.title}
        onRightPanelClose={closeRightPanel}
      >
        {children}
      </AppShell>
    </AppShellContext.Provider>
  );
}
