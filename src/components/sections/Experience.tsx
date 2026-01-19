"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { BackgroundGrid } from "@/components/ui/background-grid";
import ExperienceCard from "@/components/ui/ExperienceCard";
import { HorizontalScrollSection } from "@/components/ui/horizontal-scroll-section";

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
    // If no experiences, show minimal height section
    if (experiences.length === 0) {
        return (
            <section
                className="relative min-h-[50vh] bg-background z-50 flex items-center justify-center top-0"
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
        <HorizontalScrollSection className="z-50" contentClassName="gap-6 md:gap-16">
            <BackgroundGrid />

            {/* Header Title */}
            <div className="shrink-0 w-[200px] md:w-[400px] text-left">
                <SectionHeading number="04" title="EXPERIENCE" className="mb-2 md:mb-4" />
                <h2 className="headline-secondary text-3xl md:text-5xl lg:text-7xl">
                    My <br />
                    <span className="text-white/20">Journey</span>
                </h2>
            </div>

            {/* Experience Cards */}
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
        </HorizontalScrollSection>
    );
}
