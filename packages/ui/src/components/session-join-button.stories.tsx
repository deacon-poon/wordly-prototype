import type { Meta, StoryObj } from "@storybook/react";
import { SessionJoinButton } from "./session-join-button";

const meta: Meta<typeof SessionJoinButton> = {
  title: "Design System/Wordly/SessionJoinButton",
  component: SessionJoinButton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    sessionId: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SessionJoinButton>;

// ── Default ───────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    sessionId: "ABC-123",
  },
};

// ── With Custom Label ─────────────────────────────────────────────────────────
export const WithCustomLabel: Story = {
  args: {
    sessionId: "ABC-123",
    children: "Start Interpreting",
    variant: "success",
    size: "lg",
  },
};

// ── Without Session ID ────────────────────────────────────────────────────────
export const WithoutSessionId: Story = {
  name: "Without Session ID",
  args: {},
};

// ── Sizes ─────────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SessionJoinButton size="lg" sessionId="LARGE">
        Join Session
      </SessionJoinButton>
      <SessionJoinButton size="default" sessionId="DEFAULT">
        Join Session
      </SessionJoinButton>
      <SessionJoinButton size="sm" sessionId="SMALL">
        Join Session
      </SessionJoinButton>
    </div>
  ),
};
