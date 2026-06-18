"use client";

/**
 * AppShell context — extracted into its own module so both AppShellProvider and
 * the shell wrappers (RebrandShell) can consume it without a circular import.
 * Holds the right-panel state shared across the rebrand shell.
 */

import { createContext, useContext } from "react";
import type React from "react";

export interface RightPanelState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
}

export interface AppShellContextType {
  rightPanel: RightPanelState;
  setRightPanel: (panel: Partial<RightPanelState>) => void;
  openRightPanel: (title: string, content: React.ReactNode) => void;
  closeRightPanel: () => void;
}

export const AppShellContext = createContext<AppShellContextType | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within AppShellProvider");
  }
  return context;
}
