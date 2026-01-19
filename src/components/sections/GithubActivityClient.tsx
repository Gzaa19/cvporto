"use client";

import { FolderGit2, Users, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { BackgroundGrid } from "@/components/ui/background-grid";
import AnimatedMascot from "@/components/ui/AnimatedMascot";

interface GithubActivityClientProps {
    user: any;
}

export default function GithubActivityClient({ user }: GithubActivityClientProps) {

    if (!user) {
        return null;
    }

    const {
        name,
        login,
        avatarUrl,
        repositories,
        followers,
        following,
        contributionsCollection
    } = user;

    const calendar = contributionsCollection.contributionCalendar;
    const total = calendar.totalContributions;
    const weeks = calendar.weeks;

    // Month labels logic
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const weekLabels: { index: number, label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week: any, index: number) => {
        const firstDay = new Date(week.contributionDays[0].date);
        const month = firstDay.getMonth();
        if (month !== lastMonth) {
            weekLabels.push({ index, label: months[month] });
            lastMonth = month;
        }
    });

    // Animation Variants
    const floatingVariant = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    const floatingVariantReverse = {
        animate: {
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0],
            transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay: 1
            }
        }
    };

    const pulseVariant = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    const iconFloatVariant = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    }

    return (
        <Section className="py-32 flex flex-col items-center">

            {/* Background Grid Pattern (Subtle) */}
            <BackgroundGrid />

            <Container className="max-w-7xl w-full">

                {/* 1. TOP HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 relative w-full">

                    {/* Left Title Block with Orange Square */}
                    <div className="relative mb-8 md:mb-0">
                        {/* Decorative Orange Square (Outline) - Floating Animation */}
                        <motion.div
                            variants={floatingVariant}
                            animate="animate"
                            className="absolute -top-12 -left-6 w-16 h-16 border-2 border-orange-500 -rotate-12 z-0"
                        />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Github className="w-5 h-5 text-white" />
                                <span className="section-label text-muted-foreground">// COMMIT PATTERN</span>
                                <div className="h-px w-20 bg-muted-foreground/50 ml-2" />
                            </div>

                            <h2 className="headline-primary">
                                GITHUB
                            </h2>
                            <div className="flex items-center gap-2 md:gap-4">
                                <h2 className="headline-outline">
                                    ACTIVITY
                                </h2>
                                {/* Animated Octocat Mascot - visible on all screens */}
                                <div className="z-50 -mb-2 md:-mb-4">
                                    <AnimatedMascot />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Background Giant Text (Ghost) */}
                    <div className="absolute top-0 right-0 pointer-events-none opacity-[0.02] select-none -z-10 hidden lg:block">
                        <span className="text-[12rem] font-black uppercase">GITHUB</span>
                    </div>

                    {/* Floating White Tilted Square - Animated */}
                    <motion.div
                        variants={floatingVariantReverse}
                        animate="animate"
                        className="hidden lg:block absolute top-0 right-32 w-24 h-24 border-2 border-white/20 rotate-12"
                    />
                </div>


                {/* 2. MAIN CARD */}
                <div className="relative w-full">
                    {/* The Card Container - Using reusable Card component */}
                    <Card className="relative bg-black border-2 border-white/10 p-6 md:p-8 flex flex-col xl:flex-row gap-10 xl:gap-0 z-10 rounded-none shadow-none">

                        {/* LEFT: Profile Info */}
                        <div className="w-full xl:w-[350px] flex gap-5 items-center xl:pr-10 xl:border-r border-white/10 shrink-0">
                            <div className="relative shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={avatarUrl}
                                    alt={login}
                                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/10 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1 w-full overflow-hidden">
                                <h3 className="text-xl font-black font-mono text-white uppercase truncate tracking-tight">{name}</h3>
                                <p className="text-muted-foreground text-sm font-mono truncate mb-2">@{login}</p>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs font-mono text-muted-foreground">
                                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-default">
                                        <FolderGit2 className="w-3 h-3" />
                                        <b className="text-white">{repositories.totalCount}</b> REPOS
                                    </span>
                                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-default">
                                        <Users className="w-3 h-3" />
                                        <b className="text-white">{followers.totalCount}</b> FOLLOWERS
                                    </span>
                                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-default">
                                        <Users className="w-3 h-3" />
                                        <b className="text-white">{following.totalCount}</b> FOLLOWING
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* RIGHT: Calendar Grid */}
                        <div className="w-full xl:pl-10 flex flex-col justify-between overflow-hidden">

                            {/* Month Labels */}
                            <div className="flex w-full mb-2 text-[10px] text-muted-foreground font-mono">
                                {weekLabels.map((l, i) => (
                                    <div key={i} style={{
                                        width: `${(100 / weekLabels.length)}%`, // Approximate spacing
                                        textAlign: 'left'
                                    }}>
                                        {l.label}
                                    </div>
                                ))}
                            </div>

                            {/* The Grid Component */}
                            <div className="flex gap-[3px] overflow-x-auto pb-2 scrollbar-hide">
                                {weeks.map((week: any, i: number) => (
                                    <div key={i} className="flex flex-col gap-[3px]">
                                        {week.contributionDays.map((day: any, j: number) => {
                                            let bgClass = "bg-neutral-800"; // Empty
                                            // Green scale like GitHub
                                            if (day.contributionCount > 0) bgClass = "bg-[#0e4429]";
                                            if (day.contributionCount > 2) bgClass = "bg-[#006d32]";
                                            if (day.contributionCount > 5) bgClass = "bg-[#26a641]";
                                            if (day.contributionCount > 10) bgClass = "bg-[#39d353]";

                                            return (
                                                <div
                                                    key={j}
                                                    className={`w-[10px] h-[10px] lg:w-[13px] lg:h-[13px] rounded-[2px] ${bgClass}`}
                                                    title={`${day.contributionCount} contributions on ${day.date}`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Footer Info */}
                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground font-mono">
                                <span>{total} contributions in the last year</span>
                                <div className="flex items-center gap-1">
                                    <span>Less</span>
                                    <div className="w-3 h-3 bg-neutral-800 rounded-[2px]" />
                                    <div className="w-3 h-3 bg-[#0e4429] rounded-[2px]" />
                                    <div className="w-3 h-3 bg-[#006d32] rounded-[2px]" />
                                    <div className="w-3 h-3 bg-[#26a641] rounded-[2px]" />
                                    <div className="w-3 h-3 bg-[#39d353] rounded-[2px]" />
                                    <span>More</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Offset Black Shadow Border (Bottom Right) */}
                    <div className="absolute top-3 left-3 w-full h-full bg-black border-2 border-white/20 -z-10" />

                    {/* Floating Blue Square - Animated */}
                    <motion.div
                        variants={floatingVariant}
                        animate="animate"
                        className="absolute -bottom-6 md:left-20 w-16 h-16 bg-blue-500 rotate-12 z-20 shadow-lg"
                    />

                    {/* Floating Orange/Yellow Square - Animated Pulse */}
                    <motion.div
                        variants={pulseVariant}
                        animate="animate"
                        className="absolute bottom-10 right-[15%] w-10 h-10 bg-orange-400 rotate-45 z-20 shadow-lg"
                    />

                </div>
            </Container>
        </Section>
    );
}
