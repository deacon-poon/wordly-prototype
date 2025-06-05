import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Design System/Typography",
  component: Typography,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Typography System

Wordly's typography system ensures consistent, accessible, and beautiful text across our products. Our type scale is designed to create clear visual hierarchy while maintaining excellent readability across all devices and use cases.

## Font Stack
- **Primary**: Roboto (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 700 (Bold)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Display**: Swap (optimized loading)

## Design Principles
- **Clarity**: Every text element should be easy to read and understand
- **Hierarchy**: Clear distinction between content levels
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios
- **Consistency**: Unified spacing and sizing across all components

## Usage Guidelines
- Use semantic HTML elements when possible
- Maintain consistent line-height for readability
- Consider mobile-first responsive design
- Test with screen readers and accessibility tools
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "lead",
        "large",
        "small",
        "muted",
        "blockquote",
        "code",
        "link",
      ],
      description: "Typography variant to display",
    },
    children: {
      control: "text",
      description: "Content to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// Individual variants for testing
export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "Heading 1",
  },
  parameters: {
    docs: {
      description: {
        story: "Primary page title. Use sparingly - typically one per page.",
      },
    },
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "Heading 2",
  },
  parameters: {
    docs: {
      description: {
        story: "Section headings. Use for major content divisions.",
      },
    },
  },
};

export const Heading3: Story = {
  args: {
    variant: "h3",
    children: "Heading 3",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Subsection headings. Use for content organization within sections.",
      },
    },
  },
};

export const Heading4: Story = {
  args: {
    variant: "h4",
    children: "Heading 4",
  },
};

export const Heading5: Story = {
  args: {
    variant: "h5",
    children: "Heading 5",
  },
};

export const Heading6: Story = {
  args: {
    variant: "h6",
    children: "Heading 6",
  },
};

export const Paragraph: Story = {
  args: {
    variant: "p",
    children:
      "This is a paragraph with body text styling. It's optimized for readability with appropriate line-height and spacing. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  parameters: {
    docs: {
      description: {
        story: "Default body text. Use for all standard content.",
      },
    },
  },
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children:
      "This is lead text, used for introductory paragraphs or important information that needs more emphasis than regular body text.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Lead paragraph. Use for article introductions or important callouts.",
      },
    },
  },
};

export const Large: Story = {
  args: {
    variant: "large",
    children: "This is large text, used for emphasis.",
  },
};

export const Small: Story = {
  args: {
    variant: "small",
    children: "This is small text, used for captions or secondary information.",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "This is muted text, used for secondary information.",
  },
};

export const Blockquote: Story = {
  args: {
    variant: "blockquote",
    children:
      "A powerful translation platform that breaks down language barriers in real-time communication.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Taglines, descriptions, or emphasized secondary text. Perfect for subtitles and explanatory content.",
      },
    },
  },
};

export const Code: Story = {
  args: {
    variant: "code",
    children: "console.log('Hello world!')",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "This is a link",
    component: "a",
    href: "#",
  },
};

// Comprehensive typography showcase
export const CompleteTypeScale: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 pb-8 border-b">
        <Typography variant="h1" className="text-primary">
          Wordly Typography System
        </Typography>
        <Typography variant="lead" className="max-w-2xl mx-auto">
          A comprehensive type scale designed for clarity, accessibility, and
          beautiful user experiences across all Wordly products.
        </Typography>
      </div>

      {/* Font Information */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <Typography variant="h3">Font Information</Typography>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Typography
              variant="small"
              className="font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Primary Font
            </Typography>
            <Typography variant="large" className="font-semibold">
              Roboto
            </Typography>
            <Typography variant="small" className="text-muted-foreground">
              Geometric, friendly, and highly legible
            </Typography>
          </div>
          <div>
            <Typography
              variant="small"
              className="font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Fallback Stack
            </Typography>
            <Typography variant="code" className="text-xs">
              -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
            </Typography>
          </div>
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-8">
        <Typography variant="h2" className="border-b pb-2">
          Headings
        </Typography>

        {[
          {
            variant: "h1",
            text: "Heading 1",
            size: "3rem (48px)",
            weight: "800 (Extra Bold)",
            usage: "Page titles, hero headings",
          },
          {
            variant: "h2",
            text: "Heading 2",
            size: "2.25rem (36px)",
            weight: "700 (Bold)",
            usage: "Section headings",
          },
          {
            variant: "h3",
            text: "Heading 3",
            size: "1.875rem (30px)",
            weight: "600 (Semi Bold)",
            usage: "Subsection headings",
          },
          {
            variant: "h4",
            text: "Heading 4",
            size: "1.5rem (24px)",
            weight: "600 (Semi Bold)",
            usage: "Content group headings",
          },
          {
            variant: "h5",
            text: "Heading 5",
            size: "1.25rem (20px)",
            weight: "600 (Semi Bold)",
            usage: "Small section headings",
          },
          {
            variant: "h6",
            text: "Heading 6",
            size: "1rem (16px)",
            weight: "600 (Semi Bold)",
            usage: "Inline headings",
          },
        ].map(({ variant, text, size, weight, usage }) => (
          <div
            key={variant}
            className="group hover:bg-muted/50 p-4 rounded-lg transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <Typography variant={variant as any}>{text}</Typography>
              </div>
              <div className="text-right space-y-1 lg:w-80">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Size:</span>
                  <Typography variant="code" className="text-xs">
                    {size}
                  </Typography>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Weight:</span>
                  <Typography variant="code" className="text-xs">
                    {weight}
                  </Typography>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Usage:</span>
                  <Typography variant="small" className="text-right max-w-48">
                    {usage}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Body Text */}
      <div className="space-y-8">
        <Typography variant="h2" className="border-b pb-2">
          Body Text
        </Typography>

        <div className="space-y-6">
          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="lead">
                Lead text is used for introductory paragraphs, important
                callouts, or content that needs more emphasis than regular body
                text. It's larger and more prominent.
              </Typography>
              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                <div>
                  Size:{" "}
                  <Typography variant="code" className="text-xs">
                    1.25rem (20px)
                  </Typography>
                </div>
                <div>
                  Weight:{" "}
                  <Typography variant="code" className="text-xs">
                    400 (Regular)
                  </Typography>
                </div>
                <div>
                  Usage:{" "}
                  <Typography variant="small">
                    Article intros, callouts
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="p">
                This is standard body text used for most content. It's optimized
                for readability with appropriate line-height (1.75) and spacing.
                Use this for articles, descriptions, and general content
                throughout the application.
              </Typography>
              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                <div>
                  Size:{" "}
                  <Typography variant="code" className="text-xs">
                    1rem (16px)
                  </Typography>
                </div>
                <div>
                  Weight:{" "}
                  <Typography variant="code" className="text-xs">
                    400 (Regular)
                  </Typography>
                </div>
                <div>
                  Usage:{" "}
                  <Typography variant="small">Default content text</Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="large">
                Large text is used for emphasis within content, important
                statements, or when you need text slightly larger than body text
                but smaller than a heading.
              </Typography>
              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                <div>
                  Size:{" "}
                  <Typography variant="code" className="text-xs">
                    1.125rem (18px)
                  </Typography>
                </div>
                <div>
                  Weight:{" "}
                  <Typography variant="code" className="text-xs">
                    600 (Semi Bold)
                  </Typography>
                </div>
                <div>
                  Usage:{" "}
                  <Typography variant="small">Emphasis, highlights</Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="small">
                Small text is used for captions, metadata, secondary
                information, or when space is limited. Ensure sufficient
                contrast when using small text.
              </Typography>
              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                <div>
                  Size:{" "}
                  <Typography variant="code" className="text-xs">
                    0.875rem (14px)
                  </Typography>
                </div>
                <div>
                  Weight:{" "}
                  <Typography variant="code" className="text-xs">
                    500 (Medium)
                  </Typography>
                </div>
                <div>
                  Usage:{" "}
                  <Typography variant="small">Captions, metadata</Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="muted">
                Muted text is used for secondary information, subtle text, or
                when you need to de-emphasize content. Always ensure adequate
                contrast ratios.
              </Typography>
              <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
                <div>
                  Size:{" "}
                  <Typography variant="code" className="text-xs">
                    0.875rem (14px)
                  </Typography>
                </div>
                <div>
                  Weight:{" "}
                  <Typography variant="code" className="text-xs">
                    400 (Regular)
                  </Typography>
                </div>
                <div>
                  Usage:{" "}
                  <Typography variant="small">
                    Secondary info, helpers
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Elements */}
      <div className="space-y-8">
        <Typography variant="h2" className="border-b pb-2">
          Special Elements
        </Typography>

        <div className="space-y-6">
          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="blockquote">
                Perfect for taglines, subtitles, and descriptive text that
                accompanies headlines or provides context.
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                — Usage: Taglines, descriptions, emphasized secondary text
              </Typography>
            </div>
          </div>

          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography variant="code">
                console.log('Code text is used for inline code snippets');
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Usage: Inline code, variable names, technical references
              </Typography>
            </div>
          </div>

          <div className="group hover:bg-muted/50 p-4 rounded-lg transition-colors">
            <div className="space-y-4">
              <Typography
                variant="link"
                component="a"
                href="#"
                className="no-underline hover:underline"
              >
                This is a link with proper styling and accessibility
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                Usage: Navigation, external references, interactive text
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-8">
        <Typography variant="h2" className="border-b pb-2">
          Real-World Usage Examples
        </Typography>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 p-6 border rounded-lg">
            <Typography variant="h3">Article Layout</Typography>
            <Typography variant="blockquote">
              Understanding how typography creates hierarchy and improves
              readability in modern web applications.
            </Typography>
            <Typography variant="lead">
              This is how typography works in a typical article or blog post
              layout.
            </Typography>
            <Typography variant="p">
              The lead paragraph introduces the content with emphasis. Following
              paragraphs use standard body text for optimal readability.
            </Typography>
            <Typography variant="h4">Subsection Heading</Typography>
            <Typography variant="p">
              Content continues with proper hierarchy and spacing.{" "}
              <Typography variant="link" component="a" href="#">
                Links are clearly distinguishable
              </Typography>{" "}
              and <Typography variant="code">code snippets</Typography> are
              properly formatted.
            </Typography>
            <Typography variant="small" className="text-muted-foreground">
              Published 2 hours ago • 5 min read
            </Typography>
          </div>

          <div className="space-y-4 p-6 border rounded-lg">
            <Typography variant="h3">Dashboard Layout</Typography>
            <Typography variant="large">
              Key metrics and important data
            </Typography>
            <Typography variant="p">
              Standard descriptions and explanatory text help users understand
              the interface.
            </Typography>
            <div className="space-y-2">
              <Typography variant="small" className="font-semibold">
                Labels and metadata
              </Typography>
              <Typography variant="muted">
                Secondary information and helpers
              </Typography>
            </div>
            <Typography variant="blockquote">
              Transform global communication with real-time language
              intelligence.
            </Typography>
          </div>
        </div>
      </div>

      {/* Accessibility Notes */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 space-y-4">
        <Typography variant="h3" className="text-blue-900 dark:text-blue-100">
          Accessibility Guidelines
        </Typography>
        <div className="space-y-3 text-blue-800 dark:text-blue-200">
          <Typography variant="p">
            • All text meets WCAG 2.1 AA contrast requirements (4.5:1 for normal
            text, 3:1 for large text)
          </Typography>
          <Typography variant="p">
            • Semantic HTML elements are used for proper screen reader
            navigation
          </Typography>
          <Typography variant="p">
            • Font sizes are responsive and scale appropriately on different
            devices
          </Typography>
          <Typography variant="p">
            • Line height and spacing optimize readability for users with
            dyslexia
          </Typography>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete typography system showcase with font information, usage guidelines, and real-world examples.",
      },
    },
  },
};

// Interactive playground
export const Interactive: Story = {
  args: {
    variant: "h1",
    children: "Try different variants and content here",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground to test different typography variants and content.",
      },
    },
  },
};
