/**
 * Nav-item definitions + section composition — EXACT 1:1 port of
 *   wordly_portal@origin/main:
 *     src/app/components/navigator/navigator.component.ts
 *       (the Navigator field declarations + markRoles() / updateUserNavigation() /
 *        setOrganizationAdminNavigation() / setworkspaceAdminNavigation())
 *
 * The Angular component builds `navSections` imperatively in markRoles() driven by
 * keycloak roles + feature flags + workspace type. This port reproduces that exact
 * sequence as a pure function `buildNavSections(ctx)` over the NavContext mock.
 *
 * i18n: Angular localizes labels via i18next; the deployed English fallbacks are
 * inlined here (same strings as the `localize(path, fallback)` defaults).
 */

import {
  Navigator,
  NavigatorSection,
  AccessType,
} from "@/legacy/models/navigator";
import { NavContextValue, ROLES } from "@/legacy/services/nav-context";

/** Build the nav-item instances (Angular component field initializers). */
function createNavItems() {
  return {
    dashboard: new Navigator(
      "/dashboard",
      "Dashboard",
      [],
      "circle-gauge",
      AccessType.NORMAL_USER
    ),
    presentation: new Navigator(
      "/sessions",
      "Sessions",
      [],
      "laptop-minimal",
      AccessType.ADMIN_USER
    ),
    adminPresentations: new Navigator(
      "/admin-sessions",
      "All Sessions",
      [],
      "laptop-minimal"
    ),
    usage: (() => {
      const nav = new Navigator(
        "/usage",
        "Usage",
        [],
        "chart-line",
        AccessType.ADMIN_USER
      );
      nav.ariaLabel = "Usage";
      return nav;
    })(),
    usageSummary: new Navigator(
      "/activity",
      "Activity",
      [],
      "chart-line",
      AccessType.ADMIN_USER
    ),
    userAccounts: new Navigator(
      "/accounts",
      "Accounts",
      [],
      "wallet",
      AccessType.ADMIN_USER
    ),
    events: new Navigator(
      "/events",
      "Events",
      [],
      "calendar-days",
      AccessType.ADMIN_USER
    ),
    transcripts: new Navigator(
      "/transcripts",
      "Transcripts",
      [],
      "file-spreadsheet",
      AccessType.ADMIN_USER
    ),
    transactions: new Navigator(
      "/transactions",
      "Transactions",
      [],
      "arrow-left-right",
      AccessType.ADMIN_USER
    ),
    glossary: new Navigator(
      "/glossaries",
      "Glossaries",
      [],
      "languages",
      AccessType.ADMIN_USER
    ),
    purchase: new Navigator(
      "/purchase",
      "Purchase",
      [],
      "shopping-cart",
      AccessType.ADMIN_USER
    ),
    support: new Navigator(
      "/support",
      "Support",
      [],
      "phone",
      AccessType.ADMIN_USER
    ),
    adminAlerts: new Navigator(
      "/all-alerts",
      "Alerts",
      [],
      "triangle-alert",
      AccessType.ADMIN_USER
    ),
    users: new Navigator("/users", "Users", [], "users", AccessType.ADMIN_USER),
    adminAccounts: new Navigator(
      "/admin-accounts",
      "Admin Accounts",
      [],
      "wallet-cards",
      AccessType.ADMIN_USER
    ),
    usageSummaryAll: (() => {
      const nav = new Navigator(
        "/admin-usage",
        "All Usage",
        [],
        "chart-pie",
        AccessType.ADMIN_USER
      );
      nav.ariaLabel = "All Usage";
      return nav;
    })(),
    findInfo: new Navigator(
      "/find",
      "Find",
      [],
      "search",
      AccessType.ADMIN_USER
    ),
    future: new Navigator(
      "/future",
      "Future",
      [],
      "hourglass",
      AccessType.ADMIN_USER
    ),
    sessionsDefault: new Navigator(
      "/workspace/defaults",
      "Session Defaults",
      [],
      "rectangle-ellipsis"
    ),
    organizationUsage: (() => {
      const nav = new Navigator(
        "/organization-usage",
        "Org Usage",
        [],
        "chart-line",
        AccessType.ADMIN_USER
      );
      nav.ariaLabel = "Org Usage";
      return nav;
    })(),
    workspaceUser: new Navigator(
      "/workspace/users",
      "Workspace Users",
      [],
      "users"
    ),
    // Net-new (no Angular equivalent): the [WS] Edit & Delete Workspace surface.
    workspaceSettings: new Navigator(
      "/workspace/settings",
      "Workspace Settings",
      [],
      "settings"
    ),
  };
}

/**
 * 1:1 port of markRoles() + the set*Navigation() helpers. Returns the composed
 * `navSections`. Pure: builds fresh Navigator instances each call so per-render
 * active state never leaks across personas.
 */
export function buildNavSections(ctx: NavContextValue): NavigatorSection[] {
  const n = createNavItems();
  let navSections: NavigatorSection[] = [];

  // --- markRoles(): userNavigation -------------------------------------
  let userNavigation: Navigator[] = [
    n.dashboard,
    n.presentation,
    ...(ctx.isUsageV2Enabled ? [n.usage] : []),
    ...(ctx.isUsageV2Enabled ? [] : [n.usageSummary]),
    ...(ctx.isEventsEnabled && ctx.isAllowedForEvents ? [n.events] : []),
    n.transcripts,
    n.transactions,
    n.glossary,
    n.userAccounts,
    n.purchase,
    n.support,
  ];

  const adminNavigation: Navigator[] = [
    n.users,
    n.adminAlerts,
    n.adminAccounts,
    n.usageSummaryAll,
    n.findInfo,
    n.future,
  ];

  if (ctx.isSSOUser && ctx.isSharedWorkspace) {
    userNavigation = userNavigation.filter(
      (item) => item !== n.userAccounts && item !== n.purchase
    );
  }

  if (ctx.adminSessionsEnabled) {
    adminNavigation.splice(3, 0, n.adminPresentations);
  }

  if (ctx.keyCloakRoles.includes(ROLES.USER)) {
    navSections.push({
      title: undefined,
      accessType: AccessType.NORMAL_USER,
      items: userNavigation,
    });
  }

  if (!ctx.isSSOUser) {
    userNavigation.push(n.sessionsDefault);
  }

  // --- setworkspaceAdminNavigation() -----------------------------------
  const workspaceAdminTitle = "Workspace Admin";
  const canShowWorkspaceAdmin =
    ctx.isWorkspacesEnabled &&
    ctx.isSSOUser &&
    (!ctx.isSharedWorkspace || ctx.isRealmAdmin);
  const workspaceAdminNavigation: Navigator[] = [
    n.sessionsDefault,
    ...(ctx.isSharedWorkspace && !ctx.nonAdminSSO ? [n.workspaceUser] : []),
    n.workspaceSettings,
  ];
  navSections = navSections.filter((s) => s.title !== workspaceAdminTitle);
  if (canShowWorkspaceAdmin) {
    navSections.push({
      title: workspaceAdminTitle,
      accessType: AccessType.NORMAL_USER,
      items: workspaceAdminNavigation,
    });
  }

  // --- setOrganizationAdminNavigation() --------------------------------
  const orgAdminTitle = "Organization Admin";
  const canShowOrgAdmin =
    ctx.isUsageV2Enabled && ctx.isRealmAdmin && ctx.isSSOUser;
  navSections = navSections.filter((s) => s.title !== orgAdminTitle);
  if (canShowOrgAdmin) {
    navSections.push({
      title: orgAdminTitle,
      accessType: AccessType.ADMIN_USER,
      items: [n.organizationUsage],
    });
  }

  // --- Internal (Wordly admin / tech) ----------------------------------
  if (
    ctx.keyCloakRoles.includes(ROLES.WORDLY_ADMIN) ||
    ctx.keyCloakRoles.includes(ROLES.WORDLY_TECH)
  ) {
    navSections.push({
      title: "Internal",
      accessType: AccessType.ADMIN_USER,
      items: adminNavigation,
    });
  }

  return navSections;
}

/**
 * 1:1 port of activeNav(url): mark each item active by URL-substring match.
 * Mutates the passed sections (Angular mutates the live Navigator instances).
 */
export function markActive(sections: NavigatorSection[], url: string): void {
  for (const section of sections) {
    for (const item of section.items) {
      if (item.children.length) {
        let anyChild = false;
        item.children.forEach((c) => {
          c.isActive = url.includes(c.path);
          if (c.isActive) anyChild = true;
        });
        item.isActive = anyChild;
      } else {
        item.isActive = url.includes(item.path);
      }
    }
  }
}
