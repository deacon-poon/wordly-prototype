import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AutoScrollListView } from "./AutoScrollListView";
import { TranscriptBubble } from "./TranscriptBubble";
import { TranscriptText } from "./TranscriptText";

/**
 * Mirrors the lib stories `App/Meeting/Transcript/AutoScrollListView/Component`
 * (Default + Interactive), kept under our `Experience/Transcript` namespace.
 *
 * `AutoScrollListView` keeps a streaming list pinned to the bottom as new items
 * arrive, while respecting manual scroll-up. When the user has scrolled away and
 * new items come in, a Brand Blue "N new" notification appears to jump back.
 */
const meta: Meta<typeof AutoScrollListView> = {
  title: "Experience/Transcript/AutoScrollListView",
  component: AutoScrollListView,
  tags: ["autodocs"],
  argTypes: {
    children: { table: { disable: true } },
  },
  args: {
    getUnseenNotificationText: (unseenCount: number) => `${unseenCount} new`,
  },
};

export default meta;
type Story = StoryObj<typeof AutoScrollListView>;

// Custom transcript bubble that has spacing and wraps children (lib StoryBubble).
const StoryBubble: React.FC<{ text: string }> = ({ text }) => (
  <div className="mb-2 inline-flex">
    <TranscriptBubble>
      <TranscriptText>{text}</TranscriptText>
    </TranscriptBubble>
  </div>
);
const MemoizedStoryBubble = React.memo(StoryBubble);

export const Default: Story = {
  render: (args) => (
    <div className="h-[220px] w-[420px] overflow-hidden rounded-md border border-border p-2">
      <AutoScrollListView {...args}>
        {[
          <MemoizedStoryBubble
            key="basic-example"
            text="This is just a basic example"
          />,
          <MemoizedStoryBubble
            key="interactive-example"
            text="Check out the interactive example"
          />,
        ]}
      </AutoScrollListView>
    </div>
  ),
};

// Randomized list of messages (lib randomMessagesList / defaultMessages).
const randomMessagesList = [
  "JavaScript is one of the core technologies of the web.",
  "Over 97% of websites use JavaScript client-side.",
  "Web browsers have a dedicated JavaScript engine to execute the code on the user's device.",
  "As a multi-paradigm language, JavaScript supports event-driven, functional, and imperative programming styles.",
  "JS has application programming interfaces (APIs) for working with text, dates, regular expressions, standard data structures, and the Document Object Model (DOM).",
  "The ECMAScript standard does not include any input/output (I/O).",
  "JavaScript engines were originally used only in web browsers.",
  "JavaScript supports much of the structured programming syntax from C",
];
function getRandomMessage() {
  const min = 0;
  const max = randomMessagesList.length - 1;
  return randomMessagesList[Math.floor(Math.random() * (max - min + 1) + min)];
}
const defaultMessages = ["Hello world!", "I will be your presenter tonight."];

export const Interactive: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [messages, setMessages] = React.useState<string[]>(defaultMessages);

    return (
      <div className="flex flex-col">
        <div>
          <button
            type="button"
            onClick={() => setMessages([...messages, getRandomMessage()])}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add a new message
          </button>
          <p className="text-xs text-muted-foreground">
            <strong>DISCLAIMER:</strong> This example uses a custom story
            component to introduce functionality. Try scrolling up and adding a
            new message to display the notification.
          </p>
          <div className="my-4 h-px bg-gray-300" />
        </div>
        <div className="relative flex h-[200px] items-center overflow-y-auto">
          <AutoScrollListView {...args}>
            {messages.map((text, index) => (
              <MemoizedStoryBubble text={text} key={`key-${index}`} />
            ))}
          </AutoScrollListView>
        </div>
        <div className="my-4 h-px bg-gray-300" />
      </div>
    );
  },
};
