"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { BackgroundGrid } from "@/components/ui/background-grid";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string;
    imageUrl?: string | null;
    projectUrl?: string | null;
    githubUrl?: string | null;
}

interface ProjectsProps {
    projects?: Project[];
}

const defaultProjects: Project[] = []; // Empty default

export default function Projects({ projects = [] }: ProjectsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll progress for drawing line inside content
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end 20%"]
    });

    return (
        <section
            id="projects"
            className="relative bg-background overflow-visible py-24 min-h-screen z-20"
        >
            {/* Background Grid */}
            <BackgroundGrid />

            <div className="w-full px-6 md:px-20 relative z-10">
                {/* Header - Centered */}
                <div className="flex justify-center mb-32">
                    <SectionHeading number="02" title="PROJECTS" />
                </div>

                {/* Projects List */}
                <div ref={containerRef} className="flex flex-col gap-32 relative">

                    {projects.length === 0 && (
                        <div className="text-center text-muted-foreground font-mono">
                            <p className="text-xl">Coming Soon...</p>
                            <p className="text-sm mt-2">Projects are being updated.</p>
                        </div>
                    )}

                    {projects.map((project, index) => (
                        <div key={project.id} className="relative z-10">


                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 justify-center items-center lg:items-start group`}
                            >
                                {/* Text Content */}
                                <div className="w-full lg:w-[40%] relative z-20 flex flex-col items-start text-left">
                                    {/* Number Watermark */}
                                    <div className="absolute -top-10 -left-4 text-7xl md:text-9xl font-bold font-mono text-white/10 transition-colors duration-500 group-hover:text-primary/20 pointer-events-none select-none z-0">
                                        0{index + 1}
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-4 relative z-10 pt-4">
                                        <h3 className="text-3xl md:text-5xl font-bold text-white transition-colors duration-300 group-hover:text-primary leading-tight">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-3 relative z-10 justify-start mt-6">
                                        {project.tags.split(',').map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-4 py-2 border border-white/10 bg-white/5 text-white/70 text-sm font-mono uppercase tracking-wider hover:border-primary/50 hover:text-primary transition-colors"
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* View Project Link */}
                                    <div className="pt-8 flex justify-start">
                                        <Link
                                            href={project.projectUrl || "#"}
                                            className="group/link inline-flex items-center gap-3 text-white font-bold tracking-[0.2em] uppercase text-sm hover:text-primary transition-colors"
                                        >
                                            VIEW PROJECT
                                            <ArrowUpRight className="w-5 h-5 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                <div className="w-full lg:w-[55%] max-w-3xl">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: false, amount: 0.3 }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                        className="relative aspect-video w-full overflow-hidden bg-[#0d0d0d] border border-white/10 transition-colors duration-300 group-hover:border-primary/50 group/image"
                                    >
                                        {/* Inner content area */}
                                        <div className="absolute inset-0 bg-black border border-white/5 overflow-hidden">
                                            {/* Gradient glow effect */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-32 h-32 rounded-full bg-primary/20 blur-[100px] opacity-0 group-hover/image:opacity-100 transition-opacity duration-700" />
                                            </div>

                                            {/* Preview text */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-sm font-mono text-muted-foreground/50 group-hover/image:text-primary/70 transition-colors tracking-widest uppercase">
                                                    Preview
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}
