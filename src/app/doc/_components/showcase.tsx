import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared layout helpers for the /doc component showcase.
 * Keep these dumb + presentational; the real UI under test comes from
 * @/components/ui/*.
 */

export function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="space-y-1 border-b border-border pb-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-10">{children}</div>
    </section>
  );
}

export function ComponentEntry({
  id,
  name,
  description,
  source,
  children,
}: {
  id?: string;
  name: string;
  description: string;
  source?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        {source && (
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            {source}
          </code>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

/** A bordered "preview" card that frames a live example. */
export function Preview({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {label && (
        <div className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
      )}
      <div className={cn("flex flex-wrap items-center gap-4 p-6", className)}>
        {children}
      </div>
    </div>
  );
}

/** Small caption used to label a single variant within a Preview. */
export function VariantTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

/** A labeled cell wrapping a single example so grids read clearly. */
export function Cell({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {children}
      {label && <VariantTag>{label}</VariantTag>}
    </div>
  );
}
