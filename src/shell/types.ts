// Wordly Lab — feature-module contract.
// A prototype creator fills this out in their own src/features/<name>/feature.config.ts.
// This is pure data (no React) so it can be read by the codegen script and on the server.

/** Which sidebar group the feature appears in — mirrors the real NavWorkspace groups. */
export type NavGroup = "main" | "workspace" | "organization";

/** Lifecycle of a prototype. Informational for now. */
export type FeatureStage = "draft" | "review" | "shipped";

export interface FeatureNav {
  /** Where in the real sidebar this feature shows up. */
  group: NavGroup;
  /** Label shown in the sidebar. */
  label: string;
  /** A lucide-react icon name in PascalCase, e.g. "Sparkles". See https://lucide.dev/icons */
  icon: string;
  /** Ordering among other feature links in the same group (lower = higher). Default 100. */
  order?: number;
}

export interface FeatureConfig {
  /** URL slug + folder name. Route becomes /lab/<id>. */
  id: string;
  /** Human title (used for the page header). */
  title: string;
  /** GitHub handle of the creator who owns this feature. */
  owner?: string;
  stage?: FeatureStage;
  /**
   * How the feature is framed:
   *  - "portal" (default) → renders inside the dashboard shell (sidebar + header).
   *    Use for admin/portal features.
   *  - "standalone" → renders full-screen with no shell. Use for attendee/public
   *    end-user experiences. It still gets a sidebar entry (the portal → experience
   *    launch point); the feature provides its own "back to portal" link.
   */
  chrome?: "portal" | "standalone";
  nav: FeatureNav;
}
