"use client";

import { store } from "./index";
import { Provider } from "react-redux";
import { WorkspaceProvider } from "@/contexts/workspace-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </Provider>
  );
}
