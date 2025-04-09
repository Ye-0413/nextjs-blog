import { useEffect, useRef, useState } from 'react';

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
}

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  // This font is just an example, you should use your preferred font
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',
  minFontSize = 24,
}: TextPressureProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const dist = (a: {x: number, y: number}, b: {x: number, y: number}) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Initialize mouse near center of container if it exists
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = () => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    // Much more aggressive sizing formula to make text significantly smaller
    // Use a smaller divisor (4) and apply a scaling factor of 0.7 to further reduce size
    let newFontSize = (containerW / (chars.length / 4)) * 0.7;
    newFontSize = Math.max(newFontSize, minFontSize);
    
    // Ensure font size doesn't exceed a maximum to prevent overflow
    newFontSize = Math.min(newFontSize, containerW / chars.length * 1.5);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  };

  useEffect(() => {
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, text]);

  useEffect(() => {
    if (!titleRef.current || chars.length === 0) return;
    
    let rafId: number;
    // Store the previous state to avoid unnecessary updates
    const prevState = {
      wdth: new Map(),
      wght: new Map(),
      italVal: new Map(),
      alphaVal: new Map()
    };

    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span, index) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          const getAttr = (distance: number, minVal: number, maxVal: number) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };

          const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

          // Only update the DOM if values have changed
          const hasChanged = 
            prevState.wdth.get(index) !== wdth ||
            prevState.wght.get(index) !== wght ||
            prevState.italVal.get(index) !== italVal ||
            prevState.alphaVal.get(index) !== alphaVal;
            
          if (hasChanged) {
            prevState.wdth.set(index, wdth);
            prevState.wght.set(index, wght);
            prevState.italVal.set(index, italVal);
            prevState.alphaVal.set(index, alphaVal);
            
            span.style.opacity = alphaVal.toString();
            span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [width, weight, italic, alpha, chars.length]);

  const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      <style>{`
        /* Font face if needed */
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }

        /* If flex=true => space out each character span */
        .flex {
          display: flex;
          justify-content: space-between;
        }

        /* Stroke class toggles "stroke" effect on each character */
        .stroke span {
          position: relative;
          color: ${textColor}; /* normal text color */
        }
        /* The stroke layer sits behind with text-stroke */
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          /* If you'd like to shift the stroke up/down, you can add transform here */
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        /* If stroke=false => no stroke class => normal text color */
        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight: lineHeight.toString(),
          transform: `scale(0.9) scale(1, ${scaleY})`,
          transformOrigin: 'center center',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          display: 'inline-block'
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure; 