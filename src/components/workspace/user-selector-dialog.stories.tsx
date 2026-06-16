import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import {
  UserSelectorDialog,
  type UserSelectorOption,
} from "./user-selector-dialog";

/**
 * Mirrors the portal story:
 *   wordly_portal: stories/business/wordly-user-selector-dialog/
 *     story-1.Overview.stories.ts  (title 'Business/WordlyUserSelectorDialog')
 *
 * The existing `Workspace Kit/...` namespace is preserved for this repo. The
 * portal's Overview / WithCustomLabels / LimitedSelection / DynamicDialog
 * stories are reproduced; each portal story `alert()`s the selected users, so
 * we keep the same `onUsersSelected` alert handler.
 */
const meta: Meta<typeof UserSelectorDialog> = {
  title: "Workspace Kit/UserSelectorDialog",
  component: UserSelectorDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A reusable dialog component for searching and selecting users from " +
          "a list. Features: search by name or email, multi-selection, " +
          "real-time filtering, full keyboard navigation / screen-reader " +
          "support, responsive. The component emits selected users through the " +
          "`onUsersSelected` event. React migration of the production Angular " +
          "`wordly-user-selector-dialog`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    buttonText: {
      control: "text",
      description: "Text displayed on the trigger button",
    },
    dialogTitle: {
      control: "text",
      description: "Title shown in the dialog header",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    cancelButtonText: {
      control: "text",
      description: "Text for the cancel button",
    },
    addButtonText: {
      control: "text",
      description: "Text for the add/confirm button",
    },
    maxUsers: {
      control: "number",
      description:
        "Maximum number of users that can be selected (optional, no limit if not set)",
    },
    onUsersSelected: { action: "usersSelected" },
  },
};

export default meta;
type Story = StoryObj<typeof UserSelectorDialog>;

/** Portal `render` parity: each story alerts the selected users on confirm. */
function alertSelected(users: UserSelectorOption[]) {
  // eslint-disable-next-line no-alert
  alert(
    `Selected ${users.length} user(s):\n${users
      .map((u) => `${u.name} (${u.email})`)
      .join("\n")}`
  );
}

export const Overview: Story = {
  args: {
    buttonText: "Select Users",
    dialogTitle: "Choose Users",
    searchPlaceholder: "Search users by name or email...",
    cancelButtonText: "Cancel",
    addButtonText: "Add Selected Users",
    onUsersSelected: alertSelected,
  },
};

export const WithCustomLabels: Story = {
  args: {
    buttonText: "Invite Team Members",
    dialogTitle: "Invite People to Project",
    searchPlaceholder: "Find colleagues to invite...",
    cancelButtonText: "Not Now",
    addButtonText: "Send Invitations",
    onUsersSelected: (users) =>
      // eslint-disable-next-line no-alert
      alert(
        `Sending invitations to ${users.length} user(s):\n${users
          .map((u) => `${u.name} (${u.email})`)
          .join("\n")}`
      ),
  },
};

export const LimitedSelection: Story = {
  args: {
    buttonText: "Choose 3 Users Max",
    dialogTitle: "Select Team Leaders",
    searchPlaceholder: "Search for team leaders...",
    cancelButtonText: "Cancel",
    addButtonText: "Assign Roles",
    maxUsers: 3,
    onUsersSelected: (users) =>
      // eslint-disable-next-line no-alert
      alert(
        `Assigned leadership roles to ${users.length} user(s):\n${users
          .map((u) => `${u.name} (${u.email})`)
          .join("\n")}`
      ),
  },
};

/**
 * Portal `DynamicDialog`: opened programmatically (no trigger button) via the
 * WordlyUserSelectorDialogService, with config passed as context and the result
 * surfaced after close. There is no service layer in this React port, so we
 * reproduce the behavior with the controlled `open` prop driven by external
 * buttons, mirroring the portal demo's three variations + result panel.
 */
export const DynamicDialog: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates opening the dialog programmatically (no trigger button) " +
          "and handling the returned selection — the React analogue of the " +
          "portal's WordlyUserSelectorDialogService.open() flow.",
      },
    },
  },
  render: () => {
    function Demo() {
      const [config, setConfig] = React.useState<{
        dialogTitle?: string;
        dialogDescription?: string;
        searchPlaceholder?: string;
        selectedUsersText?: string;
        addButtonText?: string;
        cancelButtonText?: string;
        maxUsers?: number;
      } | null>(null);
      const [lastResult, setLastResult] = React.useState<
        UserSelectorOption[] | null
      >(null);

      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dynamic User Selector Demo</h3>
          <p className="text-gray-600 mb-2">
            This story demonstrates the <strong>dynamic mode</strong> of the
            UserSelectorDialog: it is opened programmatically rather than by a
            trigger button, and the selection is returned after close.
          </p>
          <p className="text-gray-600">
            Click the buttons below to open different variations of the dialog:
          </p>

          <div className="space-y-2">
            <button
              type="button"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-blue-600 mr-2"
              onClick={() => setConfig({})}
            >
              Open Basic Dialog
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-accent-green-600 text-white rounded-md hover:bg-accent-green-700 mr-2"
              onClick={() =>
                setConfig({
                  dialogTitle: "Choose Project Members",
                  dialogDescription:
                    "Select users who will have access to this project.",
                  searchPlaceholder: "Search by name or email...",
                  selectedUsersText: "Project Members",
                  addButtonText: "Add to Project",
                  cancelButtonText: "Not Now",
                })
              }
            >
              Open Customized Dialog
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-secondary-navy-700 text-white rounded-md hover:bg-secondary-navy-800"
              onClick={() =>
                setConfig({
                  dialogTitle: "Select Team Leads",
                  dialogDescription: "Choose up to 2 users to be team leads.",
                  maxUsers: 2,
                  addButtonText: "Assign as Leads",
                })
              }
            >
              Open Limited Dialog (Max 2)
            </button>
          </div>

          {config !== null ? (
            <UserSelectorDialog
              {...config}
              open
              onOpenChange={(next) => {
                if (!next) setConfig(null);
              }}
              onUsersSelected={(users) => setLastResult(users)}
            />
          ) : null}

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 className="font-semibold">Last Selection Result:</h4>
            {lastResult && lastResult.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {lastResult.map((user) => (
                  <li key={user.id} className="text-sm">
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm mt-2">
                No users selected
              </div>
            )}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
