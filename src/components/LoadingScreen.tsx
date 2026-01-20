"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const text = "Gaza Al Ghozali Chansa";
    const [displayedText, setDisplayedText] = useState("");
    const [typingComplete, setTypingComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [scope, animate] = useAnimate();
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;
        const typingInterval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                timeoutId = setTimeout(() => setTypingComplete(true), 800);
            }
        }, 60);

        return () => {
            clearInterval(typingInterval);
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        if (typingComplete && textRef.current) {
            const sequence = async () => {
                if (!textRef.current) return;

                await animate(textRef.current,
                    { scale: 1.1, filter: "blur(0px)" },
                    { duration: 0.5, ease: "easeInOut" }
                );

                if (!textRef.current) return;

                await animate(textRef.current,
                    {
                        scale: 100,
                        opacity: 0,
                        filter: "blur(10px)"
                    },
                    {
                        duration: 0.8,
                        ease: [0.76, 0, 0.24, 1],
                    }
                );

                setIsVisible(false);
                setTimeout(onComplete, 300);
            };

            sequence();
        }
    }, [typingComplete, animate, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={scope}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className="relative">
                        <motion.h1
                            ref={textRef}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground font-mono tracking-tight text-center"
                            style={{ transformOrigin: "center center" }}
                            initial={{ opacity: 1, scale: 1 }}
                        >
                            <span>{displayedText}</span>
                            {!typingComplete && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                    className="inline-block w-[2px] h-8 md:h-12 ml-1 bg-primary align-middle"
                                />
                            )}
                        </motion.h1>

                        <div className="absolute -bottom-4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-1000" style={{ opacity: typingComplete ? 0 : 0.5 }}></div>
                    </div>

                    <motion.div
                        className="absolute bottom-10 text-xs font-sans text-muted-foreground tracking-[0.3em] uppercase opacity-50"
                        animate={{ opacity: typingComplete ? 0 : 0.5, y: typingComplete ? 20 : 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Portfolio © 2026
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
