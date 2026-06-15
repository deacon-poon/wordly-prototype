import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "Design System/Atoms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "text",
    placeholder: "Enter text",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// --- Types ------------------------------------------------------------------

export const Default: Story = {
  args: { placeholder: "Enter text" },
};

export const Email: Story = {
  args: { type: "email", placeholder: "name@wordly.ai" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};

export const Number: Story = {
  args: { type: "number", placeholder: "0" },
};

// --- States -----------------------------------------------------------------

export const WithValue: Story = {
  args: { defaultValue: "English (US)" },
};

export const Disabled: Story = {
  args: { placeholder: "Cannot edit", disabled: true },
};

/** Maps to the portal error state via aria-invalid, which the component styles. */
export const Invalid: Story = {
  args: {
    defaultValue: "not-an-email",
    "aria-invalid": true,
  },
};

// --- Composed examples ------------------------------------------------------

/** Paired with a Label, matching the portal label + required form field. */
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@wordly.ai" />
    </div>
  ),
};

/** Required field with an inline error message under an invalid input. */
export const WithErrorMessage: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="org">Organization name</Label>
      <Input
        id="org"
        defaultValue=""
        aria-invalid
        aria-describedby="org-error"
        placeholder="Acme Inc"
      />
      <p id="org-error" className="text-sm text-destructive">
        Organization name is required.
      </p>
    </div>
  ),
};

/** Leading search icon, mirroring the portal showLeadingIcon/search variant. */
export const WithLeadingIcon: Story = {
  render: () => (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" placeholder="Search sessions" className="pl-9" />
    </div>
  ),
};

/** Controlled input reflecting its value live. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <div className="grid w-full max-w-sm gap-1.5">
        <Label htmlFor="controlled">Session title</Label>
        <Input
          id="controlled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a title"
        />
        <p className="text-sm text-muted-foreground">
          Value: {value.length === 0 ? "(empty)" : value}
        </p>
      </div>
    );
  },
};

/** All states stacked for quick visual review. */
export const AllStates: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-3">
      <Input placeholder="Default" />
      <Input defaultValue="With value" />
      <Input placeholder="Disabled" disabled />
      <Input defaultValue="Invalid" aria-invalid />
    </div>
  ),
};
