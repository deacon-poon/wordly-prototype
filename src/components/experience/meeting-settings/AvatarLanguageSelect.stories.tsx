import type { Meta, StoryObj } from "@storybook/react";

import {
  AvatarLanguageSelect,
  MOCK_LANGUAGES,
  type LanguageOption,
} from "./AvatarLanguageSelect";

const meta: Meta<typeof AvatarLanguageSelect> = {
  title: "Experience/Meeting Settings/AvatarLanguageSelect",
  component: AvatarLanguageSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Avatar that doubles as a language selector. Ported from the production " +
          "MUI/Emotion component to shadcn (Avatar + Popover + Command) and Tailwind. " +
          "The teal accent maps to the `action-teal` token; Brand Blue remains the app primary.",
      },
    },
  },
  argTypes: {
    onLanguageChange: { action: "languageChanged" },
    avatarImage: { control: "text" },
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof AvatarLanguageSelect>;

const sampleLanguages: LanguageOption[] = MOCK_LANGUAGES;

export const Default: Story = {
  args: {
    name: "You",
    message: "You are speaking the selected language",
    languages: sampleLanguages,
    defaultValue: "en",
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    small: true,
  },
};

export const Searchable: Story = {
  args: {
    ...Default.args,
    searchable: true,
  },
};

export const WithImage: Story = {
  args: {
    name: "Ada Lovelace",
    message: "Presenter",
    languages: sampleLanguages,
    avatarImage: "https://i.pravatar.cc/100?img=47",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const AvatarOnly: Story = {
  args: {
    name: "Grace Hopper",
    message: "Attendee",
    languages: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no languages are supplied, the component renders an avatar only " +
          "with no select affordance.",
      },
    },
  },
};

export const ManyLanguages: Story = {
  args: {
    name: "You",
    message: "Pick a language",
    searchable: true,
    languages: [
      ...sampleLanguages,
      {
        wordlyCode: "de",
        displayName: "German — Deutsch",
        compactDisplayName: "German",
      },
      {
        wordlyCode: "it",
        displayName: "Italian — Italiano",
        compactDisplayName: "Italian",
      },
      {
        wordlyCode: "pt",
        displayName: "Portuguese — Português",
        compactDisplayName: "Portuguese",
      },
      {
        wordlyCode: "zh",
        displayName: "Chinese — 中文",
        compactDisplayName: "Chinese",
      },
      {
        wordlyCode: "hi",
        displayName: "Hindi — हिन्दी",
        compactDisplayName: "Hindi",
      },
      {
        wordlyCode: "ru",
        displayName: "Russian — Русский",
        compactDisplayName: "Russian",
      },
    ],
  },
};
