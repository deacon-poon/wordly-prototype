import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { DocSidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Wordly · Component Showcase",
  description:
    "Live reference for the Wordly design system: foundations and reusable UI components from @/components/ui.",
};

export default function DocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/doc" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-primary-blue-600">
              Wordly
            </span>
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
              Component Showcase
            </span>
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border md:block">
          <DocSidebar />
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">
          <div className="mx-auto max-w-4xl space-y-16">{children}</div>
        </main>
      </div>
    </div>
  );
}
