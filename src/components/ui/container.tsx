import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "container px-4 md:px-8 mx-auto relative z-10",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Container.displayName = "Container"

export { Container }
