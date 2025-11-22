import { VercelToolbar as Toolbar } from "@vercel/toolbar/next";

export function VercelToolbar() {
  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  if (!shouldInjectToolbar) {
    return null;
  }

  return <Toolbar />;
}

