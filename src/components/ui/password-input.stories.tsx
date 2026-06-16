import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./password-input";
import { Label } from "./label";

const meta: Meta<typeof PasswordInput> = {
  title: "Design System/Atoms/PasswordInput",
  component: PasswordInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Atomic password field with a show/hide toggle. Trailing padding is built in, so the eye icon never overlaps the placeholder or value.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <PasswordInput placeholder="Enter your password" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="pw">Password</Label>
      <PasswordInput id="pw" placeholder="Enter your password" />
    </div>
  ),
};

export const StartsVisible: Story = {
  render: () => (
    <div className="w-72">
      <PasswordInput defaultVisible defaultValue="hunter2" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <PasswordInput placeholder="Enter your password" disabled />
    </div>
  ),
};
