"use client";

/**
 * NavContext — mock stand-in for the Angular DI services that drive nav composition
 * in `navigator.component.ts` (KeycloakUserService, FeaturesService,
 * RolePermissionService, WorkspaceStateService).
 *
 * In the Angular portal these come from auth/roles/feature-flag services; here they
 * are plain mock state so design can toggle each persona/flag and see the nav change.
 * The section-building logic in `nav-data.ts` is a 1:1 port that reads this shape.
 */

import * as React from "react";

/** Keycloak role strings (Angular ConstantsService). */
export const ROLES = {
  USER: "USER",
  WORDLY_ADMIN: "WORDLY_ADMIN",
  WORDLY_TECH: "WORDLY_TECH",
} as const;

export interface NavContextValue {
  /** Keycloak roles the user holds (Angular `keyCloakRoles`). */
  keyCloakRoles: string[];
  isSSOUser: boolean;
  nonAdminSSO: boolean;
  isRealmAdmin: boolean;
  isSharedWorkspace: boolean;

  // Feature flags (Angular FeaturesService) ------------------------------
  isWorkspacesEnabled: boolean;
  isUsageV2Enabled: boolean;
  isEventsEnabled: boolean;
  /** Angular RolePermissionService.isAllowedForEvents(). */
  isAllowedForEvents: boolean;
  adminSessionsEnabled: boolean;
}

/** Default persona: an SSO org admin with workspaces + usage v2 + events on. */
export const DEFAULT_NAV_CONTEXT: NavContextValue = {
  keyCloakRoles: [ROLES.USER],
  isSSOUser: true,
  nonAdminSSO: false,
  isRealmAdmin: true,
  isSharedWorkspace: false,
  isWorkspacesEnabled: true,
  isUsageV2Enabled: true,
  isEventsEnabled: true,
  isAllowedForEvents: true,
  adminSessionsEnabled: false,
};

const NavContext = React.createContext<NavContextValue>(DEFAULT_NAV_CONTEXT);

export function NavContextProvider({
  value,
  children,
}: {
  value?: Partial<NavContextValue>;
  children: React.ReactNode;
}) {
  const merged = React.useMemo(
    () => ({ ...DEFAULT_NAV_CONTEXT, ...value }),
    [value]
  );
  return <NavContext.Provider value={merged}>{children}</NavContext.Provider>;
}

export function useNavContext() {
  return React.useContext(NavContext);
}
