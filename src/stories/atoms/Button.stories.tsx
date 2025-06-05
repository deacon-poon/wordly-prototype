import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "success";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  className?: string;
}

// Simple Button component without external dependencies
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-[#118197] text-white hover:bg-[#0C687A]",
      destructive: "bg-[#E62D21] text-white hover:bg-[#B8221A]",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-800",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
      link: "bg-transparent underline-offset-4 hover:underline text-[#118197] p-0 h-auto",
      success: "bg-[#0C9A4E] hover:bg-[#0A7B3F] text-white",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 py-1 text-sm",
      lg: "h-12 px-6 py-3 text-lg",
      icon: "h-10 w-10 p-2",
    };

    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# Button Component

Interactive buttons for user actions, following Wordly's design system and brand color strategy.

## Brand Color Strategy (70-20-10 Principle)
- **70% Teal** (#118197): Primary brand color for main actions and affirmative buttons
- **20% Navy** (#0C2A3A): Secondary brand color for supporting elements
- **10% Accent Green** (#28E6B6): Accent color for highlights and visual interest (not for buttons)

## Button Variants
- **Default**: Primary teal for main actions (CTA, submit, confirm)
- **Success**: Functional green for positive confirmations (save successful, task complete)
- **Destructive**: Red for dangerous actions (delete, cancel)
- **Secondary/Outline/Ghost**: Neutral colors for secondary actions

## Design Principles
- **Clarity**: Clear visual hierarchy with appropriate contrast
- **Accessibility**: WCAG 2.1 AA compliant with focus states
- **Consistency**: Unified spacing, sizing, and interaction patterns
- **Purpose**: Each variant serves a specific functional purpose

## Usage Guidelines
- Use primary (teal) for the most important action on a page
- Success green is for functional feedback, not brand expression
- Maintain proper spacing between buttons (minimum 8px)
- Consider mobile touch targets (minimum 44px)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
        "success",
      ],
      description: "The visual style and semantic meaning of the button",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    children: {
      control: "text",
      description: "The content of the button",
    },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    children: "Button Text",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * ## Primary Button (Default)
 *
 * The primary action button using our brand teal color. Use for the most important action on a page.
 * Perfect for CTAs, form submissions, and primary navigation.
 */
export const Default: Story = {
  args: {
    children: "Primary Action",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary teal button for main actions. Use the 70% brand color following our design strategy.",
      },
    },
  },
};

/**
 * ## Success Button
 *
 * Functional green button for positive confirmations and successful actions.
 * Different from accent green - this is specifically for user feedback and completed states.
 */
export const Success: Story = {
  args: {
    variant: "success",
    children: "Save Changes",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Functional success button for positive actions like saving, confirming, or completing tasks.",
      },
    },
  },
};

/**
 * ## Destructive Button
 *
 * Red button for dangerous or irreversible actions. Use sparingly and with confirmation patterns.
 * Perfect for delete actions, cancellations, or destructive operations.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete Item",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Destructive button for dangerous actions. Always consider confirmation dialogs for irreversible actions.",
      },
    },
  },
};

/**
 * ## Secondary Button
 *
 * Lower emphasis button for secondary actions. Use when you need multiple actions but want
 * to maintain clear hierarchy with the primary button.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Action",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary button with reduced visual weight for supporting actions.",
      },
    },
  },
};

/**
 * ## Outline Button
 *
 * Minimal emphasis button with border styling. Perfect for cancel actions or
 * when you need a button that doesn't compete with primary actions.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Cancel",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outline button for low-emphasis actions like cancel or secondary navigation.",
      },
    },
  },
};

/**
 * ## Ghost Button
 *
 * Minimal visual style for tertiary actions. Use in navigation, toolbars,
 * or when you need clickable text without button styling.
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Action",
  },
  parameters: {
    docs: {
      description: {
        story: "Ghost button for subtle interactions and tertiary actions.",
      },
    },
  },
};

/**
 * ## Link Button
 *
 * Text button styled as a link. Use when the action feels more like navigation
 * than a traditional button interaction.
 */
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Action",
  },
  parameters: {
    docs: {
      description: {
        story: "Link-styled button for navigation-like actions.",
      },
    },
  },
};

/**
 * ## Button Sizes
 *
 * Different button sizes for various use cases. Choose based on content hierarchy
 * and available space. Icon buttons should use meaningful icons with proper alt text.
 */
export const ButtonSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="lg">Large Button</Button>
      <Button size="default">Default Button</Button>
      <Button size="sm">Small Button</Button>
      <Button size="icon">✓</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different button sizes for various contexts and content hierarchy.",
      },
    },
  },
};

/**
 * ## Button States
 *
 * Interactive states for different button variants. Disabled buttons should include
 * alternative ways to complete the action when the disability is temporary.
 */
export const ButtonStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Primary States</h4>
        <div className="flex flex-wrap gap-4">
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Success States</h4>
        <div className="flex flex-wrap gap-4">
          <Button variant="success">Enabled</Button>
          <Button variant="success" disabled>
            Disabled
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">
          Destructive States
        </h4>
        <div className="flex flex-wrap gap-4">
          <Button variant="destructive">Enabled</Button>
          <Button variant="destructive" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive states showing enabled and disabled variations for each button type.",
      },
    },
  },
};

/**
 * ## Button Hierarchy Example
 *
 * Example of proper button hierarchy in a typical form or dialog.
 * Primary action is most prominent, secondary actions are clearly de-emphasized.
 */
export const ButtonHierarchy: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Form Actions</h4>
        <div className="flex gap-3">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">
          Confirmation Dialog
        </h4>
        <div className="flex gap-3">
          <Button variant="destructive">Delete Item</Button>
          <Button variant="outline">Keep Item</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Success Feedback</h4>
        <div className="flex gap-3">
          <Button variant="success">Continue</Button>
          <Button variant="ghost">Go Back</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Examples of proper button hierarchy in common interface patterns.",
      },
    },
  },
};
