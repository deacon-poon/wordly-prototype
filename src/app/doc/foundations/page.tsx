import { ColorPalette } from "@/components/ui/color-palette";
import { Typography } from "@/components/ui/typography";
import {
  DesignTokens,
  TokenCategory,
  Token,
} from "@/components/ui/design-tokens";
import { SpacingGrid, SpacingRow } from "@/components/ui/spacing";
import { Section } from "../_components/showcase";

export default function FoundationsPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Foundations
        </h1>
        <p className="text-sm text-muted-foreground">
          Core design primitives: brand color, type scale, semantic tokens and
          spacing.
        </p>
      </header>

      <Section
        id="colors"
        title="Colors"
        description="Brand palettes are defined in tailwind.config.js. Use the named scales (primary-blue-*, accent-green-*, action-teal-*) rather than raw hex."
      >
        <ColorPalette
          title="Brand Blue (primary)"
          description="primary-blue-* — the primary brand color (base 500)."
          colors={[
            { name: "blue-50", value: "#D6E8FF" },
            { name: "blue-200", value: "#75B8FF" },
            { name: "blue-400", value: "#017CFF" },
            { name: "blue-500", value: "#0063CC" },
            { name: "blue-700", value: "#00458F" },
          ]}
        />
        <ColorPalette
          title="Accent Green (secondary)"
          description="accent-green-* — secondary brand color (base 500)."
          colors={[
            { name: "green-50", value: "#DAF8E5" },
            { name: "green-200", value: "#84F1A2" },
            { name: "green-400", value: "#1BE454" },
            { name: "green-500", value: "#15B743" },
            { name: "green-700", value: "#0F802F" },
          ]}
        />
        <ColorPalette
          title="Action Teal"
          description="action-teal-* — interactive / action accents (base 600)."
          colors={[
            { name: "teal-100", value: "#BBEDFA" },
            { name: "teal-300", value: "#49CFE9" },
            { name: "teal-500", value: "#169CB6" },
            { name: "teal-600", value: "#128197" },
            { name: "teal-800", value: "#0A4652" },
          ]}
        />
        <ColorPalette
          title="Semantic"
          description="Status colors for success, error, warning and info states."
          colors={[
            { name: "success-500", value: "#0c9a4e" },
            { name: "error-500", value: "#e62d21" },
            { name: "orange-500", value: "#f97316" },
            { name: "blue-info-500", value: "#2463eb" },
            { name: "gray-500", value: "#646e78" },
          ]}
        />
      </Section>

      <Section
        id="typography"
        title="Typography"
        description="The Typography component (variant prop) renders semantic text styles. Roboto is the global sans font."
      >
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="lead">
            Lead — a slightly larger muted intro paragraph for section openers.
          </Typography>
          <Typography variant="p">
            Paragraph — the default body style with comfortable line height for
            extended reading.
          </Typography>
          <Typography variant="large">Large text</Typography>
          <Typography variant="small">Small text</Typography>
          <Typography variant="muted">Muted helper text</Typography>
          <Typography variant="blockquote">
            “A blockquote variant for pulled quotes.”
          </Typography>
          <Typography variant="code">inline code</Typography>
        </div>
      </Section>

      <Section
        id="tokens"
        title="Design Tokens"
        description="Semantic CSS variables that map to the active theme. Prefer these over hard-coded values for theme-aware UI."
      >
        <DesignTokens
          title="Surface & Text Tokens"
          description="Used by most components for backgrounds, foregrounds and borders."
        >
          <TokenCategory
            title="Surfaces"
            description="Background and container colors."
          >
            <Token
              name="background"
              value="var(--background)"
              description="App background"
              preview={
                <div className="h-12 w-12 rounded-md border border-border bg-background" />
              }
            />
            <Token
              name="card"
              value="var(--card)"
              description="Raised surface / cards"
              preview={
                <div className="h-12 w-12 rounded-md border border-border bg-card" />
              }
            />
            <Token
              name="muted"
              value="var(--muted)"
              description="Subtle fills"
              preview={
                <div className="h-12 w-12 rounded-md border border-border bg-muted" />
              }
            />
            <Token
              name="primary"
              value="var(--primary)"
              description="Primary actions"
              preview={<div className="h-12 w-12 rounded-md bg-primary" />}
            />
          </TokenCategory>
          <TokenCategory title="Radii" description="Corner radius scale.">
            <Token
              name="rounded-sm"
              value="calc(var(--radius) - 4px)"
              preview={
                <div className="h-12 w-12 rounded-sm bg-primary-blue-200" />
              }
            />
            <Token
              name="rounded-md"
              value="calc(var(--radius) - 2px)"
              preview={
                <div className="h-12 w-12 rounded-md bg-primary-blue-200" />
              }
            />
            <Token
              name="rounded-lg"
              value="var(--radius)"
              preview={
                <div className="h-12 w-12 rounded-lg bg-primary-blue-200" />
              }
            />
          </TokenCategory>
        </DesignTokens>
      </Section>

      <Section
        id="spacing"
        title="Spacing"
        description="The spacing scale (Tailwind units, 1 unit = 4px). Use consistent steps for padding, gaps and margins."
      >
        <SpacingGrid
          title="Spacing Scale"
          description="Common spacing tokens used across layouts and components."
        >
          <SpacingRow
            title="Tight"
            description="For dense UI — chips, inline controls."
            values={[1, 2, 3, 4]}
          />
          <SpacingRow
            title="Standard"
            description="Component padding and stack gaps."
            values={[6, 8, 10, 12]}
          />
          <SpacingRow
            title="Layout"
            description="Section and page-level spacing."
            values={[16, 20, 24]}
          />
        </SpacingGrid>
      </Section>
    </div>
  );
}
