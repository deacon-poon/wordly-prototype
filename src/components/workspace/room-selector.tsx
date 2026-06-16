"use client";

/**
 * RoomSelector
 *
 * EXACT React mirror of the production Angular `wordly-room-selector`
 *   wordly_portal:
 *     libs/components/business/wordly-room-selector/
 *       wordly-room-selector.component.{ts,html}
 *
 * Like the Angular original, this is a *thin proxy*: it renders the shared
 * FormControlWrapper (label / required / helper / error / info icon / extra
 * info / layout) wrapping the room control, exactly the way the Angular
 * component proxies through `app-wordly-combobox` → `app-wordly-form-control-wrapper`
 * + the combobox trigger.
 *
 *   Angular:  room-selector → wordly-combobox → form-control-wrapper + trigger
 *   React:    RoomSelector  → FormControlWrapper + (Command/Popover combobox)
 *
 * Unlike account/glossary (which proxy `wordly-select`), the room template
 * proxies `wordly-combobox` — a *searchable* control — and adds an optional
 * "Add Room" footer + dialog gated on `showAddRoom() && eventId()`. Those two
 * features are preserved here. The trigger anatomy is ported verbatim from
 *   wordly_portal: libs/ui/select/src/lib/hlm-select-trigger.ts (selectTriggerVariants)
 * matching the validated-exact account-selector reference.
 *
 * The default LAYOUT is the responsive label-beside-control grid (design
 * variant "default"), matching the portal — NOT a bespoke vertical flex-col.
 *
 * Room data arrives via props (mock default); the Angular DI/bridge-service +
 * events-API layer is dropped, but the `eventId` endpoint switch
 * (fetchEventRooms vs fetchAllRooms), the `RoomSelectorOption` shape, and the
 * Add-Room flow (append option + select it + emit) are preserved.
 */

import * as React from "react";
import { cva } from "class-variance-authority";
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
import { FormControlWrapper } from "@/components/ui/form-control-wrapper";
import type { WordlyDesignVariants } from "@/components/ui/design-variants";

// ---------------------------------------------------------------------------
// Trigger anatomy — ported verbatim from the portal `selectTriggerVariants`
// (wordly_portal libs/ui/select/src/lib/hlm-select-trigger.ts). The combobox
// trigger shares the select trigger anatomy: border-input, rounded-md,
// px-3 py-2, text-sm, shadow-xs, gap-2, sizes default=h-9 / sm=h-8, focus ring
// [3px], destructive on error. Identical to the account-selector reference.
// (`w-fit` is overridden to `w-full` here to match the combobox's full-width
// trigger; pass extra classes via `triggerClass`.)
// ---------------------------------------------------------------------------

const selectTriggerVariants = cva(
  "border-input [&>svg]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      error: {
        true: "text-destructive border-destructive focus-visible:ring-destructive/20",
        false: "",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export type RoomSelectorSize = "default" | "sm";

// ---------------------------------------------------------------------------
// Data contract (mirrors the Angular EventRoom / RoomSelectorOption types)
// ---------------------------------------------------------------------------

/** Mirrors the Angular `EventRoom` entity (only the fields the UI reads). */
export interface EventRoom {
  eventRoomId: string;
  name: string;
  eventRoomCode: string;
  /** Owning event id (the bridge filters on this in fetchEventRooms). */
  eventId?: string;
  attendKey?: string;
}

/** Mirrors the Angular `RoomSelectorOption` (combobox option + entity). */
export interface RoomOption {
  label: string;
  value: string;
  /** Owning event id used by the `eventId` endpoint-switch filter. */
  eventId?: string;
  entity?: EventRoom;
}

/** Builds an option from a saved room, mirroring `onRoomSaved`. */
function roomToOption(room: EventRoom): RoomOption {
  return {
    value: room.eventRoomId,
    label: `${room.name} (${room.eventRoomCode})`,
    eventId: room.eventId,
    entity: room,
  };
}

// ---------------------------------------------------------------------------
// Mock data — in production, fetched from the events API via the bridge
// service. Mirrors the dataset used by the portal Overview story.
// ---------------------------------------------------------------------------

export const MOCK_ROOMS: RoomOption[] = [
  {
    value: "room-001",
    label: "Main Auditorium (MAIN-AUD)",
    eventId: "event-001",
  },
  {
    value: "room-002",
    label: "Workshop Room A (WORK-A)",
    eventId: "event-001",
  },
  {
    value: "room-003",
    label: "Workshop Room B (WORK-B)",
    eventId: "event-001",
  },
  {
    value: "room-004",
    label: "Conference Hall (CONF-HALL)",
    eventId: "event-002",
  },
  {
    value: "room-005",
    label: "Breakout Room 1 (BREAK-1)",
    eventId: "event-002",
  },
  {
    value: "room-006",
    label: "Virtual Room Alpha (VIRT-ALPHA)",
    eventId: "event-003",
  },
  {
    value: "room-007",
    label: "Virtual Room Beta (VIRT-BETA)",
    eventId: "event-003",
  },
  {
    value: "room-008",
    label: "Meeting Room 101 (MEET-101)",
    eventId: "event-003",
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

  /** Room list. Defaults to mock data. */
  rooms?: RoomOption[];
  /**
   * Scopes the room list to a specific event (mirrors the Angular `eventId`
   * @Input, which switched the bridge endpoint fetchEventRooms vs fetchAllRooms).
   * When omitted, all rooms are shown.
   */
  eventId?: string;
  /** Shown in the Add Room dialog header so the user knows the target event. */
  eventName?: string;
  /**
   * Renders the inline "Add Room" footer + dialog. Only appears when both
   * `showAddRoom` is true AND `eventId` is set (mirrors the Angular
   * `showAddRoom() && eventId()` guard).
   */
  showAddRoom?: boolean;
  /** Fired with the saved room after the Add Room dialog submits (roomAdded). */
  onRoomAdded?: (room: EventRoom) => void;

  placeholder?: string;
  /**
   * Show the combobox search input. The Angular combobox always renders it, so
   * this defaults to true; pass `searchable={false}` to suppress it.
   */
  searchable?: boolean;

  /** Control height. Matches the portal `data-size`: default (h-9) or sm (h-8). */
  size?: RoomSelectorSize;
  /** CSS class(es) applied to the combobox trigger (portal `triggerClass`). */
  triggerClass?: string;

  disabled?: boolean;
  /** Read-only: shows the value but blocks interaction (portal `readonly`). */
  readonly?: boolean;
  loading?: boolean;
  /** Error/invalid state (portal `displayError`). */
  error?: boolean;
  /** Error text shown below the control when `error` is set (portal errorMessage). */
  errorMessage?: string;
  /** Helper text shown below the control when not in an error state. */
  helperText?: string;
  /** Place helper text above the control (stacked layout only). */
  helperTextOnTop?: boolean;

  label?: string;
  required?: boolean;
  /** Show an info icon beside the label (portal `showInfoIcon`). */
  showInfoIcon?: boolean;
  infoTooltipText?: string;
  /** Extra info block below the control (portal `extraInfo`). */
  extraInfo?: string;

  addRoomText?: string;
  loadingText?: string;
  errorLoadingText?: string;
  noRoomsText?: string;
  noSearchResultsText?: string;

  // ===== DESIGN VARIANT INPUTS (forwarded to the wrapper, like Angular) =====
  /** Container layout. Default "default" = portal responsive label-beside grid. */
  layoutVariant?: WordlyDesignVariants["layout"];
  labelStyleVariant?: WordlyDesignVariants["labelStyle"];
  labelSizeVariant?: WordlyDesignVariants["labelSize"];
  labelContextVariant?: WordlyDesignVariants["labelContext"];
  spacingVariant?: WordlyDesignVariants["spacing"];
  contentContextVariant?: WordlyDesignVariants["contentContext"];

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
  searchable = true,
  size = "default",
  triggerClass = "",
  disabled = false,
  readonly = false,
  loading = false,
  error = false,
  errorMessage,
  helperText,
  helperTextOnTop = false,
  label,
  required = false,
  showInfoIcon = false,
  infoTooltipText,
  extraInfo,
  addRoomText = "Add New Room",
  loadingText = "Loading rooms...",
  errorLoadingText = "Failed to load rooms",
  noRoomsText = "No rooms available",
  noSearchResultsText = "No rooms match that search query",
  layoutVariant = "default",
  labelStyleVariant,
  labelSizeVariant,
  labelContextVariant,
  spacingVariant,
  contentContextVariant,
  className,
}: RoomSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  // Locally-added rooms are appended so a new selection has a label to show
  // (the Angular component does the same via roomOptions.update()).
  const [addedRooms, setAddedRooms] = React.useState<RoomOption[]>([]);

  // `eventId` mirrors the Angular endpoint switch (fetchEventRooms vs
  // fetchAllRooms): filter rooms to the scoped event when set.
  const visibleRooms = React.useMemo(
    () => (eventId ? rooms.filter((r) => r.eventId === eventId) : rooms),
    [rooms, eventId]
  );

  // The Add Room footer + dialog require both flags (Angular guard).
  const canAddRoom = showAddRoom && !!eventId;

  const roomOptions = React.useMemo(
    () => [...visibleRooms, ...addedRooms],
    [visibleRooms, addedRooms]
  );

  const selected = roomOptions.find((o) => o.value === value);
  const hasOptions = roomOptions.length > 0;
  const showError = error;

  // Loading / error / readonly block interaction (portal isLoading + readonly).
  const interactionBlocked = disabled || loading || error || readonly;

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
    // Mirror onRoomSaved: append the option, select it, then emit.
    setAddedRooms((prev) => [...prev, roomToOption(room)]);
    onValueChange?.(room.eventRoomId);
    onRoomAdded?.(room);
    setDialogOpen(false);
  }

  // Existing room names (for duplicate-name validation in the dialog).
  const existingRoomNames = React.useMemo(
    () =>
      roomOptions.map((o) => o.entity?.name).filter((n): n is string => !!n),
    [roomOptions]
  );

  return (
    <FormControlWrapper
      label={label}
      required={required}
      helperText={!error ? helperText : undefined}
      helperTextOnTop={helperTextOnTop}
      showError={showError}
      currentErrorMessage={errorMessage}
      extraInfo={extraInfo}
      showInfoIcon={showInfoIcon}
      infoTooltipText={infoTooltipText}
      layoutVariant={layoutVariant}
      labelStyleVariant={labelStyleVariant}
      labelSizeVariant={labelSizeVariant}
      labelContextVariant={labelContextVariant}
      spacingVariant={spacingVariant}
      contentContextVariant={contentContextVariant}
      className={className}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-invalid={error || undefined}
            aria-readonly={readonly || undefined}
            aria-required={required || undefined}
            disabled={interactionBlocked}
            data-size={size}
            className={cn(
              selectTriggerVariants({ error: showError }),
              readonly && "pointer-events-none",
              triggerClass
            )}
          >
            <span
              className={cn(
                "flex min-w-0 items-center gap-2 line-clamp-1 truncate",
                !selected && "text-muted-foreground"
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : null}
              <span className="line-clamp-1 truncate">{triggerLabel}</span>
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[325px] p-0"
          align="start"
        >
          <Command>
            {searchable ? <CommandInput placeholder="Search rooms..." /> : null}
            <CommandList>
              <CommandEmpty>
                {hasOptions ? noSearchResultsText : noRoomsText}
              </CommandEmpty>
              <CommandGroup>
                {roomOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <span className="min-w-0 flex-1 truncate text-left">
                      {option.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto size-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {/* Footer (combobox ng-content), gated on showAddRoom() && eventId() */}
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
    </FormControlWrapper>
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
