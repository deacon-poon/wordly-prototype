"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Workspace {
  id: string | number;
  name: string;
  role: string;
}

interface WorkspaceContextType {
  activeWorkspace: string;
  setActiveWorkspace: (name: string) => void;
  workspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [activeWorkspace, setActiveWorkspace] = useState("Main HQ");

  // Mock workspaces data - in a real app this would come from an API or Redux store
  const workspaces: Workspace[] = [
    { id: 1, name: "Main HQ", role: "Admin" },
    { id: 2, name: "Marketing Team", role: "Member" },
    { id: 3, name: "Sales Department", role: "Viewer" },
  ];

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        setActiveWorkspace,
        workspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
