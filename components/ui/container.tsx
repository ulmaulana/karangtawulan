import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

/**
 * Container Component
 * Provides consistent max-width and horizontal padding across all sections
 * Follows an 8pt spacing scale and responsive breakpoints
 */

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Width variant
   * - default: Standard content width (max-w-7xl)
   * - narrow: Narrower for focused content (max-w-4xl)
   * - wide: Full bleed with padding (max-w-screen-2xl)
   */
  size?: "default" | "narrow" | "wide";

  /**
   * Remove horizontal padding
   * Useful for full-width child elements
   */
  noPadding?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full",
          !noPadding && "px-4 sm:px-6 lg:px-8",
          {
            "max-w-7xl": size === "default",
            "max-w-4xl": size === "narrow",
            "max-w-screen-2xl": size === "wide",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

export { Container };
