"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { BackgroundGrid } from "@/components/ui/background-grid";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        role: "Senior Frontend Engineer",
        company: "TechCorp Inc.",
        period: "2023 - Present",
        description: "Leading the frontend team in building a next-generation SaaS platform. Implemented micro-frontends architecture and improved performance by 40%."
    },
    {
        role: "Full Stack Developer",
        company: "Creative Solutions",
        period: "2021 - 2023",
        description: "Developed and maintained multiple client projects using React, Node.js, and AWS. Collaborated with designers to deliver pixel-perfect UIs."
    },
    {
        role: "Junior Web Developer",
        company: "StartUp Hub",
        period: "2019 - 2021",
        description: "Worked on the core product team, implementing new features and fixing bugs. Gained hands-on experience with modern web technologies."
    },
];

export default function Experience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const content = contentRef.current;
        const container = containerRef.current;
        if (!content || !container) return;

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

    }, { scope: containerRef });

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
                    className="flex gap-16 items-center pl-12 md:pl-24 pr-12 min-w-full w-max will-change-transform"
                >
                    {/* Header - Part of the scroll flow now */}
                    <div className="flex-shrink-0 w-[300px] md:w-[400px] text-left">
                        <SectionHeading number="04" title="EXPERIENCE" className="mb-4" />
                        <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            My <br />
                            <span className="text-white/20">Journey</span>
                        </h2>
                    </div>

                    {/* Cards */}
                    {experiences.map((exp, index) => (
                        <div
                            key={index}
                            className="group relative flex-shrink-0 w-[400px] md:w-[500px] p-8 md:p-12 bg-[#0d0d0d] border border-white/10 hover:border-primary/50 transition-colors duration-500"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl font-bold text-white font-mono">0{index + 1}</span>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
                                        {exp.role}
                                    </h3>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-muted-foreground/80 font-mono text-sm">
                                        <span className="text-primary/80">{exp.company}</span>
                                        <span className="px-3 py-1 rounded-full border border-white/10">{exp.period}</span>
                                    </div>
                                </div>

                                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
