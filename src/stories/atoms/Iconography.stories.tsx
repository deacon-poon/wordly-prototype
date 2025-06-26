import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DynamicIcon } from "lucide-react/dynamic";

// Comprehensive icon categories with ALL major Lucide icons
const iconCategories = [
  {
    name: "Navigation & Arrows",
    description: "Icons for navigation, direction, and movement",
    icons: [
      "arrow-left",
      "arrow-right",
      "arrow-up",
      "arrow-down",
      "arrow-up-right",
      "arrow-down-left",
      "arrow-up-left",
      "arrow-down-right",
      "chevron-left",
      "chevron-right",
      "chevron-up",
      "chevron-down",
      "chevrons-left",
      "chevrons-right",
      "chevrons-up",
      "chevrons-down",
      "chevrons-up-down",
      "chevrons-left-right",
      "move",
      "move-diagonal",
      "move-3d",
      "navigation",
      "compass",
      "map-pin",
      "map",
      "home",
      "corner-down-left",
      "corner-down-right",
      "corner-up-left",
      "corner-up-right",
      "trending-up",
      "trending-down",
      "undo",
      "redo",
      "rotate-cw",
      "rotate-ccw",
      "flip-horizontal",
      "flip-vertical",
      "maximize",
      "minimize",
      "expand",
      "shrink",
    ],
  },
  {
    name: "Actions & Controls",
    description: "Icons for user actions and interface controls",
    icons: [
      "plus",
      "minus",
      "x",
      "check",
      "check-circle",
      "check-circle-2",
      "x-circle",
      "plus-circle",
      "minus-circle",
      "edit",
      "edit-2",
      "edit-3",
      "save",
      "trash",
      "trash-2",
      "delete",
      "copy",
      "clipboard",
      "clipboard-copy",
      "clipboard-paste",
      "clipboard-check",
      "scissors",
      "download",
      "upload",
      "refresh-cw",
      "refresh-ccw",
      "play",
      "pause",
      "stop",
      "skip-forward",
      "skip-back",
      "fast-forward",
      "rewind",
      "repeat",
      "shuffle",
      "power",
      "power-off",
      "settings",
      "sliders",
      "toggle-left",
      "toggle-right",
      "filter",
      "sort-asc",
      "sort-desc",
    ],
  },
  {
    name: "Communication",
    description: "Icons for messaging, notifications, and communication",
    icons: [
      "mail",
      "mail-open",
      "message-circle",
      "message-square",
      "messages-square",
      "phone",
      "phone-call",
      "phone-incoming",
      "phone-outgoing",
      "phone-missed",
      "phone-off",
      "bell",
      "bell-off",
      "bell-ring",
      "share",
      "share-2",
      "send",
      "send-horizontal",
      "mic",
      "mic-off",
      "video",
      "video-off",
      "headphones",
      "speaker",
      "volume",
      "volume-1",
      "volume-2",
      "volume-x",
      "at-sign",
      "hash",
      "globe",
      "wifi",
      "wifi-off",
      "bluetooth",
      "antenna",
      "radio",
      "rss",
      "signal",
      "broadcast",
      "podcast",
      "voicemail",
    ],
  },
  {
    name: "Users & People",
    description: "Icons representing users, people, and social interactions",
    icons: [
      "user",
      "user-plus",
      "user-minus",
      "user-check",
      "user-x",
      "users",
      "user-circle",
      "user-circle-2",
      "contact",
      "crown",
      "heart",
      "thumbs-up",
      "thumbs-down",
      "smile",
      "frown",
      "meh",
      "angry",
      "laugh",
      "eye",
      "eye-off",
      "glasses",
      "baby",
      "person-standing",
      "accessibility",
      "handshake",
      "hand",
      "wave",
      "clap",
      "pray",
      "muscle",
      "brain",
      "ear",
      "nose",
      "footprints",
      "fingerprint",
      "shield-check",
      "badge",
    ],
  },
  {
    name: "Files & Documents",
    description: "Icons for file types, documents, and data",
    icons: [
      "file",
      "file-text",
      "file-plus",
      "file-minus",
      "file-x",
      "file-edit",
      "file-check",
      "file-image",
      "file-video",
      "file-audio",
      "file-archive",
      "file-code",
      "file-json",
      "file-key",
      "file-lock",
      "folder",
      "folder-open",
      "folder-plus",
      "folder-minus",
      "folder-x",
      "folder-check",
      "folder-edit",
      "folder-archive",
      "archive",
      "book",
      "book-open",
      "bookmark",
      "bookmarks",
      "library",
      "newspaper",
      "scroll",
      "receipt",
      "tag",
      "tags",
      "paperclip",
      "link",
      "external-link",
      "unlink",
      "hash",
      "sticky-note",
      "note-pad-text",
      "notebook",
      "journal",
      "pen-tool",
      "highlighter",
    ],
  },
  {
    name: "Media & Content",
    description: "Icons for media, content, and creative tools",
    icons: [
      "image",
      "images",
      "camera",
      "camera-off",
      "video",
      "video-off",
      "film",
      "clapperboard",
      "music",
      "music-2",
      "music-3",
      "music-4",
      "disc",
      "disc-2",
      "disc-3",
      "cassette-tape",
      "radio",
      "tv",
      "tv-2",
      "monitor",
      "monitor-speaker",
      "smartphone",
      "tablet",
      "laptop",
      "desktop-computer",
      "printer",
      "projector",
      "webcam",
      "microphone",
      "gamepad",
      "gamepad-2",
      "joystick",
      "paintbrush",
      "paintbrush-2",
      "palette",
      "pen-tool",
      "brush",
      "pencil",
      "eraser",
      "dropper",
      "crop",
      "image-plus",
      "image-minus",
    ],
  },
  {
    name: "Interface & Layout",
    description: "Icons for UI elements and layout components",
    icons: [
      "menu",
      "more-horizontal",
      "more-vertical",
      "grip-horizontal",
      "grip-vertical",
      "grid",
      "grid-3x3",
      "list",
      "layout",
      "layout-grid",
      "layout-list",
      "layout-dashboard",
      "sidebar",
      "panel-left",
      "panel-right",
      "panel-top",
      "panel-bottom",
      "panels-top-left",
      "panels-left-bottom",
      "panels-right-bottom",
      "maximize",
      "minimize",
      "maximize-2",
      "minimize-2",
      "square",
      "circle",
      "triangle",
      "diamond",
      "hexagon",
      "octagon",
      "star",
      "heart",
      "plus-square",
      "minus-square",
      "search",
      "filter",
      "sort-asc",
      "sort-desc",
      "columns",
      "rows",
      "table",
      "table-2",
      "kanban",
      "calendar",
      "calendar-days",
      "separator-horizontal",
      "separator-vertical",
    ],
  },
  {
    name: "Status & Feedback",
    description: "Icons for status indicators and user feedback",
    icons: [
      "info",
      "alert-circle",
      "alert-triangle",
      "alert-octagon",
      "help-circle",
      "question-mark-circle",
      "check-circle",
      "check-circle-2",
      "x-circle",
      "clock",
      "clock-1",
      "clock-2",
      "calendar",
      "calendar-check",
      "calendar-x",
      "zap",
      "zap-off",
      "trending-up",
      "trending-down",
      "activity",
      "pulse",
      "battery",
      "battery-charging",
      "battery-full",
      "battery-low",
      "wifi",
      "wifi-off",
      "signal",
      "loader",
      "loader-2",
      "spinner",
      "progress",
      "hourglass",
      "timer",
      "stopwatch",
      "alarm-clock",
      "bell-ring",
      "notification",
      "badge",
      "award",
      "medal",
      "trophy",
      "star",
      "bookmark",
      "flag",
      "map-pin",
      "target",
      "crosshair",
    ],
  },
  {
    name: "E-commerce & Shopping",
    description: "Icons for shopping, payments, and commerce",
    icons: [
      "shopping-cart",
      "shopping-bag",
      "store",
      "storefront",
      "credit-card",
      "dollar-sign",
      "euro",
      "pound-sterling",
      "yen",
      "bitcoin",
      "banknote",
      "coins",
      "wallet",
      "receipt",
      "invoice",
      "calculator",
      "percent",
      "tag",
      "tags",
      "gift",
      "gift-card",
      "package",
      "package-2",
      "package-check",
      "package-plus",
      "package-minus",
      "package-x",
      "truck",
      "plane",
      "ship",
      "delivery-truck",
      "map-pin",
      "location",
      "warehouse",
      "factory",
      "building",
      "building-2",
      "home",
      "landmark",
      "chart-bar",
      "chart-line",
      "trending-up",
      "trending-down",
    ],
  },
  {
    name: "Settings & Tools",
    description: "Icons for settings, configuration, and tools",
    icons: [
      "settings",
      "sliders",
      "tool",
      "wrench",
      "hammer",
      "screwdriver",
      "drill",
      "saw",
      "ruler",
      "compass",
      "cog",
      "gear",
      "nut",
      "bolt",
      "screw",
      "lock",
      "unlock",
      "key",
      "shield",
      "shield-check",
      "shield-alert",
      "shield-off",
      "database",
      "server",
      "hard-drive",
      "hard-drive-download",
      "hard-drive-upload",
      "cpu",
      "memory-stick",
      "usb",
      "plug",
      "cable",
      "ethernet-port",
      "router",
      "modem",
      "terminal",
      "code",
      "code-2",
      "binary",
      "bug",
      "debug",
      "test-tube",
      "flask",
      "beaker",
      "microscope",
      "telescope",
      "magnet",
    ],
  },
  {
    name: "Weather & Nature",
    description: "Icons for weather conditions and natural elements",
    icons: [
      "sun",
      "moon",
      "cloud",
      "cloud-rain",
      "cloud-snow",
      "cloud-lightning",
      "wind",
      "thermometer",
      "umbrella",
      "rainbow",
      "sunrise",
      "sunset",
      "cloudy",
      "partly-cloudy-day",
      "partly-cloudy-night",
      "storm",
      "tornado",
      "hurricane",
      "snow",
      "snowflake",
      "ice",
      "fire",
      "flame",
      "droplet",
      "droplets",
      "wave",
      "waves",
      "mountain",
      "tree",
      "trees",
      "flower",
      "leaf",
      "seedling",
      "cactus",
      "cherry",
      "apple",
      "grape",
    ],
  },
  {
    name: "Transportation",
    description: "Icons for vehicles and transportation",
    icons: [
      "car",
      "truck",
      "bus",
      "train",
      "plane",
      "helicopter",
      "ship",
      "boat",
      "bicycle",
      "motorcycle",
      "scooter",
      "skateboard",
      "rocket",
      "fuel",
      "car-front",
      "car-side",
      "truck-loading",
      "delivery-truck",
      "ambulance",
      "fire-truck",
      "police-car",
      "taxi",
      "metro",
      "tram",
      "ferry",
      "submarine",
      "sailboat",
      "anchor",
      "steering-wheel",
      "tire",
      "traffic-cone",
      "road",
      "map",
      "compass",
      "navigation",
      "location",
    ],
  },
  {
    name: "Health & Medical",
    description: "Icons for healthcare and medical applications",
    icons: [
      "heart",
      "heart-pulse",
      "activity",
      "pulse",
      "stethoscope",
      "thermometer",
      "pill",
      "syringe",
      "bandage",
      "first-aid",
      "cross",
      "hospital",
      "ambulance",
      "wheelchair",
      "glasses",
      "eye",
      "ear",
      "brain",
      "tooth",
      "bone",
      "dna",
      "virus",
      "bacteria",
      "shield-plus",
      "shield-check",
      "medical-kit",
      "medicine",
      "capsule",
      "test-tube",
      "microscope",
      "x-ray",
      "scan",
      "clipboard-list",
      "prescription",
      "blood",
      "heart-rate",
    ],
  },
  {
    name: "Sports & Recreation",
    description: "Icons for sports, games, and recreational activities",
    icons: [
      "trophy",
      "medal",
      "award",
      "target",
      "crosshair",
      "dumbbell",
      "bike",
      "run",
      "walk",
      "swim",
      "golf",
      "tennis",
      "basketball",
      "football",
      "soccer",
      "baseball",
      "volleyball",
      "ping-pong",
      "bowling",
      "archery",
      "fishing",
      "camping",
      "tent",
      "backpack",
      "compass",
      "map",
      "mountain",
      "tree",
      "fire",
      "binoculars",
      "camera",
      "ticket",
      "popcorn",
      "game-controller",
      "gamepad",
      "dice",
      "puzzle",
      "chess",
      "cards",
      "music",
    ],
  },
  {
    name: "Food & Dining",
    description: "Icons for food, beverages, and dining",
    icons: [
      "utensils",
      "fork-knife",
      "spoon",
      "chef-hat",
      "cooking-pot",
      "cup",
      "coffee",
      "tea",
      "wine",
      "beer",
      "cocktail",
      "bottle",
      "glass-water",
      "ice-cream",
      "cake",
      "pizza",
      "hamburger",
      "sandwich",
      "apple",
      "banana",
      "cherry",
      "grape",
      "carrot",
      "bread",
      "egg",
      "fish",
      "meat",
      "cheese",
      "salt",
      "pepper",
      "restaurant",
      "store",
      "market",
      "shopping-cart",
      "receipt",
      "menu",
      "reservation",
      "delivery",
    ],
  },
];

// Icon display component
interface IconDisplayProps {
  name: string;
  size?: number;
}

const IconDisplay: React.FC<IconDisplayProps> = ({ name, size = 24 }) => {
  return (
    <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="w-12 h-12 flex items-center justify-center mb-2 bg-white rounded border group-hover:border-primary-teal-300 transition-colors">
        <DynamicIcon
          name={name as any}
          size={size}
          className="text-gray-700 group-hover:text-primary-teal-600 transition-colors"
        />
      </div>
      <span className="text-xs text-gray-600 text-center font-mono break-all">
        {name}
      </span>
    </div>
  );
};

// Category section component
interface CategorySectionProps {
  title: string;
  description: string;
  icons: string[];
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  icons,
}) => {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="text-xs text-gray-500 mt-1">{icons.length} icons</div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {icons.map((iconName) => (
          <IconDisplay key={iconName} name={iconName} />
        ))}
      </div>
    </div>
  );
};

// Size showcase component
const SizeShowcase: React.FC = () => {
  const sizes = [16, 20, 24, 32, 48, 64];

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Icon Sizes</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {sizes.map((size) => (
          <div
            key={size}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg"
          >
            <DynamicIcon
              name="star"
              size={size}
              className="text-primary-teal-600 mb-2"
            />
            <span className="text-sm font-medium text-gray-700">{size}px</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Usage examples component
const UsageExamples: React.FC = () => {
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Usage Examples
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Button with icon */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Buttons with Icons</h4>
          <div className="space-y-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-teal-500 text-white rounded-md hover:bg-primary-teal-600 transition-colors">
              <DynamicIcon name="plus" size={16} />
              Add Item
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <DynamicIcon name="download" size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Icon with text */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">
            List Items with Icons
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <DynamicIcon
                name="file-text"
                size={16}
                className="text-gray-500"
              />
              <span className="text-sm text-gray-700">Document.pdf</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <DynamicIcon name="image" size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">Photo.jpg</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <DynamicIcon name="music" size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">Song.mp3</span>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Status Indicators</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DynamicIcon
                name="check-circle"
                size={16}
                className="text-green-500"
              />
              <span className="text-sm text-gray-700">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <DynamicIcon name="clock" size={16} className="text-yellow-500" />
              <span className="text-sm text-gray-700">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <DynamicIcon name="x-circle" size={16} className="text-red-500" />
              <span className="text-sm text-gray-700">Failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy component for Storybook
const StoryComponent = () => null;

const meta: Meta = {
  title: "Design System/Foundation/Iconography",
  component: StoryComponent,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StoryComponent>;

/**
 * # Wordly Iconography System
 *
 * Our iconography system is built on **Lucide React**, a beautifully crafted open-source icon library
 * that provides consistent, accessible, and customizable SVG icons for our applications.
 *
 * ## Design Principles
 *
 * - **Consistency**: All icons follow the same visual language and stroke weight
 * - **Clarity**: Icons are designed to be immediately recognizable at any size
 * - **Accessibility**: Icons include proper semantic meaning and ARIA labels
 * - **Scalability**: Vector-based icons that scale perfectly at any resolution
 *
 * ## Technical Implementation
 *
 * We use `lucide-react` for dynamic icon loading, which ensures:
 * - **Tree-shaking**: Only imported icons are included in the bundle
 * - **Performance**: Lightweight SVG icons with minimal overhead
 * - **Customization**: Easy color, size, and stroke width adjustments
 *
 * ## Usage Guidelines
 *
 * - Use **16px** for small interface elements and inline text
 * - Use **20-24px** for standard interface elements (buttons, lists)
 * - Use **32px+** for prominent actions and headers
 * - Maintain consistent stroke width (2px default)
 * - Use semantic color choices that match the action/status
 */
export const AllIcons: Story = {
  render: () => (
    <div className="space-y-16">
      {/* Header Section */}
      <section>
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Wordly Iconography System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A comprehensive collection of icons powered by Lucide React,
            organized by category and optimized for clarity and consistency
            across all interfaces.
          </p>
        </div>
      </section>

      {/* Size Showcase */}
      <section>
        <SizeShowcase />
      </section>

      {/* Usage Examples */}
      <section>
        <UsageExamples />
      </section>

      {/* Icon Categories */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Icon Categories
        </h2>
        {iconCategories.map((category) => (
          <CategorySection
            key={category.name}
            title={category.name}
            description={category.description}
            icons={category.icons}
          />
        ))}
      </section>

      {/* Implementation Guide */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Implementation
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              React Component
            </h3>
            <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
              <code>{`import { Star } from 'lucide-react';

// Basic usage
<Star size={24} />

// With custom props
<Star 
  size={32} 
  color="#128197" 
  strokeWidth={2} 
/>`}</code>
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Dynamic Import
            </h3>
            <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
              <code>{`import { DynamicIcon } from 'lucide-react/dynamic';

// Dynamic usage
<DynamicIcon 
  name="star" 
  size={24} 
  className="text-primary-teal-600"
/>`}</code>
            </pre>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Best Practices
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Always provide meaningful `aria-label` attributes for standalone
              icons
            </li>
            <li>Use consistent sizing across similar interface elements</li>
            <li>
              Prefer semantic color choices (red for errors, green for success,
              etc.)
            </li>
            <li>Test icon clarity at the smallest intended size</li>
            <li>Consider using `aria-hidden="true"` for decorative icons</li>
          </ul>
        </div>
      </section>
    </div>
  ),
};
