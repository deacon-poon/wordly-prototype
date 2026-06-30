"use client";

import { usePathname } from "next/navigation";
import { VercelToolbar as Toolbar } from "@vercel/toolbar/next";
import { isStandaloneLabPath } from "@/shell/nav-registry";

export function VercelToolbar() {
  const pathname = usePathname();
  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  // Dev-only, and hidden on standalone attendee experiences so the prototype view
  // stays clean.
  if (!shouldInjectToolbar || isStandaloneLabPath(pathname)) {
    return null;
  }

  return <Toolbar />;
}
