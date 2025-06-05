import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "outline"
    | "teal"
    | "green";
  size?: "default" | "sm" | "lg";
  className?: string;
}

// Simple Badge component without external dependencies
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
}) => {
  // Define styles for different variants
  const variantStyles = {
    default: "bg-[#118197] text-white border-transparent",
    secondary: "bg-gray-200 text-gray-800 border-transparent",
    destructive: "bg-[#E62D21] text-white border-transparent",
    success: "bg-[#0C9A4E] text-white border-transparent",
    outline: "bg-transparent border-gray-300 text-gray-800",
    teal: "bg-[#118197] text-white border-transparent",
    green: "bg-[#28E6B6] text-gray-900 border-transparent",
  };

  // Define styles for different sizes
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border font-semibold transition-colors 
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </div>
  );
};

const meta: Meta<typeof Badge> = {
  title: "Design System/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "success",
        "outline",
        "teal",
        "green",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Teal: Story = {
  args: {
    children: "Teal",
    variant: "teal",
  },
};

export const Green: Story = {
  args: {
    children: "Green",
    variant: "green",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="teal">Teal</Badge>
      <Badge variant="green">Green</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};
