import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { AutoLanguageSelectSwitch } from "./AutoLanguageSelectSwitch";

const meta: Meta<typeof AutoLanguageSelectSwitch> = {
  title: "Experience/Meeting Settings/AutoLanguageSelectSwitch",
  component: AutoLanguageSelectSwitch,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "boolean" },
    disabled: { control: "boolean" },
    iconWidth: { control: "text" },
    ariaLabel: { control: "text" },
  },
  args: {
    ariaLabel: "Automatic language selection",
  },
};

export default meta;
type Story = StoryObj<typeof AutoLanguageSelectSwitch>;

/** Interactive wrapper so toggling works in Storybook. */
function Interactive(
  args: React.ComponentProps<typeof AutoLanguageSelectSwitch>
) {
  const [value, setValue] = React.useState(args.value);
  React.useEffect(() => setValue(args.value), [args.value]);
  return (
    <AutoLanguageSelectSwitch
      {...args}
      value={value}
      onToggleSwitch={setValue}
    />
  );
}

// --- States -----------------------------------------------------------------

export const On: Story = {
  render: (args) => <Interactive {...args} />,
  args: { value: true, disabled: false },
};

export const Off: Story = {
  render: (args) => <Interactive {...args} />,
  args: { value: false, disabled: false },
};

export const DisabledOn: Story = {
  render: (args) => <Interactive {...args} />,
  args: { value: true, disabled: true },
};

export const DisabledOff: Story = {
  render: (args) => <Interactive {...args} />,
  args: { value: false, disabled: true },
};

// --- In context: a meeting-settings row -------------------------------------

export const InSettingsRow: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(true);
    return (
      <div className="flex max-w-md items-center justify-between rounded-md border border-border p-4">
        <div className="pr-4">
          <p className="text-sm font-medium text-gray-900">
            Automatic language selection
          </p>
          <p className="text-sm text-muted-foreground">
            Detect each attendee&apos;s language automatically.
          </p>
        </div>
        <AutoLanguageSelectSwitch
          {...args}
          value={value}
          onToggleSwitch={setValue}
        />
      </div>
    );
  },
  args: { ariaLabel: "Automatic language selection" },
};

// --- Custom size -------------------------------------------------------------

export const LargeIcon: Story = {
  render: (args) => <Interactive {...args} />,
  args: { value: true, iconWidth: "2.25rem" },
};
