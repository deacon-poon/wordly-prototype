import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { TimezoneSelector } from "./timezone-selector";

/**
 * 1:1 mirror of the production Angular Overview story
 *   wordly_portal: stories/business/wordly-timezone-selector/story-1.Overview.stories.ts
 *
 * Same single `Overview` story + the same args (compact false, value
 * "America/Los_Angeles", label "Timezone", required true, helperText
 * "Select the timezone for your event", placeholder "Select timezone"). The
 * `id` arg from Angular is dropped (no equivalent prop). Timezone data arrives
 * via props (mock by default) rather than the Angular bridge / moment-timezone
 * provider.
 *
 * Title namespace kept as "Workspace Kit/TimezoneSelector" to match the
 * existing sibling stories on this branch.
 */
const meta: Meta<typeof TimezoneSelector> = {
  title: "Workspace Kit/TimezoneSelector",
  component: TimezoneSelector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "EXACT React mirror of the production Angular `wordly-timezone-selector`. " +
          "A thin proxy that renders the shared FormControlWrapper (label / " +
          "required / helper / error / responsive label-beside-control layout) " +
          "around a combobox (outline trigger + searchable Command popover), " +
          "matching the Angular proxy to `wordly-combobox` " +
          "(enableValueSearch=true, indentGroupedOptions=true, forwarded " +
          "compact). IANA timezones are grouped by region; compact mode shows " +
          "the abbreviation in the trigger. Data via props (mock by default); " +
          "no Angular DI / moment-timezone layer.",
      },
    },
  },
  argTypes: {
    compact: { control: "boolean" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    label: { control: "text" },
    required: { control: "boolean" },
    helperText: { control: "text" },
    placeholder: { control: "text" },
    extraInfo: { control: "text" },
    showInfoIcon: { control: "boolean" },
    infoTooltipText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof TimezoneSelector>;

/** Controlled wrapper so the story reflects real selection state. */
function Controlled(props: React.ComponentProps<typeof TimezoneSelector>) {
  const [value, setValue] = React.useState(props.value ?? "");
  return <TimezoneSelector {...props} value={value} onValueChange={setValue} />;
}

export const Overview: Story = {
  name: "Overview",
  args: {
    compact: false,
    value: "America/Los_Angeles",
    disabled: false,
    readonly: false,
    label: "Timezone",
    required: true,
    helperText: "Select the timezone for your event",
    placeholder: "Select timezone",
    extraInfo: "",
    showInfoIcon: false,
    infoTooltipText: "",
  },
  render: (args) => <Controlled {...args} />,
};
