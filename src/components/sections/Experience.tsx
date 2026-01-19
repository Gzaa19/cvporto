"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { BackgroundGrid } from "@/components/ui/background-grid";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ExperienceCard from "@/components/ui/ExperienceCard";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
    id: string;
    role: string;
    company: string;
    location: string;
    workType: string;
    period: string;
    description: string;
    order: number;
}

interface ExperienceProps {
    experiences?: Experience[];
}

export default function Experience({ experiences = [] }: ExperienceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const content = contentRef.current;
        const container = containerRef.current;
        if (!content || !container || experiences.length === 0) return;

        // Calculate the total scrollable width
        // We subtract the viewport width to know how much we need to translate left
        const getScrollAmount = () => {
            // Add a small buffer ensuring we definitely see the end padding
            return -(content.scrollWidth - window.innerWidth + 48);
        };

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`, // Dynamically set scroll length based on content width
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
            }
        });

        timeline.to(content, {
            x: getScrollAmount,
            ease: "none"
        });

    }, { scope: containerRef, dependencies: [experiences] });

    // If no experiences, show minimal height section
    if (experiences.length === 0) {
        return (
            <section
                id="experience"
                className="relative min-h-[50vh] bg-background z-50 flex items-center justify-center"
            >
                <BackgroundGrid />
                <div className="text-center">
                    <SectionHeading number="04" title="EXPERIENCE" className="mb-4" />
                    <p className="text-muted-foreground">No experience added yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={containerRef}
            id="experience"
            className="relative h-screen bg-background z-50 overflow-hidden"
        >
            {/* The wrapper that gets pinned is the section itself (h-screen) */}
            <div className="relative flex h-full items-center overflow-hidden">
                <BackgroundGrid />

                <div
                    ref={contentRef}
                    className="flex gap-6 md:gap-16 items-center pl-4 md:pl-24 pr-4 md:pr-12 min-w-full w-max will-change-transform"
                >
                    {/* Header - Part of the scroll flow now */}
                    <div className="flex-shrink-0 w-[200px] md:w-[400px] text-left">
                        <SectionHeading number="04" title="EXPERIENCE" className="mb-2 md:mb-4" />
                        <h2 className="headline-secondary text-3xl md:text-5xl lg:text-7xl">
                            My <br />
                            <span className="text-white/20">Journey</span>
                        </h2>
                    </div>

                    {/* Cards */}
                    {experiences.map((exp, index) => (
                        <ExperienceCard
                            key={exp.id}
                            index={index}
                            role={exp.role}
                            company={exp.company}
                            location={exp.location}
                            workType={exp.workType}
                            period={exp.period}
                            description={exp.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
