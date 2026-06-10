import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Experience/Display/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single collapsible content section ported from the wordly-react-components-lib MUI Accordion. Supports controlled/uncontrolled modes, an optional divider, and customizable summary/icon styling. Brand Blue is the default icon and accent color.",
      },
    },
  },
  argTypes: {
    summaryText: { control: "text" },
    expanded: { control: "boolean" },
    defaultExpanded: { control: "boolean" },
    showDivider: { control: "boolean" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const SampleContent = () => (
  <p className="m-0">
    In production this content is composed by the consuming feature. Here it is
    a simple inline mock paragraph revealed when the section expands.
  </p>
);

export const Default: Story = {
  args: {
    summaryText: "More options",
    defaultExpanded: false,
    showDivider: false,
    children: <SampleContent />,
  },
};

export const Expanded: Story = {
  args: {
    summaryText: "More options",
    defaultExpanded: true,
    showDivider: false,
    children: <SampleContent />,
  },
};

export const WithDivider: Story = {
  args: {
    summaryText: "More options",
    defaultExpanded: true,
    showDivider: true,
    children: <SampleContent />,
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Accordion
        summaryText="Click me"
        expanded={open}
        onChange={setOpen}
        summaryStyles={{ fontWeight: "bold" }}
      >
        <div className="py-2">
          Controlled mode. Current state: {open ? "expanded" : "collapsed"}.
        </div>
      </Accordion>
    );
  },
};

export const CustomStyling: Story = {
  args: {
    summaryText: "Customized accordion",
    defaultExpanded: true,
    showDivider: true,
    summaryStyles: {
      padding: "0 16px 0 36px",
      fontSize: "1.2rem",
      fontWeight: "normal",
    },
    iconStyles: { size: 28 },
    contentPadding: "8px 16px 24px 36px",
    children: (
      <ul className="m-0 list-disc pl-4">
        <li>Custom summary padding (left-indented)</li>
        <li>Custom summary font size and weight</li>
        <li>Larger expand icon (still Brand Blue by default)</li>
        <li>Custom content padding</li>
      </ul>
    ),
  },
};

export const Stacked: Story = {
  render: () => (
    <div className="w-[28rem] max-w-full">
      <Accordion summaryText="Section one">
        <SampleContent />
      </Accordion>
      <Accordion summaryText="Section two" defaultExpanded showDivider>
        <SampleContent />
      </Accordion>
      <Accordion summaryText="Section three">
        <SampleContent />
      </Accordion>
    </div>
  ),
};
