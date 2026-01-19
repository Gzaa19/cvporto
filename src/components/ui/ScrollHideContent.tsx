"use client";

import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollHideContentProps {
    children: React.ReactNode;
    className?: string;
    distance?: number;
}

export default function ScrollHideContent({
    children,
    className = "",
    distance = 100
}: ScrollHideContentProps) {
    const { scrollY } = useScroll();

    // Animate down (y: 0 -> distance) and opacity (1 -> 0)
    const y = useTransform(scrollY, [0, 300], [0, distance]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <motion.div
            style={{ y, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
