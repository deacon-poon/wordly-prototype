import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { MainContainer } from "@/components/ui/main-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Storybook for MainContainer — mirrors the Angular portal
 * `stories/core/wordly-main-container/*` (Overview, LoadingState, SidePanel,
 * WithBreadcrumb).
 *
 * The Angular component projects content into `[slot=title|description|action|
 * content|footer|side-panel]`; the React version takes those as explicit props
 * (`title`, `description`, `action`, `children`, `footer`, `sidePanel`). The
 * Overview reproduces the portal's profile-settings form layout using the shared
 * shadcn atoms (Input, Select, Checkbox).
 */

const countryOptions = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "gb" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
];

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "user", label: "User" },
  { value: "guest", label: "Guest" },
];

function ProfileField({
  id,
  label,
  placeholder,
  helperText,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} />
      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

function ProfileForm() {
  return (
    <form className="flex flex-col gap-6">
      <ProfileField
        id="firstName"
        label="First Name"
        placeholder="Enter your first name"
        helperText="This will be displayed on your profile"
      />
      <ProfileField
        id="lastName"
        label="Last Name"
        placeholder="Enter your last name"
      />
      <ProfileField
        id="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        helperText="We'll use this for account notifications"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="country">Country</Label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This helps us provide region-specific features
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Role</Label>
        <Select>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="newsletter" />
          <Label htmlFor="newsletter">Subscribe to newsletter</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="acceptTerms" />
          <Label htmlFor="acceptTerms">Accept Terms and Conditions</Label>
        </div>
      </div>
    </form>
  );
}

const meta: Meta<typeof MainContainer> = {
  title: "Design System/Organisms/MainContainer",
  component: MainContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page-level layout container ported from the Angular `app-wordly-main-container`. Provides a header (title / description / action), an optional extra-actions row, a separator, a scrollable content region, an alignable footer, an optional loading overlay, and an optional resizable side panel. Slots are exposed as explicit React props.",
      },
    },
  },
  argTypes: {
    footerAlignment: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Alignment of footer buttons",
    },
    showBorders: {
      control: "boolean",
      description: "Show borders around the container sections",
    },
    showContentPadding: {
      control: "boolean",
      description:
        "Show padding in the content area. Set to false to allow content to extend edge-to-edge",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MainContainer>;

export const Overview: Story = {
  args: {
    footerAlignment: "left",
    showBorders: true,
    showContentPadding: true,
  },
  render: (args) => (
    <div className="h-screen p-6">
      <MainContainer
        {...args}
        title={<h1 className="text-2xl font-semibold">Profile Settings</h1>}
        description="Manage your account settings and preferences"
        action={<Button variant="default">Fill Random Data</Button>}
        footer={
          <div className="flex gap-2">
            <Button variant="default">Save Changes</Button>
            <Button variant="outline">Reset Form</Button>
          </div>
        }
      >
        <ProfileForm />
      </MainContainer>
    </div>
  ),
};

export const LoadingState: Story = {
  name: "Loading state",
  args: {
    footerAlignment: "left",
    showBorders: true,
    showContentPadding: true,
    loading: true,
    loadingText: "Loading profile…",
  },
  render: (args) => (
    <div className="h-screen p-6">
      <MainContainer
        {...args}
        title={<h1 className="text-2xl font-semibold">Profile Settings</h1>}
        description="Manage your account settings and preferences"
        footer={
          <div className="flex gap-2">
            <Button variant="default">Save Changes</Button>
            <Button variant="outline">Reset Form</Button>
          </div>
        }
      >
        <ProfileForm />
      </MainContainer>
    </div>
  ),
};

export const SidePanel: Story = {
  name: "With side panel",
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="h-screen p-6">
        <MainContainer
          title={<h1 className="text-2xl font-semibold">Event Details</h1>}
          description="Inspect and configure this event"
          action={
            <Button variant="outline" onClick={() => setOpen((o) => !o)}>
              {open ? "Hide panel" : "Show panel"}
            </Button>
          }
          hasSidePanel
          sidePanelOpen={open}
          onSidePanelToggle={setOpen}
          sidePanel={
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Details</h2>
              <p className="text-sm text-muted-foreground">
                The side panel is resizable — drag the handle on its left edge.
              </p>
            </div>
          }
        >
          <ProfileForm />
        </MainContainer>
      </div>
    );
  },
};

export const WithBreadcrumb: Story = {
  name: "With breadcrumb",
  args: {
    showBreadcrumb: true,
  },
  render: (args) => (
    <div className="h-screen p-6">
      <MainContainer
        {...args}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        title={<h1 className="text-2xl font-semibold">Profile Settings</h1>}
        description="Manage your account settings and preferences"
        footer={<Button variant="default">Save Changes</Button>}
      >
        <ProfileForm />
      </MainContainer>
    </div>
  ),
};
