"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface StickySectionProps {
    children: ReactNode;
    index: number;
    totalSections: number;
    progress?: MotionValue<number>;
    range?: [number, number];
    className?: string;
    id?: string;
    backgroundColor?: string;
}

/**
 * StickySection Component
 * Creates a "Sticky Parallax Stacking" effect where sections overlap each other
 * The previous section scales down and fades slightly when the next section covers it
 */
export default function StickySection({
    children,
    index,
    totalSections,
    progress,
    range,
    className = "",
    id,
    backgroundColor = "var(--background)"
}: StickySectionProps) {
    const container = useRef<HTMLDivElement>(null);

    // Self scroll progress (for when no parent progress is provided)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "start start"]
    });

    // Calculate target scale: earlier sections scale down more
    const targetScale = 1 - ((totalSections - index) * 0.05);

    // Use parent progress if provided, otherwise use self
    const progressToUse = progress || scrollYProgress;
    const rangeToUse = range || [0, 1];

    // Scale animation: section scales down when being covered by next section
    const scale = useTransform(progressToUse, rangeToUse, [1, targetScale]);

    // Optional: Add slight darkening effect when covered
    const brightness = useTransform(progressToUse, rangeToUse, [1, 0.8]);

    // Top offset to create stacking effect (like playing cards)
    const topOffset = `calc(0px + ${index * 25}px)`;

    return (
        <div
            ref={container}
            className={`h-screen sticky top-0 flex items-center justify-center ${className}`}
            style={{ zIndex: index + 20 }}
            id={id}
        >
            <motion.div
                style={{
                    scale,
                    filter: `brightness(${brightness})`,
                    top: topOffset,
                    backgroundColor
                }}
                className="relative w-full h-full origin-top"
            >
                {children}
            </motion.div>
        </div>
    );
}

/**
 * StickySectionContainer
 * Wrapper for multiple StickySection components
 * Provides shared scroll progress for coordinated animations
 */
export function StickySectionContainer({
    children,
    className = ""
}: {
    children: ReactNode;
    className?: string;
}) {
    const container = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={container} className={`relative ${className}`}>
            {children}
        </div>
    );
}
