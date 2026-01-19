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

export function useAnimate<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const controls = useAnimation();

    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const start = useCallback(
        async (animation: TargetAndTransition | VariantLabels, transition?: Transition) => {
            await controls.start(animation, transition);
        },
        [controls]
    );

    const stop = useCallback(() => {
        controls.stop();
    }, [controls]);
    const set = useCallback(
        (animation: TargetAndTransition | VariantLabels) => {
            controls.set(animation);
        },
        [controls]
    );

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

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const createTransform = useCallback(
        (inputRange: number[], outputRange: (number | string)[]) => {
            return useTransform(scrollYProgress, inputRange, outputRange);
        },
        [scrollYProgress]
    );

    const transforms = {
        fadeIn: useTransform(scrollYProgress, [0, 0.3], [0, 1]),
        fadeOut: useTransform(scrollYProgress, [0.7, 1], [1, 0]),
        scaleUp: useTransform(scrollYProgress, [0, 0.5], [0.8, 1]),
        moveUp: useTransform(scrollYProgress, [0, 1], [100, -100]),
        moveDown: useTransform(scrollYProgress, [0, 1], [-100, 100]),
        rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
        horizontalScroll: (totalWidth: number) =>
            useTransform(scrollYProgress, [0, 1], ["0%", `-${totalWidth}%`]),
    };

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
                const { scrollTrigger, ...tweenVars } = config;
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
                animationRef.current = gsap.to(ref.current, config);
            }
        }, ref);

        return () => {
            ctx.revert();
            scrollTriggerRef.current?.kill();
        };
    }, [config]);

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
