/**
 * Site-nav data model — EXACT port of the Angular portal navigator model.
 *
 *   wordly_portal@origin/main:
 *     src/app/models/navigator/navigator.ts
 *     src/app/models/navigator/accessType.enum.ts
 *
 * The Angular `Navigator` carries both a FontAwesome `icon` (IconDefinition) and a
 * lucide icon name string (`lucidIcon`). The deployed template renders top-level
 * items with `lucidIcon` via <lucide-angular [name]>, so this port keeps `lucidIcon`
 * (a lucide-react icon name) as the icon and drops the FontAwesome dependency —
 * consistent with how the workspace-manager port dropped the Angular service layer.
 */

export enum AccessType {
  NORMAL_USER,
  ADMIN_USER,
  WORKSPACE_USER,
}

export interface NavigatorSection {
  title?: string;
  accessType: AccessType;
  items: Navigator[];
}

/** 1:1 with the Angular `Navigator` class (FontAwesome `icon` arg omitted). */
export class Navigator {
  isActive = false;
  badge?: string | number;
  activeLabels: string[] = [];
  /** Collapsible-dropdown open state (Angular template `nav.display`). */
  display = false;

  constructor(
    public path: string,
    public label: string,
    public children: Navigator[] = [],
    /** lucide-react icon name (Angular `lucidIcon`). */
    public lucidIcon?: string,
    public accessType?: AccessType,
    public ariaLabel?: string
  ) {
    if (this.children && this.children.length > 0) {
      this.children.forEach((childNav) => {
        this.activeLabels.push(childNav.label);
      });
    } else {
      this.activeLabels = [this.label];
      this.children = [];
    }
  }
}
