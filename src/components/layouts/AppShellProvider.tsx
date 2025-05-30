"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";
import { AppHeader } from "../app-header";
import { AppSidebar } from "../app-sidebar";

interface AppShellProviderProps {
  children: React.ReactNode;
}

export function AppShellProvider({ children }: AppShellProviderProps) {
  const pathname = usePathname();

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

  if (!shouldShowAppShell) {
    return <>{children}</>;
  }

  return (
    <AppShell
      sidebar={<AppSidebar />}
      header={<AppHeader title={getPageTitle()} />}
    >
      {children}
    </AppShell>
  );
}
