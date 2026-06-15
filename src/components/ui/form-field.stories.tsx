import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta: Meta<typeof FormField> = {
  title: "Design System/Core/Form Field",
  component: FormField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Standard vertical field layout (label → control → description/error). Wraps any control — Input, Select, Checkbox, RadioGroup — and auto-wires id + aria for accessibility.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const WithInput: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Session name" description="Shown to attendees on join.">
        <Input placeholder="Q1 All-Hands" />
      </FormField>
    </div>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Source language" required>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Email" error="Enter a valid email address." required>
        <Input type="email" defaultValue="not-an-email" />
      </FormField>
    </div>
  ),
};

export const WithRadioGroup: Story = {
  render: () => (
    <FormField label="Caption display" description="Where captions appear.">
      <RadioGroup defaultValue="overlay" className="mt-1">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="overlay" id="r-overlay" />
          <Label htmlFor="r-overlay">Overlay</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sidebar" id="r-sidebar" />
          <Label htmlFor="r-sidebar">Sidebar</Label>
        </div>
      </RadioGroup>
    </FormField>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <FormField description="You can change this later in settings.">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-record" defaultChecked />
        <Label htmlFor="cb-record">Record this session</Label>
      </div>
    </FormField>
  ),
};
