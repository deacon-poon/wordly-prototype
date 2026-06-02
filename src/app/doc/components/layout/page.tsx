"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  Section,
  ComponentEntry,
  Preview,
} from "../../_components/showcase";

export default function LayoutPage() {
  const [open, setOpen] = useState(false);

  return (
    <Section
      title="Layout & Disclosure"
      description="Containers and progressive-disclosure components."
    >
      <ComponentEntry
        id="card"
        name="Card"
        source="@/components/ui/card"
        description="A surface for grouping related content, with header / content / footer slots."
      >
        <Preview>
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Session summary</CardTitle>
              <CardDescription>Last 30 days of activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                42 sessions across 6 languages. Average duration 38 minutes.
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline" size="sm">
                Dismiss
              </Button>
              <Button size="sm">View report</Button>
            </CardFooter>
          </Card>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="tabs"
        name="Tabs"
        source="@/components/ui/tabs"
        description="Switch between related views within the same context."
      >
        <Preview className="block">
          <Tabs defaultValue="account" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
              Manage your account details and profile information.
            </TabsContent>
            <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
              Change your password and security settings.
            </TabsContent>
          </Tabs>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="accordion"
        name="Accordion"
        source="@/components/ui/accordion"
        description="Vertically stacked, expandable sections."
      >
        <Preview className="block">
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It follows the WAI-ARIA design pattern and is keyboard
                navigable.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles matching the Wordly theme.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="collapsible"
        name="Collapsible"
        source="@/components/ui/collapsible"
        description="A single open/closed region toggled by a trigger."
      >
        <Preview className="block">
          <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="w-full max-w-md space-y-2"
          >
            <div className="flex items-center justify-between rounded-md border px-4 py-2">
              <span className="text-sm font-medium">Advanced options</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle">
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2 rounded-md border px-4 py-2 text-sm text-muted-foreground">
              These extra settings are hidden until expanded.
            </CollapsibleContent>
          </Collapsible>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="separator"
        name="Separator"
        source="@/components/ui/separator"
        description="A thin divider, horizontal or vertical."
      >
        <Preview className="block">
          <div className="text-sm">
            <p className="font-medium">Wordly UI</p>
            <p className="text-muted-foreground">A design system.</p>
            <Separator className="my-3" />
            <div className="flex h-5 items-center gap-3 text-muted-foreground">
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Source</span>
              <Separator orientation="vertical" />
              <span>About</span>
            </div>
          </div>
        </Preview>
      </ComponentEntry>
    </Section>
  );
}
