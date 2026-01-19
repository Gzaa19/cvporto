"use client";

import { useRef, useCallback, useEffect } from "react";
import {
    useAnimation,
    useInView,
    useScroll,
    useTransform,
    useSpring,
    type TargetAndTransition,
    type VariantLabels,
    type Transition,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

type AnimateConfig = {
    initial?: TargetAndTransition | VariantLabels;
    animate?: TargetAndTransition | VariantLabels;
    transition?: Transition;
    inViewOptions?: {
        once?: boolean;
        amount?: number | "some" | "all";
        margin?: string;
    };
};

type PresetConfig = {
    initial?: TargetAndTransition | VariantLabels;
    animate?: TargetAndTransition | VariantLabels;
    transition?: Transition;
};

/**
 * Custom hook untuk Framer Motion animations
 * Gunakan untuk animasi React yang bersih dan declarative
 */
export function useAnimate<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const controls = useAnimation();

    // Check if element is in view
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Start animation
    const start = useCallback(
        async (animation: TargetAndTransition | VariantLabels, transition?: Transition) => {
            await controls.start(animation, transition);
        },
        [controls]
    );

    // Stop animation
    const stop = useCallback(() => {
        controls.stop();
    }, [controls]);

    // Set animation state immediately
    const set = useCallback(
        (animation: TargetAndTransition | VariantLabels) => {
            controls.set(animation);
        },
        [controls]
    );

    // Preset animations
    const presets: Record<string, PresetConfig> = {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5 },
        },
        fadeInUp: {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        fadeInDown: {
            initial: { opacity: 0, y: -50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        fadeInLeft: {
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        fadeInRight: {
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, ease: "easeOut" },
        },
        slideInLeft: {
            initial: { x: "-100%" },
            animate: { x: 0 },
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        slideInRight: {
            initial: { x: "100%" },
            animate: { x: 0 },
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        bounce: {
            animate: { y: [0, -10, 0] },
            transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
        },
        pulse: {
            animate: { scale: [1, 1.05, 1] },
            transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
        },
        shake: {
            animate: { x: [0, -10, 10, -10, 10, 0] },
            transition: { duration: 0.5 },
        },
        rotate: {
            animate: { rotate: 360 },
            transition: { duration: 1, repeat: Infinity, ease: "linear" },
        },
    };

    // Apply preset animation
    const applyPreset = useCallback(
        async (preset: keyof typeof presets) => {
            const config = presets[preset];
            if (config.initial) {
                controls.set(config.initial);
            }
            if (config.animate) {
                await controls.start(config.animate, config.transition);
            }
        },
        [controls, presets]
    );

    // Stagger children helper
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    };

    return {
        ref,
        controls,
        isInView,
        start,
        stop,
        set,
        presets,
        applyPreset,
        staggerContainer,
        staggerItem,
    };
}

/**
 * Hook untuk scroll-based animations dengan Framer Motion
 */
export function useScrollAnimate(options?: {
    target?: React.RefObject<HTMLElement | null>;
    offset?: string[];
}) {
    const defaultRef = useRef<HTMLElement>(null);
    const targetRef = options?.target || defaultRef;

    const { scrollYProgress, scrollY } = useScroll({
        target: targetRef,
        offset: (options?.offset || ["start end", "end start"]) as any,
    });

    // Smooth spring version of scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Common transforms
    const createTransform = useCallback(
        (inputRange: number[], outputRange: (number | string)[]) => {
            return useTransform(scrollYProgress, inputRange, outputRange);
        },
        [scrollYProgress]
    );

    // Preset scroll transforms
    const transforms = {
        // Fade in as element enters viewport
        fadeIn: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
        // Fade out as element leaves viewport
        fadeOut: useTransform(scrollYProgress, [0.7, 1], [1, 0]),
        // Scale from small to normal
        scaleUp: useTransform(scrollYProgress, [0, 0.5], [0.8, 1]),
        // Move up as scrolling
        moveUp: useTransform(scrollYProgress, [0, 1], [100, -100]),
        // Move down as scrolling
        moveDown: useTransform(scrollYProgress, [0, 1], [-100, 100]),
        // Rotate based on scroll
        rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
        // Horizontal scroll (for horizontal scroll sections)
        horizontalScroll: (totalWidth: number) =>
            useTransform(scrollYProgress, [0, 1], ["0%", `-${totalWidth}%`]),
    };

    // Parallax helper
    const parallax = useCallback(
        (speed: number = 0.5) => {
            return useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
        },
        [scrollYProgress]
    );

    return {
        ref: targetRef,
        scrollYProgress,
        scrollY,
        smoothProgress,
        createTransform,
        transforms,
        parallax,
    };
}

/**
 * Hook untuk GSAP animations dengan Lenis smooth scroll
 * Gunakan ini sebagai pengganti Framer Motion untuk animasi scroll yang lebih kompleks
 */
export function useGsapAnimate<T extends HTMLElement = HTMLDivElement>(
    config?: gsap.TweenVars & {
        scrollTrigger?: Omit<ScrollTrigger.Vars, "trigger">;
    }
) {
    const ref = useRef<T>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            if (!ref.current) return;

            if (config?.scrollTrigger) {
                // Scroll-triggered animation
                const { scrollTrigger, ...tweenVars } = config;
                // scrollTrigger disini pasti bukan undefined karena sudah di-check di if condition
                const stVars: Omit<ScrollTrigger.Vars, "trigger"> = scrollTrigger!;

                const scrollTriggerConfig: ScrollTrigger.Vars = {
                    trigger: ref.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    ...stVars,
                };

                animationRef.current = gsap.to(ref.current, {
                    ...tweenVars,
                    scrollTrigger: scrollTriggerConfig,
                });
                scrollTriggerRef.current = animationRef.current.scrollTrigger as ScrollTrigger;
            } else if (config) {
                // Regular animation
                animationRef.current = gsap.to(ref.current, config);
            }
        }, ref);

        return () => {
            ctx.revert();
            scrollTriggerRef.current?.kill();
        };
    }, [config]);

    // Helper methods
    const play = useCallback(() => {
        animationRef.current?.play();
    }, []);

    const pause = useCallback(() => {
        animationRef.current?.pause();
    }, []);

    const reverse = useCallback(() => {
        animationRef.current?.reverse();
    }, []);

    const restart = useCallback(() => {
        animationRef.current?.restart();
    }, []);

    return {
        ref,
        animation: animationRef.current,
        scrollTrigger: scrollTriggerRef.current,
        play,
        pause,
        reverse,
        restart,
    };
}

/**
 * Hook untuk membuat scroll-triggered animations dengan GSAP
 * Cocok untuk animasi yang lebih kompleks dan performant
 */
export function useScrollTriggerAnimate() {
    const ctx = useRef<gsap.Context | null>(null);

    useEffect(() => {
        ctx.current = gsap.context(() => { });

        return () => {
            ctx.current?.revert();
        };
    }, []);

    const createScrollTrigger = useCallback(
        (element: HTMLElement | string, vars: ScrollTrigger.Vars) => {
            if (!ctx.current) return null;

            return ScrollTrigger.create({
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                ...vars,
            });
        },
        []
    );

    const animateOnScroll = useCallback(
        (
            element: HTMLElement | string,
            to: gsap.TweenVars,
            scrollVars?: Omit<ScrollTrigger.Vars, "trigger">
        ) => {
            if (!ctx.current) return null;

            return gsap.to(element, {
                ...to,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse",
                    ...scrollVars,
                },
            });
        },
        []
    );

    return {
        createScrollTrigger,
        animateOnScroll,
        context: ctx.current,
    };
}

/**
 * Hook untuk hover animations
 */
export function useHoverAnimate() {
    const presets = {
        lift: {
            whileHover: { y: -5, transition: { duration: 0.2 } },
            whileTap: { y: 0 },
        },
        scale: {
            whileHover: { scale: 1.05, transition: { duration: 0.2 } },
            whileTap: { scale: 0.95 },
        },
        glow: {
            whileHover: {
                boxShadow: "0 0 20px rgba(var(--primary), 0.5)",
                transition: { duration: 0.2 },
            },
        },
        tilt: {
            whileHover: { rotateY: 10, rotateX: 5, transition: { duration: 0.3 } },
        },
        borderGlow: {
            whileHover: {
                borderColor: "rgba(var(--primary), 0.8)",
                transition: { duration: 0.2 },
            },
        },
    };

    return { presets };
}

export default useAnimate;
