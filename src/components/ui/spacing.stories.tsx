import type { Meta, StoryObj } from "@storybook/react";
import { SpacingGrid, SpacingRow } from "./spacing";

const meta: Meta<typeof SpacingGrid> = {
  title: "Design System/Foundation/Spacing",
  component: SpacingGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SpacingGrid>;

export const SpacingSystem: Story = {
  render: () => (
    <div className="space-y-12">
      <SpacingGrid
        title="Spacing Scale"
        description="The spacing scale is a key part of our design system, used for margin, padding, gap, and layout sizes."
      >
        <SpacingRow
          title="Extra Small (px)"
          description="Used for tight spacing within components"
          values={[0, 1, 2, 3, 4]}
        />
        <SpacingRow
          title="Small (xs)"
          description="For small gaps and padding within compact components"
          values={[5, 6, 7, 8]}
        />
        <SpacingRow
          title="Medium (sm)"
          description="For medium spacing between related components"
          values={[9, 10, 11, 12]}
        />
        <SpacingRow
          title="Large (md)"
          description="For generous spacing between unrelated components"
          values={[14, 16, 20, 24]}
        />
        <SpacingRow
          title="Extra Large (lg)"
          description="For major layout sections"
          values={[28, 32, 36, 40]}
        />
        <SpacingRow
          title="2XL and 3XL (xl, 2xl)"
          description="For page-level spacing"
          values={[48, 56, 64, 72, 80]}
        />
      </SpacingGrid>

      <SpacingGrid
        title="Usage Guidelines"
        description="How to apply spacing consistently across different contexts"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">
              Component Internal Spacing
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <strong>Extra Small (1-4):</strong> For tight spacing within
                compact components (button padding, input field padding)
              </li>
              <li>
                <strong>Small (5-8):</strong> Standard padding inside components
                and between closely related elements
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Component Gaps</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <strong>Small to Medium (4-12):</strong> Space between related
                items (form fields, list items)
              </li>
              <li>
                <strong>Medium (9-12):</strong> Space between components within
                the same section
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Section Spacing</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <strong>Large (14-24):</strong> Space between different sections
                or content blocks
              </li>
              <li>
                <strong>Extra Large (28-40):</strong> Major layout sections and
                container padding
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Page Spacing</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <strong>2XL and 3XL (48-80):</strong> Page padding, large
                section dividers, and major layout spacing
              </li>
            </ul>
          </div>
        </div>
      </SpacingGrid>

      <SpacingGrid
        title="Responsive Adaptation"
        description="How spacing should adapt across different screen sizes"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Mobile (sm)</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Reduce container padding to 4-8 units</li>
              <li>Reduce spacing between sections by ~25%</li>
              <li>Maintain component internal spacing for touch targets</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Tablet (md)</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Use medium container padding (8-12 units)</li>
              <li>Scale section spacing proportionally</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Desktop (lg+)</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>Use full spacing scale as defined</li>
              <li>
                Consider larger container padding (16-24) for wide screens
              </li>
            </ul>
          </div>
        </div>
      </SpacingGrid>
    </div>
  ),
};
