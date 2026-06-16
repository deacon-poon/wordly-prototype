"use client";

/**
 * CardHeaderLayout
 *
 * EXACT React mirror of the production Angular `wordly-card` DEFAULT variant
 *   wordly_portal:
 *     libs/components/core/card/wordly-card.component.{ts,html}
 *   anatomy from the Spartan helm directives:
 *     libs/ui/card/src/lib/hlm-card{,-header,-title,-description,-action,-content,-footer}.ts
 *
 * The Angular DEFAULT variant renders a `<section hlmCard>` with five content
 * projection slots — title / description / action (in the header), content, and
 * footer. Each slot's wrapper is always rendered (empty projection shows
 * nothing), so we mirror that by always rendering the title/description/action/
 * content/footer wrappers and letting empty children collapse visually.
 *
 * Class strings are ported VERBATIM from the hlm directives so the DOM/layout
 * matches the portal 1:1 (cannot consume the repo `@/components/ui/card` atom:
 * that is the older shadcn anatomy — rounded-lg / space-y-1.5 p-6 / text-2xl —
 * and editing shared atoms is out of scope):
 *   hlmCard        → bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
 *   hlmCardHeader  → @container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6
 *   hlmCardTitle   → leading-none font-semibold
 *   hlmCardDescription → text-muted-foreground text-sm
 *   hlmCardAction  → col-start-2 row-span-2 row-start-1 self-start justify-self-end
 *   hlmCardContent → px-6
 *   hlmCardFooter  → flex items-center px-6 [.border-t]:pt-6
 *
 * The header `has-data-[slot=card-action]` grid switch keys off the action
 * element carrying `data-slot="card-action"`, exactly as the portal does, so the
 * header collapses to a single column when no action is present.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CardHeaderLayoutProps {
  /** Title slot (Angular: [slot=title], rendered in <h3 hlmCardTitle>). */
  title: React.ReactNode;
  /** Description slot (Angular: [slot=description], rendered in <p hlmCardDescription>). */
  description: React.ReactNode;
  /** Content slot (Angular: [slot=content], rendered in <div hlmCardContent>). */
  children: React.ReactNode;
  /** Action slot (Angular: [slot=action], rendered in <div hlmCardAction>). */
  actions?: React.ReactNode;
  /** Footer slot (Angular: [slot=footer], rendered in <div hlmCardFooter>). */
  footer?: React.ReactNode;

  /** Extra classes for the card container (Angular: cardClass). */
  cardClass?: string;
  /** Extra classes for the card header (Angular: headerClass). */
  headerClass?: string;
  /** Extra classes for the card content (Angular: contentClass). */
  contentClass?: string;
  /** Extra classes for the card footer (Angular: footerClass). */
  footerClass?: string;
}

export function CardHeaderLayout({
  title,
  description,
  children,
  actions,
  footer,
  cardClass,
  headerClass,
  contentClass,
  footerClass,
}: CardHeaderLayoutProps) {
  return (
    <section
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        cardClass
      )}
    >
      {/* Card Header with Action */}
      <div
        className={cn(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          headerClass
        )}
      >
        <h3 className="leading-none font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        {actions ? (
          <div
            data-slot="card-action"
            className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
          >
            {actions}
          </div>
        ) : null}
      </div>

      {/* Card Content */}
      <div className={cn("px-6", contentClass)}>{children}</div>

      {/* Card Footer */}
      {footer ? (
        <div
          className={cn("flex items-center px-6 [.border-t]:pt-6", footerClass)}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}
