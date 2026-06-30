// Composes sidebar entries for prototype features from the generated registry.
// Pure/server-safe: returns plain data (icon stays a string name, resolved in the client nav).

import type { FeatureConfig, NavGroup } from "./types";
import { featureConfigs } from "./feature-registry.generated";

export interface FeatureNavLink {
  id: string;
  title: string;
  href: string;
  icon: string;
  order: number;
}

/** All feature nav links for a given sidebar group, ordered. */
export function getFeatureNavLinks(
  group: NavGroup,
  configs: FeatureConfig[] = featureConfigs
): FeatureNavLink[] {
  return configs
    .filter((c) => c.nav.group === group)
    .map((c) => ({
      id: c.id,
      title: c.nav.label,
      href: `/lab/${c.id}`,
      icon: c.nav.icon,
      order: c.nav.order ?? 100,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/** Look up a feature's title by slug (used for the page header). */
export function getFeatureTitle(
  id: string,
  configs: FeatureConfig[] = featureConfigs
): string | undefined {
  return configs.find((c) => c.id === id)?.title;
}

/** A feature's chrome mode (defaults to "portal" when unset/unknown). */
export function getFeatureChrome(
  id: string,
  configs: FeatureConfig[] = featureConfigs
): "portal" | "standalone" {
  return configs.find((c) => c.id === id)?.chrome ?? "portal";
}

/**
 * True when the path is a standalone (full-screen, no-shell) lab experience.
 * Used to hide dev chrome (Spotlight launcher, Vercel toolbar) so the attendee
 * view reads like the real product.
 */
export function isStandaloneLabPath(
  pathname: string | null | undefined,
  configs: FeatureConfig[] = featureConfigs
): boolean {
  const m = pathname?.match(/^\/lab\/([^/?#]+)/);
  return !!m && getFeatureChrome(m[1], configs) === "standalone";
}
