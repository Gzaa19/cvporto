"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Footer from "@/components/sections/Connect";
import LoadingScreen from "@/components/LoadingScreen";

interface HeroStatusData {
    location: string;
    currentRole: string;
    status: string;
    subtitle: string;
}

interface AboutContentData {
    greeting: string;
    name: string;
    introText: string;
    focusText: string;
}

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

interface Skill {
    id: string;
    name: string;
    category: string;
    iconName: string;
    order: number;
}

interface HomeClientProps {
    children: React.ReactNode;
    heroStatus: HeroStatusData;
    aboutContent: AboutContentData;
    projects: Project[];
    skills: Skill[];
    experiences: Experience[];
}



export default function HomeClient({
    children,
    heroStatus,
    aboutContent,
    projects = [],
    skills = [],
    experiences = []
}: HomeClientProps) {
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        // Trigger a resize event to ensure ScrollTrigger and Sticky elements recalculate positions
        // This is crucial when content height changes due to data loading (or lack thereof)
        const triggerResize = () => {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('resize'));
            }
        };

        // Immediate trigger
        triggerResize();

        // Delayed triggers to handle layout settling
        const t1 = setTimeout(triggerResize, 100);
        const t2 = setTimeout(triggerResize, 500);
        const t3 = setTimeout(triggerResize, 1000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [projects.length, skills.length, experiences.length]); // Track length changes specifically to avoid deep object diff issues

    return (
        <>
            {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}

            {/* Wrapper Utama untuk Parallax Footer */}
            <div className="relative">

                {/* MAIN CONTENT (TIRAI) - z-10, bg solid, shadow, mb = footer height */}
                <div className="relative z-10 bg-background shadow-2xl mb-[350px]">
                    <Header />
                    <main className="flex flex-col w-full">
                        <Hero heroStatus={heroStatus} />
                        {/* Sticky Parallax Container - About/Projects overlap each other */}
                        <div className="relative">
                            <div id="about" className="absolute top-0 w-full h-px -translate-y-24 visibility-hidden pointer-events-none" />
                            <About aboutContent={aboutContent} />

                            <div id="projects" className="absolute top-[100vh] w-full h-px -translate-y-24 visibility-hidden pointer-events-none" />
                            <Projects projects={projects} />
                        </div>

                        {/* Sticky Parallax Container - Skills sticks, Experience slides over */}
                        {/* Sticky Parallax Container - Skills sticks */}
                        <div className="relative">
                            <div id="skills" className="absolute top-0 w-full h-px -translate-y-24 visibility-hidden pointer-events-none" />
                            <Skills skills={skills} />
                        </div>

                        {/* Experience slides over */}
                        <div className="relative">
                            <div id="experience" className="absolute top-0 w-full h-px -translate-y-24 visibility-hidden pointer-events-none" />
                            <Experience experiences={experiences} />
                        </div>

                        {/* Github Activity (Server Component passed as child) */}
                        <div className="relative">
                            <div id="github" className="absolute top-0 w-full h-px -translate-y-24 visibility-hidden pointer-events-none" />
                            {children}
                        </div>
                    </main>
                </div>

                {/* FOOTER (YANG NGUMPET) - fixed di bawah, z-0 */}
                <Footer />
            </div>
        </>
    );
}
