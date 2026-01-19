"use client";

import Image from "next/image";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";
import Snowfall from "react-snowfall";
import footerBg from "@/assets/footer-bg.jpg";

const contactLinks = [
    {
        icon: Mail,
        label: "gaza0alghozali@gmail.com",
        href: "mailto:gaza0alghozali@gmail.com",
    },
    {
        icon: Github,
        label: "Gzaa19",
        href: "https://github.com/Gzaa19",
    },
    {
        icon: Linkedin,
        label: "gazaalghozali",
        href: "https://www.linkedin.com/in/gazaalghozali/",
    },
];

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 h-[350px] z-0 overflow-hidden">
            {/* Background Image */}
            <Image
                src={footerBg}
                alt="Footer background"
                fill
                className="object-cover object-center"
                quality={90}
                priority={false}
            />

            {/* Snowfall Effect */}
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-50">
                <Snowfall
                    color="#ffffff"
                    snowflakeCount={150}
                    radius={[0.5, 2.5]}
                    speed={[0.5, 2.0]}
                    wind={[-0.5, 1.5]}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
            </div>

            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Marquee Text Slider */}
            <div className="absolute top-0 left-0 right-0 z-20 overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap py-3">
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="mx-4 text-sm font-mono text-white/80 uppercase tracking-widest">
                            LET&apos;S WORK TOGETHER • AVAILABLE FOR HIRE • LET&apos;S BUILD SOMETHING AMAZING •
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full container mx-auto px-6 md:px-12 flex items-center">
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-12">

                    {/* Left Side - Headline */}
                    <div>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] uppercase tracking-tight">
                            LET&apos;S
                            <br />
                            CONNECT
                        </h2>
                    </div>

                    {/* Right Side - Contact Links */}
                    <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[400px]">
                        {contactLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between gap-4 px-5 py-4 bg-[#1a1a2e]/80 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <link.icon className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" />
                                    <span className="font-mono text-sm md:text-base text-white/90 group-hover:text-white transition-colors">
                                        {link.label}
                                    </span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
