"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Bold, Italic, Underline, Mail, Plus, Settings } from "lucide-react";
import { useState } from "react";
import {
  Section,
  ComponentEntry,
  Preview,
  Cell,
} from "../../_components/showcase";

export default function ActionsPage() {
  const [showStatus, setShowStatus] = useState(true);

  return (
    <Section
      title="Buttons & Actions"
      description="Interactive triggers: buttons, badges, toggles and menus."
    >
      <ComponentEntry
        id="button"
        name="Button"
        source="@/components/ui/button"
        description="Primary action element. Variants × sizes, plus icon and disabled states."
      >
        <Preview label="Variants" className="gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
        </Preview>
        <Preview label="Sizes & states" className="gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus className="h-4 w-4" />
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" /> With icon
          </Button>
          <Button disabled>Disabled</Button>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="badge"
        name="Badge"
        source="@/components/ui/badge"
        description="Compact status / category label. Each variant shown below."
      >
        <Preview label="Variants" className="gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="teal">Teal</Badge>
          <Badge variant="navy">Navy</Badge>
          <Badge variant="accent">Accent</Badge>
        </Preview>
        <Preview label="Sizes" className="gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="default">Default</Badge>
          <Badge size="lg">Large</Badge>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="toggle"
        name="Toggle"
        source="@/components/ui/toggle"
        description="A two-state button. Variants and sizes shown."
      >
        <Preview className="gap-3">
          <Cell label="default">
            <Toggle aria-label="Bold">
              <Bold className="h-4 w-4" />
            </Toggle>
          </Cell>
          <Cell label="outline">
            <Toggle variant="outline" aria-label="Italic">
              <Italic className="h-4 w-4" />
            </Toggle>
          </Cell>
          <Cell label="with text">
            <Toggle>Pressed?</Toggle>
          </Cell>
          <Cell label="disabled">
            <Toggle disabled aria-label="Underline">
              <Underline className="h-4 w-4" />
            </Toggle>
          </Cell>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="toggle-group"
        name="Toggle Group"
        source="@/components/ui/toggle-group"
        description="A set of toggles behaving as single- or multi-select."
      >
        <Preview className="gap-6">
          <Cell label="single">
            <ToggleGroup type="single" defaultValue="bold">
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </Cell>
          <Cell label="multiple">
            <ToggleGroup type="multiple" variant="outline">
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </Cell>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="dropdown-menu"
        name="Dropdown Menu"
        source="@/components/ui/dropdown-menu"
        description="A menu of actions triggered by a button, with items, labels, separators and checkbox items."
      >
        <Preview>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Open menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatus}
                onCheckedChange={setShowStatus}
              >
                Show status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Preview>
      </ComponentEntry>
    </Section>
  );
}
