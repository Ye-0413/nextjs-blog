"use client";

import { useEffect, useState, useRef, ReactNode, useCallback, useId } from 'react'
import { motion } from 'framer-motion'

const styles = {
    wrapper: {
        display: 'inline-block',
        whiteSpace: 'pre-wrap',
    },
    srOnly: {
        position: 'absolute' as 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        border: 0,
    },
}

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: 'start' | 'end' | 'center';
    useOriginalCharsOnly?: boolean;
    characters?: string;
    className?: string;
    parentClassName?: string;
    encryptedClassName?: string;
    animateOn?: 'view' | 'hover' | 'mount';
    willChange?: boolean;
    children?: ReactNode;
}

export default function DecryptedText({
    text,
    speed = 200,
    maxIterations = 15,
    sequential = false,
    revealDirection = 'start',
    useOriginalCharsOnly = false,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    className = '',
    parentClassName = '',
    encryptedClassName = '',
    animateOn = 'hover',
    willChange = true,
    ...props
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState<string>(text)
    const [isHovering, setIsHovering] = useState<boolean>(false) // Don't initialize as true for SSR
    const [isScrambling, setIsScrambling] = useState<boolean>(false)
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
    const [hasAnimated, setHasAnimated] = useState<boolean>(false)
    const [isClient, setIsClient] = useState<boolean>(false) // Track client-side rendering
    const containerRef = useRef<HTMLSpanElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null) 
    const animationFrameRef = useRef<number | null>(null)
    const uniqueId = useId(); // Add stable ID for SSR

    // Set client-side flag after mount
    useEffect(() => {
        setIsClient(true)
        
        // Now that we're client-side, check if we should auto-start
        if (animateOn === 'mount') {
            setIsHovering(true);
            setHasAnimated(true);
        }
    }, [animateOn]);

    // Clean up function to clear all animation timers
    const cleanupAnimation = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, []);

    // Auto-start animation on mount if animateOn is 'mount', but only client-side
    useEffect(() => {
        if (!isClient) return; // Skip during SSR

        if (animateOn === 'mount' && !hasAnimated) {
            // Ensure animation completes even if something goes wrong
            const fallbackTimer = setTimeout(() => {
                setDisplayText(text);
                setIsScrambling(false);
                cleanupAnimation();
            }, 5000); // Safety timeout after 5 seconds
            
            return () => {
                clearTimeout(fallbackTimer);
                cleanupAnimation();
            };
        }

        return () => {
            cleanupAnimation();
        };
    }, [animateOn, hasAnimated, text, cleanupAnimation, isClient]);

    useEffect(() => {
        if (!isClient || !isHovering) return; // Skip during SSR
        
        let currentIteration = 0

        const getNextIndex = (revealedSet: Set<number>): number => {
            const textLength = text.length
            switch (revealDirection) {
                case 'start':
                    return revealedSet.size
                case 'end':
                    return textLength - 1 - revealedSet.size
                case 'center': {
                    const middle = Math.floor(textLength / 2)
                    const offset = Math.floor(revealedSet.size / 2)
                    const nextIndex =
                        revealedSet.size % 2 === 0
                            ? middle + offset
                            : middle - offset - 1

                    if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                        return nextIndex
                    }

                    for (let i = 0; i < textLength; i++) {
                        if (!revealedSet.has(i)) return i
                    }
                    return 0
                }
                default:
                    return revealedSet.size
            }
        }

        const availableChars = useOriginalCharsOnly
            ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
            : characters.split('')

        const shuffleText = (originalText: string, currentRevealed: Set<number>): string => {
            if (useOriginalCharsOnly) {
                const positions = originalText.split('').map((char, i) => ({
                    char,
                    isSpace: char === ' ',
                    index: i,
                    isRevealed: currentRevealed.has(i),
                }))

                const nonSpaceChars = positions
                    .filter((p) => !p.isSpace && !p.isRevealed)
                    .map((p) => p.char)

                for (let i = nonSpaceChars.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                    ;[nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
                }

                let charIndex = 0
                return positions
                    .map((p) => {
                        if (p.isSpace) return ' '
                        if (p.isRevealed) return originalText[p.index]
                        return nonSpaceChars[charIndex++]
                    })
                    .join('')
            } else {
                return originalText
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' '
                        if (currentRevealed.has(i)) return originalText[i]
                        return availableChars[Math.floor(Math.random() * availableChars.length)]
                    })
                    .join('')
            }
        }

        // Clean up any existing interval
        cleanupAnimation();
        
        setIsScrambling(true)
        intervalRef.current = setInterval(() => {
            setRevealedIndices((prevRevealed) => {
                if (sequential) {
                    if (prevRevealed.size < text.length) {
                        const nextIndex = getNextIndex(prevRevealed)
                        const newRevealed = new Set(prevRevealed)
                        newRevealed.add(nextIndex)
                        setDisplayText(shuffleText(text, newRevealed))
                        return newRevealed
                    } else {
                        cleanupAnimation();
                        setIsScrambling(false)
                        return prevRevealed
                    }
                } else {
                    setDisplayText(shuffleText(text, prevRevealed))
                    currentIteration++
                    if (currentIteration >= maxIterations) {
                        cleanupAnimation();
                        setIsScrambling(false)
                        setDisplayText(text)
                    }
                    return prevRevealed
                }
            })
        }, speed)

        return () => {
            cleanupAnimation();
        }
    }, [
        isHovering,
        text,
        speed,
        maxIterations,
        sequential,
        revealDirection,
        characters,
        useOriginalCharsOnly,
        isClient,
        cleanupAnimation
    ])

    useEffect(() => {
        if (!isClient || animateOn !== 'view') return;

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setIsHovering(true)
                    setHasAnimated(true)
                }
            })
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)
        const currentRef = containerRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
            cleanupAnimation();
        }
    }, [animateOn, hasAnimated, isClient, cleanupAnimation])

    const hoverProps =
        animateOn === 'hover' && isClient
            ? {
                onMouseEnter: () => setIsHovering(true),
                onMouseLeave: () => setIsHovering(false),
            }
            : {}

    // During SSR, just render the plain text
    if (!isClient) {
        return (
            <span className={parentClassName}>
                {text}
            </span>
        );
    }

    return (
        <motion.span 
            className={parentClassName} 
            ref={containerRef} 
            style={{
                display: 'inline-block',
                whiteSpace: 'pre-wrap',
                willChange: willChange ? 'contents' : 'auto',
            }} 
            {...hoverProps} 
            {...props}
        >
            <span style={styles.srOnly}>{displayText}</span>

            <span aria-hidden="true">
                {displayText.split('').map((char, index) => {
                    const isRevealedOrDone =
                        revealedIndices.has(index) || !isScrambling || !isHovering

                    return (
                        <span
                            key={`${uniqueId}-${index}`}
                            className={isRevealedOrDone ? className : encryptedClassName}
                        >
                            {char}
                        </span>
                    )
                })}
            </span>
        </motion.span>
    )
} 