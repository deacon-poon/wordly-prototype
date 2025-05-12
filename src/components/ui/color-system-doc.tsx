import React from "react";
import { ColorPalette } from "./color-palette";
import { colorCombinations } from "../../lib/color-combinations";
import {
  oceanTealPalette,
  azureTealPalette,
  mintTealPalette,
  deepTealPalette,
  royalPaintPalette,
  coralPaintPalette,
  berryPaintPalette,
  slatePaintPalette,
  brandBlue,
} from "../../lib/color-exploration";

// Contrast indicator component from color-combinations-doc.tsx
interface ContrastIndicatorProps {
  ratio: number;
  aa: boolean;
  aaa: boolean;
}

const ContrastIndicator: React.FC<ContrastIndicatorProps> = ({
  ratio,
  aa,
  aaa,
}) => {
  const getLevel = () => {
    if (aaa) return "AAA";
    if (aa) return "AA";
    return "Fail";
  };

  const getColor = () => {
    if (aaa) return "bg-green-500";
    if (aa) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getColor()}`} />
      <span className="font-medium">{ratio.toFixed(2)}</span>
      <span className="text-sm text-muted-foreground">({getLevel()})</span>
    </div>
  );
};

// Color relationship component from color-exploration-doc.tsx
interface ColorRelationshipProps {
  name: string;
  value: string;
  relationship: string;
  textColor?: string;
}

const ColorRelationship: React.FC<ColorRelationshipProps> = ({
  name,
  value,
  relationship,
  textColor = "",
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-full h-16 rounded-md shadow-sm flex items-center justify-center ${textColor}`}
        style={{ backgroundColor: value }}
      >
        <span className="font-medium">{name}</span>
      </div>
      <div className="text-sm text-muted-foreground">{relationship}</div>
      <div className="text-xs">{value}</div>
    </div>
  );
};

// Color combination card component from color-combinations-doc.tsx
interface ColorCombinationCardProps {
  index: number;
}

const ColorCombinationCard: React.FC<ColorCombinationCardProps> = ({
  index,
}) => {
  const combo = colorCombinations[index];

  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{combo.name}</h3>
        <p className="text-sm text-muted-foreground">{combo.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div
            className="w-full h-24 rounded-md shadow-sm mb-2 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: combo.primary[5].value }}
          >
            {combo.primary[5].name}
          </div>
          <div className="text-sm mb-1">Primary</div>
          <div className="text-xs text-muted-foreground">
            {combo.primary[5].value}
          </div>
        </div>

        <div>
          <div
            className="w-full h-24 rounded-md shadow-sm mb-2 flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: combo.secondary[5].value }}
          >
            {combo.secondary[5].name}
          </div>
          <div className="text-sm mb-1">Secondary</div>
          <div className="text-xs text-muted-foreground">
            {combo.secondary[5].value}
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Accessibility Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Primary vs Secondary Contrast:</span>
            <ContrastIndicator
              ratio={combo.contrast.primarySecondary}
              aa={combo.wcag.primarySecondary.aa}
              aaa={combo.wcag.primarySecondary.aaa}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Primary on White:</span>
            <ContrastIndicator
              ratio={combo.contrast.onLight}
              aa={combo.wcag.onLight.aa}
              aaa={combo.wcag.onLight.aaa}
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Primary on Black:</span>
            <ContrastIndicator
              ratio={combo.contrast.onDark}
              aa={combo.wcag.onDark.aa}
              aaa={combo.wcag.onDark.aaa}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main tabs for color system navigation
interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="border-b mb-8">
      <div className="flex space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Consolidated Color System Documentation
export const ColorSystemDoc: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "combinations", label: "Color Combinations" },
    { id: "explorations", label: "Color Explorations" },
    { id: "accessibility", label: "Accessibility" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold mb-4">Wordly Color System</h1>
        <p className="text-lg text-muted-foreground mb-6">
          A comprehensive documentation of our color system, including brand
          colors, color combinations, explorations, and accessibility
          guidelines.
        </p>

        <div className="p-6 rounded-lg border bg-card mb-8">
          <h3 className="text-lg font-semibold mb-4">Brand Foundation Color</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <div
                className="w-full h-24 rounded-md shadow-sm flex items-center justify-center text-white"
                style={{ backgroundColor: brandBlue }}
              >
                <span className="text-lg font-medium">Brand Blue</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Base color for our design system
              </div>
              <div className="text-xs mt-1">{brandBlue}</div>
            </div>
          </div>
        </div>
      </section>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {activeTab === "overview" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Color System Overview</h2>
            <p className="text-muted-foreground mb-6">
              Our color system is built around the brand blue (#0D1E3C) and
              includes carefully crafted combinations of primary (teal/blue) and
              secondary (pink/purple) colors. All colors meet WCAG accessibility
              standards and are designed to create a cohesive brand experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Color Combinations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Four different combinations of primary and secondary colors,
                each with its own distinct personality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {colorCombinations.map((combo, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex space-x-2 h-10">
                      <div
                        className="w-1/2 rounded-l-md"
                        style={{ backgroundColor: combo.primary[5].value }}
                      />
                      <div
                        className="w-1/2 rounded-r-md"
                        style={{ backgroundColor: combo.secondary[5].value }}
                      />
                    </div>
                    <div className="text-xs font-medium">{combo.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-4">Color Explorations</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Additional palette explorations derived from our brand blue,
                offering different design directions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex space-x-2 h-10">
                    <div
                      className="w-1/2 rounded-l-md"
                      style={{ backgroundColor: oceanTealPalette[5].value }}
                    />
                    <div
                      className="w-1/2 rounded-r-md"
                      style={{ backgroundColor: azureTealPalette[5].value }}
                    />
                  </div>
                  <div className="text-xs font-medium">Teal Variants</div>
                </div>
                <div className="space-y-2">
                  <div className="flex space-x-2 h-10">
                    <div
                      className="w-1/2 rounded-l-md"
                      style={{ backgroundColor: coralPaintPalette[5].value }}
                    />
                    <div
                      className="w-1/2 rounded-r-md"
                      style={{ backgroundColor: berryPaintPalette[5].value }}
                    />
                  </div>
                  <div className="text-xs font-medium">Pink Variants</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Color Usage Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Primary Colors</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Main navigation elements</li>
                  <li>Buttons and key interactive elements</li>
                  <li>Headers and important UI elements</li>
                  <li>Progress indicators</li>
                  <li>Active states</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Secondary Colors</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Accents and highlights</li>
                  <li>Secondary actions</li>
                  <li>Selection states</li>
                  <li>Important supporting elements</li>
                  <li>Hover and focus states</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Accessibility</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>All base colors meet WCAG AA standards</li>
                  <li>Use proper contrast for text elements</li>
                  <li>Consider color blindness in your designs</li>
                  <li>Never rely on color alone to convey meaning</li>
                  <li>Test designs with accessibility tools</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "combinations" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Primary & Secondary Color Combinations
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on the brand blue (#0D1E3C), we've created four different
              combinations of primary (teal/blue) and secondary (pink/purple)
              colors. Each combination meets WCAG accessibility standards for
              contrast ratios and provides a distinct branded experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1, 2, 3].map((index) => (
              <ColorCombinationCard key={index} index={index} />
            ))}
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Using Color Combinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Primary Color Usage</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Main navigation elements</li>
                  <li>Buttons and key interactive elements</li>
                  <li>Headers and important UI elements</li>
                  <li>Progress indicators</li>
                  <li>Active states</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Secondary Color Usage</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Accents and highlights</li>
                  <li>Secondary actions</li>
                  <li>Selection states</li>
                  <li>Important supporting elements</li>
                  <li>Hover and focus states</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "explorations" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Color Exploration: Brand Blue Derivatives
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on the brand blue (#0D1E3C), we've created several color
              variations to explore different visual directions. This section
              presents teal and pink color families, each offering a distinct
              personality while maintaining a relationship to the original brand
              blue.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Teal Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Ocean Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A cooler, deeper teal with blue undertones that evokes depth
                  and stability.
                </p>
                <ColorRelationship
                  name="Ocean Teal 500"
                  value={oceanTealPalette[5].value}
                  relationship="Adds aquatic blue qualities while maintaining depth"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Azure Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A brighter, more vibrant teal with high saturation that feels
                  energetic and modern.
                </p>
                <ColorRelationship
                  name="Azure Teal 500"
                  value={azureTealPalette[5].value}
                  relationship="Increases brightness and vibrancy for a more digital feel"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Mint Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A green-leaning teal that feels fresh, natural, and organic.
                </p>
                <ColorRelationship
                  name="Mint Teal 500"
                  value={mintTealPalette[5].value}
                  relationship="Shifts toward green for a fresher, more natural feel"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Deep Teal</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A darker teal with blue-black undertones that conveys elegance
                  and sophistication.
                </p>
                <ColorRelationship
                  name="Deep Teal 500"
                  value={deepTealPalette[5].value}
                  relationship="Maintains depth with a teal hue shift and darker presence"
                  textColor="text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Pink Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Royal Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A purple-leaning pink with rich, royal tones that suggest
                  creativity and imagination.
                </p>
                <ColorRelationship
                  name="Royal Paint 500"
                  value={royalPaintPalette[5].value}
                  relationship="Shifts toward purple while maintaining depth and richness"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Coral Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A warm, reddish pink with energetic tones that convey passion
                  and warmth.
                </p>
                <ColorRelationship
                  name="Coral Paint 500"
                  value={coralPaintPalette[5].value}
                  relationship="Introduces warmth and energy with a red shift"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Berry Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A cooler, blue-purple pink with berry-like qualities that
                  suggest elegance and luxury.
                </p>
                <ColorRelationship
                  name="Berry Paint 500"
                  value={berryPaintPalette[5].value}
                  relationship="Combines blue undertones with magenta for a rich berry tone"
                  textColor="text-white"
                />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="text-lg font-semibold mb-2">Slate Paint</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A neutral, gray-blue pink that feels more subdued and
                  professional.
                </p>
                <ColorRelationship
                  name="Slate Paint 500"
                  value={slatePaintPalette[5].value}
                  relationship="Desaturates the blue for a more neutral, business-like tone"
                  textColor="text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Color Selection Considerations
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Brand Personality:</strong> Consider which color palette
                best represents the brand's personality and values.
              </li>
              <li>
                <strong>User Perception:</strong> Different color palettes may
                evoke different emotional responses from users.
              </li>
              <li>
                <strong>Application Context:</strong> Consider the context where
                these colors will be applied (website, app, print materials).
              </li>
              <li>
                <strong>Accessibility:</strong> All base colors (500) have been
                tested for contrast against white text, meeting WCAG AA
                standards.
              </li>
              <li>
                <strong>Differentiation:</strong> Consider how the color will
                differentiate from competitors in the market.
              </li>
            </ul>
          </div>
        </section>
      )}

      {activeTab === "accessibility" && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Accessibility Guidelines
            </h2>
            <p className="text-muted-foreground mb-6">
              Our color system is designed with accessibility in mind. All
              colors have been tested for contrast ratios and WCAG compliance to
              ensure they can be used in accessible designs.
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              WCAG Contrast Guidelines
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  Contrast Ratio Requirements
                </h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Level AA:</strong> Requires a contrast ratio of at
                    least 4.5:1 for normal text and 3:1 for large text.
                  </li>
                  <li>
                    <strong>Level AAA:</strong> Requires a contrast ratio of at
                    least 7:1 for normal text and 4.5:1 for large text.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Color Contrast Indicators</h4>
                <div className="flex space-x-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">AAA (7.0+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">AA (4.5-7.0)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">Fail (&lt;4.5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Accessible Color Usage
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Text Legibility</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Always ensure sufficient contrast between text and its
                    background
                  </li>
                  <li>
                    Use darker shades (600-900) for text on light backgrounds
                  </li>
                  <li>
                    Use lighter shades (50-200) for text on dark backgrounds
                  </li>
                  <li>Avoid placing text on busy patterns or gradients</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  UI Component Considerations
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    Ensure interactive elements have at least 3:1 contrast with
                    surroundings
                  </li>
                  <li>
                    Use additional indicators beyond color for state changes
                    (icons, text, etc.)
                  </li>
                  <li>
                    Test designs with grayscale filters to ensure information is
                    not lost
                  </li>
                  <li>
                    Consider color blindness when creating data visualizations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Color Combinations Accessibility
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The following table shows the accessibility status of our
                primary color combinations:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Combination</th>
                      <th className="text-left py-2 px-4">Primary on White</th>
                      <th className="text-left py-2 px-4">Primary on Black</th>
                      <th className="text-left py-2 px-4">
                        Primary vs Secondary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorCombinations.map((combo, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">{combo.name}</td>
                        <td className="py-2 px-4">
                          <ContrastIndicator
                            ratio={combo.contrast.onLight}
                            aa={combo.wcag.onLight.aa}
                            aaa={combo.wcag.onLight.aaa}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <ContrastIndicator
                            ratio={combo.contrast.onDark}
                            aa={combo.wcag.onDark.aa}
                            aaa={combo.wcag.onDark.aaa}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <ContrastIndicator
                            ratio={combo.contrast.primarySecondary}
                            aa={combo.wcag.primarySecondary.aa}
                            aaa={combo.wcag.primarySecondary.aaa}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ColorSystemDoc;
