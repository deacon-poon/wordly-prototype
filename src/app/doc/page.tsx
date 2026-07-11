import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { navGroups } from "./_components/nav";

const groupHref: Record<string, string> = {
  Foundations: "/doc/foundations",
  "Buttons & Actions": "/doc/components/actions",
  "Forms & Inputs": "/doc/components/forms",
  Overlays: "/doc/components/overlays",
  "Layout & Disclosure": "/doc/components/layout",
  "Data Display": "/doc/components/data",
};

export default function DocIndexPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Wordly Component Showcase
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          A live reference for the Wordly design system. Every example on this
          site renders the real components from{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            @/components/ui
          </code>
          , so it always reflects the current implementation. Use it to discover
          what is available to reuse before building something new.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {navGroups.map((group) => (
          <Link
            key={group.title}
            href={groupHref[group.title] ?? "/doc"}
            className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary-blue-300 hover:bg-primary-blue-25"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {group.title}
              </h2>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              {group.items.map((i) => i.label).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
