"use client";

import React, { useRef, useEffect, ReactNode, useState, RefObject, useCallback } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { cn } from "@/lib/utils";
import "./InfiniteScroll.css";

gsap.registerPlugin(Observer);

interface InfiniteScrollItem {
  content: ReactNode;
}

export interface InfiniteScrollProps {
  items?: InfiniteScrollItem[];
  itemMinHeight?: number;
  isTilted?: boolean;
  tiltDirection?: "left" | "right";
  autoplay?: boolean;
  autoplaySpeed?: number;
  autoplayDirection?: "down" | "up"; // "down" or "up"
  pauseOnHover?: boolean; // Pause autoplay on hover
  className?: string;
  itemClassName?: string;
  wrapperRef?: RefObject<HTMLDivElement>;
  width?: string;
  maxHeight?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items = [],
  itemMinHeight = 150,
  isTilted = true,
  tiltDirection = "left",
  autoplay = false,
  autoplaySpeed = 0.5,
  autoplayDirection = "down",
  pauseOnHover = false,
  className,
  itemClassName,
  wrapperRef: externalWrapperRef,
  width = "100%",
  maxHeight = "100%",
}) => {
  const localWrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRef = externalWrapperRef || localWrapperRef;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isGrabbing = useRef(false);
  const lastY = useRef(0);
  const scrollVelocity = useRef(0);
  const autoScrollRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getTiltTransform = (angle: number): string => {
    if (isMobile || !isTilted) return "none";
    return `perspective(1000px) rotateX(${angle}deg)`;
  };

  const transformItems = useCallback(() => {
    if (!scrollContainerRef.current || !isTilted || isMobile) return;

    const scrollContainer = scrollContainerRef.current;
    
    // Get all items
    const items = Array.from(scrollContainer.children) as HTMLElement[];
    
    // Calculate each item's transform based on its position
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      
      // Calculate the position of the item relative to the container
      const relativePosition = (rect.top + rect.height / 2 - containerRect.top) / containerRect.height;
      
      // Convert the relative position to a rotation angle
      const rotationAngle = (relativePosition - 0.5) * 15;
      
      // Apply the transform to the item
      if (!isMobile) {
        item.style.transform = getTiltTransform(rotationAngle);
      }
    });
  }, [isTilted, isMobile]);

  const autoScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    if (Math.abs(scrollVelocity.current) > 0.1) {
      scrollContainerRef.current.scrollTop += scrollVelocity.current;
      scrollVelocity.current *= 0.95; // Gradually reduce velocity (friction)
      transformItems();
      autoScrollRef.current = requestAnimationFrame(autoScroll);
    } else {
      autoScrollRef.current = null;
    }
  }, [transformItems]);

  useEffect(() => {
    // Skip if autoplay is off
    if (!autoplay || items.length <= 1 || isMobile) return;

    let paused = false;

    if (containerRef.current) {
      const scrollTween = gsap.to(containerRef.current, {
        scrollTop: `+=${autoplayDirection === "down" ? "+=1000" : "-=1000"}`,
        ease: "none",
        duration: 10,
        repeat: -1,
        onRepeat: () => {
          if (containerRef.current) {
            // Reset scroll position to create infinite effect
            const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
            if (
              (autoplayDirection === "down" && containerRef.current.scrollTop >= maxScroll) ||
              (autoplayDirection === "up" && containerRef.current.scrollTop <= 0)
            ) {
              containerRef.current.scrollTop = autoplayDirection === "down" ? 0 : maxScroll;
            }
          }
        },
      });

      if (pauseOnHover) {
        containerRef.current.addEventListener("mouseenter", () => {
          paused = true;
          scrollTween.pause();
        });

        containerRef.current.addEventListener("mouseleave", () => {
          paused = false;
          scrollTween.play();
        });
      }

      return () => {
        scrollTween.kill();
      };
    }
  }, [
    autoplay,
    autoplayDirection,
    autoplaySpeed,
    pauseOnHover,
    items.length,
    isMobile,
    itemMinHeight
  ]);

  useEffect(() => {
    transformItems();
  }, [transformItems, items]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      transformItems();
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [transformItems]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isMobile) return;

    const onPointerDown = (e: PointerEvent) => {
      // Only respond to mouse/touch primary button
      if (e.pointerType === "mouse" && e.button !== 0) return;
      
      isGrabbing.current = true;
      lastY.current = e.clientY;
      scrollVelocity.current = 0;
      
      // Stop any ongoing animation
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      
      // Change the cursor to grabbing
      if (scrollContainer) {
        scrollContainer.style.cursor = "grabbing";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isGrabbing.current || !scrollContainer) return;

      // Calculate the distance moved
      const deltaY = lastY.current - e.clientY;
      lastY.current = e.clientY;
      
      // Update the scroll position
      scrollContainer.scrollTop += deltaY;
      
      // Update velocity based on movement
      scrollVelocity.current = deltaY * 0.8 + scrollVelocity.current * 0.2;
      
      // Update the transforms while dragging
      transformItems();
      
      e.preventDefault();
    };

    const onPointerUp = () => {
      if (!isGrabbing.current) return;
      
      isGrabbing.current = false;
      
      // Reset cursor
      if (scrollContainer) {
        scrollContainer.style.cursor = "grab";
      }
      
      // Start auto-scrolling with the current velocity
      if (Math.abs(scrollVelocity.current) > 0.5 && !autoScrollRef.current) {
        autoScrollRef.current = requestAnimationFrame(autoScroll);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!scrollContainer) return;
      
      // Update scroll position based on wheel delta
      scrollContainer.scrollTop += e.deltaY;
      
      // Update velocity
      scrollVelocity.current = e.deltaY * 0.05 + scrollVelocity.current * 0.95;
      
      // Update transforms
      transformItems();
      
      // Start auto-scrolling if not already running
      if (Math.abs(scrollVelocity.current) > 0.5 && !autoScrollRef.current) {
        autoScrollRef.current = requestAnimationFrame(autoScroll);
      }
      
      e.preventDefault();
    };

    // Add event listeners
    scrollContainer.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    scrollContainer.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      // Clean up event listeners
      scrollContainer.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      scrollContainer.removeEventListener("wheel", onWheel);
      
      // Cancel any animations
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [autoScroll, transformItems, isMobile]);

  // Prepare item styles based on mobile status
  const wrapperStyle: React.CSSProperties = {
    maxHeight: isMobile ? "auto" : maxHeight
  };

  const containerStyle: React.CSSProperties = {
    width: isMobile ? "100%" : width
  };

  const innerContainerStyle: React.CSSProperties = {
    transform: isMobile ? "none" : `perspective(1000px) rotateX(${15 / 2}deg)`,
    height: isMobile ? "auto" : `${Math.min(itemMinHeight * items.length * 1.2, 600)}px`
  };

  return (
    <div 
      className={cn("infinite-scroll-wrapper", isMobile && "mobile-view", className)} 
      ref={wrapperRef}
      style={wrapperStyle}
    >
      <div
        className="infinite-scroll-container"
        ref={containerRef}
        style={containerStyle}
      >
        <div
          ref={scrollContainerRef}
          className="infinite-scroll-container-inner"
          style={innerContainerStyle}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={cn("infinite-scroll-item", itemClassName)}
              style={{
                transform: isMobile ? "none" : getTiltTransform(-15 / 2),
                height: "auto",
                minHeight: itemMinHeight,
                marginTop: isMobile ? '16px' : "-0.5em"
              }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 