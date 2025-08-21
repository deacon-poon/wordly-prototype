import type { Meta, StoryObj } from "@storybook/react";
import { SessionJoinModalCompact } from "@/components/ui/session-join-modal-compact";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof SessionJoinModalCompact> = {
  title: "Organisms/SessionJoinModalCompact",
  component: SessionJoinModalCompact,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A compact version of the session join modal with streamlined UI and action-first design.",
      },
    },
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Controls modal visibility",
    },
    sessionId: {
      control: "text",
      description: "Session ID to display",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

function SessionJoinModalCompactDemo({ sessionId }: { sessionId?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleJoinAsPresenter = (method: string) => {
    console.log(`Joined as presenter with method: ${method}`);
    alert(`Joined as presenter with method: ${method}`);
    setIsOpen(false);
  };

  const handleJoinAsAttendee = (method: string) => {
    console.log(`Joined as attendee with method: ${method}`);
    alert(`Joined as attendee with method: ${method}`);
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Compact Join Modal</Button>
      <SessionJoinModalCompact
        open={isOpen}
        onOpenChange={setIsOpen}
        sessionId={sessionId}
        onJoinAsPresenter={handleJoinAsPresenter}
        onJoinAsAttendee={handleJoinAsAttendee}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <SessionJoinModalCompactDemo sessionId="SSOD-5071" />,
};

export const WithoutSessionId: Story = {
  render: () => <SessionJoinModalCompactDemo />,
};

export const LongSessionId: Story = {
  render: () => <SessionJoinModalCompactDemo sessionId="WORKSHOP-2024-Q1-EXTENDED-SESSION-001" />,
};
