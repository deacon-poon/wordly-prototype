import type { Meta, StoryObj } from "@storybook/react";

import { HelpPopoverBubble } from "./HelpPopoverBubble";

const LOREM =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem.";

const ARABIC =
  "عندما يريد العالم أن يتكلّم، فهو يتحدّث بلغة يونيكود. تسجّل الآن لحضور المؤتمر الدولي العاشر ليونيكود (Unicode Conference)، الذي سيعقد في 10-12 آذار 1997 بمدينة مَايِنْتْس، ألمانيا. وسيجمع المؤتمر بين خبراء من كافة قطاعات الصناعة على الشبكة العالمية انترنيت ويونيكود.";

const meta: Meta<typeof HelpPopoverBubble> = {
  title: "Experience/Display/HelpPopoverBubble",
  component: HelpPopoverBubble,
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
  // Constrain width to mimic the help-popover container it lives inside.
  decorators: [
    (Story) => (
      <div className="max-w-sm rounded-md border border-border bg-popover shadow-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HelpPopoverBubble>;

export const Default: Story = {
  args: {
    title: "This is a Title",
    children: <span>{LOREM}</span>,
  },
};

export const NoTitle: Story = {
  args: {
    children: <span>{LOREM}</span>,
  },
};

export const Rtl: Story = {
  args: {
    title: "يتحدّث بلغة يونيكود.",
    rtl: true,
    children: <span>{ARABIC}</span>,
  },
};

export const RichContent: Story = {
  args: {
    title: "Keyboard shortcuts",
    children: (
      <ul className="space-y-1">
        <li>
          <kbd className="rounded border border-border bg-gray-100 px-1 text-xs text-gray-700">
            ⌘ K
          </kbd>{" "}
          Open command palette
        </li>
        <li>
          <kbd className="rounded border border-border bg-gray-100 px-1 text-xs text-gray-700">
            Esc
          </kbd>{" "}
          Close this popover
        </li>
      </ul>
    ),
  },
};
