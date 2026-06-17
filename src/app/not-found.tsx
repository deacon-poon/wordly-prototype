"use client";

/**
 * Graceful placeholder for routes that aren't ported into the prototype yet.
 *
 * Renders inside the active shell (root layout → AppShellProvider → LegacyShell),
 * so the nav stays in place and the active item still highlights. Used because the
 * legacy nav links to Angular's real paths 1:1; screens not yet cloned land here
 * instead of a bare Next 404.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Construction } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-blue-50 text-primary-blue-400">
        <Construction className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Screen not ported yet
        </h1>
        <p className="mt-1 max-w-md text-sm text-gray-600">
          This screen exists in the Wordly portal but hasn’t been cloned into
          the prototype yet.
        </p>
        {pathname ? (
          <p className="mt-2 font-mono text-xs text-gray-400">{pathname}</p>
        ) : null}
      </div>
      <Button asChild variant="outline">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
