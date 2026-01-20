import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

// Simple color display component that doesn't rely on external dependencies
interface ColorSwatchProps {
  name: string;
  value: string;
  textColor?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  value,
  textColor = "text-black",
}) => {
  return (
    <div className="flex flex-col">
      <div
        className="w-full h-16 rounded-md mb-2 shadow-sm"
        style={{ backgroundColor: value }}
      />
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${textColor}`}>{name}</span>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
    </div>
  );
};

interface ColorSetProps {
  title: string;
  description?: string;
  colors: Array<{
    name: string;
    value: string;
    textColor?: string;
  }>;
}

const ColorSet = ({ title, description, colors }: ColorSetProps) => {
  return (
    <div className="p-6 rounded-lg border bg-white mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {colors.map((color) => (
          <ColorSwatch
            key={color.name}
            name={color.name}
            value={color.value}
            textColor={color.textColor}
          />
        ))}
      </div>
    </div>
  );
};

// Dummy component for Storybook
const StoryComponent = () => null;

const meta: Meta = {
  title: "Design System/Foundation/Colors",
  component: StoryComponent,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StoryComponent>;

/**
 * # Wordly Color Palette
 *
 * This is the comprehensive color palette for the Wordly design system.
 * It uses Navy (blue) as the PRIMARY brand color and Green as the SECONDARY/accent color.
 *
 * Each color has shades labeled from 50 (lightest) to 900 (darkest).
 *
 * ## Brand Colors
 * - **Primary Navy (#0B1C3A)**: Main brand color for primary actions and navigation
 * - **Secondary Green (#28E6B6)**: Accent color for highlights and interactive elements
 *
 * ## Semantic Color System
 * - **Informational Blue (#2563EB)**: For links, informational messages, help text, and info states
 * - **Success Green (#0C9A4E)**: For affirmative actions, success states, and positive feedback
 * - **Warning Orange (#F97316)**: For warnings, caution states, and attention-getting elements
 * - **Error Red (#E62D21)**: For destructive actions, errors, and critical alerts
 * - **Neutral Gray (#646E78)**: For UI elements, borders, disabled states, and placeholders
 *
 * ## Color Usage Priority
 * 1. **Primary Navy** - Main brand color for buttons, headers, and key UI elements
 * 2. **Secondary Green** - Accent highlights and secondary actions
 * 3. **Semantic colors** - For specific UI states and feedback
 * 4. **Neutral Gray** - For UI elements and disabled states
 *
 * ## WCAG Compliance
 *
 * The palette is designed with accessibility in mind. Each color is tested against
 * both white and black backgrounds to ensure WCAG compliance:
 *
 * - **AA**: Requires a contrast ratio of at least 4.5:1 for normal text
 * - **AAA**: Requires a contrast ratio of at least 7:1 for normal text
 */
export const AllColors: Story = {
  render: () => (
    <div className="space-y-12">
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Brand Colors</h2>
        <div className="space-y-10">
          <ColorSet
            title="Primary Navy Palette"
            description="Primary brand color used for navigation, primary buttons, and key UI elements."
            colors={[
              { name: "Navy 20", value: "#E9F0FB" },
              { name: "Navy 50", value: "#D4E1F7" },
              { name: "Navy 100", value: "#94B3EB" },
              { name: "Navy 200", value: "#5486DE" },
              { name: "Navy 300", value: "#255DC1" },
              { name: "Navy 400", value: "#183E81" },
              { name: "Navy 500", value: "#0B1C3A" },
              { name: "Navy 600", value: "#0A1933" },
              { name: "Navy 700", value: "#030811" },
            ]}
          />

          <ColorSet
            title="Secondary Green Palette"
            description="Secondary/accent brand color used for highlights and interactive elements."
            colors={[
              { name: "Green 50", value: "#E8FCF7" },
              { name: "Green 100", value: "#C8F9EC" },
              { name: "Green 200", value: "#BAF7E8" },
              { name: "Green 300", value: "#8DF2D8" },
              { name: "Green 400", value: "#5FECC9" },
              { name: "Green 500", value: "#28E6B6" },
              { name: "Green 600", value: "#15B78E" },
              { name: "Green 700", value: "#10896A" },
              { name: "Green 800", value: "#0B5B47" },
              { name: "Green 900", value: "#052E23" },
            ]}
          />

          <ColorSet
            title="Accent Green Palette"
            description="Accent color used for highlights, links, and interactive feedback."
            colors={[
              { name: "Green 50", value: "#E6FDF9" },
              { name: "Green 100", value: "#C2FAF0" },
              { name: "Green 200", value: "#85F4E1" },
              { name: "Green 300", value: "#48EDD2" },
              { name: "Green 400", value: "#38E9CB" },
              { name: "Green 500", value: "#28E6B6" },
              { name: "Green 600", value: "#20B892" },
              { name: "Green 700", value: "#188A6E" },
              { name: "Green 800", value: "#105C4A" },
              { name: "Green 900", value: "#082E25" },
            ]}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Semantic Colors</h2>
        <p className="text-gray-600 mb-6">
          Complete semantic color system for consistent UI communication and
          user feedback.
        </p>
        <div className="space-y-10">
          <ColorSet
            title="Informational Blue Palette"
            description="Primary color for links, informational messages, help text, and general information states."
            colors={[
              { name: "Blue 50", value: "#EBF5FF" },
              { name: "Blue 100", value: "#D1E7FF" },
              { name: "Blue 200", value: "#B3D4FF" },
              { name: "Blue 300", value: "#84C5FF" },
              { name: "Blue 400", value: "#53B1FD" },
              { name: "Blue 500", value: "#2563EB" },
              { name: "Blue 600", value: "#1D4ED8" },
              { name: "Blue 700", value: "#1E40AF" },
              { name: "Blue 800", value: "#1E3A8A" },
              { name: "Blue 900", value: "#1E2F60" },
            ]}
          />

          <ColorSet
            title="Success Green Palette"
            description="Used for affirmative actions, success states, confirmations, and positive feedback."
            colors={[
              { name: "Green 50", value: "#E6F6EC" },
              { name: "Green 100", value: "#C5E8D2" },
              { name: "Green 200", value: "#9CD7B0" },
              { name: "Green 300", value: "#66C188" },
              { name: "Green 400", value: "#34AD67" },
              { name: "Green 500", value: "#0C9A4E" },
              { name: "Green 600", value: "#0A7B3F" },
              { name: "Green 700", value: "#085D2F" },
              { name: "Green 800", value: "#053E20" },
              { name: "Green 900", value: "#021F10" },
            ]}
          />

          <ColorSet
            title="Warning Orange Palette"
            description="Used for warnings, caution states, attention-getting elements, and non-critical alerts."
            colors={[
              { name: "Orange 50", value: "#FFF7ED" },
              { name: "Orange 100", value: "#FFEDD5" },
              { name: "Orange 200", value: "#FED7AA" },
              { name: "Orange 300", value: "#FDBA74" },
              { name: "Orange 400", value: "#FB923C" },
              { name: "Orange 500", value: "#F97316" },
              { name: "Orange 600", value: "#EA580C" },
              { name: "Orange 700", value: "#C2410C" },
              { name: "Orange 800", value: "#9A3412" },
              { name: "Orange 900", value: "#7C2D12" },
            ]}
          />

          <ColorSet
            title="Error Red Palette"
            description="Used for destructive actions, errors, critical alerts, and negative feedback."
            colors={[
              { name: "Red 50", value: "#FCEBEA" },
              { name: "Red 100", value: "#F9CFCC" },
              { name: "Red 200", value: "#F5A8A2" },
              { name: "Red 300", value: "#F07870" },
              { name: "Red 400", value: "#EA4F45" },
              { name: "Red 500", value: "#E62D21" },
              { name: "Red 600", value: "#B8221A" },
              { name: "Red 700", value: "#8A1A13" },
              { name: "Red 800", value: "#5C110D" },
              { name: "Red 900", value: "#2E0906" },
            ]}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">UI Colors</h2>
        <div className="space-y-10">
          <ColorSet
            title="Gray Palette"
            description="Used for UI elements, backgrounds, borders, and text."
            colors={[
              { name: "Gray 50", value: "#F8F9FA" },
              { name: "Gray 100", value: "#EEF0F2" },
              { name: "Gray 200", value: "#E3E6E8" },
              { name: "Gray 300", value: "#CDD2D7" },
              { name: "Gray 400", value: "#9BA3AB" },
              { name: "Gray 500", value: "#646E78" },
              { name: "Gray 600", value: "#495057" },
              { name: "Gray 700", value: "#343A40" },
              { name: "Gray 800", value: "#212529" },
              { name: "Gray 900", value: "#121416" },
            ]}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Usage Guidelines</h2>
        <div className="space-y-8">
          {/* Brand Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-primary-teal-500 mb-2">
                  Primary Teal
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use for primary buttons, navigation, and key brand elements.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Common usage:</strong> Primary CTAs, active
                  navigation, brand highlights
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-secondary-navy-500 mb-2">
                  Secondary Navy
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use for secondary actions, headings, and supporting content.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Common usage:</strong> Secondary buttons, headings,
                  body text
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-accent-green-500 mb-2">
                  Accent Green
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use for highlights, interactive feedback, and accent elements.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Common usage:</strong> Hover states, progress
                  indicators, badges
                </div>
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Semantic Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-blue-700">
                    Informational Blue
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Primary color for links, help text, and informational content.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Use for:</strong> Links, info alerts, help text,
                  tooltips
                  <br />
                  <strong>Recommended shades:</strong> 500-700 for text, 50-100
                  for backgrounds
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-green-700">
                    Success Green
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  For positive feedback, confirmations, and success states.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Use for:</strong> Success messages, checkmarks,
                  positive indicators
                  <br />
                  <strong>Recommended shades:</strong> 500-700 for text, 50-100
                  for backgrounds
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-orange-700">
                    Warning Orange
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  For warnings, caution states, and attention-getting elements.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Use for:</strong> Warning alerts, caution text,
                  pending states
                  <br />
                  <strong>Recommended shades:</strong> 600-700 for text, 50-100
                  for backgrounds
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-red-700">Error Red</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  For errors, destructive actions, and critical alerts.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Use for:</strong> Error messages, delete buttons,
                  critical warnings
                  <br />
                  <strong>Recommended shades:</strong> 500-700 for text, 50-100
                  for backgrounds
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                  <h4 className="font-semibold text-gray-700">Neutral Gray</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  For UI elements, borders, and disabled states.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Use for:</strong> Borders, disabled text,
                  placeholders, dividers
                  <br />
                  <strong>Recommended shades:</strong> 400-600 for text, 100-200
                  for backgrounds
                </div>
              </div>
            </div>
          </div>

          {/* Color Combinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Recommended Color Combinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Light Backgrounds</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-blue-800">Blue 800 on Blue 50</span>
                    <span className="text-xs text-gray-500">Info alerts</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-green-800">
                      Green 800 on Green 50
                    </span>
                    <span className="text-xs text-gray-500">
                      Success alerts
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-orange-800">
                      Orange 800 on Orange 50
                    </span>
                    <span className="text-xs text-gray-500">
                      Warning alerts
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-red-800">Red 800 on Red 50</span>
                    <span className="text-xs text-gray-500">Error alerts</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Text Colors on White</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white border rounded">
                    <span className="text-blue-600">Blue 600</span>
                    <span className="text-xs text-gray-500">
                      Links & info text
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white border rounded">
                    <span className="text-secondary-navy-500">Navy 500</span>
                    <span className="text-xs text-gray-500">
                      Secondary text
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white border rounded">
                    <span className="text-gray-700">Gray 700</span>
                    <span className="text-xs text-gray-500">Body text</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white border rounded">
                    <span className="text-gray-500">Gray 500</span>
                    <span className="text-xs text-gray-500">Muted text</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};

export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <section>
        <h2 className="text-2xl font-bold mb-6">Color Usage Examples</h2>
        <p className="text-gray-600 mb-8">
          Here are practical examples of how to use the new informational colors
          in your components.
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold">Links and Informational Text</h3>

        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div>
            <h4 className="font-medium mb-2">Standard Links</h4>
            <div className="space-y-2">
              <p>
                This is a paragraph with a{" "}
                <a href="#" className="link">
                  standard link
                </a>{" "}
                that uses the informational blue color.
              </p>
              <p>
                You can also use{" "}
                <a href="#" className="link-subtle">
                  subtle links
                </a>{" "}
                that are less prominent.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Informational Text Colors</h4>
            <div className="space-y-2">
              <p className="text-info">
                This is informational text using text-info class
              </p>
              <p className="text-info-light">
                This is lighter informational text using text-info-light class
              </p>
              <p className="text-info-dark">
                This is darker informational text using text-info-dark class
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Tailwind Utilities</h4>
            <div className="space-y-2">
              <p className="text-blue-600">
                Using text-blue-600 for standard informational text
              </p>
              <p className="text-blue-700">
                Using text-blue-700 for prominent informational text
              </p>
              <div className="bg-blue-50 text-blue-800 p-3 rounded">
                Informational background using bg-blue-50 with text-blue-800
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold">Warning and Alert Colors</h3>

        <div className="bg-white p-6 rounded-lg border space-y-4">
          <div>
            <h4 className="font-medium mb-2">Warning Text</h4>
            <div className="space-y-2">
              <p className="text-warning">
                This is warning text using text-warning class
              </p>
              <p className="text-warning-light">
                This is lighter warning text using text-warning-light class
              </p>
              <p className="text-warning-dark">
                This is darker warning text using text-warning-dark class
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Warning Backgrounds</h4>
            <div className="space-y-2">
              <div className="bg-warning text-orange-800 p-3 rounded">
                Warning message with bg-warning background
              </div>
              <div className="bg-orange-50 text-orange-700 p-3 rounded">
                Using bg-orange-50 with text-orange-700
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Tailwind Orange Utilities</h4>
            <div className="space-y-2">
              <p className="text-orange-600">
                Using text-orange-600 for warnings
              </p>
              <p className="text-orange-700">
                Using text-orange-700 for important warnings
              </p>
              <div className="bg-orange-100 text-orange-800 p-3 rounded border border-orange-200">
                Alert box using bg-orange-100, text-orange-800, and
                border-orange-200
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold">Component Examples</h3>

        <div className="bg-white p-6 rounded-lg border space-y-6">
          <div>
            <h4 className="font-medium mb-3">Alert Components</h4>
            <div className="space-y-3">
              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Information
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        This is an informational alert using the blue color
                        palette.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Alert */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-orange-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800">
                      Warning
                    </h3>
                    <div className="mt-2 text-sm text-orange-700">
                      <p>
                        This is a warning alert using the orange color palette.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Navigation Links</h4>
            <nav className="space-y-2">
              <a href="#" className="block link">
                Dashboard
              </a>
              <a href="#" className="block link">
                Analytics
              </a>
              <a href="#" className="block link-subtle">
                Settings
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800">
                Help Center
              </a>
            </nav>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">CSS Classes Reference</h3>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Informational Blue Classes</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>
                  <code className="bg-white px-2 py-1 rounded">.text-info</code>{" "}
                  - Standard info text
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .text-info-light
                  </code>{" "}
                  - Lighter info text
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .text-info-dark
                  </code>{" "}
                  - Darker info text
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">.bg-info</code> -
                  Info background
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">.link</code> -
                  Standard link styling
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .link-subtle
                  </code>{" "}
                  - Subtle link styling
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Warning Orange Classes</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .text-warning
                  </code>{" "}
                  - Standard warning text
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .text-warning-light
                  </code>{" "}
                  - Lighter warning text
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .text-warning-dark
                  </code>{" "}
                  - Darker warning text
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">
                    .bg-warning
                  </code>{" "}
                  - Warning background
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Tailwind Utilities</h4>
            <p className="text-sm text-gray-600 mb-3">
              You can also use standard Tailwind utilities with the new color
              palettes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Blue:</strong>{" "}
                <code className="bg-white px-2 py-1 rounded">
                  text-blue-{50 - 900}
                </code>
                ,{" "}
                <code className="bg-white px-2 py-1 rounded">
                  bg-blue-{50 - 900}
                </code>
              </div>
              <div>
                <strong>Orange:</strong>{" "}
                <code className="bg-white px-2 py-1 rounded">
                  text-orange-{50 - 900}
                </code>
                ,{" "}
                <code className="bg-white px-2 py-1 rounded">
                  bg-orange-{50 - 900}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};
