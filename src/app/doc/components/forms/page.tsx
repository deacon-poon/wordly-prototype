"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/datetime-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Section,
  ComponentEntry,
  Preview,
  Cell,
} from "../../_components/showcase";

export default function FormsPage() {
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);
  const [date, setDate] = useState("");
  const [calDate, setCalDate] = useState<Date | undefined>(new Date());

  return (
    <Section
      title="Forms & Inputs"
      description="Controls for collecting user input."
    >
      <ComponentEntry
        id="input"
        name="Input"
        source="@/components/ui/input"
        description="Single-line text field. Supports all native input types and states."
      >
        <Preview className="gap-4">
          <Cell label="default">
            <Input placeholder="you@wordly.ai" className="w-60" />
          </Cell>
          <Cell label="disabled">
            <Input placeholder="Disabled" disabled className="w-60" />
          </Cell>
          <Cell label="type=password">
            <Input type="password" defaultValue="secret" className="w-60" />
          </Cell>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="textarea"
        name="Textarea"
        source="@/components/ui/textarea"
        description="Multi-line text field."
      >
        <Preview>
          <Textarea
            placeholder="Type your message…"
            className="w-full max-w-md"
            rows={3}
          />
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="label"
        name="Label"
        source="@/components/ui/label"
        description="Accessible label paired with a control via htmlFor."
      >
        <Preview>
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="doc-email">Email address</Label>
            <Input id="doc-email" type="email" placeholder="you@wordly.ai" />
          </div>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="select"
        name="Select"
        source="@/components/ui/select"
        description="Dropdown for choosing one option from a list."
      >
        <Preview>
          <Select>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="checkbox"
        name="Checkbox"
        source="@/components/ui/checkbox"
        description="Boolean control. Controlled, disabled and checked states."
      >
        <Preview className="gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="cb1"
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <Label htmlFor="cb1">Controlled</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb2" defaultChecked />
            <Label htmlFor="cb2">Default checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="cb3" disabled />
            <Label htmlFor="cb3">Disabled</Label>
          </div>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="switch"
        name="Switch"
        source="@/components/ui/switch"
        description="On/off toggle. Controlled via checked / onCheckedChange."
      >
        <Preview className="gap-6">
          <div className="flex items-center gap-2">
            <Switch id="sw1" checked={on} onCheckedChange={setOn} />
            <Label htmlFor="sw1">Notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="sw2"
              checked={false}
              onCheckedChange={() => {}}
              disabled
            />
            <Label htmlFor="sw2">Disabled</Label>
          </div>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="radio-group"
        name="Radio Group"
        source="@/components/ui/radio-group"
        description="Choose one option from a small set."
      >
        <Preview>
          <RadioGroup defaultValue="comfortable" className="space-y-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="r3" disabled />
              <Label htmlFor="r3">Compact (disabled)</Label>
            </div>
          </RadioGroup>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="datetime-picker"
        name="Date Picker"
        source="@/components/ui/datetime-picker"
        description="Popover-based date selector. Value is a YYYY-MM-DD string."
      >
        <Preview>
          <DatePicker
            value={date}
            onChange={setDate}
            label="Event date"
            placeholder="Pick a date"
          />
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="calendar"
        name="Calendar"
        source="@/components/ui/calendar"
        description="Inline month calendar built on react-day-picker."
      >
        <Preview>
          <Calendar
            mode="single"
            selected={calDate}
            onSelect={setCalDate}
            className="rounded-md border"
          />
        </Preview>
      </ComponentEntry>
    </Section>
  );
}
