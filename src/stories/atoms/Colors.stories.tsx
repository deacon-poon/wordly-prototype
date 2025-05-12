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
  title: "Atoms/Colors",
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
 * It includes the primary brand colors (teal and pink), along with green and red
 * for affirmative and destructive actions, and a gray scale for UI elements.
 *
 * Each color has 10 shades, labeled from 50 (lightest) to 900 (darkest).
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
            title="Teal Palette"
            description="Primary brand color used for UI elements, buttons, and links."
            colors={[
              { name: "Teal 50", value: "#E6F4F7" },
              { name: "Teal 100", value: "#C5E8EE" },
              { name: "Teal 200", value: "#9ED2DC" },
              { name: "Teal 300", value: "#5CB9CA" },
              { name: "Teal 400", value: "#30A3B7" },
              { name: "Teal 500", value: "#118197", textColor: "text-white" },
              { name: "Teal 600", value: "#0C687A", textColor: "text-white" },
              { name: "Teal 700", value: "#08505D", textColor: "text-white" },
              { name: "Teal 800", value: "#063840", textColor: "text-white" },
              { name: "Teal 900", value: "#021F24", textColor: "text-white" },
            ]}
          />

          <ColorSet
            title="Pink Palette"
            description="Secondary brand color used for accents and highlights."
            colors={[
              { name: "Pink 50", value: "#FCE6F1" },
              { name: "Pink 100", value: "#F9BFD9" },
              { name: "Pink 200", value: "#F693C1" },
              { name: "Pink 300", value: "#F367A9", textColor: "text-white" },
              { name: "Pink 400", value: "#F13B91", textColor: "text-white" },
              { name: "Pink 500", value: "#E0007B", textColor: "text-white" },
              { name: "Pink 600", value: "#B30062", textColor: "text-white" },
              { name: "Pink 700", value: "#85004A", textColor: "text-white" },
              { name: "Pink 800", value: "#570031", textColor: "text-white" },
              { name: "Pink 900", value: "#290019", textColor: "text-white" },
            ]}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Semantic Colors</h2>
        <div className="space-y-10">
          <ColorSet
            title="Green Palette"
            description="Used for affirmative actions, success states, and approvals."
            colors={[
              { name: "Green 50", value: "#E6F6EC" },
              { name: "Green 100", value: "#C5E8D2" },
              { name: "Green 200", value: "#9CD7B0" },
              { name: "Green 300", value: "#66C188" },
              { name: "Green 400", value: "#34AD67", textColor: "text-white" },
              { name: "Green 500", value: "#0C9A4E", textColor: "text-white" },
              { name: "Green 600", value: "#0A7B3F", textColor: "text-white" },
              { name: "Green 700", value: "#085D2F", textColor: "text-white" },
              { name: "Green 800", value: "#053E20", textColor: "text-white" },
              { name: "Green 900", value: "#021F10", textColor: "text-white" },
            ]}
          />

          <ColorSet
            title="Red Palette"
            description="Used for destructive actions, errors, and warnings."
            colors={[
              { name: "Red 50", value: "#FCEBEA" },
              { name: "Red 100", value: "#F9CFCC" },
              { name: "Red 200", value: "#F5A8A2" },
              { name: "Red 300", value: "#F07870", textColor: "text-white" },
              { name: "Red 400", value: "#EA4F45", textColor: "text-white" },
              { name: "Red 500", value: "#E62D21", textColor: "text-white" },
              { name: "Red 600", value: "#B8221A", textColor: "text-white" },
              { name: "Red 700", value: "#8A1A13", textColor: "text-white" },
              { name: "Red 800", value: "#5C110D", textColor: "text-white" },
              { name: "Red 900", value: "#2E0906", textColor: "text-white" },
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
              { name: "Gray 500", value: "#646E78", textColor: "text-white" },
              { name: "Gray 600", value: "#495057", textColor: "text-white" },
              { name: "Gray 700", value: "#343A40", textColor: "text-white" },
              { name: "Gray 800", value: "#212529", textColor: "text-white" },
              { name: "Gray 900", value: "#121416", textColor: "text-white" },
            ]}
          />
        </div>
      </section>
    </div>
  ),
};
