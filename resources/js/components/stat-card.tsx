import React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils" // Shadcn's utility for merging classes

interface GlassStatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function GlassStatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: GlassStatCardProps) {
  return (
    <Card className={cn(
      "bg-white/10 backdrop-blur-md border-white/20 shadow-xl  transition-all hover:bg-white/15",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium ">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-white/50" />
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>

        {(description || trend) && (
          <p className="text-xs text-white/50 mt-1">
            {trend && (
              <span className={cn(
                "font-medium mr-1",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}>
                {trend.value}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
