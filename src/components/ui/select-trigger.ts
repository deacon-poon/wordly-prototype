import { cva, type VariantProps } from "class-variance-authority";

/**
 * Shared trigger styling for the workspace "selector" components (combobox-style
 * popover triggers: room, timezone, voice, transcript, workspace, …). Extracted
 * so every selector consumes the SAME atom instead of copy-pasting the cva.
 */
export const selectTriggerVariants = cva(
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

export type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;
