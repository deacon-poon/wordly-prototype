import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { LocaleSelector } from "./locale-selector";

/**
 * 1:1 mirror of the production Angular Overview story
 *   wordly_portal: stories/business/wordly-locale-selector/story-1.Overview.stories.ts
 *
 * Same single `Overview` story + the same args (label "Select Language",
 * placeholder "Choose a locale", helperText "Select your preferred language",
 * info tooltip text, empty initial value) and the same mock locale dataset
 * (en / es / fr / ja) — provided here via the component's MOCK_LOCALES default
 * rather than the Angular bridge-service provider override.
 *
 * Title namespace kept as "Workspace Kit/LocaleSelector" to match the existing
 * sibling stories on this branch.
 */
const meta: Meta<typeof LocaleSelector> = {
  title: "Workspace Kit/LocaleSelector",
  component: LocaleSelector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "EXACT React mirror of the production Angular `wordly-locale-selector`. " +
          "A thin proxy that renders the shared FormControlWrapper (label / " +
          "required / helper / error / info / extra-info / responsive " +
          "label-beside-control layout) around a single, non-searchable Select " +
          "— matching the Angular proxy to `wordly-select` " +
          "(multiple=false, scrollable=true, searchable=false). Locale data " +
          "arrives via props (mock supported-locales by default); no Angular DI " +
          "layer (ConstantsService.SUPPORTED_LOCALES).",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the locale selector",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when no locale is selected",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the selector",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the selector is disabled",
    },
    readonly: {
      control: "boolean",
      description: "Whether the selector is readonly",
    },
    errorMessage: {
      control: "text",
      description: "Custom error message to display",
    },
    showInfoIcon: {
      control: "boolean",
      description: "Whether to show the info icon with tooltip",
    },
    infoTooltipText: {
      control: "text",
      description: "Text for the info tooltip",
    },
    extraInfo: {
      control: "text",
      description: "Additional information displayed below the field",
    },
    value: {
      control: "select",
      options: ["", "en", "es", "fr", "ja"],
      description: "Selected locale value",
    },
    loadingText: {
      control: "text",
      description: "Text to display while loading",
    },
    errorLoadingText: {
      control: "text",
      description: "Text to display when there is an error",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocaleSelector>;

/** Controlled wrapper so the story reflects real selection state. */
function Controlled(props: React.ComponentProps<typeof LocaleSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return <LocaleSelector {...props} value={value} onValueChange={setValue} />;
}

export const Overview: Story = {
  args: {
    label: "Select Language",
    placeholder: "Choose a locale",
    helperText: "Select your preferred language",
    required: false,
    disabled: false,
    readonly: false,
    errorMessage: "",
    showInfoIcon: false,
    infoTooltipText: "Choose the language for the application interface",
    extraInfo: "",
    value: "",
    loadingText: "Loading locales...",
    errorLoadingText: "Failed to load locales",
  },
  render: (args) => <Controlled {...args} />,
};
