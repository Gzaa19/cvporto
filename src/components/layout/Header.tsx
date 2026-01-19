"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Header() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Hide when scrolling down, show when scrolling up
        if (latest > previous && latest > 100) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 bg-transparent py-8"
        >
            <div className="w-full pl-4 md:pl-8 pr-6 md:pr-12 lg:pr-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl md:text-3xl font-black font-mono tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">Gaza</span>
                    <span className="text-primary">Chansa</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 ml-auto">
                    <Link href="#about" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors font-mono uppercase tracking-widest">
                        About
                    </Link>
                    <Link href="#projects" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors font-mono uppercase tracking-widest">
                        Projects
                    </Link>
                    <Link href="#skills" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors font-mono uppercase tracking-widest">
                        Skills
                    </Link>
                    <Link href="#experience" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors font-mono uppercase tracking-widest">
                        Experience
                    </Link>
                    <Link href="#github" className="text-xs lg:text-sm font-medium hover:text-primary transition-colors font-mono uppercase tracking-widest">
                        GitHub
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
}
