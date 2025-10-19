import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { Container, ContainerProps } from "./container";

/**
 * Section Component
 * Semantic wrapper for page sections with consistent vertical spacing
 * Automatically includes Container unless noContainer is set
 */

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /**
   * Vertical padding size
   * - sm: 4rem (64px)
   * - md: 6rem (96px)
   * - lg: 8rem (128px)
   * - xl: 10rem (160px)
   */
  spacing?: "sm" | "md" | "lg" | "xl";

  /**
   * Container size (passed to Container component)
   */
  containerSize?: ContainerProps["size"];

  /**
   * Don't wrap content in Container
   * Use when you need full control over the layout
   */
  noContainer?: boolean;

  /**
   * HTML element to render as
   */
  as?: "section" | "div" | "article" | "aside";
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      spacing = "lg",
      containerSize = "default",
      noContainer = false,
      as: Component = "section",
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      sm: "py-16",
      md: "py-24",
      lg: "py-32",
      xl: "py-40",
    };

    const content = noContainer ? (
      children
    ) : (
      <Container size={containerSize}>{children}</Container>
    );

    return (
      <Component
        ref={ref as any}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

Section.displayName = "Section";

export { Section };
