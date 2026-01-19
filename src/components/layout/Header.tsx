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
                <Link href="/" className="flex items-center gap-3 text-3xl md:text-4xl font-black font-mono tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">Gaza</span>
                    <span className="text-primary">Chansa</span>
                </Link>
                <nav className="hidden md:flex items-center gap-10 ml-auto">
                    <Link href="/" className="text-base font-semibold hover:text-primary transition-colors font-mono uppercase tracking-wider">
                        Home
                    </Link>
                    <Link href="#about" className="text-base font-semibold hover:text-primary transition-colors font-mono uppercase tracking-wider">
                        About
                    </Link>
                    <Link href="#experience" className="text-base font-semibold hover:text-primary transition-colors font-mono uppercase tracking-wider">
                        Experience
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
}
