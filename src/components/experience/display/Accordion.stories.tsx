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

// Mirrors the lib's `Custom` story: all customization options exercised.
// (The lib used raw hex for divider/text/icon colors; here those map to brand
// tokens — Brand Blue accents — to honor the no-raw-hex rule.)
export const Custom: Story = {
  args: {
    summaryText: "Customized Accordion",
    defaultExpanded: true,
    showDivider: true,
    summaryStyles: {
      padding: "0px 16px 0px 36px",
      fontSize: "1.2rem",
      fontWeight: "normal",
      variant: "h6",
    },
    iconStyles: { size: 28 },
    contentPadding: "8px 16px 24px 36px",
    children: (
      <div>
        <p>This accordion demonstrates all customization options:</p>
        <ul className="m-0 list-disc pl-4">
          <li>Expanded with a divider</li>
          <li>
            Custom summary padding (top: 0px, right: 16px, bottom: 0px, left:
            36px)
          </li>
          <li>
            Custom content padding (top: 8px, right: 16px, bottom: 24px, left:
            36px)
          </li>
          <li>Custom summary text size, variant, and weight</li>
          <li>Custom icon size (color stays Brand Blue by default)</li>
        </ul>
      </div>
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
