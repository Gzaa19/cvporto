import { cn } from "@/lib/utils";

interface BackgroundGridProps {
    className?: string;
    opacity?: number;
    centered?: boolean;
}

export function BackgroundGrid({ className, opacity = 0.08, centered = true }: BackgroundGridProps) {
    return (
        <div
            className={cn("bg-grid", className)}
            style={{
                opacity,
                maskImage: centered
                    ? "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 90%)"
                    : undefined,
                WebkitMaskImage: centered
                    ? "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 90%)"
                    : undefined,
            }}
        />
    );
}
