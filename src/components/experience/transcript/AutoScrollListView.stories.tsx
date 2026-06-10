import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AutoScrollListView } from "./AutoScrollListView";

/**
 * `AutoScrollListView` keeps a streaming list pinned to the bottom as new
 * items arrive, while respecting manual scroll-up. When the user has scrolled
 * away and new items come in, a Brand Blue "N new" chip appears to jump back.
 */
const meta: Meta<typeof AutoScrollListView> = {
  title: "Experience/Transcript/AutoScrollListView",
  component: AutoScrollListView,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: { table: { disable: true } },
    getUnseenNotificationText: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AutoScrollListView>;

// A simple transcript-bubble stand-in (production renders real bubbles).
function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 inline-flex max-w-[80%] self-start rounded-2xl bg-gray-100 px-3 py-2 text-sm leading-6 text-gray-900">
      {children}
    </div>
  );
}

const SAMPLE_LINES = [
  "JavaScript is one of the core technologies of the web.",
  "Over 97% of websites use JavaScript client-side.",
  "Web browsers have a dedicated JavaScript engine to execute the code.",
  "As a multi-paradigm language, it supports event-driven and functional styles.",
  "It has APIs for text, dates, regular expressions, and the DOM.",
  "The ECMAScript standard does not include any input/output (I/O).",
  "JavaScript engines were originally used only in web browsers.",
  "JavaScript supports much of the structured programming syntax from C.",
];

/** A short, fully-visible list — no scrolling, no notification. */
export const Default: Story = {
  render: (args) => (
    <div className="h-[220px] w-[420px] rounded-md border border-border p-2">
      <AutoScrollListView {...args}>
        <Bubble>Hello world!</Bubble>
        <Bubble>I will be your presenter tonight.</Bubble>
      </AutoScrollListView>
    </div>
  ),
};

/** A long list that overflows — auto-scrolls to the newest item on mount. */
export const Overflowing: Story = {
  render: (args) => (
    <div className="h-[220px] w-[420px] rounded-md border border-border p-2">
      <AutoScrollListView {...args}>
        {SAMPLE_LINES.concat(SAMPLE_LINES).map((line, i) => (
          <Bubble key={i}>{line}</Bubble>
        ))}
      </AutoScrollListView>
    </div>
  ),
};

/**
 * Interactive: add messages to see auto-scroll. Scroll up first, then add a
 * message — the "N new" notification chip appears; click it to jump back.
 */
export const Interactive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [messages, setMessages] = React.useState<string[]>([
      "Hello world!",
      "I will be your presenter tonight.",
    ]);

    return (
      <div className="flex w-[420px] flex-col gap-2">
        <button
          type="button"
          onClick={() =>
            setMessages((m) => [
              ...m,
              SAMPLE_LINES[Math.floor(Math.random() * SAMPLE_LINES.length)],
            ])
          }
          className="self-start rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add a new message
        </button>
        <p className="text-xs text-muted-foreground">
          Scroll up, then add a message to reveal the &ldquo;N new&rdquo;
          notification.
        </p>
        <div className="h-[220px] rounded-md border border-border p-2">
          <AutoScrollListView {...args}>
            {messages.map((text, i) => (
              <Bubble key={i}>{text}</Bubble>
            ))}
          </AutoScrollListView>
        </div>
      </div>
    );
  },
};

/** Custom localized notification label. */
export const CustomNotificationLabel: Story = {
  ...Interactive,
  args: {
    getUnseenNotificationText: (count) =>
      `${count} new ${count === 1 ? "message" : "messages"} below`,
  },
};
