"use client";

/**
 * LegacyNav — EXACT 1:1 replica of the deployed Angular portal site navigation.
 *
 *   wordly_portal@origin/main:
 *     src/app/components/navigator/navigator.component.html  (this template)
 *     src/app/components/navigator/navigator.component.ts    (data → nav-data.ts)
 *     src/app/components/navigator/navigator.component.scss   (→ legacy-nav.module.css)
 *
 * Structure/markup is mirrored node-for-node; the only intentional deviation is the
 * brand color (deployed teal #128197 → rebrand blue #017CFF), handled in the CSS module.
 *
 * Angular DI (i18next, routing, keycloak, websocket alert badges) is dropped: nav
 * composition is driven by the NavContext mock and active state by `usePathname()`.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

import { WorkspaceManager } from "@/components/workspace/workspace-manager";
import { useNavContext } from "@/legacy/services/nav-context";
import { buildNavSections, markActive } from "./nav-data";
import styles from "./legacy-nav.module.css";

/**
 * Angular's lucide-angular uses newer canonical icon names; this repo's
 * lucide-react is 0.298.0 (pre-rename). Map the renamed ones to their 0.298 export.
 */
const LUCIDE_ALIASES: Record<string, string> = {
  "circle-gauge": "GaugeCircle",
  "laptop-minimal": "Laptop",
  "chart-line": "LineChart",
  "chart-pie": "PieChart",
  "rectangle-ellipsis": "CircleEllipsis",
  "triangle-alert": "AlertTriangle",
};

/** Resolve a kebab-case lucide name (Angular `lucidIcon`) to a lucide-react icon. */
function LucidIcon({ name }: { name?: string }) {
  if (!name) return null;
  const pascal =
    LUCIDE_ALIASES[name] ??
    name
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join("");
  const icons = LucideIcons as unknown as Record<string, React.ElementType>;
  const Icon = icons[pascal] ?? LucideIcons.Circle;
  return <Icon className={styles["lucid-icon"]} aria-hidden="true" />;
}

export interface LegacyNavProps {
  /** Mirrors Angular @Input() hideNav. */
  hideNav?: boolean;
  /** Mirrors PageBlockService.blockPage → nopointer class. */
  blockPage?: boolean;
}

export function LegacyNav({
  hideNav = false,
  blockPage = false,
}: LegacyNavProps) {
  const ctx = useNavContext();
  const router = useRouter();
  const pathname = usePathname() ?? "";

  // navSections + active state (markRoles() + activeNav()).
  const navSections = React.useMemo(() => {
    if (hideNav) return [];
    const sections = buildNavSections(ctx);
    markActive(sections, pathname);
    return sections;
  }, [ctx, pathname, hideNav]);

  // Local open state for collapsible parents (Angular template `nav.display`).
  const [openPath, setOpenPath] = React.useState<string | null>(null);

  const showWorkspaceManager = ctx.isWorkspacesEnabled && ctx.isSSOUser;

  return (
    <div className={styles["dynamic-nav"]}>
      <nav
        className={`${styles["nav-section"]} ${blockPage ? styles.nopointer : ""}`}
      >
        <div className={styles["header-logos"]}>
          <div className={`${styles["header-icon"]} cursor`}>
            {/* Rebrand (per Deacon): brand-blue Wordly wordmark on the white nav
                top bar, top-left, per the Organizations/Workspaces Figma. */}
            <img
              className={styles["wordly-img"]}
              src="/logo/wordly-logo-rebrand-blue.svg"
              alt="Wordly Logo"
            />
          </div>
          <div className={styles.htfix} />
        </div>

        <div className={`${styles["nav-links"]} scrollbar-none`}>
          {showWorkspaceManager && (
            <div className={styles["ws-manager-container"]}>
              <span className={styles["ws-floating-label"]}>Workspace:</span>
              <WorkspaceManager
                label=""
                layoutVariant="stacked"
                labelContextVariant="stacked"
                contentContextVariant="stacked"
                onCreateWorkspace={() => router.push("/workspace/users")}
                onEditProfile={() => router.push("/profile")}
                onWorkspaceSettings={() => router.push("/workspace/settings")}
              />
            </div>
          )}

          {navSections.map((section, si) => (
            <div key={section.title ?? `section-${si}`}>
              {section.title && (
                <div className={styles["nav-section-title"]}>
                  {section.title}
                </div>
              )}
              {section.items.map((nav) => {
                // *ngIf="!(isSharedWorkspace && nav.path === '/accounts')"
                if (ctx.isSharedWorkspace && nav.path === "/accounts") {
                  return null;
                }
                const hasPath = !!nav.path && nav.children.length === 0;
                return (
                  <div
                    key={nav.path || nav.label}
                    className={`${styles["nav-block"]} ${
                      nav.isActive ? styles["nav-active"] : ""
                    }`}
                  >
                    {hasPath ? (
                      <Link
                        href={nav.path}
                        role="link"
                        aria-label={nav.ariaLabel || undefined}
                        className={styles["nav-link"]}
                      >
                        {nav.lucidIcon && (
                          <span
                            className={styles["nav-icon"]}
                            aria-hidden="true"
                          >
                            <LucidIcon name={nav.lucidIcon} />
                          </span>
                        )}
                        <span className={styles["nav-label"]}>{nav.label}</span>
                        {nav.badge ? (
                          <span className={styles.badge}>{nav.badge}</span>
                        ) : null}
                        <div className={styles.htfix} />
                      </Link>
                    ) : (
                      <div
                        className={`${styles["nav-link"]} ${styles["nav-children"]}`}
                        onClick={() =>
                          setOpenPath((p) =>
                            p === nav.label ? null : nav.label
                          )
                        }
                        onMouseLeave={() => setOpenPath(null)}
                      >
                        {nav.lucidIcon && (
                          <span className={styles["nav-icon"]}>
                            <LucidIcon name={nav.lucidIcon} />
                          </span>
                        )}
                        <span className={styles["nav-label"]}>{nav.label}</span>
                        {nav.children.length > 0 && (
                          <div className={styles["child-arrow"]}>
                            <LucideIcons.ChevronDown
                              className={styles["lucid-icon"]}
                            />
                          </div>
                        )}
                        <div className={styles.htfix} />
                        <div
                          className={`${styles["dropdown-menu"]} ${
                            openPath === nav.label
                              ? styles["dropdown-menu-display"]
                              : ""
                          }`}
                        >
                          {nav.children.map((child) => (
                            <Link
                              key={child.path}
                              href={child.path}
                              className={`${styles["dropdown-item"]} ${
                                child.isActive ? styles.active : ""
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.htfix} />
      </nav>
    </div>
  );
}

export default LegacyNav;
