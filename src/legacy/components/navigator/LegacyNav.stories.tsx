import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { LegacyNav } from "./LegacyNav";
import {
  NavContextProvider,
  NavContextValue,
  ROLES,
} from "@/legacy/services/nav-context";

/**
 * LegacyNav — 1:1 replica of the deployed Angular portal site navigation
 *   wordly_portal: src/app/components/navigator/navigator.component.*
 *
 * Stories drive the same persona/feature-flag permutations the Angular
 * markRoles() branches on, so you can see each composed nav. Brand color is the
 * rebrand blue (#017CFF), swapped from the deployed teal.
 */
const meta: Meta<typeof LegacyNav> = {
  title: "Site Nav/LegacyNav",
  component: LegacyNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Exact replica of the production Angular `app-navigator`: sectioned nav " +
          "(User / Workspace Admin / Organization Admin / Internal) composed from " +
          "keycloak roles + feature flags + workspace type, with the workspace " +
          "manager combobox at top. Structure is 1:1; brand color swapped teal→blue.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LegacyNav>;

/** Render the nav at a realistic sidebar width inside a NavContext persona. */
function Framed({ ctx }: { ctx?: Partial<NavContextValue> }) {
  return (
    <NavContextProvider value={ctx}>
      <div style={{ width: 280, height: "100vh" }}>
        <LegacyNav />
      </div>
    </NavContextProvider>
  );
}

/** Default persona: SSO org admin, workspaces + usage v2 + events on. */
export const Overview: Story = {
  render: () => <Framed />,
};

/** Non-SSO standard user: no workspace manager, session defaults appended. */
export const NonSsoUser: Story = {
  render: () => (
    <Framed
      ctx={{
        isSSOUser: false,
        isRealmAdmin: false,
        isWorkspacesEnabled: false,
      }}
    />
  ),
};

/** Shared workspace: Accounts/Purchase hidden, Workspace Users shown. */
export const SharedWorkspace: Story = {
  render: () => <Framed ctx={{ isSharedWorkspace: true }} />,
};

/** Wordly internal admin: adds the "Internal" section. */
export const InternalAdmin: Story = {
  render: () => (
    <Framed
      ctx={{
        keyCloakRoles: [ROLES.USER, ROLES.WORDLY_ADMIN],
        adminSessionsEnabled: true,
      }}
    />
  ),
};
