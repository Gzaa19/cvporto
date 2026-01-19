import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode
    fullWidth?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, children, fullWidth = false, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn(
                    "relative py-16 md:py-24 bg-background overflow-hidden",
                    fullWidth ? "w-full" : "",
                    className
                )}
                {...props}
            >
                {children}
            </section>
        )
    }
)
Section.displayName = "Section"

export { Section }
