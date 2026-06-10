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

export const AllProminences: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <TextButton {...args} label="Primary" prominence="primary" />
      <TextButton {...args} label="Secondary" prominence="secondary" />
      <TextButton {...args} label="Tertiary" prominence="tertiary" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <TextButton {...args} label="Primary" prominence="primary" disabled />
      <TextButton {...args} label="Secondary" prominence="secondary" disabled />
      <TextButton {...args} label="Tertiary" prominence="tertiary" disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <TextButton {...args} label="Small" size="sm" />
      <TextButton {...args} label="Default" size="default" />
      <TextButton {...args} label="Large" size="lg" />
    </div>
  ),
};

/**
 * The `customColor` escape hatch renders a button outside the theme — for use on
 * colored surfaces. It is an arbitrary runtime color (applied via inline style, not
 * a class), so a raw color value is the correct input type here. Prefer prominence
 * + tokens for on-theme buttons; reach for this only when off-theme.
 */
const OFF_THEME_DEMO_COLOR = "rgb(124 58 237)"; // arbitrary off-theme purple for the escape-hatch demo

export const CustomColor: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <TextButton
        {...args}
        label="Custom Primary"
        prominence="primary"
        customColor={OFF_THEME_DEMO_COLOR}
      />
      <TextButton
        {...args}
        label="Custom Secondary"
        prominence="secondary"
        customColor={OFF_THEME_DEMO_COLOR}
      />
      <TextButton
        {...args}
        label="Custom Tertiary"
        prominence="tertiary"
        customColor={OFF_THEME_DEMO_COLOR}
      />
    </div>
  ),
};
