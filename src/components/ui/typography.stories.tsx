import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Design System/Typography",
  component: Typography,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "lead",
        "large",
        "small",
        "muted",
        "blockquote",
        "code",
        "link",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "Heading 1",
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "Heading 2",
  },
};

export const Heading3: Story = {
  args: {
    variant: "h3",
    children: "Heading 3",
  },
};

export const Heading4: Story = {
  args: {
    variant: "h4",
    children: "Heading 4",
  },
};

export const Heading5: Story = {
  args: {
    variant: "h5",
    children: "Heading 5",
  },
};

export const Heading6: Story = {
  args: {
    variant: "h6",
    children: "Heading 6",
  },
};

export const Paragraph: Story = {
  args: {
    variant: "p",
    children:
      "This is a paragraph with body text styling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at vestibulum est, non aliquet lacus.",
  },
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children:
      "This is lead text, used for introductory paragraphs or important information.",
  },
};

export const Large: Story = {
  args: {
    variant: "large",
    children: "This is large text, used for emphasis.",
  },
};

export const Small: Story = {
  args: {
    variant: "small",
    children: "This is small text, used for captions or secondary information.",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "This is muted text, used for secondary information.",
  },
};

export const Blockquote: Story = {
  args: {
    variant: "blockquote",
    children:
      "This is a blockquote, used for quoting external sources or highlighting important information.",
  },
};

export const Code: Story = {
  args: {
    variant: "code",
    children: "console.log('Hello world!')",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "This is a link",
    component: "a",
    href: "#",
  },
};

export const TypographySystem: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="muted">
          Font-size: 3rem (48px) | Font-weight: 800
        </Typography>
      </div>
      <div>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="muted">
          Font-size: 2.25rem (36px) | Font-weight: 700
        </Typography>
      </div>
      <div>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="muted">
          Font-size: 1.875rem (30px) | Font-weight: 700
        </Typography>
      </div>
      <div>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="muted">
          Font-size: 1.5rem (24px) | Font-weight: 700
        </Typography>
      </div>
      <div>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="muted">
          Font-size: 1.25rem (20px) | Font-weight: 600
        </Typography>
      </div>
      <div>
        <Typography variant="h6">Heading 6</Typography>
        <Typography variant="muted">
          Font-size: 1rem (16px) | Font-weight: 600
        </Typography>
      </div>
      <div>
        <Typography variant="p">
          This is a paragraph with body text styling. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Donec at vestibulum est, non
          aliquet lacus.
        </Typography>
        <Typography variant="muted">
          Font-size: 1rem (16px) | Font-weight: 400 | Line-height: 1.75
        </Typography>
      </div>
      <div>
        <Typography variant="lead">
          This is lead text, used for introductory paragraphs or important
          information.
        </Typography>
        <Typography variant="muted">
          Font-size: 1.25rem (20px) | Font-weight: 400
        </Typography>
      </div>
      <div>
        <Typography variant="large">
          This is large text, used for emphasis.
        </Typography>
        <Typography variant="muted">
          Font-size: 1.125rem (18px) | Font-weight: 600
        </Typography>
      </div>
      <div>
        <Typography variant="small">
          This is small text, used for captions or secondary information.
        </Typography>
        <Typography variant="muted">
          Font-size: 0.875rem (14px) | Font-weight: 500
        </Typography>
      </div>
      <div>
        <Typography variant="muted">
          This is muted text, used for secondary information.
        </Typography>
        <Typography variant="muted">
          Font-size: 0.875rem (14px) | Font-weight: 400 | Color: muted
        </Typography>
      </div>
      <div>
        <Typography variant="blockquote">
          This is a blockquote, used for quoting external sources or
          highlighting important information.
        </Typography>
        <Typography variant="muted">
          Font-style: italic | Border-left: 2px
        </Typography>
      </div>
      <div>
        <Typography variant="code">console.log('Hello world!')</Typography>
        <Typography variant="muted">
          Font-family: monospace | Background-color: muted
        </Typography>
      </div>
      <div>
        <Typography variant="link" component="a" href="#">
          This is a link
        </Typography>
        <Typography variant="muted">
          Font-weight: 500 | Text-decoration: underline
        </Typography>
      </div>
    </div>
  ),
};
