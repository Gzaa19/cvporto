"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    useEffect(() => {
        // Skip Lenis entirely for admin routes — use native browser scroll
        if (isAdmin) {
            return;
        }

        const lenis = new Lenis({
            lerp: 0.1,
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

        lenis.on("scroll", ScrollTrigger.update);

        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        (window as any).lenis = lenis;

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            (window as any).lenis = null;
        };
    }, [isAdmin]);

    return <>{children}</>;
}
