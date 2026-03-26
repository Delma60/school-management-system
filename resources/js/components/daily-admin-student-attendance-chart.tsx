import React from "react"
import { Users, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AttendanceData {
  date: string
  count: number
}

interface AttendanceChartProps {
  data: AttendanceData[]
  className?: string
}

export function DailyAttendanceChart({ data, className }: AttendanceChartProps) {
  return (
    <Card className={cn("bg-card text-card-foreground shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 py-5">
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">Daily Attendance</CardTitle>
          </div>
          <CardDescription>
            Total student presence recorded over the last 7 days
          </CardDescription>
        </div>
        <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-emerald-500 font-bold">
                <TrendingUp className="h-4 w-4" />
                <span>+2.4%</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-medium">vs last week</span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold">
                              Date
                            </span>
                            <span className="text-sm font-bold">
                              {payload[0].payload.date}
                            </span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase text-muted-foreground font-bold">
                              Students
                            </span>
                            <span className="text-sm font-bold text-primary">
                              {payload[0].value}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
