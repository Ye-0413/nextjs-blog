"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

import "./Dock.css";

// Define custom Spring type based on framer-motion's actual usage
interface CustomSpring {
  mass?: number;
  stiffness?: number;
  damping?: number;
  velocity?: number;
}

interface DockItemChildProps {
  isHovered?: MotionValue<number>;
}

interface DockItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spring: CustomSpring;
  distance: number;
  magnification: number;
  baseItemSize: number;
  vertical?: boolean;
}

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  mouseY,
  spring,
  distance,
  magnification,
  baseItemSize,
  vertical = false,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const [rect, setRect] = useState({ x: 0, y: 0, width: baseItemSize, height: baseItemSize });

  // Choose the appropriate motion value based on orientation
  const motionValue = vertical ? mouseY : mouseX;

  // Update rectangle dimensions only when the element mounts
  useEffect(() => {
    if (ref.current) {
      const updateRect = () => {
        if (ref.current) {
          const newRect = ref.current.getBoundingClientRect();
          setRect({
            x: newRect.x,
            y: newRect.y,
            width: newRect.width,
            height: newRect.height
          });
        }
      };
      
      // Initial measurement
      updateRect();
      
      // Re-measure on resize
      window.addEventListener('resize', updateRect);
      return () => window.removeEventListener('resize', updateRect);
    }
  }, []);

  // Smoothed mouse distance calculation
  const mouseDistance = useTransform(motionValue, (val: number) => {
    if (!ref.current) return 0;
    
    // For vertical orientation, use Y coordinates
    if (vertical) {
      return val - rect.y - rect.height / 2;
    }
    
    // For horizontal orientation, use X coordinates
    return val - rect.x - rect.width / 2;
  });

  // Use more stable spring settings
  const stableSpring = useMemo(() => ({
    mass: spring.mass ?? 0.6,
    stiffness: spring.stiffness ?? 300,
    damping: spring.damping ?? 25,
    velocity: spring.velocity ?? 0
  }), [spring]);

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  
  // Explicitly type the spring return value with more stable animation settings
  const size = useSpring(targetSize as MotionValue<number>, stableSpring) as MotionValue<number>;

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) => {
        if (!child || typeof child !== 'object' || !('type' in child)) {
          return child;
        }
        
        // Cast to appropriate type
        const childElement = child as React.ReactElement<DockItemChildProps>;
        if (childElement && childElement.props && typeof childElement.props === 'object') {
          return cloneElement(childElement, { 
            ...childElement.props,
            isHovered 
          });
        }
        return child;
      })}
    </motion.div>
  );
}

interface DockLabelProps {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DockIconProps {
  children: ReactNode;
  className?: string;
  isHovered?: MotionValue<number>;
}

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export interface DockItem {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  vertical?: boolean;
  dockHeight?: number;
}

export default function Dock({
  items,
  className = "",
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  baseItemSize = 50,
  vertical = false,
  dockHeight,
}: DockProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);

  // Initialize refs array when items change
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, items.length);
  }, [items.length]);

  // Simpler approach without dynamic sizing based on mouse position
  const handleItemMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div
      ref={dockRef}
      className={`dock-outer ${className}`}
      style={{
        height: vertical ? "auto" : panelHeight + 20,
        width: vertical ? baseItemSize * 2.5 : "auto",
        maxHeight: dockHeight,
        position: "relative", // Ensure proper positioning for children
        zIndex: 1 // Set a z-index to establish stacking context
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`dock-panel ${vertical ? "dock-vertical" : ""}`}
        style={{ 
          height: vertical ? "auto" : panelHeight,
          position: "relative", // Ensure proper positioning
          zIndex: 2 // Higher than parent but lower than labels
        }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => {
          // Determine if the item should be larger
          const isActive = hoveredItem === index;
          const itemSize = isActive ? magnification : baseItemSize;
          
          return (
            <button
              key={index}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={`dock-item ${item.className || ""}`}
              style={{
                width: itemSize,
                height: itemSize,
                cursor: item.onClick ? 'pointer' : 'default',
                transition: "width 0.2s ease, height 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
                position: "relative",
                border: "none",
                outline: "none",
                padding: 0,
                zIndex: isActive ? 3 : 2
              }}
              onClick={item.onClick}
              onMouseEnter={() => handleItemMouseEnter(index)}
              aria-label={item.label}
            >
              <div className="dock-icon">
                {item.icon}
              </div>
              
              {isActive && (
                <div
                  className="dock-label"
                  role="tooltip"
                >
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
} 