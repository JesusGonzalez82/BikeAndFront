import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "../lib/utils"

const ChartContainer = React.forwardRef(({ config, children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, className, hideLabel = false }, ref) => {
    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background p-2 shadow-sm",
          className
        )}
      >
        {!hideLabel && (
          <div className="mb-2 text-sm font-medium">
            {payload[0]?.payload?.month}
          </div>
        )}
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }