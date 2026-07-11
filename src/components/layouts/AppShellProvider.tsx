"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

import { getFeatureChrome } from "@/shell/nav-registry";
import { useChrome } from "@/components/chrome/chrome-context";
import { SHELLS } from "@/components/chrome/shell-registry";
import {
  AppShellContext,
  AppShellContextType,
  RightPanelState,
} from "./app-shell-context";

// Re-export so existing consumers (`@/components/layouts/AppShellProvider`) keep working.
export { useAppShell } from "./app-shell-context";

interface AppShellProviderProps {
  children: React.ReactNode;
}

export function AppShellProvider({ children }: AppShellProviderProps) {
  const pathname = usePathname();
  const { chrome } = useChrome();
  const [rightPanel, setRightPanelState] = useState<RightPanelState>({
    isOpen: false,
    title: "",
    content: null,
  });

  // Lab features can opt out of the shell (standalone attendee/public experiences).
  const labSegments = pathname.split("/").filter(Boolean);
  const isStandaloneLabFeature =
    labSegments[0] === "lab" &&
    !!labSegments[1] &&
    getFeatureChrome(labSegments[1]) === "standalone";

  // Skip the shell for auth/public pages and standalone lab features.
  const shouldShowAppShell =
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup") &&
    !pathname.startsWith("/public") &&
    !pathname.startsWith("/doc") &&
    !isStandaloneLabFeature;

  const setRightPanel = (panel: Partial<RightPanelState>) => {
    setRightPanelState((prev) => ({ ...prev, ...panel }));
  };

  const openRightPanel = (title: string, content: React.ReactNode) => {
    setRightPanelState({ isOpen: true, title, content });
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

  // Pick the active app-layout wrapper for this chrome version. Both wrappers
  // consume the same `children` (page container) at their own level.
  const Shell = SHELLS[chrome];

  return (
    <AppShellContext.Provider value={contextValue}>
      <Shell>{children}</Shell>
    </AppShellContext.Provider>
  );
}
