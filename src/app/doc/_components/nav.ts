export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Sidebar navigation for the /doc showcase.
 * Categories map to sub-routes; items are anchors within each page.
 */
export const navGroups: NavGroup[] = [
  {
    title: "Foundations",
    items: [
      { label: "Colors", href: "/doc/foundations#colors" },
      { label: "Typography", href: "/doc/foundations#typography" },
      { label: "Design Tokens", href: "/doc/foundations#tokens" },
      { label: "Spacing", href: "/doc/foundations#spacing" },
    ],
  },
  {
    title: "Buttons & Actions",
    items: [
      { label: "Button", href: "/doc/components/actions#button" },
      { label: "Badge", href: "/doc/components/actions#badge" },
      { label: "Toggle", href: "/doc/components/actions#toggle" },
      { label: "Toggle Group", href: "/doc/components/actions#toggle-group" },
      { label: "Dropdown Menu", href: "/doc/components/actions#dropdown-menu" },
    ],
  },
  {
    title: "Forms & Inputs",
    items: [
      { label: "Input", href: "/doc/components/forms#input" },
      { label: "Textarea", href: "/doc/components/forms#textarea" },
      { label: "Label", href: "/doc/components/forms#label" },
      { label: "Select", href: "/doc/components/forms#select" },
      { label: "Checkbox", href: "/doc/components/forms#checkbox" },
      { label: "Switch", href: "/doc/components/forms#switch" },
      { label: "Radio Group", href: "/doc/components/forms#radio-group" },
      { label: "Date Picker", href: "/doc/components/forms#datetime-picker" },
      { label: "Calendar", href: "/doc/components/forms#calendar" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { label: "Dialog", href: "/doc/components/overlays#dialog" },
      { label: "Alert Dialog", href: "/doc/components/overlays#alert-dialog" },
      { label: "Sheet", href: "/doc/components/overlays#sheet" },
      { label: "Popover", href: "/doc/components/overlays#popover" },
      { label: "Tooltip", href: "/doc/components/overlays#tooltip" },
      { label: "Hover Card", href: "/doc/components/overlays#hover-card" },
      { label: "Command", href: "/doc/components/overlays#command" },
    ],
  },
  {
    title: "Layout & Disclosure",
    items: [
      { label: "Card", href: "/doc/components/layout#card" },
      { label: "Tabs", href: "/doc/components/layout#tabs" },
      { label: "Accordion", href: "/doc/components/layout#accordion" },
      { label: "Collapsible", href: "/doc/components/layout#collapsible" },
      { label: "Separator", href: "/doc/components/layout#separator" },
    ],
  },
  {
    title: "Data Display",
    items: [
      { label: "Avatar", href: "/doc/components/data#avatar" },
      { label: "Progress", href: "/doc/components/data#progress" },
      { label: "Skeleton", href: "/doc/components/data#skeleton" },
      { label: "Table", href: "/doc/components/data#table" },
      { label: "Alert", href: "/doc/components/data#alert" },
      { label: "Breadcrumb", href: "/doc/components/data#breadcrumb" },
    ],
  },
];
