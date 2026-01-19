"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";


interface ExperienceCardProps {
    role: string;
    company: string;
    location: string;
    workType: string;
    period: string;
    description: string;
    index: number;
}

export default function ExperienceCard({
    role,
    company,
    location,
    workType,
    period,
    description,
    index
}: ExperienceCardProps) {
    return (
        <div
            className="group relative flex-shrink-0 w-[85vw] md:w-[600px] p-6 md:p-10 bg-[#0d0d0d] border border-white/10 hover:border-primary/50 transition-colors duration-500 flex flex-col justify-start"
        >
            {/* Watermark Number - Top Right */}
            <div className="absolute top-4 md:top-6 right-4 md:right-8 opacity-10 group-hover:opacity-20 transition-opacity select-none pointer-events-none">
                <span className="text-5xl md:text-8xl font-black text-white font-mono tracking-tighter">
                    0{index + 1}
                </span>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header Section */}
                <div className="mb-4 md:mb-6 space-y-3 md:space-y-4 pr-10 md:pr-16">
                    {/* Role */}
                    <h3 className="text-xl md:text-3xl font-bold font-mono text-white group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                        {role}
                    </h3>

                    {/* Meta Info Grid */}
                    <div className="space-y-3">
                        {/* Company & Location */}
                        <div className="flex flex-col gap-0.5 md:gap-1">
                            <span className="text-base md:text-lg font-mono text-primary font-medium tracking-wide">
                                {company}
                            </span>
                            {location && (
                                <span className="text-xs md:text-sm font-mono text-muted-foreground/60">
                                    {location}
                                </span>
                            )}
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-1">
                            <span className="inline-flex items-center px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-mono text-muted-foreground tracking-wider uppercase">
                                {period}
                            </span>
                            <span className="inline-flex items-center px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] md:text-xs font-mono text-primary font-bold tracking-wider uppercase">
                                {workType}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 mb-4 md:mb-6 group-hover:bg-white/10 transition-colors" />

                {/* Description */}
                <div className="flex-grow">
                    <div className="text-muted-foreground leading-relaxed text-sm md:text-[15px] font-light">
                        <ReactMarkdown
                            components={{
                                p: ({ children }: any) => <p className="mb-3 last:mb-0">{children}</p>,
                                ul: ({ children }: any) => <ul className="space-y-2.5 my-3">{children}</ul>,
                                li: ({ children }: any) => (
                                    <li className="flex items-start gap-3">
                                        <span className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-80" />
                                        <span className="text-muted-foreground/90 leading-relaxed text-[15px] font-light">
                                            {children}
                                        </span>
                                    </li>
                                ),
                                strong: ({ children }: any) => <strong className="text-white font-semibold">{children}</strong>,
                            }}
                        >
                            {description}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
