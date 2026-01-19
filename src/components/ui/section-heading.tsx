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
            className={cn("flex items-center gap-2 md:gap-4 mb-4 md:mb-8 lg:mb-12", className)}
        >
            {/* The Cyan Line */}
            <div className="h-[2px] w-8 md:w-12 bg-primary"></div>

            {/* The Number and Title */}
            <span className={cn(
                "text-sm md:text-lg lg:text-xl font-mono uppercase tracking-widest",
                lightMode ? "text-white" : "text-primary"
            )}>
                <span className="mr-1 md:mr-2">{number}</span> / <span className="ml-1 md:ml-2">{title}</span>
            </span>
        </motion.div>
    );
}
