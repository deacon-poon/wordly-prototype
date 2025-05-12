import type { Meta, StoryObj } from "@storybook/react";
import { DesignTokens, TokenCategory, Token } from "./design-tokens";

const meta: Meta<typeof DesignTokens> = {
  title: "Design System/Design Tokens",
  component: DesignTokens,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DesignTokens>;

export const DesignTokensDocumentation: Story = {
  render: () => (
    <div className="space-y-12">
      <DesignTokens
        title="Design Tokens"
        description="These design tokens ensure consistency across our application. Use these tokens instead of hardcoded values."
      >
        <TokenCategory
          title="Border Radius"
          description="Use these border radius values to maintain consistent curvature across UI elements."
        >
          <Token
            name="radius-none"
            value="0px"
            description="No border radius, used for straight-edged components"
            preview={<div className="w-16 h-16 bg-primary rounded-none"></div>}
          />
          <Token
            name="radius-sm"
            value="0.125rem (2px)"
            description="Subtle radius for small elements like chips and tags"
            preview={<div className="w-16 h-16 bg-primary rounded-sm"></div>}
          />
          <Token
            name="radius-md"
            value="0.25rem (4px)"
            description="Default radius for most UI elements like buttons and cards"
            preview={<div className="w-16 h-16 bg-primary rounded"></div>}
          />
          <Token
            name="radius-lg"
            value="0.5rem (8px)"
            description="More prominent radius for emphasis on UI elements"
            preview={<div className="w-16 h-16 bg-primary rounded-lg"></div>}
          />
          <Token
            name="radius-xl"
            value="0.75rem (12px)"
            description="Strong radius for feature cards and prominent UI elements"
            preview={<div className="w-16 h-16 bg-primary rounded-xl"></div>}
          />
          <Token
            name="radius-2xl"
            value="1rem (16px)"
            description="Very strong radius for modals and important UI elements"
            preview={<div className="w-16 h-16 bg-primary rounded-2xl"></div>}
          />
          <Token
            name="radius-full"
            value="9999px"
            description="Full radius for circular elements like avatars and badges"
            preview={<div className="w-16 h-16 bg-primary rounded-full"></div>}
          />
        </TokenCategory>

        <TokenCategory
          title="Shadows"
          description="Use shadows to create depth and hierarchy in your designs."
        >
          <Token
            name="shadow-none"
            value="none"
            description="No shadow, flat elements"
            preview={<div className="w-16 h-16 bg-card border rounded"></div>}
          />
          <Token
            name="shadow-sm"
            value="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            description="Subtle shadow for hover states and subtle elements"
            preview={
              <div className="w-16 h-16 bg-card border rounded shadow-sm"></div>
            }
          />
          <Token
            name="shadow-md"
            value="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            description="Standard shadow for cards and containers"
            preview={
              <div className="w-16 h-16 bg-card border rounded shadow"></div>
            }
          />
          <Token
            name="shadow-lg"
            value="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            description="Large shadow for popovers and dropdowns"
            preview={
              <div className="w-16 h-16 bg-card border rounded shadow-lg"></div>
            }
          />
          <Token
            name="shadow-xl"
            value="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            description="Extra large shadow for modals and large UI elements"
            preview={
              <div className="w-16 h-16 bg-card border rounded shadow-xl"></div>
            }
          />
          <Token
            name="shadow-2xl"
            value="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            description="Dramatic shadow for key UI elements that need emphasis"
            preview={
              <div className="w-16 h-16 bg-card border rounded shadow-2xl"></div>
            }
          />
          <Token
            name="shadow-inner"
            value="inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
            description="Inset shadow for pressed buttons and inset elements"
            preview={
              <div className="w-16 h-16 bg-card border rounded shadow-inner"></div>
            }
          />
        </TokenCategory>

        <TokenCategory
          title="Animations"
          description="Use these animation tokens for consistent motion across the UI."
        >
          <Token
            name="transition-none"
            value="none"
            description="No transition"
            preview={
              <div className="w-12 h-12 bg-primary hover:bg-primary/80"></div>
            }
          />
          <Token
            name="transition-fast"
            value="150ms cubic-bezier(0.4, 0, 0.2, 1)"
            description="Quick transitions for UI elements like buttons"
            preview={
              <div className="w-12 h-12 bg-primary hover:bg-primary/80 transition-colors duration-150"></div>
            }
          />
          <Token
            name="transition-normal"
            value="300ms cubic-bezier(0.4, 0, 0.2, 1)"
            description="Standard transition for most UI animations"
            preview={
              <div className="w-12 h-12 bg-primary hover:bg-primary/80 transition-colors duration-300"></div>
            }
          />
          <Token
            name="transition-slow"
            value="500ms cubic-bezier(0.4, 0, 0.2, 1)"
            description="Slower transition for emphasis or larger UI shifts"
            preview={
              <div className="w-12 h-12 bg-primary hover:bg-primary/80 transition-colors duration-500"></div>
            }
          />
          <Token
            name="ease-in-out"
            value="cubic-bezier(0.4, 0, 0.2, 1)"
            description="Smooth acceleration and deceleration"
            preview={
              <div className="w-12 h-12 bg-primary hover:translate-x-2 transition-transform duration-300 ease-in-out"></div>
            }
          />
          <Token
            name="ease-out"
            value="cubic-bezier(0, 0, 0.2, 1)"
            description="Gentle deceleration, for elements entering the screen"
            preview={
              <div className="w-12 h-12 bg-primary hover:translate-x-2 transition-transform duration-300 ease-out"></div>
            }
          />
          <Token
            name="ease-in"
            value="cubic-bezier(0.4, 0, 1, 1)"
            description="Gentle acceleration, for elements leaving the screen"
            preview={
              <div className="w-12 h-12 bg-primary hover:translate-x-2 transition-transform duration-300 ease-in"></div>
            }
          />
        </TokenCategory>

        <TokenCategory
          title="Z-Index"
          description="Use these z-index values to maintain a consistent stacking order."
        >
          <Token
            name="z-0"
            value="0"
            description="Base level, default for all elements"
          />
          <Token
            name="z-10"
            value="10"
            description="Low-level elements that should appear above their containers"
          />
          <Token
            name="z-20"
            value="20"
            description="Medium-level elements like dropdowns and popovers"
          />
          <Token
            name="z-30"
            value="30"
            description="High-level elements like sticky headers and footers"
          />
          <Token
            name="z-40"
            value="40"
            description="Very high-level elements like notifications"
          />
          <Token
            name="z-50"
            value="50"
            description="Top-level elements like modals and dialogs"
          />
          <Token
            name="z-auto"
            value="auto"
            description="Let the browser determine the stacking context"
          />
        </TokenCategory>

        <TokenCategory
          title="Spacing Scale"
          description="Use these spacing values for margin, padding, gap, and layout sizes."
        >
          <Token
            name="space-0"
            value="0px"
            description="No spacing"
            preview={<div className="w-0 h-8 bg-primary"></div>}
          />
          <Token
            name="space-1"
            value="0.25rem (4px)"
            description="Extra small spacing"
            preview={<div className="w-1 h-8 bg-primary"></div>}
          />
          <Token
            name="space-2"
            value="0.5rem (8px)"
            description="Small spacing"
            preview={<div className="w-2 h-8 bg-primary"></div>}
          />
          <Token
            name="space-4"
            value="1rem (16px)"
            description="Default spacing"
            preview={<div className="w-4 h-8 bg-primary"></div>}
          />
          <Token
            name="space-6"
            value="1.5rem (24px)"
            description="Medium spacing"
            preview={<div className="w-6 h-8 bg-primary"></div>}
          />
          <Token
            name="space-8"
            value="2rem (32px)"
            description="Large spacing"
            preview={<div className="w-8 h-8 bg-primary"></div>}
          />
          <Token
            name="space-10"
            value="2.5rem (40px)"
            description="Extra large spacing"
            preview={<div className="w-10 h-8 bg-primary"></div>}
          />
          <Token
            name="space-12"
            value="3rem (48px)"
            description="2x large spacing"
            preview={<div className="w-12 h-8 bg-primary"></div>}
          />
          <Token
            name="space-16"
            value="4rem (64px)"
            description="3x large spacing"
            preview={<div className="w-16 h-8 bg-primary"></div>}
          />
        </TokenCategory>
      </DesignTokens>
    </div>
  ),
};
