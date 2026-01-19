"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type GsapAnimationConfig = {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    scrollTrigger?: ScrollTrigger.Vars;
    duration?: number;
    ease?: string;
    delay?: number;
};

export function useGsap<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        return () => {
            timeline.current?.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const animate = useCallback((config: GsapAnimationConfig) => {
        if (!ref.current) return;

        const { from, to, scrollTrigger, duration = 1, ease = "power2.out", delay = 0 } = config;

        if (from && to) {
            return gsap.fromTo(ref.current, from, {
                ...to,
                duration,
                ease,
                delay,
                scrollTrigger: scrollTrigger ? { trigger: ref.current, ...scrollTrigger } : undefined,
            });
        } else if (to) {
            return gsap.to(ref.current, {
                ...to,
                duration,
                ease,
                delay,
                scrollTrigger: scrollTrigger ? { trigger: ref.current, ...scrollTrigger } : undefined,
            });
        } else if (from) {
            return gsap.from(ref.current, {
                ...from,
                duration,
                ease,
                delay,
                scrollTrigger: scrollTrigger ? { trigger: ref.current, ...scrollTrigger } : undefined,
            });
        }
    }, []);

    const createTimeline = useCallback((config?: gsap.TimelineVars) => {
        timeline.current = gsap.timeline(config);
        return timeline.current;
    }, []);

    const scrollAnimate = useCallback((
        to: gsap.TweenVars,
        triggerConfig?: Partial<ScrollTrigger.Vars>
    ) => {
        if (!ref.current) return;

        return gsap.to(ref.current, {
            ...to,
            scrollTrigger: {
                trigger: ref.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
                ...triggerConfig,
            },
        });
    }, []);

    const horizontalScroll = useCallback((
        container: HTMLElement,
        config?: Partial<ScrollTrigger.Vars>
    ) => {
        if (!ref.current) return;

        const sections = gsap.utils.toArray<HTMLElement>(ref.current.children);
        const totalWidth = sections.reduce((acc, section) => acc + section.offsetWidth, 0);

        return gsap.to(sections, {
            x: () => -(totalWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: container,
                pin: true,
                scrub: 1,
                end: () => `+=${totalWidth}`,
                ...config,
            },
        });
    }, []);

    const parallax = useCallback((speed: number = 0.5) => {
        if (!ref.current) return;

        return gsap.to(ref.current, {
            y: () => window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    }, []);

    const staggerChildren = useCallback((
        to: gsap.TweenVars,
        stagger: number = 0.1,
        triggerConfig?: Partial<ScrollTrigger.Vars>
    ) => {
        if (!ref.current) return;

        return gsap.to(ref.current.children, {
            ...to,
            stagger,
            scrollTrigger: {
                trigger: ref.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
                ...triggerConfig,
            },
        });
    }, []);

    const textReveal = useCallback((config?: { duration?: number; stagger?: number }) => {
        if (!ref.current) return;

        const { duration = 0.8, stagger = 0.02 } = config || {};
        const text = ref.current.textContent || "";
        ref.current.innerHTML = text
            .split("")
            .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
            .join("");

        return gsap.from(ref.current.children, {
            opacity: 0,
            y: 50,
            rotateX: -90,
            stagger,
            duration,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: ref.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });
    }, []);

    return {
        ref,
        timeline: timeline.current,
        animate,
        createTimeline,
        scrollAnimate,
        horizontalScroll,
        parallax,
        staggerChildren,
        textReveal,
        gsap,
        ScrollTrigger,
    };
}

export default useGsap;
