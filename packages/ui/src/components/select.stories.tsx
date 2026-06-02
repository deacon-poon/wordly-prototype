import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";

const meta: Meta<typeof Select> = {
  title: "Design System/Core/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese (Simplified)" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
];

// ── Basic ─────────────────────────────────────────────────────────────────────
export const Basic: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

// ── With Label ────────────────────────────────────────────────────────────────
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-xs items-center gap-1.5">
      <Label htmlFor="output-language">Output language</Label>
      <Select>
        <SelectTrigger id="output-language" className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Wordly will translate speech into this language.
      </p>
    </div>
  ),
};

// ── Grouped ───────────────────────────────────────────────────────────────────
export const Grouped: Story = {
  render: () => (
    <div className="grid w-full max-w-xs items-center gap-1.5">
      <Label>Input language</Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select spoken language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="es-MX">Spanish (Mexico)</SelectItem>
            <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="en-GB">English (UK)</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia Pacific</SelectLabel>
            <SelectItem value="zh">Chinese (Simplified)</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

// ── Disabled ─────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-xs items-center gap-1.5">
      <Label>Language (disabled)</Label>
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="English (US)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en-US">English (US)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
