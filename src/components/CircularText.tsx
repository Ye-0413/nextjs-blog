"use client";

import React, { useEffect, useState, useId } from "react";
import "./CircularText.css";

interface CircularTextProps {
  text: string;
  className?: string;
  radius?: number;
  delay?: number;
  duration?: number;
}

export default function CircularText({
  text,
  className = "",
  radius = 120,
  delay = 0,
  duration = 30000,
}: CircularTextProps) {
  const [isMounted, setIsMounted] = useState(false);
  const uniqueId = useId();
  
  // Set mounted state after component mounts to handle SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use a simple server-side rendering approach
  // During SSR, render nothing substantial to avoid hydration issues
  if (!isMounted) {
    return (
      <div className={`circular-text ${className}`} style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}>
        {/* Empty during SSR */}
      </div>
    );
  }
  
  const letters = text.split('');
  const angleStep = 360 / letters.length;
  
  return (
    <div 
      className={`circular-text ${className}`} 
      style={{ 
        width: `${radius * 2}px`, 
        height: `${radius * 2}px`,
        animation: `rotate ${duration / 1000}s linear infinite`,
        animationDelay: `${delay}ms`,
      }}
    >
      {letters.map((char, index) => {
        // Calculate angle for this letter around the circle
        const angle = angleStep * index;
        
        // Calculate position on the circle
        const angleRad = (angle - 90) * (Math.PI / 180); // Start at the top
        const x = Math.floor(radius * Math.cos(angleRad));
        const y = Math.floor(radius * Math.sin(angleRad));
        
        return (
          <span 
            key={`${uniqueId}-${index}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transformOrigin: "0 0",
              transform: `rotate(${angle}deg) translateY(-${radius}px)`,
              color: char === "*" ? "#059669" : "currentColor"
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
} 