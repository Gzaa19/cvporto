"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ICON_MAP } from "@/lib/icons-map";
import { useEffect } from "react";

interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string;
    imageUrl?: string | null;
    projectUrl?: string | null;
    githubUrl?: string | null;
    order: number;
}

interface AdminProjectPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}

export default function ProjectDetailModal({
    isOpen,
    onClose,
    project,
}: AdminProjectPreviewModalProps) {

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content - Mimicking Projects.tsx Layout */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
                    >
                        {/* Header / Close Button */}
                        <div className="absolute top-4 right-4 z-50">
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 justify-center items-center lg:items-start">
                                {/* Text Content */}
                                <div className="w-full lg:w-[45%] relative z-20 flex flex-col items-start text-left">
                                    {/* Number Watermark (Static for preview) */}
                                    <div className="absolute -top-10 -left-4 text-7xl md:text-9xl font-bold font-mono text-white/5 pointer-events-none select-none z-0">
                                        0{project.order || 1}
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-4 relative z-10 pt-4">
                                        <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                            {project.title}
                                        </h3>
                                        <div
                                            className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin overscroll-contain"
                                            data-lenis-prevent
                                        >
                                            <div className="text-muted-foreground text-base md:text-lg leading-relaxed prose prose-invert max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2 [&>p]:mb-4 [&_strong]:text-primary">
                                                <ReactMarkdown>
                                                    {project.description}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-3 relative z-10 justify-start mt-6 items-center">
                                        {project.tags.split(',').map((tag, i) => {
                                            const tagName = tag.trim();
                                            const matchedKey = Object.keys(ICON_MAP).find(k => k.toLowerCase() === tagName.toLowerCase());
                                            const iconUrl = matchedKey ? ICON_MAP[matchedKey] : null;
                                            const isNextJs = matchedKey === "Next.js" || tagName.toLowerCase() === "next.js";

                                            if (!iconUrl) {
                                                return (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 border border-white/10 bg-white/5 text-white/60 text-xs font-mono uppercase tracking-wider"
                                                    >
                                                        {tagName}
                                                    </span>
                                                );
                                            }

                                            return (
                                                <div key={i} className="group/icon relative" title={tagName}>
                                                    <div className="w-10 h-10 p-2 bg-white/5 border border-white/10 rounded-md flex items-center justify-center">
                                                        <img
                                                            src={iconUrl}
                                                            alt={tagName}
                                                            className={`w-full h-full object-contain ${isNextJs ? 'invert' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* View Project Link */}
                                    <div className="pt-8 flex gap-6">
                                        {project.projectUrl && (
                                            <Link
                                                href={project.projectUrl}
                                                target="_blank"
                                                className="group/link inline-flex items-center gap-3 text-white font-bold tracking-[0.2em] uppercase text-sm hover:text-primary transition-colors"
                                            >
                                                VIEW PROJECT
                                                <ArrowUpRight className="w-5 h-5 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" />
                                            </Link>
                                        )}
                                        {project.githubUrl && (
                                            <Link
                                                href={project.githubUrl}
                                                target="_blank"
                                                className="group/link inline-flex items-center gap-3 text-muted-foreground font-bold tracking-[0.2em] uppercase text-sm hover:text-white transition-colors"
                                            >
                                                GITHUB REPO
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Image Preview */}
                                <div className="w-full lg:w-[55%] max-w-3xl">
                                    <div className="relative aspect-video w-full overflow-hidden bg-[#0d0d0d] border border-white/10 group/image">
                                        {project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black border border-white/5">
                                                <div className="w-32 h-32 rounded-full bg-primary/20 blur-[100px]" />
                                                <span className="text-sm font-mono text-muted-foreground/50 tracking-widest uppercase relative z-10">
                                                    No Image Preview
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
