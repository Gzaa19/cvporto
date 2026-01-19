"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    number: string;
    title: string;
    className?: string;
    lightMode?: boolean; // Prop to force white text if needed, mainly standardizing on specific colors though.
}

export function SectionHeading({ number, title, className, lightMode = false }: SectionHeadingProps) {
    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className={cn("flex items-center gap-4 mb-8 md:mb-12", className)}
        >
            {/* The Cyan Line */}
            <div className="h-[2px] w-12 bg-primary"></div>

            {/* The Number and Title */}
            <span className={cn(
                "text-lg md:text-xl font-mono uppercase tracking-widest",
                lightMode ? "text-white" : "text-primary"
            )}>
                <span className="mr-2">{number}</span> / <span className="ml-2">{title}</span>
            </span>
        </motion.div>
    );
}
