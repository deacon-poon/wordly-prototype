/**
 * Shell registry — maps each chrome variant to its app-layout wrapper.
 *
 * Both wrappers take the same `{children}` (the page container) and place it at
 * their own level. Adding a new chrome = add a wrapper + one entry here.
 */

import type React from "react";

import { LegacyShell } from "@/legacy/components/shell/LegacyShell";
import { RebrandShell } from "@/components/layouts/RebrandShell";
import type { ChromeVariant } from "./chrome-context";

export const SHELLS: Record<
  ChromeVariant,
  React.ComponentType<{ children: React.ReactNode }>
> = {
  legacy: LegacyShell,
  rebrand: RebrandShell,
};
