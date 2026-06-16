import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { LanguageSelector } from "./language-selector";

/**
 * 1:1 mirror of the production Angular Overview story
 *   wordly_portal: stories/business/wordly-language-selector/story-1.Overview.stories.ts
 *
 * The Angular Overview is a multi-select (chip-selector) language picker with
 * search, a max-selectable cap, detectable-only languages, and the same arg
 * set (label / helperText / maxSelectable / emptyStateText / selectMoreText /
 * dialogTitle / dialogDescription / hideSelectedOptions / required / disabled /
 * errorMessage / showInfoIcon / infoTooltipText / extraInfo). Language data is
 * provided here via the component's MOCK_LANGUAGES default rather than the
 * Angular MockLanguageService provider.
 *
 * Title namespace kept as "Workspace Kit/LanguageSelector" to match the
 * existing sibling stories on this branch.
 */
const meta: Meta<typeof LanguageSelector> = {
  title: "Workspace Kit/LanguageSelector",
  component: LanguageSelector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A business component that wraps WordlyChipSelector to provide language " +
          "selection functionality. It automatically loads language data from the " +
          "LanguageService and presents it in a user-friendly interface. Features: " +
          "automatic language data loading with caching, loading and error states, " +
          "all WordlyChipSelector functionality (search, multi-select, dialogs), " +
          "form integration, and a transparent proxy to the underlying chip selector.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Label for the language selector" },
    maxSelectable: {
      control: "number",
      description: "Maximum number of languages that can be selected",
    },
    searchable: {
      control: "boolean",
      description: "Whether to show search functionality",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the field is disabled",
    },
    emptyStateText: {
      control: "text",
      description: "Text shown when no languages are selected",
    },
    selectMoreText: {
      control: "text",
      description: "Text for the add more languages button",
    },
    dialogTitle: {
      control: "text",
      description: "Title for the selection dialog",
    },
    helperText: {
      control: "text",
      description: "Helper text shown below the component",
    },
    hideSelectedOptions: {
      control: "boolean",
      description: "Whether to hide selected languages from the dialog",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when there is an error",
    },
    showInfoIcon: {
      control: "boolean",
      description: "Whether to show an info icon next to the label",
    },
    infoTooltipText: {
      control: "text",
      description: "Tooltip text for the info icon",
    },
    extraInfo: {
      control: "text",
      description: "Additional information text displayed below the component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

/** Controlled wrapper so the story reflects real selection state. */
function Controlled(props: React.ComponentProps<typeof LanguageSelector>) {
  const [value, setValue] = React.useState<string | string[]>(
    props.value ?? (props.singleSelection ? "" : [])
  );
  return (
    <LanguageSelector
      {...props}
      value={value}
      onValueChange={setValue}
      onLanguageSelectionChanged={(languages) =>
        console.log("Language selection changed:", languages)
      }
    />
  );
}

export const Overview: Story = {
  args: {
    label: "Preferred Languages",
    helperText: "Select the languages you are fluent in",
    searchable: true,
    maxSelectable: 3,
    emptyStateText: "No languages selected",
    selectMoreText: "Add more languages",
    dialogTitle: "Select Languages",
    dialogDescription: "Choose the languages you want to select.",
    hideSelectedOptions: true,
    required: false,
    disabled: false,
    onlyDetectable: true,
    errorMessage: "",
    showInfoIcon: false,
    infoTooltipText: "This field helps us understand your language preferences",
    extraInfo: "",
  },
  render: (args) => <Controlled {...args} />,
};
