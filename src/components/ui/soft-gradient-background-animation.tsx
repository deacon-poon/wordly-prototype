import React, { useEffect } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BrandGradientAnimProps {
  className?: string;
  animationDuration?: number;
  opacity?: number;
}

const BrandGradientAnim: React.FC<BrandGradientAnimProps> = ({
  className = "",
  animationDuration = 8,
  opacity = 0.3,
}) => {
  useEffect(() => {
    // Add required CSS for the brand color gradient animation
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @property --brand-hue {
        syntax: "<angle>";
        inherits: false;
        initial-value: 180deg;
      }
      
      .brand-gradient-bg {
        background-image: 
          linear-gradient(
            135deg,
            hsl(180 45% 85% / ${opacity}),
            hsl(var(--brand-hue) 35% 80% / ${opacity}),
            hsl(140 40% 82% / ${opacity})
          ),
          linear-gradient(
            45deg,
            hsl(200 50% 88% / ${opacity * 0.7}),
            hsl(160 45% 85% / ${opacity * 0.7})
          );
        background-size: 200% 200%, 150% 150%;
        background-position: 0% 50%, 100% 50%;
        animation: brandGradientShift ${animationDuration}s ease-in-out infinite;
      }
      
      @keyframes brandGradientShift {
        0%, 100% {
          --brand-hue: 180deg;
          background-position: 0% 50%, 100% 50%;
        }
        25% {
          --brand-hue: 200deg;
          background-position: 100% 50%, 0% 50%;
        }
        50% {
          --brand-hue: 160deg;
          background-position: 50% 0%, 50% 100%;
        }
        75% {
          --brand-hue: 190deg;
          background-position: 0% 100%, 100% 0%;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [animationDuration, opacity]);

  return <div className={cn("brand-gradient-bg w-full h-full", className)} />;
};

// Keep the original component for backward compatibility
const BgradientAnim: React.FC<BrandGradientAnimProps> = (props) => {
  return <BrandGradientAnim {...props} />;
};

export { BrandGradientAnim, BgradientAnim };
