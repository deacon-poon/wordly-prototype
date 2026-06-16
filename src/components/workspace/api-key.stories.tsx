import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ApiKey, type ApiKeyEventData, type ApiKeyState } from "./api-key";

/**
 * 1:1 mirror of the Angular Overview story
 *   wordly_portal: stories/business/wordly-api-key/story-1.Overview.stories.ts
 *
 * The Angular story exposes two stories — `Overview` (a single controls-driven
 * component starting EMPTY) and `WithApiKeyDemo` (two components side-by-side
 * showing the EMPTY and HAS_KEY states with reactive-form info panels) — both
 * wrapped in the "Portal Context Required" warning banner. Those are reproduced
 * here. The `title:` namespace ("Workspace Kit/...") is kept from the existing
 * React story file.
 *
 * The Angular mock services (`mockDeveloperApiService*`) surface events via
 * `alert(...)`; the same alert handlers are reproduced as React callbacks. Since
 * the React component has no DI/service layer, EMPTY vs HAS_KEY is driven directly
 * by `value`/`state` instead of a mocked `getApiKeys()` call count.
 */

// Mirrors the Angular mock key returned for the HAS_KEY demo.
const MOCK_DEMO_KEY = "ak_1234567890abcdef_mockApiKeyForDemo";

// ---------------------------------------------------------------------------
// Portal Context Warning banner — ported verbatim from the Angular story template
// (<div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"> ...).
// ---------------------------------------------------------------------------
function PortalContextWarning() {
  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-blue-600">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-blue-800">
          <h3 className="mb-1 text-sm font-semibold">
            Portal Context Required
          </h3>
          <p className="text-sm">
            This component must be tested in the portal context at{" "}
            <strong>/storybook</strong> page for full functionality. This demo
            only shows the look and feel of the component.
          </p>
        </div>
      </div>
    </div>
  );
}

// Alert handlers — mirror the Angular story `props` event handlers 1:1.
const onApiKeyCreated = () =>
  alert(
    "This component must be tested in the portal context at /storybook page for full functionality. This demo only shows the look and feel of the component."
  );
const onApiKeyDeleted = (event: ApiKeyEventData) =>
  alert("API Key Deleted: " + JSON.stringify(event));
const onApiKeyRefreshed = (event: ApiKeyEventData) =>
  alert("API Key Refreshed: " + JSON.stringify(event));
const onApiKeyCopied = (event: ApiKeyEventData) =>
  alert("API Key Copied: " + JSON.stringify(event));

// Args mirror the Angular story `args` block (shared by both stories).
const sharedArgs = {
  label: "API Key",
  placeholder: "Your api key will appear here",
  helperText: "Use this API key to authenticate your requests",
  addButtonText: "Generate API Key",
  noKeyText: "No API key found. Generate one to get started.",
  copyButtonTitle: "Copy to Clipboard",
  refreshButtonTitle: "Refresh API Key",
  deleteButtonTitle: "Delete API Key",
  required: false,
  disabled: false,
  readonly: false,
};

const meta: Meta<typeof ApiKey> = {
  title: "Workspace Kit/ApiKey",
  component: ApiKey,
  argTypes: {
    // Mirrors the Angular `argTypes` block.
    label: {
      control: "text",
      description: "Label for the API key input field",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the API key input",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the input",
    },
    addButtonText: {
      control: "text",
      description: 'Text for the "Generate API Key" button',
    },
    noKeyText: {
      control: "text",
      description: "Text displayed when no API key is found",
    },
    copyButtonTitle: {
      control: "text",
      description: "Title/tooltip for the copy button",
    },
    refreshButtonTitle: {
      control: "text",
      description: "Title/tooltip for the refresh button",
    },
    deleteButtonTitle: {
      control: "text",
      description: "Title/tooltip for the delete button",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
    readonly: {
      control: "boolean",
      description: "Whether the input is read-only",
    },
    state: {
      control: "select",
      options: ["loading", "empty", "has_key", "error"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
# Wordly API Key Component

A business component for managing API keys with Keycloak integration.

## Portal Context Required

This component requires portal services and Keycloak authentication to function fully.
For complete functionality testing, use the **/storybook** page in the development portal environment.

## Features

- **State Management**: Handles empty, loading, has-key, and error states
- **API Key Operations**: Create, copy, refresh, and delete API keys
- **Keycloak Integration**: Seamless authentication flow
- **Form Integration**: Works with reactive forms and template forms
- **Event Handling**: Emits events for all API key operations
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ApiKey>;

// ---------------------------------------------------------------------------
// Overview — single controls-driven component, starting in EMPTY state.
// (Angular `export const Overview`.)
// ---------------------------------------------------------------------------
export const Overview: Story = {
  render: (args) => (
    <div className="p-6">
      <PortalContextWarning />
      <ApiKey
        {...args}
        onAdd={onApiKeyCreated}
        onDelete={onApiKeyDeleted}
        onRefresh={onApiKeyRefreshed}
        onCopy={onApiKeyCopied}
      />
    </div>
  ),
  args: sharedArgs,
  parameters: {
    docs: {
      description: {
        story: `
**Simple API Key Component**

Use the Controls panel to customize the component properties:

- **Text Properties**: Change labels, placeholder, helper text, button titles
- **Boolean Properties**: Toggle required, disabled, readonly states

**Note**: Component events show alerts when triggered. The component starts in EMPTY state.
        `,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// WithApiKeyDemo — two components side by side (EMPTY + HAS_KEY) with the
// state-info panels. Mirrors the Angular `export const WithApiKeyDemo` reactive
// form demo (the FormControl value/valid/touched/dirty panels become local state).
// ---------------------------------------------------------------------------
export const WithApiKeyDemo: Story = {
  render: (args) => {
    const [emptyValue, setEmptyValue] = React.useState<string | null>(null);
    const [existingValue, setExistingValue] = React.useState<string | null>(
      MOCK_DEMO_KEY
    );

    return (
      <div className="p-6">
        <PortalContextWarning />

        <div className="space-y-8">
          {/* Empty State Example */}
          <div className="mb-8">
            <h3 className="mb-4 text-base font-medium">
              Empty State (No API Key)
            </h3>
            <ApiKey
              {...args}
              value={emptyValue}
              onAdd={() => {
                onApiKeyCreated();
                setEmptyValue(MOCK_DEMO_KEY);
              }}
              onDelete={(e) => {
                onApiKeyDeleted(e);
                setEmptyValue(null);
              }}
              onRefresh={onApiKeyRefreshed}
              onCopy={onApiKeyCopied}
            />

            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium">State Info:</h4>
              <div className="text-xs text-gray-600">
                <div>Value: {emptyValue || "null"}</div>
                <div>State: {emptyValue ? "has_key" : "empty"}</div>
              </div>
            </div>
          </div>

          {/* Has Key State Example */}
          <div className="mb-8">
            <h3 className="mb-4 text-base font-medium">
              Has Key State (With API Key)
            </h3>
            <ApiKey
              {...args}
              label="API Key (With Existing Key)"
              helperText="This shows how the component looks with an existing API key"
              value={existingValue}
              onAdd={onApiKeyCreated}
              onDelete={(e) => {
                onApiKeyDeleted(e);
                setExistingValue(null);
              }}
              onRefresh={onApiKeyRefreshed}
              onCopy={onApiKeyCopied}
            />

            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium">State Info:</h4>
              <div className="text-xs text-gray-600">
                <div>Value: {existingValue || "null"}</div>
                <div>State: {existingValue ? "has_key" : "empty"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  args: sharedArgs,
  parameters: {
    docs: {
      description: {
        story: `
**API Key Demo - With Existing Key**

This story shows both EMPTY and HAS_KEY states side by side:

- **Top component**: Shows EMPTY state with "Generate API Key" button
- **Bottom component**: Shows HAS_KEY state with copy/refresh/delete buttons

**Portal Context Required**: This component must be tested in the portal context at **/storybook** page for full functionality. This demo only shows the look and feel of the component.
        `,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// State variants — direct showcases of each WordlyApiKeyState (not in the
// Angular Overview story, but kept to exercise the loading/error states the
// service-mocked Angular story can only reach indirectly).
// ---------------------------------------------------------------------------
const stateArgs = { ...sharedArgs, addButtonText: "Add Api Key" };

export const Loading: Story = {
  args: { ...stateArgs, state: "loading" as ApiKeyState },
};

export const Error: Story = {
  args: { ...stateArgs, state: "error" as ApiKeyState },
};
