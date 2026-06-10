import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ApiKey, MOCK_API_KEY, type ApiKeyState } from "./api-key";

const meta: Meta<typeof ApiKey> = {
  title: "Workspace Kit/ApiKey",
  component: ApiKey,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "React migration of the production Angular `wordly-api-key`. A single " +
          "developer API key with four states (loading, empty, has-key, error), " +
          "copy/refresh/delete actions, and a destructive delete confirmation. " +
          "Data via props (mock by default); no Angular DI / Keycloak layer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["loading", "empty", "has_key", "error"],
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ApiKey>;

/** Controlled wrapper so add/delete actually flip the visible key + state. */
function Controlled(props: React.ComponentProps<typeof ApiKey>) {
  const [value, setValue] = React.useState<string | null>(props.value ?? null);
  const [state, setState] = React.useState<ApiKeyState | undefined>(
    props.state
  );

  return (
    <div className="w-[28rem]">
      <ApiKey
        {...props}
        value={value}
        state={state}
        onAdd={() => {
          setValue(MOCK_API_KEY);
          setState("has_key");
        }}
        onRefresh={() => setValue(MOCK_API_KEY.replace(/.$/, "9"))}
        onDelete={() => {
          setValue(null);
          setState("empty");
        }}
        onRetry={() => setState("empty")}
      />
    </div>
  );
}

export const HasKey: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", value: MOCK_API_KEY },
};

export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", value: null },
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", state: "loading" },
};

export const Error: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", state: "error" },
};

export const Required: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", required: true, value: MOCK_API_KEY },
};

export const ReadOnly: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", value: MOCK_API_KEY, readOnly: true },
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} />,
  args: { label: "API Key", value: MOCK_API_KEY, disabled: true },
};

/**
 * Anatomy matrix — every portal-aligned state in one view so the icon-button
 * sizing (38×38), destructive border, and brand-blue hover surface can be
 * eyeballed against the Angular `wordly-api-key` source.
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex w-[28rem] flex-col gap-6">
      <Controlled label="Has Key" value={MOCK_API_KEY} />
      <Controlled label="Empty" value={null} />
      <Controlled label="Loading" state="loading" />
      <Controlled label="Error" state="error" />
      <Controlled label="Disabled" value={MOCK_API_KEY} disabled />
    </div>
  ),
};
