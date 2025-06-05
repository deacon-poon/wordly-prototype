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
    | "accent";
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
    accent: "bg-[#28E6B6] text-gray-900 border-transparent",
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
    docs: {
      description: {
        component: `
# Badge Component

Small status indicators and labels for categorization, status display, and visual emphasis following Wordly's design system.

## Brand Color Strategy (70-20-10 Principle)
- **70% Teal** (#118197): Primary brand color for default and teal variants
- **20% Navy** (#0C2A3A): Secondary brand color for supporting elements
- **10% Accent Green** (#28E6B6): Brand accent for highlights and visual interest

## Badge Variants
- **Default/Teal**: Primary brand badges using our main teal color
- **Accent**: Brand accent green for special highlights and visual interest
- **Success**: Functional green for positive status indicators (different from accent)
- **Destructive**: Red for warnings, errors, or negative status
- **Secondary**: Neutral gray for general categorization
- **Outline**: Minimal styling for subtle labeling

## Design Principles
- **Clarity**: High contrast text for excellent readability
- **Purpose**: Each color variant conveys specific semantic meaning
- **Consistency**: Unified sizing and spacing across all variants
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios

## Usage Guidelines
- Use sparingly to avoid visual clutter
- Maintain consistent sizes within similar contexts
- Consider badge hierarchy when using multiple variants
- Ensure meaningful content for screen readers
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
        "secondary",
        "destructive",
        "success",
        "outline",
        "teal",
        "accent",
      ],
      description: "The visual style and semantic meaning of the badge",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
      description: "The size of the badge",
    },
    children: {
      control: "text",
      description: "The content of the badge",
    },
  },
  args: {
    variant: "default",
    size: "default",
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/**
 * ## Default Badge
 *
 * Primary brand badge using our main teal color. Perfect for general categorization
 * and brand-consistent labeling.
 */
export const Default: Story = {
  args: {
    children: "Default",
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Primary teal badge for general use cases and brand consistency.",
      },
    },
  },
};

/**
 * ## Teal Badge
 *
 * Explicitly teal-colored badge, identical to default but semantically clear.
 * Use when you want to be explicit about using the primary brand color.
 */
export const Teal: Story = {
  args: {
    children: "Teal",
    variant: "teal",
  },
  parameters: {
    docs: {
      description: {
        story: "Explicitly branded teal badge for primary categorization.",
      },
    },
  },
};

/**
 * ## Accent Badge
 *
 * Brand accent green badge for special highlights and visual interest.
 * Part of our 10% accent color strategy - use sparingly for maximum impact.
 */
export const Accent: Story = {
  args: {
    children: "Featured",
    variant: "accent",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Brand accent badge using our signature green for special highlights and featured content.",
      },
    },
  },
};

/**
 * ## Success Badge
 *
 * Functional green badge for positive status indicators and successful states.
 * Different from accent green - this is specifically for functional feedback.
 */
export const Success: Story = {
  args: {
    children: "Completed",
    variant: "success",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Functional success badge for positive status indicators like completed tasks or successful operations.",
      },
    },
  },
};

/**
 * ## Destructive Badge
 *
 * Red badge for warnings, errors, or negative status indicators.
 * Use for critical information that requires immediate attention.
 */
export const Destructive: Story = {
  args: {
    children: "Error",
    variant: "destructive",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Destructive badge for error states, warnings, or critical status indicators.",
      },
    },
  },
};

/**
 * ## Secondary Badge
 *
 * Neutral gray badge for general categorization without strong semantic meaning.
 * Perfect for tags, categories, or secondary information.
 */
export const Secondary: Story = {
  args: {
    children: "Category",
    variant: "secondary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary badge for neutral categorization and general labeling.",
      },
    },
  },
};

/**
 * ## Outline Badge
 *
 * Minimal styling badge with transparent background and border.
 * Use when you need subtle labeling that doesn't compete with other content.
 */
export const Outline: Story = {
  args: {
    children: "Label",
    variant: "outline",
  },
  parameters: {
    docs: {
      description: {
        story: "Outline badge for subtle labeling and minimal visual impact.",
      },
    },
  },
};

/**
 * ## Badge Sizes
 *
 * Different badge sizes for various contexts and content hierarchy.
 * Choose size based on the importance and context of the information.
 */
export const BadgeSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different badge sizes for various contexts and information hierarchy.",
      },
    },
  },
};

/**
 * ## All Badge Variants
 *
 * Complete overview of all available badge variants showing their visual
 * differences and appropriate use cases.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="teal">Teal</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All badge variants showcasing the complete range of styles and semantic meanings.",
      },
    },
  },
};

/**
 * ## Status Badge Examples
 *
 * Real-world examples of how badges work in different status scenarios.
 * Shows proper usage patterns and semantic color associations.
 */
export const StatusExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Task Status</h4>
        <div className="flex gap-2">
          <Badge variant="success">Completed</Badge>
          <Badge variant="default">In Progress</Badge>
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="destructive">Failed</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Content Labels</h4>
        <div className="flex gap-2">
          <Badge variant="accent">Featured</Badge>
          <Badge variant="teal">Premium</Badge>
          <Badge variant="outline">Draft</Badge>
          <Badge variant="secondary">Archive</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">User Types</h4>
        <div className="flex gap-2">
          <Badge variant="teal">Admin</Badge>
          <Badge variant="default">Member</Badge>
          <Badge variant="outline">Guest</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world examples showing proper semantic usage of badge variants in different contexts.",
      },
    },
  },
};
