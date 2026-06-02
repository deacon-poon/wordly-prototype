import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription } from "./alert";
import { Info, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "Design System/Core/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

// ── Info ─────────────────────────────────────────────────────────────────────
export const InfoAlert: Story = {
  name: "Info",
  render: () => (
    <Alert className="flex items-start gap-3 max-w-md">
      <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
      <AlertDescription>
        It may take up to 30 seconds for the Wordly bot to join your meeting.
      </AlertDescription>
    </Alert>
  ),
};

// ── Success ───────────────────────────────────────────────────────────────────
export const SuccessAlert: Story = {
  name: "Success",
  render: () => (
    <Alert className="flex items-start gap-3 max-w-md border-green-200 bg-green-50">
      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
      <AlertDescription className="text-green-800">
        Session started successfully. Attendees can now join at{" "}
        <strong>attend.wordly.ai/join/ABC-123</strong>.
      </AlertDescription>
    </Alert>
  ),
};

// ── Warning ───────────────────────────────────────────────────────────────────
export const WarningAlert: Story = {
  name: "Warning",
  render: () => (
    <Alert className="flex items-start gap-3 max-w-md border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
      <AlertDescription className="text-amber-800">
        Your session is approaching the language limit. Upgrade your plan to add
        more output languages.
      </AlertDescription>
    </Alert>
  ),
};

// ── Error ─────────────────────────────────────────────────────────────────────
export const ErrorAlert: Story = {
  name: "Error",
  render: () => (
    <Alert className="flex items-start gap-3 max-w-md border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
      <AlertDescription className="text-red-800">
        Could not connect to the session. Please check your network and try
        again.
      </AlertDescription>
    </Alert>
  ),
};

// ── All Variants ─────────────────────────────────────────────────────────────
export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="space-y-3 max-w-md">
      <Alert className="flex items-start gap-3">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
        <AlertDescription>Info: Default blue alert.</AlertDescription>
      </Alert>
      <Alert className="flex items-start gap-3 border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
        <AlertDescription className="text-green-800">
          Success: Action completed.
        </AlertDescription>
      </Alert>
      <Alert className="flex items-start gap-3 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Warning: Something needs attention.
        </AlertDescription>
      </Alert>
      <Alert className="flex items-start gap-3 border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
        <AlertDescription className="text-red-800">
          Error: Something went wrong.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
