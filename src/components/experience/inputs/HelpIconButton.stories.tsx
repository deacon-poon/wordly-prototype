import type { Meta, StoryObj } from "@storybook/react";
import { Settings } from "lucide-react";

import { HelpIconButton } from "./HelpIconButton";

const meta: Meta<typeof HelpIconButton> = {
  title: "Experience/Inputs/HelpIconButton",
  component: HelpIconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Help icon that reveals a contextual popover bubble on hover or focus. Ported from the MUI HelpIconButton + HelpPopoverBubble to shadcn HoverCard + Button. Hover or focus the icon to open.",
      },
    },
  },
  argTypes: {
    children: { control: false },
    icon: { control: false },
    title: { control: "text" },
    popoverWidth: { control: "text" },
    rtl: { control: "boolean" },
    "aria-label": { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof HelpIconButton>;

/** Default: no title, mock help copy, default HelpCircle icon. */
export const Default: Story = {
  args: {
    "aria-label": "Field help",
  },
};

/** With a title + divider (mirrors HelpPopoverBubble's titled layout). */
export const Titled: Story = {
  args: {
    title: "Source Language",
    popoverWidth: "20rem",
    "aria-label": "Source language help",
    children: (
      <p className="text-sm text-gray-700">
        Select the language the speaker will present in. Attendees can then
        choose any of the supported translation languages.
      </p>
    ),
  },
};

/** Custom trigger icon (lucide Settings) instead of the default help icon. */
export const CustomIcon: Story = {
  args: {
    icon: <Settings className="size-5" />,
    title: "Advanced Settings",
    "aria-label": "Advanced settings help",
    children: (
      <p className="text-sm text-gray-700">
        These options control how captions are rendered for end users.
      </p>
    ),
  },
};

/** Right-to-left content layout. */
export const RightToLeft: Story = {
  args: {
    rtl: true,
    title: "مساعدة",
    popoverWidth: "20rem",
    "aria-label": "RTL help",
    children: (
      <p className="text-sm text-gray-700">
        هذا نص المساعدة السياقي المعروض داخل الفقاعة المنبثقة.
      </p>
    ),
  },
};

/** Right-justified placement within a full-width row. */
export const RightJustified: Story = {
  render: (args) => (
    <div className="flex w-full flex-row-reverse">
      <HelpIconButton {...args} />
    </div>
  ),
  args: {
    title: "Help",
    "aria-label": "Right justified help",
  },
};

/** Rich content: the popover children can be any node. */
export const RichContent: Story = {
  args: {
    title: "Supported Formats",
    popoverWidth: "22rem",
    "aria-label": "Supported formats help",
    children: (
      <ul className="list-disc space-y-1 pl-4 text-sm text-gray-700">
        <li>Live audio captioning</li>
        <li>Real-time translation in 60+ languages</li>
        <li>Downloadable transcripts</li>
      </ul>
    ),
  },
};
