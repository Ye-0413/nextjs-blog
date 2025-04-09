/* eslint-disable react/no-unknown-property */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import './Lanyard.css';

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  logoUrl?: string;
}

export default function Lanyard({
  onThemeToggle,
  logoUrl
}: LanyardProps) {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strandRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const velocity = useRef({ x: 0, y: 0 });
  const cardPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const dragDistance = useRef({ x: 0, y: 0 }); // Track total drag distance to differentiate from clicks
  const animateCardRef = useRef<(() => void) | null>(null); // Store animateCard function reference

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
    if (onThemeToggle) onThemeToggle();
  };

  // Update card position function - keep it outside to avoid recreations
  const updateCardPosition = () => {
    if (!cardRef.current || !strandRef.current || !containerRef.current) return;
    
    // Apply constraints to keep card within visible area
    const container = containerRef.current.getBoundingClientRect();
    const card = cardRef.current.getBoundingClientRect();
    
    // Constrain X - with more elasticity near edges
    if (cardPosition.current.x < -card.width * 0.75) {
      const overshoot = -card.width * 0.75 - cardPosition.current.x;
      cardPosition.current.x = -card.width * 0.75 + overshoot * 0.2;
      velocity.current.x *= -0.6; // Bounce with damping
    } else if (cardPosition.current.x > container.width - card.width * 0.25) {
      const overshoot = cardPosition.current.x - (container.width - card.width * 0.25);
      cardPosition.current.x = container.width - card.width * 0.25 - overshoot * 0.2;
      velocity.current.x *= -0.6; // Bounce with damping
    }
    
    // Constrain Y - with elasticity
    if (cardPosition.current.y < -20) {
      const overshoot = -20 - cardPosition.current.y;
      cardPosition.current.y = -20 + overshoot * 0.2;
      velocity.current.y *= -0.6; // Bounce with damping
    } else if (cardPosition.current.y > container.height - card.height * 0.6) {
      const overshoot = cardPosition.current.y - (container.height - card.height * 0.6);
      cardPosition.current.y = container.height - card.height * 0.6 - overshoot * 0.2;
      velocity.current.y *= -0.6; // Bounce with damping
    }
    
    // Update card and strand position with 3D transform
    cardRef.current.style.transform = `translate(${cardPosition.current.x}px, ${cardPosition.current.y}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`;
    
    // Update strand to connect to the card's top center
    const cardRect = cardRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Anchors: top center of container to top center of card
    const startX = containerRect.width / 2;
    const startY = 0;
    const endX = cardPosition.current.x + cardRect.width / 2;
    const endY = cardPosition.current.y;
    
    // Calculate distance and angle
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    
    // Add slight curve to strand
    strandRef.current.style.width = `${distance}px`;
    strandRef.current.style.transform = `translateX(${startX}px) rotate(${angle}deg)`;
    strandRef.current.style.transformOrigin = '0 0';
    
    // Apply tension effect - thinner when stretched
    const tension = Math.min(1, 50 / distance);
    strandRef.current.style.height = `${1 + tension}px`;
    strandRef.current.style.opacity = `${0.5 + tension * 0.5}`;
  };

  // Initialize physics simulation
  useEffect(() => {
    if (isInitialized || typeof window === 'undefined') return;
    
    // Define the animation function inside useEffect but use the ref
    animateCardRef.current = () => {
      // Apply gravity - stronger over time for more natural feel
      velocity.current.y += 0.2 + cardPosition.current.y * 0.001; 
      
      // Apply air resistance - more when moving faster
      const speed = Math.sqrt(velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y);
      const dragFactor = 0.97 - Math.min(0.04, speed * 0.0005);
      velocity.current.x *= dragFactor;
      velocity.current.y *= dragFactor;
      
      // Apply spring force to return to rest position at top
      const restX = containerRef.current ? containerRef.current.getBoundingClientRect().width / 2 - (cardRef.current?.getBoundingClientRect().width || 0) / 2 : 0;
      const distanceFromRest = restX - cardPosition.current.x;
      const springForceX = distanceFromRest * 0.004; // Gentle spring
      velocity.current.x += springForceX;
      
      // Add slight oscillation when near rest position
      if (Math.abs(distanceFromRest) < 40 && Math.abs(velocity.current.x) < 1) {
        velocity.current.x += Math.sin(Date.now() * 0.005) * 0.05;
      }
      
      // Gradually return rotation to neutral with easing
      setRotation(prev => ({
        x: prev.x * 0.92,
        y: prev.y * 0.92,
        z: prev.z * 0.92
      }));
      
      // Update position with velocity
      cardPosition.current.x += velocity.current.x;
      cardPosition.current.y += velocity.current.y;
      
      updateCardPosition();
      
      // Stop animation if almost stopped and near rest position
      if (Math.abs(velocity.current.x) < 0.05 && 
          Math.abs(velocity.current.y) < 0.05 &&
          Math.abs(cardPosition.current.x - restX) < 1 &&
          cardPosition.current.y < 5 &&
          Math.abs(rotation.x) < 0.1 &&
          Math.abs(rotation.y) < 0.1 &&
          Math.abs(rotation.z) < 0.1) {
        cancelAnimationFrame(animationRef.current!);
        animationRef.current = null;
        
        // Reset to perfect rest position
        cardPosition.current.x = restX;
        cardPosition.current.y = 0;
        setRotation({ x: 0, y: 0, z: 0 });
        updateCardPosition();
        return;
      }
      
      animationRef.current = requestAnimationFrame(animateCardRef.current!);
    };

    // Define all event handlers before referencing them
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      dragDistance.current = { x: 0, y: 0 }; // Reset drag distance
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      document.body.style.cursor = 'grabbing';
      
      // Add some random rotation on grab for more dynamic feel
      setRotation(prev => ({
        ...prev,
        z: Math.random() * 4 - 2
      }));
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const touch = e.touches[0];
      isDragging.current = true;
      lastMouseX.current = touch.clientX;
      lastMouseY.current = touch.clientY;
      dragDistance.current = { x: 0, y: 0 }; // Reset drag distance
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Add some random rotation on grab for more dynamic feel
      setRotation(prev => ({
        ...prev,
        z: Math.random() * 4 - 2
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const dx = e.clientX - lastMouseX.current;
      const dy = e.clientY - lastMouseY.current;
      
      // Update total drag distance
      dragDistance.current.x += Math.abs(dx);
      dragDistance.current.y += Math.abs(dy);
      
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      
      cardPosition.current.x += dx;
      cardPosition.current.y += dy;
      
      // Apply velocity with smoothing
      velocity.current.x = dx * 0.6 + velocity.current.x * 0.4;
      velocity.current.y = dy * 0.6 + velocity.current.y * 0.4;
      
      // Calculate 3D rotation based on movement with more natural feel
      setRotation({
        x: Math.min(Math.max(dy * 0.7, -25), 25),
        y: Math.min(Math.max(-dx * 0.7, -25), 25),
        z: Math.min(Math.max(dx * 0.05, -5), 5) // Add slight z-rotation for more realistic physics
      });
      
      updateCardPosition();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      e.stopPropagation();
      
      const touch = e.touches[0];
      const dx = touch.clientX - lastMouseX.current;
      const dy = touch.clientY - lastMouseY.current;
      
      // Update total drag distance
      dragDistance.current.x += Math.abs(dx);
      dragDistance.current.y += Math.abs(dy);
      
      lastMouseX.current = touch.clientX;
      lastMouseY.current = touch.clientY;
      
      cardPosition.current.x += dx;
      cardPosition.current.y += dy;
      
      // Apply velocity with smoothing
      velocity.current.x = dx * 0.6 + velocity.current.x * 0.4;
      velocity.current.y = dy * 0.6 + velocity.current.y * 0.4;
      
      // Calculate 3D rotation based on movement with more natural feel
      setRotation({
        x: Math.min(Math.max(dy * 0.7, -25), 25),
        y: Math.min(Math.max(-dx * 0.7, -25), 25),
        z: Math.min(Math.max(dx * 0.05, -5), 5) // Add slight z-rotation for more realistic physics
      });
      
      updateCardPosition();
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      isDragging.current = false;
      document.body.style.cursor = 'auto';
      
      // Add some "flick" to velocity based on current rotation
      velocity.current.x += rotation.y * 0.1;
      velocity.current.y -= rotation.x * 0.1;
      
      if (!animationRef.current && animateCardRef.current) {
        animateCardRef.current();
      }
      
      // Improved: If total drag distance is very small, consider it a click
      // Note: We no longer call handleThemeToggle directly since we added onClick
      // This avoids duplicate theme toggling when clicking
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      
      if (!isDragging.current) return;
      
      isDragging.current = false;
      
      // Add some "flick" to velocity based on current rotation
      velocity.current.x += rotation.y * 0.1;
      velocity.current.y -= rotation.x * 0.1;
      
      if (!animationRef.current && animateCardRef.current) {
        animateCardRef.current();
      }
      
      // Improved: If total drag distance is very small, consider it a click
      // Note: We no longer call handleThemeToggle directly since we added onClick
      // This avoids duplicate theme toggling when clicking
    };
    
    // Clean up any existing listeners first
    const cleanupListeners = () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousedown', handleMouseDown);
        cardRef.current.removeEventListener('touchstart', handleTouchStart);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // Clean up first to prevent duplicates
    cleanupListeners();

    // Attach event listeners
    if (cardRef.current) {
      cardRef.current.addEventListener('mousedown', handleMouseDown);
      cardRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    setIsInitialized(true);

    // Initial bounce animation
    setTimeout(() => {
      if (!animationRef.current && containerRef.current && cardRef.current && animateCardRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        const cardWidth = cardRef.current.getBoundingClientRect().width;
        
        // Start from slightly off-center with random velocity
        cardPosition.current.x = containerWidth / 2 - cardWidth / 2 + (Math.random() * 40 - 20);
        cardPosition.current.y = -80; // Start from above
        velocity.current = { 
          x: Math.random() * 4 - 2, 
          y: Math.random() * 2 + 2 
        };
        animateCardRef.current();
      }
    }, 500);

    return cleanupListeners;
  }, [isInitialized]);

  // Add a separate useEffect for theme changes if needed
  useEffect(() => {
    // Only handle theme-related side effects here
    // This keeps theme changes isolated from animation logic
  }, [theme]);

  return (
    <div ref={containerRef} className="lanyard-container">
      <div ref={strandRef} className="lanyard-strand"></div>
      <div 
        ref={cardRef} 
        className={`lanyard-card ${isDarkMode ? 'dark' : 'light'}`}
        onClick={handleThemeToggle}
      >
        <div className="lanyard-card-inner">
          <div className="lanyard-card-front">
            <div className="lanyard-card-logo">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="lanyard-logo-image" />
              ) : (
                isDarkMode ? <Sun size={24} /> : <Moon size={24} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 