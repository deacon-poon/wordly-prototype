import type { Meta, StoryObj } from "@storybook/react";
import LoginPage from "@/app/(auth)/login/page";

const meta: Meta<typeof LoginPage> = {
  title: "Pages/Authentication/Login",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Pre-SSO Login Page

The Wordly pre-SSO login page provides a modern, accessible interface for users to authenticate via single sign-on (SSO) or search for their organization's SSO provider. The design follows the structure of modern login components while maintaining Wordly's brand identity.

## Features

- **Centered Card Design**: Clean, focused layout inspired by modern authentication patterns
- **Primary Wordly SSO**: Prominent gradient button for direct Wordly authentication
- **SSO Discovery**: Email/organization-based search for SSO providers
- **Progressive Disclosure**: Search results appear dynamically
- **Loading States**: Visual feedback during authentication and search processes
- **Responsive Design**: Optimized for all device sizes
- **Brand Consistency**: Uses Wordly design system colors and components

## Design Structure

Based on the shadcn sign-in component structure with:
- **Logo Container**: Elevated logo with shadow for brand prominence  
- **Welcome Header**: Clear, friendly messaging
- **Primary Action**: Gradient button for main authentication flow
- **Secondary Options**: Clean separation with "or continue with" divider
- **Input Fields**: Consistent styling with proper labels and focus states
- **Results Display**: Organized list of found organizations
- **Minimal Footer**: Essential support link

## Design Principles

- **Trust & Security**: Professional card-based design with subtle gradients
- **Visual Hierarchy**: Clear primary and secondary actions
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios
- **Micro-interactions**: Hover states, loading spinners, and scale animations
- **Brand Integration**: Wordly teal color palette throughout

## Technical Implementation

- Built with Wordly design system components (Button, Input)
- Follows shadcn component structure patterns
- Gradient backgrounds using Wordly brand colors
- Responsive design using Tailwind CSS
- TypeScript for type safety
- Next.js App Router for routing
- Smooth animations and transitions

## Usage

This page serves as the pre-SSO authentication interface maintained by the portal team. Users can either sign in directly with Wordly credentials or search for their organization's SSO provider before being redirected to Keycloak.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {
  name: "Login Page",
};

export const WithSearchResults: Story = {
  name: "With SSO Search Results",
  parameters: {
    docs: {
      description: {
        story:
          "Shows the login page after a user has searched for their SSO provider and results are displayed.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    // You could add interactions here to simulate the search flow
    // For now, this is just the default state
  },
};

export const LoadingState: Story = {
  name: "Loading State",
  parameters: {
    docs: {
      description: {
        story:
          "Shows the login page in a loading state while authenticating or searching for SSO providers.",
      },
    },
  },
};
