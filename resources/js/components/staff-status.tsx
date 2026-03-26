import React from "react"
import { Users, Clock, UserMinus, GraduationCap, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function StaffStatusCard({ stats }: { stats: any }) {
  return (
    <Card className="bg-card text-card-foreground shadow-md">
      <CardHeader className="pb-2 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-bold">Faculty Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Attendance Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-muted-foreground">Staff Attendance</span>
            <span>42 / 45 Present</span>
          </div>
          <Progress value={93} className="h-2" />
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">In Class</span>
            <span className="text-xl font-bold">28</span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">On Leave</span>
            <span className="text-xl font-bold">03</span>
          </div>
        </div>

        {/* Quick List of Teachers on Leave */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Leave Today</h4>
          {['Dr. Aris', 'Mr. Thompson', 'Ms. Clara'].map((name) => (
            <div key={name} className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded border border-border">
              <div className="flex items-center gap-2">
                <UserMinus className="h-3 w-3 text-rose-500" />
                <span className="font-medium">{name}</span>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">Sick Leave</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
