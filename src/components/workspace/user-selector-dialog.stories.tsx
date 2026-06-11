import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  UserSelectorDialog,
  MOCK_USERS,
  dialogButtonVariants,
  type UserSelectorOption,
  type DialogButtonVariant,
  type DialogButtonSize,
} from "./user-selector-dialog";

const meta: Meta<typeof UserSelectorDialog> = {
  title: "Workspace Kit/UserSelectorDialog",
  component: UserSelectorDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-user-selector-dialog`. " +
          "Opens a dialog to search a user directory, multi-select users (with an " +
          "optional max-users cap and excluded users), and confirm. Data via props " +
          "(mock by default); the Angular DI/service search layer is dropped and " +
          "search is filtered client-side.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    maxUsers: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof UserSelectorDialog>;

/** Wrapper that surfaces the confirmed selection so stories feel real. */
function Controlled(props: React.ComponentProps<typeof UserSelectorDialog>) {
  const [added, setAdded] = React.useState<UserSelectorOption[]>([]);
  return (
    <div className="flex flex-col items-start gap-4">
      <UserSelectorDialog
        {...props}
        onUsersSelected={(users) => {
          setAdded(users);
          props.onUsersSelected?.(users);
        }}
      />
      {added.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          Added: {added.map((u) => u.name).join(", ")}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Open the dialog and search (e.g. &ldquo;a&rdquo;) to select users.
        </p>
      )}
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Controlled {...args} />,
  args: {},
};

export const MaxTwoUsers: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    maxUsers: 2,
    dialogDescription:
      "Added users will be given access. You can add up to 2 users.",
  },
};

export const WithExcludedUsers: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    // Already-members appear disabled in search results.
    excludedUsers: [MOCK_USERS[0], MOCK_USERS[1]],
  },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { loading: true },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    // No directory -> any search lands on the "no users found" empty state.
    users: [],
  },
};

export const CustomCopy: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    buttonText: "Invite teammates",
    dialogTitle: "Invite teammates",
    dialogDescription: "Invited teammates can collaborate on this workspace.",
    addButtonText: "Send invites",
    selectedUsersText: "Teammates to invite",
  },
};

/**
 * Button anatomy parity check - exercises the dialog's internal
 * `dialogButtonVariants`, which mirrors the portal core button
 * (wordly-button.component.scss): variants primary/secondary/destructive/
 * outline/icon and sizes sm/default/lg/block, plus the disabled state.
 * The dialog itself only uses primary (trigger + Add) and outline (Cancel);
 * the rest are shown so the portal anatomy is visible/regression-tested.
 */
export const ButtonAnatomy: StoryObj = {
  parameters: { layout: "padded" },
  render: () => {
    const variants: DialogButtonVariant[] = [
      "primary",
      "secondary",
      "destructive",
      "outline",
    ];
    const sizes: DialogButtonSize[] = ["sm", "default", "lg", "block"];
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-800">Variants</h4>
          <div className="flex flex-wrap items-center gap-3">
            {variants.map((variant) => (
              <button
                key={variant}
                type="button"
                className={cn(dialogButtonVariants({ variant }))}
              >
                {variant}
              </button>
            ))}
            <button
              type="button"
              aria-label="Icon button"
              className={cn(
                dialogButtonVariants({ variant: "icon", size: "icon" })
              )}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-800">Sizes</h4>
          <div className="flex flex-col items-start gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={cn(
                  dialogButtonVariants({ variant: "primary", size })
                )}
              >
                size: {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-800">
            Disabled state
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled
              className={cn(dialogButtonVariants({ variant: "primary" }))}
            >
              Disabled
            </button>
            <button
              type="button"
              disabled
              className={cn(dialogButtonVariants({ variant: "outline" }))}
            >
              Disabled outline
            </button>
          </div>
        </div>
      </div>
    );
  },
};
