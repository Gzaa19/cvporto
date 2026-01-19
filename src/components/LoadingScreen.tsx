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

    // Typing effect
    useEffect(() => {
        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;
        const typingInterval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                // Short pause after typing, then start zoom
                timeoutId = setTimeout(() => setTypingComplete(true), 300);
            }
        }, 80); // Typing speed

        return () => {
            clearInterval(typingInterval);
            clearTimeout(timeoutId);
        };
    }, []);

    // Zoom animation after typing is complete
    useEffect(() => {
        if (typingComplete && textRef.current) {
            // Animate the text to zoom through
            animate(textRef.current,
                { scale: 50, opacity: 0 },
                {
                    duration: 1.2,
                    ease: [0.76, 0, 0.24, 1],
                }
            ).then(() => {
                // Fade out the entire container after zoom
                setIsVisible(false);
                setTimeout(onComplete, 300);
            });
        }
    }, [typingComplete, animate, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={scope}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.h1
                        ref={textRef}
                        className="text-4xl md:text-6xl font-bold text-white font-mono whitespace-nowrap"
                        style={{ transformOrigin: "52% 50%" }}
                        initial={{ opacity: 1, scale: 1 }}
                    >
                        <span>{displayedText}</span>
                        {/* Blinking cursor - only visible while typing */}
                        {!typingComplete && (
                            <span className="inline-block w-1 h-8 md:h-12 ml-1 bg-primary align-middle animate-pulse" />
                        )}
                    </motion.h1>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
