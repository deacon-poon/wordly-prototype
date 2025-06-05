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
      description: "The visual style of the button",
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
 * ## Default Button
 *
 * The default button using the primary brand color (teal).
 */
export const Default: Story = {
  args: {
    children: "Default Button",
  },
};

/**
 * ## Destructive Button
 *
 * Used for destructive actions like delete or cancel.
 * Uses the red color palette.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive Button",
  },
};

/**
 * ## Success Button
 *
 * Used for affirmative actions like save or confirm.
 * Uses the green color palette.
 */
export const Success: Story = {
  args: {
    variant: "success",
    children: "Success Button",
  },
};

/**
 * ## Secondary Button
 *
 * Secondary action button with less visual emphasis.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

/**
 * ## Outline Button
 *
 * Used for secondary actions that should be less visually dominant.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

/**
 * ## Ghost Button
 *
 * Minimal visual style for tertiary actions.
 */
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

/**
 * ## Green Brand Button
 *
 * Using the new accent color (green).
 */
export const GreenBrand: Story = {
  args: {
    children: "Green Button",
  },
  render: (args) => (
    <Button {...args} className="bg-[#28E6B6] hover:bg-[#1FDAA8] text-gray-900">
      {args.children}
    </Button>
  ),
};

/**
 * ## Button Sizes
 *
 * Buttons in different sizes.
 */
export const ButtonSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="lg">Large Button</Button>
      <Button size="default">Default Button</Button>
      <Button size="sm">Small Button</Button>
      <Button size="icon">+</Button>
    </div>
  ),
};

/**
 * ## Button States
 *
 * Buttons in different states.
 */
export const ButtonStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Button>Enabled</Button>
        <Button disabled>Disabled</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="destructive">Enabled</Button>
        <Button variant="destructive" disabled>
          Disabled
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="success">Enabled</Button>
        <Button variant="success" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};
