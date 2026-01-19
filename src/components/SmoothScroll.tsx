"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            lerp: 0.1, // Sedikit dinaikkan untuk pin yang lebih responsif
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        lenisRef.current = lenis;

        // Setup ScrollTrigger to use Lenis scroll position
        lenis.on("scroll", ScrollTrigger.update);

        // Add Lenis raf to GSAP ticker
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Important: Refresh ScrollTrigger after Lenis is ready
        // This recalculates all trigger positions with Lenis
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        // Expose globally
        (window as any).lenis = lenis;

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            (window as any).lenis = null;
        };
    }, []);

    return <>{children}</>;
}
