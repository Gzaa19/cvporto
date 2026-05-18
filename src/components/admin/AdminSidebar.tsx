"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Hero Settings", href: "/admin/hero" },
        { name: "About Settings", href: "/admin/about" },
        { name: "Project Settings", href: "/admin/projects" },
        { name: "Tech Stack", href: "/admin/skills" },
        { name: "Experience", href: "/admin/experience" },
    ];

    return (
        <aside
            className="h-full w-full border-r border-white/10 bg-[#0a0a0a] flex flex-col"
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
                <h1 className="text-xl font-bold font-mono tracking-tighter text-white">
                    Gaza/Admin
                </h1>
            </div>

            {/* Nav links — scrollable if overflow */}
            <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors font-mono ${isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Log Out — always pinned at bottom */}
            <div className="shrink-0 p-4 border-t border-white/10">
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-950/40 hover:text-red-400 transition-colors font-mono"
                    >
                        Log Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
