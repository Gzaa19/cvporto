"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { WatermarkText } from "@/components/ui/watermark-text";
import { BackgroundGrid } from "@/components/ui/background-grid";


interface AboutContentData {
    greeting: string;
    name: string;
    introText: string;
    focusText: string;
}

interface AboutProps {
    aboutContent?: AboutContentData;
}

export default function About({ aboutContent }: AboutProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of THIS section relative to viewport
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    // Exit Animation (Sticky Effect): "Ngilang" saat ketimpa section bawahnya
    // Scale down sedikit
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
    // Fade out lebih cepat biar berasa "ngilang"
    const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);
    // Effect blur biar smooth ngilangnya
    const filter = useTransform(scrollYProgress, [0.6, 1], ["blur(0px)", "blur(10px)"]);
    // Geser ke atas (Parallax exit)
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    // Watermark Parallax (Berjalan berlawanan arah saat scroll)
    const watermarkX = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="h-screen sticky top-0 flex items-center justify-center bg-background text-foreground overflow-hidden z-10"
            style={{ zIndex: 10 }}
        >
            <motion.div
                style={{ scale, opacity, filter, y }}
                className="w-full h-full relative flex items-center justify-center bg-background origin-center"
            >
                {/* Background Grid */}
                <BackgroundGrid />

                {/* GIANT WATERMARK BACKGROUND */}
                <WatermarkText text="ABOUT ME" x={watermarkX} animate />

                <div className="w-full px-6 md:px-20 relative z-10 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 h-full items-center">

                        {/* LEFT COLUMN: Main Info */}
                        <div className="flex flex-col justify-center space-y-8 md:space-y-10">
                            {/* Label - Replaced with reusable component */}
                            <SectionHeading number="01" title="ABOUT" />

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="headline-primary"
                            >
                                PASSIONATE
                            </motion.h2>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="space-y-6 max-w-lg"
                            >
                                <p className="description-text">
                                    {aboutContent?.greeting || "Hi, I'm"} <span className="bg-primary/10 text-primary px-1 font-medium">{aboutContent?.name || "Gaza Chansa"}</span>, {aboutContent?.introText || "A Software Engineer who loves building modern web applications with cutting-edge technologies."}
                                </p>
                                <p className="description-text opacity-80">
                                    {aboutContent?.focusText || "Currently focusing on creating interactions that feel natural and performance that feels instantaneous."}
                                </p>

                                <div className="pt-6">
                                    <a href="#experience" className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-white hover:text-primary transition-colors group font-mono">
                                        View Experience
                                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: Scroll Prompt & Decor */}
                        <div className="hidden md:flex flex-col justify-center items-end text-right space-y-8 relative">
                            {/* Decorative Box (Blue square from reference) */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 right-10 w-24 h-24 border border-primary/30 rounded-lg pointer-events-none"
                            />

                            <div className="space-y-4">
                                <motion.span
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ delay: 0.3 }}
                                    className="section-label opacity-60"
                                >
                                    // Projects
                                </motion.span>

                                <motion.h3
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ delay: 0.4 }}
                                    className="headline-secondary"
                                >
                                    SCROLL TO<br />
                                    EXPLORE
                                </motion.h3>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                viewport={{ once: false, amount: 0.3 }}
                                className="pt-8"
                            >
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-8 h-8">
                                        <path d="M12 5v14M19 12l-7 7-7-7" />
                                    </svg>
                                </motion.div>
                            </motion.div>
                        </div>

                    </div>
                </div>

                {/* Circuit pattern separator */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                </div>
            </motion.div>
        </section>
    );
}
