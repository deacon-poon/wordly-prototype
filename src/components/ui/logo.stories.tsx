import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Design System/Core/Logo",
  component: Logo,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["color", "mono"] },
    withTagline: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: { variant: "color" },
};

export const WithTagline: Story = {
  args: { variant: "color", withTagline: true },
};

export const Mono: Story = {
  args: { variant: "mono" },
  render: (args) => (
    <div className="rounded-lg bg-primary-blue-800 p-6 text-white">
      <Logo {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Logo markClassName="h-4" />
      <Logo markClassName="h-6" />
      <Logo markClassName="h-8" />
    </div>
  ),
};
