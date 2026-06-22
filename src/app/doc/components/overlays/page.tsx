"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Smile } from "lucide-react";
import {
  Section,
  ComponentEntry,
  Preview,
} from "../../_components/showcase";

export default function OverlaysPage() {
  return (
    <Section
      title="Overlays"
      description="Components that render above the page: dialogs, sheets, popovers, tooltips and command palette."
    >
      <ComponentEntry
        id="dialog"
        name="Dialog"
        source="@/components/ui/dialog"
        description="Modal dialog for focused tasks. Trigger opens it; click the button below."
      >
        <Preview>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <Label htmlFor="dlg-name">Name</Label>
                <Input id="dlg-name" defaultValue="Wordly User" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="alert-dialog"
        name="Alert Dialog"
        source="@/components/ui/alert-dialog"
        description="Confirmation dialog that interrupts for a destructive or important action."
      >
        <Preview>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="sheet"
        name="Sheet"
        source="@/components/ui/sheet"
        description="A panel that slides in from an edge — good for side forms and details."
      >
        <Preview>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Adjust your preferences. Changes apply immediately.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-3 py-4">
                <Label htmlFor="sheet-name">Display name</Label>
                <Input id="sheet-name" defaultValue="Wordly User" />
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Done</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="popover"
        name="Popover"
        source="@/components/ui/popover"
        description="Lightweight floating panel anchored to a trigger."
      >
        <Preview>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" /> Open popover
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <p className="text-sm font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer. Popovers can hold any
                  content.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="tooltip"
        name="Tooltip"
        source="@/components/ui/tooltip"
        description="Hover hint. Requires a TooltipProvider somewhere up the tree."
      >
        <Preview>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="hover-card"
        name="Hover Card"
        source="@/components/ui/hover-card"
        description="Richer hover preview for entities like users or links."
      >
        <Preview>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@wordly</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex items-start gap-3">
                <Smile className="h-8 w-8 text-primary-blue-500" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Wordly</p>
                  <p className="text-sm text-muted-foreground">
                    Real-time AI translation and transcription.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Preview>
      </ComponentEntry>

      <ComponentEntry
        id="command"
        name="Command"
        source="@/components/ui/command"
        description="Command palette / fuzzy-search list. Shown inline here."
      >
        <Preview>
          <Command className="w-full max-w-md rounded-lg border">
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Preview>
      </ComponentEntry>
    </Section>
  );
}
