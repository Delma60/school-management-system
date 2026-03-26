import React from "react"
import { Activity, CreditCard, UserPlus, LogIn, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: number | string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  type: 'payment' | 'admission' | 'security' | 'attendance'
  description: string
  timestamp: string
  status?: 'success' | 'warning' | 'info'
}

interface ActivityCardProps {
  activities: ActivityItem[]
  className?: string
}

export function RecentActivity({ activities, className }: ActivityCardProps) {

  // Icon mapper based on activity type
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-4 w-4 text-emerald-500" />
      case 'admission': return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'security': return <LogIn className="h-4 w-4 text-orange-500" />
      case 'attendance': return <CheckCircle2 className="h-4 w-4 text-indigo-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className={cn("bg-card text-card-foreground shadow-md flex flex-col", className)}>
      <CardHeader className="border-b bg-muted/20 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Live Feed</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="">
          <div className="relative">
            {/* The vertical timeline line */}
            <div className="absolute left-9 top-0 bottom-0 w-px bg-border ml-[2px]" />

            <div className="py-6 px-4 space-y-8">
              {activities.map((item) => (
                <div key={item.id} className="relative flex gap-4 items-start group">

                  {/* Avatar with Type Icon Overlay */}
                  <div className="relative z-10 shrink-0">
                    <Avatar className="h-10 w-10  shadow-sm">
                      <AvatarImage src={item.user.avatar} />
                      <AvatarFallback className=" text-[10px] font-bold">
                        {item.user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 border shadow-sm group-hover:scale-110 transition-transform">
                      {getIcon(item.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold leading-none truncate">
                        {item.user.name}
                      </p>
                      <time className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                        {item.timestamp}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
