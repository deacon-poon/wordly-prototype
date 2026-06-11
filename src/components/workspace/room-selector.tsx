"use client";

/**
 * RoomSelector
 *
 * React migration of the production Angular `wordly-room-selector`
 * (wordly_portal: libs/components/business/wordly-room-selector).
 *
 * The Angular original is a proxy over the core `wordly-combobox`, populated
 * with room data from a bridge service, plus an inline "Add Room" dialog
 * (room-dialog) that creates a room via the events API. Here we keep the same
 * public surface (searchable combobox, optional "Add Room" footer scoped to an
 * event, an add-room dialog with name + attendee-passcode fields and
 * duplicate-name validation, loading/error/empty states) but drop the Angular
 * DI/service layer: data arrives via props and saving is simulated locally.
 *
 * Built on the shared shadcn primitives (Command + Popover for the combobox,
 * Dialog for the add-room flow) per DEC-003.
 * In production these rooms would be fetched/created from the events API.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, Check, ChevronDown, Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Trigger anatomy — mirrors the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). The portal
// proxies wordly-room-selector → wordly-combobox → hlm-select-trigger, so the
// real control anatomy lives there: border-input, rounded-md, px-3 py-2,
// text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8, focus ring [3px] on
// ring with no offset, destructive border+text+ring on error. Identical to the
// validated-exact account-selector reference.
// ---------------------------------------------------------------------------

const selectTriggerVariants = cva(
  "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:pointer-events-none [&>svg]:text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8",
      },
      error: {
        true: "border-destructive text-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
);

export type RoomSelectorSize = NonNullable<
  VariantProps<typeof selectTriggerVariants>["size"]
>;

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular EventRoom / RoomSelectorOption types)
// ---------------------------------------------------------------------------

/** Mirrors the Angular `EventRoom` entity (only the fields the UI reads). */
export interface EventRoom {
  eventRoomId: string;
  name: string;
  eventRoomCode: string;
  attendKey: string;
}

/** Mirrors the Angular `RoomSelectorOption` (combobox option + entity). */
export interface RoomOption {
  label: string;
  value: string;
  entity?: EventRoom;
}

/** Payload emitted when a new room is added via the dialog. */
export interface NewRoomDraft {
  name: string;
  attendKey: string;
}

function roomToOption(room: EventRoom): RoomOption {
  return {
    value: room.eventRoomId,
    label: `${room.name} (${room.eventRoomCode})`,
    entity: room,
  };
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the events API
// ---------------------------------------------------------------------------

export const MOCK_ROOMS: RoomOption[] = [
  {
    label: "Main Auditorium (AUD-01)",
    value: "room-aud",
    entity: {
      eventRoomId: "room-aud",
      name: "Main Auditorium",
      eventRoomCode: "AUD-01",
      attendKey: "",
    },
  },
  {
    label: "Workshop Room A (WRK-A)",
    value: "room-wrka",
    entity: {
      eventRoomId: "room-wrka",
      name: "Workshop Room A",
      eventRoomCode: "WRK-A",
      attendKey: "1234",
    },
  },
  {
    label: "Breakout Hall (BRK-02)",
    value: "room-brk",
    entity: {
      eventRoomId: "room-brk",
      name: "Breakout Hall",
      eventRoomCode: "BRK-02",
      attendKey: "",
    },
  },
  {
    label: "Press Room (PRS-03)",
    value: "room-prs",
    entity: {
      eventRoomId: "room-prs",
      name: "Press Room",
      eventRoomCode: "PRS-03",
      attendKey: "",
    },
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface RoomSelectorProps {
  /** Controlled selected room value (eventRoomId). */
  value?: string;
  /** Fired when the selection changes (empty string when cleared). */
  onValueChange?: (value: string) => void;
  /** Available rooms. */
  rooms?: RoomOption[];

  /**
   * Scopes the selector to a specific event. The "Add Room" footer only
   * appears when both `eventId` is set and `showAddRoom` is true (mirrors the
   * Angular `showAddRoom() && eventId()` guard).
   */
  eventId?: string;
  /** Shown in the Add Room dialog header so the user knows the target event. */
  eventName?: string;
  /** Renders the inline "Add Room" footer + dialog (requires `eventId`). */
  showAddRoom?: boolean;
  /** Fired with the saved room after the Add Room dialog submits. */
  onRoomAdded?: (room: EventRoom) => void;

  placeholder?: string;
  /** Show a search input to filter rooms. */
  searchable?: boolean;
  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: RoomSelectorSize;
  label?: string;
  required?: boolean;

  disabled?: boolean;
  loading?: boolean;
  error?: boolean;

  addRoomText?: string;
  loadingText?: string;
  errorLoadingText?: string;
  noRoomsText?: string;
  noSearchResultsText?: string;

  className?: string;
}

export function RoomSelector({
  value,
  onValueChange,
  rooms = MOCK_ROOMS,
  eventId,
  eventName = "",
  showAddRoom = false,
  onRoomAdded,
  placeholder = "Select room",
  // The portal combobox always renders its search input; default to true to
  // match. Pass `searchable={false}` to suppress it.
  searchable = true,
  size = "default",
  label,
  required = false,
  disabled = false,
  loading = false,
  error = false,
  addRoomText = "Add New Room",
  loadingText = "Loading rooms...",
  errorLoadingText = "Failed to load rooms",
  noRoomsText = "No rooms available",
  noSearchResultsText = "No rooms match that search query",
  className,
}: RoomSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Locally-added rooms are appended so the new selection has a label to show
  // (the Angular component does the same via roomOptions.update()).
  const [addedRooms, setAddedRooms] = React.useState<RoomOption[]>([]);

  const canAddRoom = showAddRoom && !!eventId;

  const allOptions = React.useMemo(
    () => [...rooms, ...addedRooms],
    [rooms, addedRooms]
  );
  const selected = allOptions.find((o) => o.value === value);
  const hasOptions = allOptions.length > 0;

  const triggerLabel = loading
    ? loadingText
    : error
      ? errorLoadingText
      : (selected?.label ?? placeholder);

  function handleSelect(next: string) {
    onValueChange?.(next === value ? "" : next);
    setOpen(false);
  }

  function handleRoomSaved(room: EventRoom) {
    setAddedRooms((prev) => [...prev, roomToOption(room)]);
    onValueChange?.(room.eventRoomId);
    onRoomAdded?.(room);
    setDialogOpen(false);
  }

  // Existing room names (for duplicate-name validation in the dialog).
  const existingRoomNames = React.useMemo(
    () => allOptions.map((o) => o.entity?.name).filter((n): n is string => !!n),
    [allOptions]
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="ml-0.5 text-destructive">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-invalid={error || undefined}
            aria-required={required || undefined}
            disabled={disabled || loading || error}
            className={cn(selectTriggerVariants({ size, error }))}
          >
            <span
              className={cn(
                "flex min-w-0 items-center gap-2 truncate",
                !selected && "text-muted-foreground"
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : null}
              <span className="truncate">{triggerLabel}</span>
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            {searchable ? <CommandInput placeholder="Search rooms..." /> : null}
            <CommandList>
              <CommandEmpty>
                {hasOptions ? noSearchResultsText : noRoomsText}
              </CommandEmpty>
              <CommandGroup>
                {allOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <span className="truncate flex-1 min-w-0 text-left">
                      {option.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {canAddRoom ? (
              <div className="sticky bottom-0 border-t border-border bg-popover py-2">
                <div className="px-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={addRoomText}
                    className="w-full justify-start"
                    onClick={() => {
                      setOpen(false);
                      setDialogOpen(true);
                    }}
                  >
                    <span className="text-primary">+ {addRoomText}</span>
                  </Button>
                </div>
              </div>
            ) : null}
          </Command>
        </PopoverContent>
      </Popover>

      {canAddRoom ? (
        <RoomDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          eventName={eventName}
          existingRoomNames={existingRoomNames}
          onSaved={handleRoomSaved}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add Room dialog (React migration of room-dialog.component)
// ---------------------------------------------------------------------------

let roomIdSeq = 0;

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  existingRoomNames: string[];
  onSaved: (room: EventRoom) => void;
}

function RoomDialog({
  open,
  onOpenChange,
  eventName,
  existingRoomNames,
  onSaved,
}: RoomDialogProps) {
  const [roomName, setRoomName] = React.useState("");
  const [requireAttendKey, setRequireAttendKey] = React.useState(false);
  const [attendKey, setAttendKey] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [saveError, setSaveError] = React.useState(false);

  // Reset the form each time the dialog opens (mirrors the Angular effect).
  React.useEffect(() => {
    if (open) {
      setRoomName("");
      setRequireAttendKey(false);
      setAttendKey("");
      setSubmitting(false);
      setSubmitted(false);
      setSaveError(false);
    }
  }, [open]);

  const trimmedName = roomName.trim();
  const duplicateName = existingRoomNames.some(
    (n) => n.toLowerCase() === trimmedName.toLowerCase()
  );
  const nameError = duplicateName
    ? "A room with this name already exists"
    : submitted && !trimmedName
      ? "Room name is required"
      : "";
  const attendKeyError =
    submitted && requireAttendKey && !attendKey.trim()
      ? "Attendee passcode is required"
      : "";

  function handleSubmit() {
    setSubmitted(true);
    if (!trimmedName || duplicateName) return;
    if (requireAttendKey && !attendKey.trim()) return;

    setSubmitting(true);
    setSaveError(false);
    // Simulate the async create call from the bridge service.
    window.setTimeout(() => {
      onSaved({
        eventRoomId: `room-new-${++roomIdSeq}`,
        name: trimmedName,
        eventRoomCode: `NEW-${String(roomIdSeq).padStart(2, "0")}`,
        attendKey: requireAttendKey ? attendKey.trim() : "",
      });
      setSubmitting(false);
    }, 400);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Add Room
          </DialogTitle>
          {eventName ? (
            <DialogDescription>Adding room to: {eventName}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="room-dialog-name">
              Room Name
              <span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Input
              id="room-dialog-name"
              autoFocus
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., Main Auditorium, Workshop Room A"
              aria-invalid={!!nameError}
              className={cn(nameError && "border-destructive")}
            />
            {nameError ? (
              <p className="flex items-center gap-1 pl-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{nameError}</span>
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="room-dialog-require-key"
              checked={requireAttendKey}
              onCheckedChange={(checked) => {
                const next = checked === true;
                setRequireAttendKey(next);
                if (!next) setAttendKey("");
              }}
            />
            <Label htmlFor="room-dialog-require-key" className="font-normal">
              Require attendee passcode
            </Label>
          </div>

          {requireAttendKey ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="room-dialog-key">
                Attendee Passcode
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <Input
                id="room-dialog-key"
                value={attendKey}
                onChange={(e) => setAttendKey(e.target.value)}
                aria-invalid={!!attendKeyError}
                className={cn(attendKeyError && "border-destructive")}
              />
              {attendKeyError ? (
                <p className="flex items-center gap-1 pl-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{attendKeyError}</span>
                </p>
              ) : null}
            </div>
          ) : null}

          <Alert className="border-blue-100 bg-blue-50 text-blue-700">
            <AlertDescription className="text-blue-700">
              All sessions you add in this room later will use a single link to
              launch all of them.
            </AlertDescription>
          </Alert>

          {saveError ? (
            <Alert className="border-destructive/30 bg-destructive/10">
              <AlertDescription className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Something went wrong. Please try again.</span>
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Add Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
