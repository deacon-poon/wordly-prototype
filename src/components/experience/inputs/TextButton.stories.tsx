import type { Meta, StoryObj } from "@storybook/react";

import { TextButton } from "./TextButton";

const meta: Meta<typeof TextButton> = {
  title: "Experience/Inputs/TextButton",
  component: TextButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button wrapper with three prominence levels (primary, secondary, tertiary). " +
          "Ported from the production wordly-react-components-lib MUI `TextButton` onto " +
          "the shared shadcn `Button`. Brand Blue stays the primary color.",
      },
    },
  },
  argTypes: {
    prominence: {
      control: { type: "inline-radio" },
      options: ["primary", "secondary", "tertiary"],
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    customColor: { control: "color" },
    handleClick: { action: "clicked" },
  },
  args: {
    label: "Button",
    prominence: "primary",
  },
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Primary: Story = {
  args: { label: "Primary", prominence: "primary" },
};

export const Secondary: Story = {
  args: { label: "Secondary", prominence: "secondary" },
};

export const Tertiary: Story = {
  args: { label: "Tertiary", prominence: "tertiary" },
};

export const Disabled: Story = {
  args: { label: "Disabled", prominence: "primary", disabled: true },
};

export const Small: Story = {
  args: { label: "Small", size: "sm" },
};

export const Large: Story = {
  args: { label: "Large", size: "lg" },
};

// The customColor escape hatch renders a button outside the theme (arbitrary
// runtime color via inline style) for colored surfaces. Prefer prominence +
// tokens for on-theme buttons; reach for this only when off-theme.
export const CustomColor: Story = {
  args: {
    label: "Custom",
    prominence: "primary",
    customColor: "rgb(124 58 237)",
  },
};
