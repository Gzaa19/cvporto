"use client";

import { motion, useScroll, useTransform } from 'framer-motion';

// Variasi animasi untuk Container (pembungkus kalimat)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.04 * i }, // Stagger: Jeda antar kata
    }),
};

// Variasi animasi untuk setiap Kata (Child)
const childVariants = {
    hidden: {
        y: "100%", // Ubah ini untuk arah: "100%" (dari bawah), "-100%" (dari atas)
        x: 0,      // Ubah ini jika mau dari samping: "100%" (kanan), "-100%" (kiri)
        opacity: 0,
        transition: {
            type: "spring" as const,
            damping: 12,
            stiffness: 100,
            duration: 0.5
        },
    },
    visible: {
        y: 0, // Posisi akhir (normal)
        x: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            damping: 12,
            stiffness: 100,
        },
    },
};

interface StaggeredTextProps {
    text: string;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    mode?: 'word' | 'char';
    scrollDirection?: 'left' | 'right' | 'none'; // New prop for scroll parallax
}

export default function StaggeredText({
    text,
    className = "",
    direction = 'up',
    mode = 'word',
    scrollDirection = 'none'
}: StaggeredTextProps) {

    // Scroll Parallax Logic
    const { scrollY } = useScroll();
    const distance = 400; // Increased distance for longer scroll duration

    // Tentukan nilai target berdasarkan arah scroll
    const targetX = scrollDirection === 'left' ? -distance
        : scrollDirection === 'right' ? distance
            : 0;

    // Extend range to window height usually (approx 1000px) so it keeps moving
    const x = useTransform(scrollY, [0, 1000], [0, targetX]);

    // Direction Logic for Entry Animation
    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { y: "100%", x: 0 };
            case 'down': return { y: "-100%", x: 0 };
            case 'left': return { x: "-100%", y: 0 };
            case 'right': return { x: "100%", y: 0 };
            default: return { y: "100%", x: 0 };
        }
    };

    const dynamicChildVariants = {
        ...childVariants,
        hidden: { ...childVariants.hidden, ...getInitialPosition() }
    };

    const items = mode === 'char' ? text.split("") : text.split(" ");

    return (
        <motion.div
            style={{
                overflow: "hidden",
                display: "flex",
                flexWrap: "wrap",
                x: x, // Apply scroll parallax here
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className={className}
        >
            {items.map((item, index) => (
                <motion.span
                    variants={dynamicChildVariants}
                    style={{ marginRight: mode === 'word' ? "0.25em" : "0", display: "inline-block" }}
                    key={index}
                >
                    {item === " " ? "\u00A0" : item}
                </motion.span>
            ))}
        </motion.div>
    );
}
