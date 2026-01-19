"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import HeroSvg from "@/assets/Hero.svg";
import Snowfall from "react-snowfall";
import StaggeredText from "@/components/ui/StaggeredText";
import ScrollHideContent from "@/components/ui/ScrollHideContent";
import { useMediaQuery } from "@/hooks";

interface HeroStatusData {
    location: string;
    currentRole: string;
    status: string;
    subtitle: string;
}

interface HeroProps {
    heroStatus: HeroStatusData;
}

export default function Hero({ heroStatus }: HeroProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <section className="h-screen relative overflow-hidden bg-background flex flex-col justify-end">
            {/* Background decorative elements */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-transparent opacity-20 pointer-events-none" />

            {/* Snowfall Effect */}
            <div className="absolute inset-0 z-1 pointer-events-none opacity-40">
                <Snowfall
                    color="#ffffff"
                    snowflakeCount={200}
                    radius={[0.5, 3.0]}
                    speed={[0.5, 3.0]}
                    wind={[-0.5, 2.0]}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
            </div>

            {/* Hero SVG Background - Fullscreen */}
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
            >
                <Image
                    src={HeroSvg}
                    alt="Hero decoration"
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>

            {/* Content Container - Aligned Left */}
            <div className="z-10 pl-4 md:pl-8 pr-6 md:pr-12 h-full flex flex-col justify-center md:justify-end pb-32 md:pb-48">

                {/* Main Text Area - Aligned Left */}
                <div className="mb-12 md:mb-16 w-full flex flex-col items-start">
                    {/* Name Part 1: Solid - Moves Left */}
                    <div className="overflow-hidden w-fit">
                        <StaggeredText
                            text="GAZA"
                            className="text-6xl md:text-[8rem] font-bold tracking-tighter text-white leading-[0.85] font-mono"
                            direction="up"
                            mode="char"
                            scrollDirection="left"
                        />
                    </div>

                    {/* Name Part 2: Outlined - Moves Right */}
                    <div className="overflow-hidden w-fit -mt-2 md:-mt-4">
                        <StaggeredText
                            text="CHANSA"
                            className="text-6xl md:text-[8rem] font-bold tracking-tighter text-transparent leading-[0.85] stroke-text font-mono"
                            direction="up"
                            mode="char"
                            scrollDirection="right"
                        />
                        {/* CSS variable for stroke text hack if needed, or inline style. Tailwind doesn't have standard text-stroke support without plugin. */}
                        <style jsx global>{`
                            .stroke-text {
                                -webkit-text-stroke: 2px rgba(255, 255, 255, 0.5);
                                color: transparent;
                            }
                            @media (max-width: 768px) {
                                .stroke-text {
                                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
                                }
                            }
                        `}</style>
                    </div>

                    {/* Subtitle - Moves Left */}
                    <div className="overflow-hidden w-fit mt-6 md:mt-10">
                        <StaggeredText
                            text={heroStatus.subtitle}
                            className="text-base md:text-xl font-medium tracking-[0.2em] text-muted-foreground font-mono"
                            direction="left"
                            scrollDirection="left"
                        />
                    </div>
                </div>

                {/* Bottom Status Cards - Separated with gaps */}
                <ScrollHideContent>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-wrap gap-4 md:gap-6"
                    >
                        {/* Card 1 - Location */}
                        <div className="p-3 md:p-5 border border-white/20 bg-background/30 backdrop-blur-sm min-w-[130px] md:min-w-[160px]">
                            <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">Location</h3>
                            <p className="text-base md:text-lg font-bold text-white font-mono">{heroStatus.location}</p>
                        </div>

                        {/* Card 2 - Current Role */}
                        <div className="p-3 md:p-5 border border-white/20 bg-background/30 backdrop-blur-sm min-w-[130px] md:min-w-[160px]">
                            <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">Current Role</h3>
                            <p className="text-base md:text-lg font-bold text-white font-mono">{heroStatus.currentRole}</p>
                        </div>

                        {/* Card 3 - Status (Highlighted) */}
                        <div className="p-3 md:p-5 bg-primary text-primary-foreground border border-primary min-w-[130px] md:min-w-[160px] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <h3 className="text-[9px] md:text-[10px] uppercase tracking-widest opacity-80 mb-2 font-mono relative z-10">Status</h3>
                            <p className="text-base md:text-lg font-bold font-mono relative z-10">{heroStatus.status}</p>
                        </div>
                    </motion.div>
                </ScrollHideContent>
            </div>

            {/* Glitch/Circuit board placeholder at bottom to blend */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
        </section>
    );
}
