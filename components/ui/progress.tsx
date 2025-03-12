"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({
    className,
    value,
    indicatorClassName,
    indicatorStyle, // New prop for inline styles
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    indicatorStyle?: React.CSSProperties;
}) {
    return (
        <ProgressPrimitive.Root
            data-slot='progress'
            className={cn(
                "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot='progress-indicator'
                className={cn(
                    "h-full w-full flex-1 transition-all",
                    indicatorClassName // Custom class
                )}
                style={{
                    transform: `translateX(-${100 - (value || 0)}%)`,
                    ...indicatorStyle, // Apply inline styles dynamically
                }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
