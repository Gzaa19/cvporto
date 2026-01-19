"use client";

import { useRef } from "react";
import { useMediaQuery } from "@/hooks";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { WatermarkText } from "@/components/ui/watermark-text";
import { ICON_MAP } from "@/lib/icons-map";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Use simplified Skill type for frontend
interface SkillDisplay {
    id: string;
    number: string;
    name: string;
    category: string;
    iconName: string;
}

const SkillCard = ({
    skill,
    className
}: {
    skill: SkillDisplay;
    className?: string; // receive opacity/transform styles from parent if needed or use class
}) => {
    // Resolve Icon URL
    const iconUrl = ICON_MAP[skill.iconName] || ICON_MAP["React"];
    // Check if it's Next.js for invert filter (Next.js logo is black, invisible on dark bg)
    const isNextJs = skill.iconName === "Next.js";

    return (
        <div className={`h-[90px] md:h-[160px] ${className}`}>
            <Card className="h-full group p-2 md:p-4 border-t border-white/10 border-l-0 border-r-0 border-b-0 rounded-none bg-transparent shadow-none hover:bg-transparent transition-colors duration-300 cursor-default flex flex-col justify-between">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className="text-[10px] md:text-xs font-mono text-neutral-500">
                        {skill.number}
                    </span>
                    <div className="relative w-6 h-6 md:w-8 md:h-8">
                        <img
                            src={iconUrl}
                            alt={skill.name}
                            className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 ${isNextJs ? 'invert' : ''}`}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="space-y-0.5 md:space-y-1">
                    <h3 className="text-sm md:text-xl font-bold font-mono text-white group-hover:text-primary transition-colors duration-300 uppercase tracking-tight truncate">
                        {skill.name}
                    </h3>
                    <p className="text-[8px] md:text-xs font-mono text-neutral-400 uppercase tracking-wider truncate">
                        {skill.category}
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default function Skills({ skills = [] }: { skills?: any[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    // Transform incoming data to display format with "01", "02" numbers
    const displaySkills: SkillDisplay[] = skills.length > 0 ? skills.map((s, i) => ({
        id: s.id,
        number: `0${i + 1}`,
        name: s.name,
        category: s.category,
        iconName: s.iconName,
        order: s.order // Keep order if present
    })).sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

    useGSAP(() => {
        if (!displaySkills.length) return;

        const container = containerRef.current;
        const header = headerRef.current;
        const cards = cardsRef.current?.children;

        if (!container || !cards) return;

        // Create a timeline that pins the container
        // We use a large 'end' value to create scroll distance for the animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=2000", // Adjust this value to control speed/duration
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        // 1. Animate Header In
        if (header) {
            tl.fromTo(header,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        // 2. Animate Cards Staggered
        // We want them to appear one by one as we scroll
        // Converting the array of HTMLCollection to array for easy usage
        const cardElements = Array.from(cards);

        cardElements.forEach((card, index) => {
            // For each card, we fade it in and move it up
            // We stagger them by placing them at different times in the timeline
            tl.fromTo(card,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
                // Stagger offset: start after header, then 0.5s apart (relative to scroll timeline)
                0.5 + (index * 0.5)
            );
        });

        // Add a small buffer at the end of timeline so user sees all cards before unpinning
        tl.to({}, { duration: 1 });

    }, { scope: containerRef, dependencies: [displaySkills.length] });

    // Conditional height: If no skills, just normal height. if Skills, full screen (pinned)
    const sectionHeight = displaySkills.length > 0 ? "h-screen" : "min-h-[60vh] border-b border-white/5";

    return (
        <section
            ref={containerRef}
            className={`relative ${sectionHeight} bg-background z-10 overflow-hidden`}
        >
            <div className="w-full h-full flex items-center justify-center">
                {/* Background Grid Pattern */}
                <BackgroundGrid />

                {displaySkills.length > 0 && (
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 hidden md:block opacity-20 pointer-events-none">
                        <WatermarkText text="TOOLS" />
                    </div>
                )}

                <div className="container px-4 md:px-12 relative z-10 mx-auto max-w-7xl h-full flex flex-col justify-center items-center">
                    {displaySkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full pt-20">

                            {/* Header Section */}
                            <div
                                ref={headerRef}
                                className="col-span-1 md:col-span-3 lg:col-span-3 mb-8 md:mb-0 text-center md:text-left opacity-0" // start opacity 0 for GSAP
                            >
                                <SectionHeading number="03" title="SKILLS" className="mb-6 justify-center md:justify-start" />
                                <h2 className="headline-secondary mb-4">
                                    TECH<br />STACK
                                </h2>
                                <p className="description-text">
                                    A curated collection of modern technologies I use to build robust, scalable, and beautiful digital experiences.
                                </p>
                            </div>

                            {/* Skills Grid */}
                            <div className="col-span-1 md:col-span-9 lg:col-span-9 w-full">
                                <div
                                    ref={cardsRef}
                                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-y-6"
                                >
                                    {displaySkills.map((skill) => (
                                        // opacity-0 by default, handled by GSAP
                                        <div key={skill.id} className="opacity-0">
                                            <SkillCard skill={skill} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center z-20">
                            <h2 className="headline-secondary text-white mb-4">TECH STACK</h2>
                            <p className="section-label text-muted-foreground">No skills added yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
