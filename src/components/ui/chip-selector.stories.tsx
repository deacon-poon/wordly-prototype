import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { ChipSelector, type ChipSelectorOption } from "./chip-selector";

/**
 * ChipSelector — React migration of the portal `app-wordly-chip-selector`
 * (wordly_portal: libs/components/core/chip-selector).
 *
 * Stories mirror the portal Overview.stories 1:1
 * (stories/core/wordly-chip-selector/story-1.Overview.stories.ts):
 * Overview, Max Selectable (Limit 3), Unlimited Selections, With Search.
 *
 * Provides a way to select multiple options from a list and display them as
 * chips. A dialog with a (optionally searchable) checkbox list drives the
 * selection; supports a max-selection limit, hiding selected options, and
 * loading / error / empty states.
 */

// Available languages for the example - Extended list to test dialog scrolling
const AVAILABLE_LANGUAGES: ChipSelectorOption[] = [
  { value: "en-US", text: "English (US)", help: "American English" },
  { value: "en-GB", text: "English (UK)", help: "British English" },
  { value: "en-AU", text: "English (Australia)", help: "Australian English" },
  { value: "en-CA", text: "English (Canada)", help: "Canadian English" },
  { value: "es-ES", text: "Spanish (Spain)", help: "Castilian Spanish" },
  { value: "es-MX", text: "Spanish (Mexico)", help: "Mexican Spanish" },
  { value: "es-AR", text: "Spanish (Argentina)", help: "Argentinian Spanish" },
  { value: "es-CO", text: "Spanish (Colombia)", help: "Colombian Spanish" },
  { value: "es-CL", text: "Spanish (Chile)", help: "Chilean Spanish" },
  { value: "fr-FR", text: "French (France)", help: "Metropolitan French" },
  { value: "fr-CA", text: "French (Canada)", help: "Canadian French" },
  { value: "fr-BE", text: "French (Belgium)", help: "Belgian French" },
  { value: "fr-CH", text: "French (Switzerland)", help: "Swiss French" },
  { value: "de-DE", text: "German (Germany)", help: "Standard German" },
  { value: "de-AT", text: "German (Austria)", help: "Austrian German" },
  { value: "de-CH", text: "German (Switzerland)", help: "Swiss German" },
  { value: "it-IT", text: "Italian (Italy)", help: "Standard Italian" },
  { value: "it-CH", text: "Italian (Switzerland)", help: "Swiss Italian" },
  { value: "pt-BR", text: "Portuguese (Brazil)", help: "Brazilian Portuguese" },
  {
    value: "pt-PT",
    text: "Portuguese (Portugal)",
    help: "European Portuguese",
  },
  { value: "ja-JP", text: "Japanese (Japan)", help: "Standard Japanese" },
  { value: "ko-KR", text: "Korean (Korea)", help: "Standard Korean" },
  { value: "zh-CN", text: "Chinese (Simplified)", help: "Mandarin Simplified" },
  {
    value: "zh-TW",
    text: "Chinese (Traditional)",
    help: "Mandarin Traditional",
  },
  {
    value: "zh-HK",
    text: "Chinese (Hong Kong)",
    help: "Cantonese Traditional",
  },
  {
    value: "ar-SA",
    text: "Arabic (Saudi Arabia)",
    help: "Modern Standard Arabic",
  },
  { value: "ar-EG", text: "Arabic (Egypt)", help: "Egyptian Arabic" },
  { value: "ar-AE", text: "Arabic (UAE)", help: "Gulf Arabic" },
  { value: "hi-IN", text: "Hindi (India)", help: "Standard Hindi" },
  { value: "ru-RU", text: "Russian (Russia)", help: "Standard Russian" },
  { value: "nl-NL", text: "Dutch (Netherlands)", help: "Standard Dutch" },
  { value: "nl-BE", text: "Dutch (Belgium)", help: "Flemish" },
  { value: "sv-SE", text: "Swedish (Sweden)", help: "Standard Swedish" },
  { value: "no-NO", text: "Norwegian (Norway)", help: "Norwegian Bokmål" },
  { value: "da-DK", text: "Danish (Denmark)", help: "Standard Danish" },
  { value: "fi-FI", text: "Finnish (Finland)", help: "Standard Finnish" },
  { value: "pl-PL", text: "Polish (Poland)", help: "Standard Polish" },
  { value: "cs-CZ", text: "Czech (Czech Republic)", help: "Standard Czech" },
  { value: "sk-SK", text: "Slovak (Slovakia)", help: "Standard Slovak" },
  { value: "hu-HU", text: "Hungarian (Hungary)", help: "Standard Hungarian" },
  { value: "ro-RO", text: "Romanian (Romania)", help: "Standard Romanian" },
  { value: "bg-BG", text: "Bulgarian (Bulgaria)", help: "Standard Bulgarian" },
  { value: "hr-HR", text: "Croatian (Croatia)", help: "Standard Croatian" },
  { value: "sr-RS", text: "Serbian (Serbia)", help: "Standard Serbian" },
  { value: "sl-SI", text: "Slovenian (Slovenia)", help: "Standard Slovenian" },
  { value: "et-EE", text: "Estonian (Estonia)", help: "Standard Estonian" },
  { value: "lv-LV", text: "Latvian (Latvia)", help: "Standard Latvian" },
  {
    value: "lt-LT",
    text: "Lithuanian (Lithuania)",
    help: "Standard Lithuanian",
  },
  { value: "el-GR", text: "Greek (Greece)", help: "Modern Greek" },
  { value: "tr-TR", text: "Turkish (Turkey)", help: "Standard Turkish" },
  { value: "he-IL", text: "Hebrew (Israel)", help: "Modern Hebrew" },
  { value: "th-TH", text: "Thai (Thailand)", help: "Central Thai" },
  { value: "vi-VN", text: "Vietnamese (Vietnam)", help: "Northern Vietnamese" },
  { value: "ms-MY", text: "Malay (Malaysia)", help: "Standard Malay" },
  { value: "id-ID", text: "Indonesian (Indonesia)", help: "Bahasa Indonesia" },
  { value: "tl-PH", text: "Filipino (Philippines)", help: "Tagalog-based" },
  { value: "ur-PK", text: "Urdu (Pakistan)", help: "Standard Urdu" },
  { value: "bn-BD", text: "Bengali (Bangladesh)", help: "Standard Bengali" },
  { value: "ta-IN", text: "Tamil (India)", help: "Standard Tamil" },
  { value: "te-IN", text: "Telugu (India)", help: "Standard Telugu" },
  { value: "ml-IN", text: "Malayalam (India)", help: "Standard Malayalam" },
  { value: "kn-IN", text: "Kannada (India)", help: "Standard Kannada" },
  { value: "gu-IN", text: "Gujarati (India)", help: "Standard Gujarati" },
];

const meta: Meta<typeof ChipSelector> = {
  title: "Design System/Molecules/ChipSelector",
  component: ChipSelector,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Label text for the chip selector" },
    helperText: {
      control: "text",
      description: "Helper text shown below the component",
    },
    displayError: {
      control: "boolean",
      description: "Whether to display error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when displayError is true",
    },
    required: {
      control: "boolean",
      description: "Whether the field is required",
    },
    disabled: {
      control: "boolean",
      description: "Whether the component is disabled",
    },
    readOnly: {
      control: "boolean",
      description: "Whether the component is readonly",
    },
    showInfoIcon: {
      control: "boolean",
      description: "Whether to show info icon",
    },
    infoTooltipText: {
      control: "text",
      description: "Tooltip text for info icon",
    },
    extraInfo: { control: "text", description: "Extra information text" },
    selectMoreText: {
      control: "text",
      description: 'Text for the "add more" button',
    },
    dialogTitle: {
      control: "text",
      description: "Title of the selection dialog",
    },
    dialogDescription: {
      control: "text",
      description: "Description text in the selection dialog",
    },
    dialogSelectText: {
      control: "text",
      description: "Text for the select button in dialog",
    },
    dialogCancelText: {
      control: "text",
      description: "Text for the cancel button in dialog",
    },
    emptyStateText: {
      control: "text",
      description: "Text shown when no options are selected",
    },
    maxSelectable: {
      control: "number",
      description:
        "Maximum number of options that can be selected. Use 0 or undefined for no limit.",
    },
    selectionLimitText: {
      control: "text",
      description:
        'Text displayed before the limit number (e.g., "Select up to")',
    },
    itemTypeName: {
      control: "text",
      description:
        'Name for the items being selected (e.g., "languages", "skills", "options")',
    },
    searchable: {
      control: "boolean",
      description: "Whether to show the search input field",
    },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    hideSelectedOptions: {
      control: "boolean",
      description:
        "Whether to hide already selected options from the modal (default: true). When true, only unselected options appear in the dialog.",
    },
  },
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChipSelector>;

/**
 * Controlled wrapper — the portal stories bind `value` two-way; here we keep
 * selection in local state so chips add/remove and the picker reflects changes.
 */
function ControlledChipSelector({
  initial = [],
  ...props
}: React.ComponentProps<typeof ChipSelector> & { initial?: string[] }) {
  const [value, setValue] = React.useState<string[]>(initial);
  return (
    <div style={{ maxWidth: 520 }}>
      <ChipSelector {...props} value={value} onValueChange={setValue} />
    </div>
  );
}

// Complete story showing all features with configurable parameters
export const Overview: Story = {
  name: "Overview",
  render: (args) => (
    <ControlledChipSelector {...args} initial={["en-US", "es-ES"]} />
  ),
  args: {
    label: "Preferred Languages",
    helperText:
      "Select the languages you want to use. You can select multiple options.",
    displayError: false,
    errorMessage: "Please select at least one language",
    required: true,
    disabled: false,
    readOnly: false,
    showInfoIcon: true,
    infoTooltipText: "You can select multiple languages for your content",
    extraInfo: "Selected languages will affect content localization.",
    selectMoreText: "Add another language",
    dialogTitle: "Select Languages",
    dialogDescription:
      "Choose the languages you want to enable. You can select multiple options.",
    dialogSelectText: "Select",
    dialogCancelText: "Cancel",
    emptyStateText: "No languages selected",
    maxSelectable: undefined,
    selectionLimitText: "Select up to",
    itemTypeName: "languages",
    searchable: false,
    searchPlaceholder: "Search for languages...",
    hideSelectedOptions: true,
    options: AVAILABLE_LANGUAGES,
  },
};

// Story demonstrating maximum selection limit
export const MaxSelectable: Story = {
  name: "Max Selectable (Limit 3)",
  render: (args) => (
    <ControlledChipSelector {...args} initial={["angular", "typescript"]} />
  ),
  args: {
    label: "Select up to 3 Skills",
    helperText: "You can select a maximum of 3 skills.",
    displayError: false,
    errorMessage: "Please select at least one skill",
    required: true,
    disabled: false,
    readOnly: false,
    showInfoIcon: true,
    infoTooltipText: "Choose your top 3 skills",
    extraInfo: "Selection is limited to 3 options maximum.",
    selectMoreText: "Add skill",
    dialogTitle: "Select Skills (Max 3)",
    dialogDescription:
      "Choose up to 3 skills that best represent your expertise.",
    dialogSelectText: "Select",
    dialogCancelText: "Cancel",
    emptyStateText: "No skills selected",
    maxSelectable: 3,
    selectionLimitText: "Select up to",
    itemTypeName: "skills",
    searchable: true,
    searchPlaceholder: "Search for skills...",
    hideSelectedOptions: true,
    options: [
      { value: "angular", text: "Angular" },
      { value: "react", text: "React" },
      { value: "vue", text: "Vue.js" },
      { value: "nodejs", text: "Node.js" },
      { value: "typescript", text: "TypeScript" },
      { value: "javascript", text: "JavaScript" },
      { value: "python", text: "Python" },
      { value: "java", text: "Java" },
      { value: "csharp", text: "C#" },
      { value: "golang", text: "Go" },
    ],
  },
};

// Story demonstrating unlimited selections
export const Unlimited: Story = {
  name: "Unlimited Selections",
  render: (args) => (
    <ControlledChipSelector
      {...args}
      initial={["tech", "music", "travel", "reading", "gaming"]}
    />
  ),
  args: {
    label: "Choose Your Interests",
    helperText: "Select as many interests as you want - no limit!",
    displayError: false,
    errorMessage: "Please select at least one interest",
    required: false,
    disabled: false,
    readOnly: false,
    showInfoIcon: true,
    infoTooltipText: "You can select unlimited options",
    extraInfo: "No maximum limit on selections.",
    selectMoreText: "Add interest",
    dialogTitle: "Select Your Interests",
    dialogDescription:
      "Choose all the interests that apply to you. There is no limit on selections.",
    dialogSelectText: "Select",
    dialogCancelText: "Cancel",
    emptyStateText: "No interests selected",
    maxSelectable: undefined, // No limit
    selectionLimitText: "Select up to",
    itemTypeName: "interests",
    searchable: true,
    searchPlaceholder: "Search for interests...",
    options: [
      { value: "tech", text: "Technology" },
      { value: "sports", text: "Sports" },
      { value: "music", text: "Music" },
      { value: "travel", text: "Travel" },
      { value: "cooking", text: "Cooking" },
      { value: "reading", text: "Reading" },
      { value: "gaming", text: "Gaming" },
      { value: "fitness", text: "Fitness" },
      { value: "art", text: "Art & Design" },
      { value: "photography", text: "Photography" },
      { value: "movies", text: "Movies & TV" },
      { value: "nature", text: "Nature & Outdoors" },
    ],
  },
};

// Story demonstrating search functionality
export const WithSearch: Story = {
  name: "With Search",
  render: (args) => (
    <ControlledChipSelector {...args} initial={["javascript", "typescript"]} />
  ),
  args: {
    label: "Programming Languages",
    helperText: "Search and select your preferred programming languages.",
    displayError: false,
    errorMessage: "Please select at least one language",
    required: false,
    disabled: false,
    readOnly: false,
    showInfoIcon: true,
    infoTooltipText: "Use the search to quickly find languages",
    extraInfo: "Type to filter the available options.",
    selectMoreText: "Add language",
    dialogTitle: "Select Programming Languages",
    dialogDescription:
      "Use the search field to quickly find and select your preferred programming languages.",
    dialogSelectText: "Select",
    dialogCancelText: "Cancel",
    emptyStateText: "No languages selected",
    maxSelectable: 5,
    selectionLimitText: "Select up to",
    itemTypeName: "languages",
    searchable: true,
    searchPlaceholder: "Search for programming languages...",
    options: [
      { value: "javascript", text: "JavaScript" },
      { value: "typescript", text: "TypeScript" },
      { value: "python", text: "Python" },
      { value: "java", text: "Java" },
      { value: "csharp", text: "C#" },
      { value: "cpp", text: "C++" },
      { value: "go", text: "Go" },
      { value: "rust", text: "Rust" },
      { value: "php", text: "PHP" },
      { value: "ruby", text: "Ruby" },
      { value: "kotlin", text: "Kotlin" },
      { value: "swift", text: "Swift" },
      { value: "dart", text: "Dart" },
      { value: "scala", text: "Scala" },
      { value: "elixir", text: "Elixir" },
      { value: "clojure", text: "Clojure" },
      { value: "haskell", text: "Haskell" },
      { value: "erlang", text: "Erlang" },
    ],
  },
};
