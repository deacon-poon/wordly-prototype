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
