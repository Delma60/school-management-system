import React from "react"
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  Users2,
  Heart,
  MessageCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SocialPlatform {
  name: 'Facebook' | 'Instagram' | 'Twitter' | 'YouTube'
  handle: string
  followers: string
  engagement: string
  url: string
  color: string
}

export function SocialsCard({ className }: { className?: string }) {
  const platforms: SocialPlatform[] = [
    {
      name: 'Facebook',
      handle: 'greenwood.high',
      followers: '4.2k',
      engagement: '+12%',
      url: '#',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Instagram',
      handle: '@greenwood_edu',
      followers: '8.1k',
      engagement: '+24%',
      url: '#',
      color: 'text-pink-600 dark:text-pink-400'
    },
    {
      name: 'Twitter',
      handle: '@GreenwoodHigh',
      followers: '2.5k',
      engagement: '-2%',
      url: '#',
      color: 'text-sky-500'
    },
  ]

  return (
    <Card className={cn("bg-card text-card-foreground shadow-md", className)}>
      <CardHeader className="border-b bg-muted/20 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold tracking-tight">Community Reach</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            Manage Links
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-full bg-muted transition-colors group-hover:bg-primary/10", platform.color)}>
                {platform.name === 'Facebook' && <Facebook className="h-5 w-5" />}
                {platform.name === 'Instagram' && <Instagram className="h-5 w-5" />}
                {platform.name === 'Twitter' && <Twitter className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold">{platform.name}</p>
                <p className="text-xs text-muted-foreground">{platform.handle}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold">{platform.followers}</p>
                <p className={cn(
                  "text-[10px] font-medium",
                  platform.engagement.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                )}>
                  {platform.engagement} growth
                </p>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t mt-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              LATEST COMMUNITY POST
            </div>
            <p className="text-xs italic leading-snug text-foreground/80">
              "Congratulations to our Class of 2026 for the record-breaking SAT scores! 🎓✨ #GreenwoodPride"
            </p>
            <div className="flex gap-3 mt-3">
               <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                 <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> 1.2k
               </span>
               <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                 <MessageCircle className="h-3 w-3" /> 84
               </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
