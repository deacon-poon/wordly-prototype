import type { FeatureConfig } from "@/shell/types";

// This file is the contract between your prototype and the app shell.
// `npm run create-feature <name>` fills in id/title/owner for you.
const config: FeatureConfig = {
  id: "attendee-engagement",
  title: "Attendee Engagement",
  owner: "deacon",
  stage: "draft",
  // Attendee-facing end-user experience → render full-screen, no portal shell.
  // It still appears in the sidebar as the portal → experience launch point.
  chrome: "standalone",
  // First-run coaching variants, surfaced in Spotlight (⌘K) instead of an on-screen
  // switcher. Each is its own shareable deep-link.
  spotlight: [
    {
      label: "Attendee Engagement · Coached in panel",
      href: "/lab/attendee-engagement?v=b1",
      hint: "B1",
      keywords: "variant coaching panel default",
    },
    {
      label: "Attendee Engagement · Dismissible pill",
      href: "/lab/attendee-engagement?v=b2",
      hint: "B2",
      keywords: "variant coaching pill tooltip",
    },
    {
      label: "Attendee Engagement · First-run spotlight",
      href: "/lab/attendee-engagement?v=b3",
      hint: "B3",
      keywords: "variant coaching spotlight onboarding modal",
    },
    {
      label: "Attendee Engagement · Static hint banner",
      href: "/lab/attendee-engagement?v=b4",
      hint: "B4",
      keywords: "variant coaching hint banner",
    },
  ],
  nav: {
    // Where your feature appears in the real sidebar so it feels native:
    //   "main"         → primary menu (Sessions, Events, …)
    //   "workspace"    → Workspace Settings group
    //   "organization" → Organization group
    group: "main",
    label: "Attendee Engagement",
    // Any lucide-react icon name, PascalCase. Browse: https://lucide.dev/icons
    icon: "Sparkles",
    order: 100,
  },
};

export default config;
