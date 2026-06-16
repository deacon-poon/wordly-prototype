import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Experience/Inputs/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    label: "Text Field Label",
    placeholder: "Add text here",
    disabled: false,
    required: false,
    isPassword: false,
    variant: "standard",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["outlined", "standard"],
    },
    inputColor: { control: "color" },
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Display name",
    placeholder: "How others see you",
    helperText: "This name is visible to attendees.",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    defaultValue: "not-an-email",
    error: true,
    errorMessage: "Enter a valid email address.",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    placeholder: "Enter a password",
    isPassword: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Workspace ID",
    defaultValue: "ws-acme",
    disabled: true,
  },
};

export const StandardUnderline: Story = {
  args: {
    label: "Session title",
    placeholder: "Add text here",
    variant: "standard",
  },
};

export const CustomInputColor: Story = {
  args: {
    label: "Branded input",
    defaultValue: "Brand Blue text",
    inputColor: "hsl(var(--primary))",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [val, setVal] = React.useState("");
    return (
      <div className="flex w-80 flex-col gap-2">
        <TextField
          {...args}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Value: {val || "(empty)"}
        </p>
      </div>
    );
  },
  args: {
    label: "Controlled field",
    placeholder: "Type here",
  },
};
