"use client";

/**
 * RebrandShell — the new-design app layout wrapper.
 *
 * Symmetric counterpart to LegacyShell: takes only `{children}` (the page
 * container) and wraps it in the rebrand AppShell (collapsible sidebar + header +
 * resizable right panel). Right-panel state comes from the shared AppShell context.
 */

import * as React from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "./AppShell";
import { AppHeader } from "../app-header";
import { AppSidebar } from "./AppSidebar";
import { useAppShell } from "./app-shell-context";
import { getFeatureTitle } from "@/shell/nav-registry";

/** Page title from the pathname (moved from AppShellProvider). */
function getPageTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  switch (segments[0]) {
    case "transcripts":
      return "Transcripts";
    case "glossaries":
      return "Glossaries";
    case "sessions":
      return "Sessions";
    case "events":
      return "Events";
    case "history":
      return "History";
    case "organization":
      if (segments[1] === "usage") return "Organization Usage";
      return "Organization Management";
    case "workspace":
    case "workspace-settings":
      return "Workspace Settings";
    case "lab":
      return (segments[1] && getFeatureTitle(segments[1])) || "Lab";
    default:
      return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  }
}

export function RebrandShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { rightPanel, closeRightPanel } = useAppShell();

  return (
    <AppShell
      sidebar={<AppSidebar />}
      header={<AppHeader title={getPageTitle(pathname)} />}
      rightPanel={rightPanel.content}
      showRightPanel={rightPanel.isOpen}
      rightPanelTitle={rightPanel.title}
      onRightPanelClose={closeRightPanel}
    >
      {children}
    </AppShell>
  );
}

export default RebrandShell;
