import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { WorkspaceManager } from "./workspace-manager";

/**
 * Mirrors the portal Overview story 1:1:
 *   wordly_portal: stories/business/wordly-workspace-manager/story-1.Overview.stories.ts
 *
 * The Angular meta is `title: 'Business/WordlyWorkspaceManager'` with a single
 * `Overview` story (empty args). We keep the repo's existing
 * "Workspace Kit/WorkspaceManager" namespace and expose the same single
 * Overview, driven by the mock workspaces.
 */
const meta: Meta<typeof WorkspaceManager> = {
  title: "Workspace Kit/WorkspaceManager",
  component: WorkspaceManager,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-workspace-manager`. " +
          "A workspace combobox (label + outline trigger) with an 'Add workspace' " +
          "action and a user menu (Edit profile / Log out), plus a 'Create New " +
          "Workspace' dialog with a name input (max length, info tooltip). Data " +
          "via props (mock by default); no Angular DI / bridge / data service layer.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceManager>;

/** Controlled wrapper so the story reflects real selection state. */
function Controlled(props: React.ComponentProps<typeof WorkspaceManager>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <div className="w-80">
      <WorkspaceManager {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

export const Overview: Story = {
  name: "Overview",
  render: (args) => <Controlled {...args} />,
  args: {},
};
