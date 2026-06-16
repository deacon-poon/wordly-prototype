import type { Meta, StoryObj } from "@storybook/react";
import { HelpCircle } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { HelpIconButton } from "./HelpIconButton";

/**
 * Inline equivalent of the lib's `HelpPopoverBubble` (display component) so these
 * stories can mirror the lib's HelpIconButton stories, which pass a
 * `HelpPopoverBubble` as `children`. Renders an optional title + divider, then the
 * content, with optional RTL direction. (HelpPopoverBubble itself is out of scope
 * for this inputs-only port.)
 */
function HelpPopoverBubble({
  title = "",
  rtl = false,
  children,
}: {
  title?: string;
  rtl?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative flex flex-col px-[15px] pb-[15px] pt-[10px]"
      style={{
        direction: rtl ? "rtl" : "ltr",
        textAlign: rtl ? "right" : "left",
      }}
    >
      {title ? (
        <>
          <p
            data-testid="title"
            className="pb-3.5 text-base font-medium text-gray-900"
          >
            {title}
          </p>
          <Separator data-testid="divider" />
        </>
      ) : null}
      <div className="w-full overflow-auto pt-[5px] text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
}

const LOREM =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium " +
  "doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore " +
  "veritatis et quasi architecto beatae vitae dicta sunt explicabo.";

const meta: Meta<typeof HelpIconButton> = {
  title: "Experience/Inputs/HelpIconButton",
  component: HelpIconButton,
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
    icon: { control: false },
    iconColor: { control: "color" },
    popoverWidth: { control: "text" },
    borderColor: { control: "color" },
    "aria-label": { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof HelpIconButton>;

/** Mirrors lib `Titled`: a HelpPopoverBubble with a title + divider as children. */
export const Titled: Story = {
  args: {
    children: (
      <HelpPopoverBubble title="This is a Title">{LOREM}</HelpPopoverBubble>
    ),
    icon: <HelpCircle className="size-5" />,
    popoverWidth: "400px",
    "aria-label": "test-label",
  },
};

/** Mirrors lib `NoTitle`: a HelpPopoverBubble with no title. */
export const NoTitle: Story = {
  args: {
    children: <HelpPopoverBubble>{LOREM}</HelpPopoverBubble>,
    icon: <HelpCircle className="size-5" />,
    popoverWidth: "400px",
    "aria-label": "test-label",
  },
};

/** Mirrors lib `RightJustifiedTitle`: trigger right-justified within a full-width row. */
export const RightJustifiedTitle: Story = {
  render: (args) => (
    <div
      style={{ width: "100%", display: "flex", flexDirection: "row-reverse" }}
    >
      <HelpIconButton {...args} />
    </div>
  ),
  args: {
    children: (
      <HelpPopoverBubble title="This is a Title">{LOREM}</HelpPopoverBubble>
    ),
    icon: <HelpCircle className="size-5" />,
    popoverWidth: "400px",
    "aria-label": "test-label",
  },
};

/** Mirrors lib `PinnedToBottomTitle`: trigger pinned to the bottom-left. */
export const PinnedToBottomTitle: Story = {
  render: (args) => (
    <div style={{ position: "absolute", bottom: 0, left: 0 }}>
      <HelpIconButton {...args} />
    </div>
  ),
  args: {
    children: (
      <HelpPopoverBubble title="This is a Title">{LOREM}</HelpPopoverBubble>
    ),
    icon: <HelpCircle className="size-5" />,
    popoverWidth: "400px",
    "aria-label": "test-label",
  },
};

/** Mirrors lib `PinnedToBottomRightTitle`: trigger pinned to the bottom-right. */
export const PinnedToBottomRightTitle: Story = {
  render: (args) => (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <HelpIconButton {...args} />
    </div>
  ),
  args: {
    children: (
      <HelpPopoverBubble title="This is a Title">{LOREM}</HelpPopoverBubble>
    ),
    icon: <HelpCircle className="size-5" />,
    popoverWidth: "400px",
    "aria-label": "test-label",
  },
};
