import React from "react"
import { Bell, Calendar, Pin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Notice {
  id: number | string
  title: string
  content: string
  date: string
  type: 'urgent' | 'info' | 'event'
  isPinned?: boolean
}

interface NoticeBoardProps {
  notices: Notice[]
  className?: string
}

export function NoticeBoard({ notices, className }: NoticeBoardProps) {
  const sortedNotices = [...notices].sort((a, b) =>
    (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
  )

  // Mapping types to shadcn theme variables
  const typeStyles = {
    urgent: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-primary/10 text-primary border-primary/20",
    event: "bg-accent text-accent-foreground border-border",
  }

  return (
    <Card className={cn("bg-card text-card-foreground shadow-md", className)}>
      <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          {/* Using primary color for the icon */}
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold tracking-tight">Notice Board</CardTitle>
        </div>
        <Badge variant="secondary" className="rounded-sm font-medium">
          {notices.length} Updates
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[450px] px-4">
          <div className="space-y-3 py-4">
            {sortedNotices.map((notice) => (
              <div
                key={notice.id}
                className={cn(
                  "group relative p-4 rounded-lg border transition-all duration-200",
                  "bg-card hover:bg-accent/50 hover:border-accent-foreground/10",
                  "border-border" // Uses your app.css --border variable
                )}
              >
                {notice.isPinned && (
                  <Pin className="absolute top-3 right-3 h-3 w-3 text-primary rotate-45 fill-current opacity-70" />
                )}

                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={cn("capitalize text-[10px] font-bold", typeStyles[notice.type])}
                  >
                    {notice.type}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {notice.date}
                  </span>
                </div>

                <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {notice.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
