import type { Meta, StoryObj } from "@storybook/react";
import { SessionJoinModal } from "@/components/ui/session-join-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof SessionJoinModal> = {
  title: "Organisms/SessionJoinModal",
  component: SessionJoinModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Session Join Modal

A centralized interface for joining Wordly sessions that replaces the information-dense wireframe with a clean, 
focused design using the established color coding system.

### Key Features

- **Two-column layout** with clear presenter/attendee separation
- **Dark teal theme** for presenter options (authority/control)
- **Light blue theme** for attendee options (accessibility/participation)
- **All four high-fidelity illustrations** integrated meaningfully
- **Progressive disclosure** with primary and secondary actions
- **Responsive design** that stacks on mobile devices
- **Design system integration** using existing components and patterns

### Design Principles

1. **Reduced Cognitive Load**: Focus on 2 main options per side instead of 6-8 scattered options
2. **Clear Visual Hierarchy**: Color coding and typography guide user attention
3. **Progressive Disclosure**: Advanced options available but not overwhelming
4. **Accessibility**: Built on Radix UI foundation with proper focus management
        `,
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
      description: "Session ID to display and copy",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SessionJoinModal>;

// Wrapper component to handle state
function ModalWrapper({ sessionId, ...args }: any) {
  const [open, setOpen] = useState(false);

  const handleJoinAsPresenter = (method: string) => {
    console.log("Joining as presenter with method:", method);
    alert(`Joining as presenter with method: ${method}`);
    setOpen(false);
  };

  const handleJoinAsAttendee = (method: string) => {
    console.log("Joining as attendee with method:", method);
    alert(`Joining as attendee with method: ${method}`);
    setOpen(false);
  };

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)} className="mb-4">
        Open Session Join Modal
      </Button>

      <SessionJoinModal
        {...args}
        open={open}
        onOpenChange={setOpen}
        sessionId={sessionId}
        onJoinAsPresenter={handleJoinAsPresenter}
        onJoinAsAttendee={handleJoinAsAttendee}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    sessionId: "DEMO-1234",
  },
};

export const WithLongSessionId: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    sessionId: "LONG-SESSION-ID-2024",
  },
};

export const WithoutSessionId: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    sessionId: undefined,
  },
};

export const ColorCodingShowcase: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    sessionId: "COLOR-TEST",
  },
  parameters: {
    docs: {
      description: {
        story: `
This story showcases the color coding system:

**Presenter Side (Left)**
- **Dark Teal** primary buttons (#0C687A)
- **Light Teal** card backgrounds with subtle borders
- **Darker theme** conveys authority and control

**Attendee Side (Right)**  
- **Blue** primary buttons (#2563EB)
- **Light Blue** card backgrounds with subtle borders
- **Lighter theme** conveys accessibility and participation

This color coding is consistent with the mobile app patterns and extends throughout the Wordly experience.
        `,
      },
    },
  },
};

export const ResponsiveShowcase: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    sessionId: "RESPONSIVE-TEST",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: `
This story demonstrates the responsive behavior:

**Desktop (lg+)**
- Two-column grid layout
- Cards side by side
- Optimized for horizontal space

**Mobile (<lg)**
- Single column stack
- Full-width cards
- Centered alignment
- Maintains usability on small screens

The modal also has a maximum height (90vh) with scroll capability for very small screens.
        `,
      },
    },
  },
};
