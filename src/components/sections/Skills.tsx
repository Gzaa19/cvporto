"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { WatermarkText } from "@/components/ui/watermark-text";
import { ICON_MAP } from "@/lib/icons-map";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 8;

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
    className?: string;
}) => {
    const iconUrl = ICON_MAP[skill.iconName] || ICON_MAP["React"];
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
    const [currentPage, setCurrentPage] = useState(0);
    const initialAnimDone = useRef(false);
    const isTransitioning = useRef(false);

    const displaySkills: SkillDisplay[] = skills.length > 0 ? skills.map((s, i) => ({
        id: s.id,
        number: `0${i + 1}`,
        name: s.name,
        category: s.category,
        iconName: s.iconName,
        order: s.order
    })).sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

    const totalPages = Math.ceil(displaySkills.length / ITEMS_PER_PAGE);
    const pagedSkills = displaySkills.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const handlePageChange = useCallback((newPage: number) => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        const cards = cardsRef.current?.children;
        if (!cards) {
            setCurrentPage(newPage);
            isTransitioning.current = false;
            return;
        }

        // Fade out current cards
        gsap.to(Array.from(cards), {
            opacity: 0,
            y: -20,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                setCurrentPage(newPage);
            },
        });
    }, []);

    // ScrollTrigger — only created ONCE for the initial reveal
    useGSAP(() => {
        if (!displaySkills.length) return;

        const container = containerRef.current;
        const header = headerRef.current;
        const cards = cardsRef.current?.children;

        if (!container || !cards) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=2000",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onLeave: () => { initialAnimDone.current = true; },
                onEnterBack: () => { initialAnimDone.current = true; },
            }
        });

        if (header) {
            tl.fromTo(header,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        const cardElements = Array.from(cards);

        cardElements.forEach((card, index) => {
            tl.fromTo(card,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
                0.5 + (index * 0.5)
            );
        });

        tl.to({}, { duration: 1 });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, { scope: containerRef, dependencies: [displaySkills.length] });

    // Animate cards in after page change (runs when currentPage updates and React re-renders new cards)
    useEffect(() => {
        if (currentPage === 0 && !initialAnimDone.current) {
            // First page initial load is handled by ScrollTrigger
            isTransitioning.current = false;
            return;
        }

        // Wait a tick for React to render the new cards
        const timer = requestAnimationFrame(() => {
            const cards = cardsRef.current?.children;
            if (!cards) {
                isTransitioning.current = false;
                return;
            }

            const cardElements = Array.from(cards);

            gsap.set(cardElements, { opacity: 0, y: 30, scale: 0.95 });

            gsap.to(cardElements, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                ease: "power2.out",
                stagger: 0.06,
                onComplete: () => {
                    isTransitioning.current = false;
                },
            });
        });

        return () => cancelAnimationFrame(timer);
    }, [currentPage]);

    const sectionHeight = displaySkills.length > 0 ? "h-screen" : "min-h-[60vh] border-b border-white/5";

    return (
        <section
            ref={containerRef}
            className={`relative ${sectionHeight} bg-background z-10 overflow-hidden`}
        >
            <div className="w-full h-full flex items-center justify-center">
                <BackgroundGrid />

                {displaySkills.length > 0 && (
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 hidden md:block opacity-20 pointer-events-none">
                        <WatermarkText text="TOOLS" />
                    </div>
                )}
                <div className="container px-4 md:px-12 relative z-10 mx-auto max-w-7xl h-full flex flex-col justify-center items-center">
                    {displaySkills.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full pt-20">
                            <div
                                ref={headerRef}
                                className="col-span-1 md:col-span-3 lg:col-span-3 mb-8 md:mb-0 text-center md:text-left opacity-0"
                            >
                                <SectionHeading number="03" title="SKILLS" className="mb-6 justify-center md:justify-start" />
                                <h2 className="headline-secondary mb-4">
                                    TECH<br />STACK
                                </h2>
                                <p className="description-text">
                                    A curated collection of modern technologies I use to build robust, scalable, and beautiful digital experiences.
                                </p>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-6 flex flex-col items-center md:items-start gap-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 0}
                                                className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/10 text-neutral-400 hover:text-primary hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 font-mono text-xs"
                                                aria-label="Previous page"
                                            >
                                                ‹
                                            </button>

                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(i)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage
                                                        ? 'bg-primary scale-125 shadow-[0_0_8px_rgba(0,255,255,0.4)]'
                                                        : 'bg-white/20 hover:bg-white/40'
                                                        }`}
                                                    aria-label={`Go to page ${i + 1}`}
                                                />
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages - 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/10 text-neutral-400 hover:text-primary hover:border-primary/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 font-mono text-xs"
                                                aria-label="Next page"
                                            >
                                                ›
                                            </button>
                                        </div>

                                        <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                                            {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="col-span-1 md:col-span-9 lg:col-span-9 w-full">
                                <div
                                    ref={cardsRef}
                                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-y-6"
                                >
                                    {pagedSkills.map((skill) => (
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
