import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Import ColorVariant interface from color-palette
import { ColorVariant } from "./color-palette";

// ColorVariant interface (imported from color-palette)
interface ColorVariantLocal {
  name: string;
  value: string;
  contrast?: {
    white: number;
    black: number;
  };
  wcag?: {
    aa: boolean;
    aaa: boolean;
  };
}

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      label: "text-sm font-medium leading-none",
      blockquote: "text-lg text-muted-foreground italic leading-relaxed",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      link: "font-medium text-primary underline underline-offset-4",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  component?: keyof JSX.IntrinsicElements;
  href?: string;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ children, className, variant, component, href, ...props }, ref) => {
    const Component =
      component ||
      ((variant === "h1"
        ? "h1"
        : variant === "h2"
        ? "h2"
        : variant === "h3"
        ? "h3"
        : variant === "h4"
        ? "h4"
        : variant === "h5"
        ? "h5"
        : variant === "h6"
        ? "h6"
        : variant === "blockquote"
        ? "blockquote"
        : variant === "code"
        ? "code"
        : variant === "link"
        ? "a"
        : "p") as keyof JSX.IntrinsicElements);

    const additionalProps: Record<string, any> = {};
    if (Component === "a" && href) {
      additionalProps.href = href;
    }

    return React.createElement(
      Component,
      {
        className: cn(typographyVariants({ variant }), className),
        ref,
        ...additionalProps,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";

export { typographyVariants };
