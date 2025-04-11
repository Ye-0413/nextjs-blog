"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import "./SpotlightCard.css";

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  lightModeSpotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  darkModeSpotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor,
  lightModeSpotlightColor = "rgba(100, 116, 139, 0.25)",
  darkModeSpotlightColor = "rgba(255, 255, 255, 0.25)"
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const getSpotlightColor = () => {
    // If a general spotlightColor is provided, use it regardless of theme
    if (spotlightColor) return spotlightColor;
    
    // Otherwise, use the theme-specific colors
    return theme === 'dark' ? darkModeSpotlightColor : lightModeSpotlightColor;
  };

  // Set initial spotlight color
  useEffect(() => {
    if (divRef.current) {
      const currentSpotlightColor = getSpotlightColor();
      
      divRef.current.style.setProperty("--spotlight-color", currentSpotlightColor);
      
      // Set initial position to center
      divRef.current.style.setProperty("--mouse-x", "50%");
      divRef.current.style.setProperty("--mouse-y", "50%");
    }
  }, [theme, spotlightColor, lightModeSpotlightColor, darkModeSpotlightColor]);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", getSpotlightColor());
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className}`}
      style={{ 
        "--spotlight-color": getSpotlightColor() 
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default SpotlightCard; 