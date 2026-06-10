"use client";

import config from "./feature.config";

/**
 * __TITLE__ — prototype feature.
 *
 * This renders inside the real Wordly app shell (sidebar + header), so it looks
 * like a native part of the product — that's the point: prototype the feature
 * where it would actually live.
 *
 * Rules of the road:
 *  - This file MUST stay a React component: keep "use client" above and a
 *    `export default function` that returns JSX. Never paste a raw
 *    <!DOCTYPE html> document in here — it won't compile and breaks the build.
 *    Have an HTML sketch? Ask Claude: "convert my HTML prototype to React".
 *  - Build everything inside this folder (src/features/__ID__/).
 *  - Reuse shared UI from "@/components/ui/*" so it matches the product.
 *  - Don't edit shared files outside this folder — that keeps you conflict-free.
 */
export default function Feature() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">{config.title}</h1>
        <p className="text-gray-600">
          Prototype scaffold — start building in{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">
            src/features/{config.id}/index.tsx
          </code>
        </p>
      </header>

      <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
        Your prototype goes here.
      </div>
    </div>
  );
}
