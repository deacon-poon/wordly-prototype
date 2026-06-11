"use client";

/**
 * Item
 *
 * React migration of the production Angular `app-wordly-item`
 * (wordly_portal: libs/components/core/item).
 *
 * A generic list-row primitive: a leading media slot (icon / avatar / image),
 * a content area (title + description), and a trailing actions slot. Supports
 * rendering as a static row, an interactive (clickable) row, or a link row with
 * a trailing chevron / "selected" eye indicator — mirroring the Angular
 * `variant`, `size`, `mediaVariant`, `isLink`, `selected`, and `interactive`
 * inputs.
 *
 * The Angular original wraps Spartan UI's Item with content projection slots
 * (`[header]`, `[media]`, `[title]`, `[description]`, `[actions]`, `[footer]`)
 * plus a data-driven array mode. Here we keep the same surface but drop the
 * Angular DI / i18n / RxJS layer:
 *  - Composable slot components (`ItemMedia`, `ItemContent`, `ItemTitle`, ...)
 *    replace content projection.
 *  - The `<Item items={[...]} />` data-driven mode is preserved as a prop.
 *  - Click handlers arrive via props (`onItemClick`) instead of `@Output`.
 *
 * Variants are expressed with CVA. Built to compose with the shared shadcn
 * primitives; reuses `@/components/ui/separator` for the data-driven separators.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight, Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Variants (mirror WordlyItemVariant / WordlyItemSize / WordlyItemMediaVariant)
// ---------------------------------------------------------------------------

// Mirrors the Spartan `hlmItem` anatomy that the Angular `app-wordly-item`
// proxies (Spartan is the ng port of shadcn's Item primitive). Base classes
// are 1:1 with `hlm-item.ts`:
//   root  → group/item flex flex-wrap items-center rounded-md (6px) border
//           border-transparent text-sm transition-colors duration-100 outline-none
//           focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
//   default → transparent; outline → bg-white border-border (+responsive col→row);
//             muted → bg-muted/50
//   default density → gap-4 p-4; sm → gap-2.5 px-4 py-3
// State colors come from the portal CSS vars (styles-v2.scss):
//   --item-selected-bg     → accent-green-50
//   --item-selected-border → accent-green-700
//   --item-selected-icon   → accent-green-800
//   --item-hover-bg        → accent-green-100
//   --item-active-bg       → accent-green-200
const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-md border border-transparent text-left text-sm text-gray-900 outline-none transition-colors duration-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border-border bg-white flex-col items-stretch shadow-xs md:flex-row md:items-center",
        muted: "bg-muted/50",
      },
      // size === density
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
      },
      rounded: {
        true: "",
        false: "rounded-none",
      },
      interactive: {
        true: "cursor-pointer hover:bg-accent-green-100 active:bg-accent-green-200",
        false: "",
      },
      selected: {
        true: "border-l-2 border-l-accent-green-700 bg-accent-green-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: true,
      interactive: false,
      selected: false,
    },
  }
);

// Mirrors Spartan `hlm-item-media.ts`:
//   base  → flex shrink-0 items-center justify-center gap-2 (+ description-offset
//           utilities that nudge the media to self-start when a description exists)
//   icon  → bg-muted size-8 rounded-sm border, icon glyph at text-base (size-4)
//   image → size-10 overflow-hidden rounded-sm, img fills + object-cover
const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 text-muted-foreground group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start",
  {
    variants: {
      mediaVariant: {
        default: "bg-transparent",
        icon: "size-8 rounded-sm border bg-muted [&_svg]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      mediaVariant: "default",
    },
  }
);

export type ItemVariant = NonNullable<
  VariantProps<typeof itemVariants>["variant"]
>;
export type ItemSize = NonNullable<VariantProps<typeof itemVariants>["size"]>;
export type ItemMediaVariant = NonNullable<
  VariantProps<typeof itemMediaVariants>["mediaVariant"]
>;

// ---------------------------------------------------------------------------
// Slot subcomponents (replace Angular content-projection slots)
// ---------------------------------------------------------------------------

export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  mediaVariant?: ItemMediaVariant;
}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, mediaVariant = "default", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="item-media"
      className={cn(itemMediaVariants({ mediaVariant }), className)}
      {...props}
    />
  )
);
ItemMedia.displayName = "ItemMedia";

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="item-content"
    className={cn(
      "flex min-w-0 flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
      className
    )}
    {...props}
  />
));
ItemContent.displayName = "ItemContent";

const ItemTitle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="item-title"
    className={cn(
      "flex w-fit items-center gap-2 truncate text-sm font-medium leading-snug text-gray-900",
      className
    )}
    {...props}
  />
));
ItemTitle.displayName = "ItemTitle";

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="item-description"
    className={cn(
      "line-clamp-2 text-sm font-normal leading-normal text-muted-foreground",
      className
    )}
    {...props}
  />
));
ItemDescription.displayName = "ItemDescription";

const ItemActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="item-actions"
    className={cn("flex w-full items-center gap-2 md:w-auto", className)}
    {...props}
  />
));
ItemActions.displayName = "ItemActions";

const ItemHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="item-header"
    className={cn(
      "flex basis-full items-center justify-between gap-2",
      className
    )}
    {...props}
  />
));
ItemHeader.displayName = "ItemHeader";

const ItemFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="item-footer"
    className={cn(
      "flex basis-full items-center justify-between gap-2",
      className
    )}
    {...props}
  />
));
ItemFooter.displayName = "ItemFooter";

// ---------------------------------------------------------------------------
// Data contract for data-driven mode (mirrors WordlyItemData)
// ---------------------------------------------------------------------------

export interface ItemData {
  title: string;
  description?: string;
  /** Rendered inside the media slot when provided. */
  icon?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  mediaVariant?: ItemMediaVariant;
  href?: string;
  target?: string;
  /** Arbitrary payload echoed back on click. */
  data?: unknown;
}

// ---------------------------------------------------------------------------
// Item — root component
// ---------------------------------------------------------------------------

export interface ItemProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onClick"
> {
  variant?: ItemVariant;
  /** Density: "default" (standard) or "sm" (compact). */
  size?: ItemSize;
  mediaVariant?: ItemMediaVariant;

  /** Render as an `<a>` and show a trailing chevron / selected indicator. */
  isLink?: boolean;
  href?: string;
  target?: string;

  /** Accent-green selected state + trailing eye indicator (link mode). */
  selected?: boolean;
  /** Opt-in hover/active background feedback for clickable rows. */
  interactive?: boolean;
  /** Square corners when false. */
  rounded?: boolean;

  /** Echoed back through `onItemClick`. */
  data?: unknown;
  /** Fired for link-without-href or interactive rows. */
  onItemClick?: (data: unknown) => void;

  /**
   * Data-driven mode. When provided, renders one row per entry and ignores
   * `children`. Mirrors the Angular `[items]` input.
   */
  items?: ItemData[];
  /** Show separators between data-driven rows. */
  showSeparators?: boolean;

  /** Accessible label for the trailing chevron (link mode). */
  viewDetailsLabel?: string;

  children?: React.ReactNode;
}

/** Trailing indicator shown in link mode: eye when selected, else chevron. */
function LinkIndicator({
  selected,
  label,
}: {
  selected?: boolean;
  label: string;
}) {
  if (selected) {
    return (
      <Eye
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-accent-green-800"
        data-slot="item-selected-icon"
      />
    );
  }
  return (
    <ChevronRight
      aria-label={label}
      className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-active/item:scale-90"
    />
  );
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    className,
    variant = "default",
    size = "default",
    mediaVariant = "default",
    isLink = false,
    href,
    target,
    selected = false,
    interactive = false,
    rounded = true,
    data,
    onItemClick,
    items,
    showSeparators = false,
    viewDetailsLabel = "View details",
    children,
    ...rest
  },
  ref
) {
  // --- Data-driven mode -----------------------------------------------------
  if (items && items.length > 0) {
    return (
      <div
        role="list"
        data-slot="item-group"
        className={cn("flex w-full flex-col", className)}
      >
        {items.map((item, i) => {
          const media =
            item.icon != null ? (
              item.icon
            ) : item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.imageAlt ?? item.title} />
            ) : null;

          return (
            <React.Fragment key={i}>
              <Item
                variant={variant}
                size={size}
                mediaVariant={item.mediaVariant ?? mediaVariant}
                isLink={isLink || Boolean(item.href)}
                href={item.href}
                target={item.target ?? target}
                interactive={interactive}
                rounded={rounded}
                selected={selected}
                data={item.data}
                onItemClick={onItemClick}
              >
                {media != null ? (
                  <ItemMedia mediaVariant={item.mediaVariant ?? mediaVariant}>
                    {media}
                  </ItemMedia>
                ) : null}
                <ItemContent>
                  <ItemTitle>{item.title}</ItemTitle>
                  {item.description ? (
                    <ItemDescription>{item.description}</ItemDescription>
                  ) : null}
                </ItemContent>
              </Item>
              {showSeparators && i < items.length - 1 ? <Separator /> : null}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // --- Single row (slotted) -------------------------------------------------
  const classes = cn(
    itemVariants({
      variant,
      size,
      rounded,
      interactive: interactive || (isLink && !href),
      selected: selected && isLink,
    }),
    className
  );

  function handleClick(e: React.MouseEvent) {
    if (isLink) {
      if (!href) {
        e.preventDefault();
        onItemClick?.(data);
      }
      return;
    }
    if (interactive) {
      // Don't fire when clicking nested controls.
      if ((e.target as HTMLElement).closest("button, a")) return;
      onItemClick?.(data);
    }
  }

  // Keyboard activation for the interactive (role="button") div row.
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!interactive) return;
    if (e.key !== "Enter" && e.key !== " ") return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    e.preventDefault();
    onItemClick?.(data);
  }

  const trailing =
    isLink && !hasActions(children) ? (
      <ItemActions>
        <LinkIndicator selected={selected} label={viewDetailsLabel} />
      </ItemActions>
    ) : null;

  if (isLink) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href || undefined}
        target={target || undefined}
        data-slot="item"
        data-selected={selected || undefined}
        className={classes}
        onClick={handleClick}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
        {trailing}
      </a>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      data-slot="item"
      data-selected={selected || undefined}
      className={classes}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});
Item.displayName = "Item";

/** Heuristic: did the caller already provide their own ItemActions slot? */
function hasActions(children: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === ItemActions) found = true;
  });
  return found;
}

/** A passthrough for callers that want `asChild`-style composition of media. */
export const ItemMediaSlot = Slot;

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
  itemVariants,
  itemMediaVariants,
};
