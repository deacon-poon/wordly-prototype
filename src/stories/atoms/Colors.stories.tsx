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
 * It includes the primary brand colors (teal, navy, and accent green), along with green and red
 * for affirmative and destructive actions, and a gray scale for UI elements.
 *
 * Each color has 10 shades, labeled from 50 (lightest) to 900 (darkest).
 *
 * ## Brand Colors
 * - **Primary Teal (#128197)**: Main brand color for primary actions and navigation
 * - **Secondary Navy (#0BaC3A)**: Secondary brand color for depth and contrast
 * - **Accent Green (#28E6B6)**: Accent color for highlights and interactive elements
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
            title="Primary Teal Palette"
            description="Primary brand color used for navigation, primary buttons, and key UI elements."
            colors={[
              { name: "Teal 50", value: "#E0F8F8" },
              { name: "Teal 100", value: "#B3EFEF" },
              { name: "Teal 200", value: "#80E5E5" },
              { name: "Teal 300", value: "#4DD8D8" },
              { name: "Teal 400", value: "#26C7CC" },
              { name: "Teal 500", value: "#128197" },
              { name: "Teal 600", value: "#0F7287" },
              { name: "Teal 700", value: "#0C6377" },
              { name: "Teal 800", value: "#095466" },
              { name: "Teal 900", value: "#064556" },
            ]}
          />

          <ColorSet
            title="Secondary Navy Palette"
            description="Secondary brand color used for depth, contrast, and supporting elements."
            colors={[
              { name: "Navy 50", value: "#E8EDF5" },
              { name: "Navy 100", value: "#C5D3E8" },
              { name: "Navy 200", value: "#9BB4D9" },
              { name: "Navy 300", value: "#6688C4" },
              { name: "Navy 400", value: "#3A5FAF" },
              { name: "Navy 500", value: "#0B1C3A" },
              { name: "Navy 600", value: "#091731" },
              { name: "Navy 700", value: "#071228" },
              { name: "Navy 800", value: "#050E1F" },
              { name: "Navy 900", value: "#030916" },
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
        <div className="space-y-10">
          <ColorSet
            title="Success Green Palette"
            description="Used for affirmative actions, success states, and approvals."
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
            title="Error Red Palette"
            description="Used for destructive actions, errors, and warnings."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary-teal-500 mb-2">
              Primary Teal
            </h3>
            <p className="text-sm text-gray-600">
              Use for primary buttons, navigation, and key brand elements.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-secondary-navy-500 mb-2">
              Secondary Navy
            </h3>
            <p className="text-sm text-gray-600">
              Use for secondary actions, headings, and supporting content.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-accent-green-500 mb-2">
              Accent Green
            </h3>
            <p className="text-sm text-gray-600">
              Use for links, highlights, and interactive feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  ),
};
