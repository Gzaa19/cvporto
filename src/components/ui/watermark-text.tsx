import { cn } from "@/lib/utils";
import { motion, MotionValue } from "framer-motion";

interface WatermarkTextProps {
    text: string;
    className?: string;
    x?: MotionValue<string>;
    animate?: boolean;
}

export function WatermarkText({ text, className, x, animate = false }: WatermarkTextProps) {
    if (animate && x) {
        return (
            <div className="watermark-text">
                <motion.h1
                    style={{ x }}
                    className={cn("text-[20vw] font-bold text-white/3 whitespace-nowrap leading-none tracking-tighter", className)}
                >
                    {text}
                </motion.h1>
            </div>
        );
    }

    return (
        <div className={cn("watermark-text hidden lg:block", className)}>
            <span className="text-[12rem] md:text-[20rem] font-black text-white/2 tracking-tighter uppercase">
                {text}
            </span>
        </div>
    );
}
