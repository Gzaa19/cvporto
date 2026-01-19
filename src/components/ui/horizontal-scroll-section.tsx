"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollSectionProps {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}

export function HorizontalScrollSection({
    children,
    className,
    contentClassName
}: HorizontalScrollSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const content = contentRef.current;
        const container = containerRef.current;

        if (!content || !container) return;

        // Function recalculate width yang robust
        const getScrollAmount = () => {
            const viewportWidth = window.innerWidth;
            const contentWidth = content.scrollWidth;

            // Safety: Kalau konten lebih kecil dari layar, jangan scroll aneh-aneh
            if (contentWidth <= viewportWidth) return 0;

            // Scroll sampai ujung konten + buffer sedikit biar lega
            return -(contentWidth - viewportWidth + 100);
        };

        const scrollAmount = getScrollAmount();

        // Hanya aktifkan ScrollTrigger jika konten memang panjang
        if (scrollAmount !== 0) {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: () => `+=${Math.abs(getScrollAmount())}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            timeline.to(content, {
                x: () => getScrollAmount(),
                ease: "none"
            });
        }

        // Force refresh biar layout pas saat load
        const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
        return () => clearTimeout(timer);

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className={cn("relative h-screen overflow-hidden bg-background", className)}
        >
            <div className="relative flex h-full items-center overflow-hidden">
                <div
                    ref={contentRef}
                    className={cn(
                        "flex items-center min-w-full w-max will-change-transform pl-4 md:pl-24 pr-4 md:pr-12",
                        contentClassName
                    )}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
