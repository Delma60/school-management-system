// import React, { useState } from "react"
// import { Calendar as CalendarIcon, ChevronRight, Plus, MapPin, Clock } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Calendar } from "@/components/ui/calendar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"

// interface SchoolEvent {
//   id: string
//   title: string
//   date: Date
//   time: string
//   location: string
//   type: 'academic' | 'holiday' | 'meeting' | 'sports'
// }

// export function EventCalendarCard({ className }: { className?: string }) {
//   const [date, setDate] = useState<Date | undefined>(new Date())

//   // Sample data - in a real app, this comes from your Inertia props
//   const events: SchoolEvent[] = [
//     {
//         id: '1',
//         title: 'Mid-Term Examinations',
//         date: new Date(2026, 2, 25),
//         time: '08:00 AM',
//         location: 'Main Hall',
//         type: 'academic'
//     },
//     {
//         id: '2',
//         title: 'Easter Break',
//         date: new Date(2026, 3, 3),
//         time: 'All Day',
//         location: 'Campus Wide',
//         type: 'holiday'
//     },
//     {
//         id: '3',
//         title: 'Inter-School Sports',
//         date: new Date(2026, 2, 28),
//         time: '10:00 AM',
//         location: 'Athletic Field',
//         type: 'sports'
//     },
//   ]

//   const typeColors = {
//     academic: "bg-blue-500",
//     holiday: "bg-emerald-500",
//     meeting: "bg-amber-500",
//     sports: "bg-purple-500",
//   }

//   return (
//     <Card className={cn("bg-card text-card-foreground shadow-md overflow-hidden", className)}>
//       <CardHeader className="border-b bg-muted/20 py-4 flex flex-row items-center justify-between">
//         <div className="flex items-center gap-2">
//           <CalendarIcon className="h-5 w-5 text-primary" />
//           <CardTitle className="text-xl font-bold tracking-tight">School Calendar</CardTitle>
//         </div>
//         <Button size="sm" variant="outline" className="h-8 gap-1">
//           <Plus className="h-3.5 w-3.5" />
//           Add Event
//         </Button>
//       </CardHeader>

//       <CardContent className="p-0 flex flex-col lg:flex-row">
//         {/* Left Side: The Interactive Calendar */}
//         <div className="p-4 border-b lg:border-b-0 lg:border-r border-border bg-background/50 w-[30%]">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={setDate}
//             className="rounded-md border-none w-full"
//             classNames={{

//                 day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//                 day_today: "bg-accent text-accent-foreground font-bold",
//             }}
//           />
//         </div>

//         {/* Right Side: Upcoming Events List */}
//         <div className="flex-1 flex flex-col w-[50%] bg-card">
//           <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
//             <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Upcoming</h3>
//             <Badge variant="secondary" className="text-[10px]">{events.length} Planned</Badge>
//           </div>

//           <ScrollArea className="h-[300px] lg:h-[350px]">
//             <div className="p-4 space-y-4">
//               {events.map((event) => (
//                 <div key={event.id} className="group relative pl-4 border-l-2 border-transparent hover:border-primary transition-all">
//                   <div className={cn(
//                     "absolute left-[-2px] top-0 bottom-0 w-[2px] rounded-full",
//                     typeColors[event.type]
//                   )} />

//                   <div className="flex flex-col gap-1">
//                     <div className="flex items-center justify-between gap-2">
//                         <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
//                             {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                         </span>
//                         <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
//                     </div>

//                     <h4 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">
//                         {event.title}
//                     </h4>

//                     <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
//                         <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
//                             <Clock className="h-3 w-3" />
//                             {event.time}
//                         </div>
//                         <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
//                             <MapPin className="h-3 w-3" />
//                             {event.location}
//                         </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


import React, { useState } from "react"
import { Calendar as CalendarIcon, ChevronRight, Plus, MapPin, Clock, Loader2 } from "lucide-react"
import { useForm } from "@inertiajs/react" // Standard Inertia Form Hook
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export interface SchoolEvent {
  id: string
  title: string
  date: Date
  time: string
  location: string
  type: 'academic' | 'holiday' | 'meeting' | 'sports'
}

export function EventCalendarCard({ events, className }: { events:SchoolEvent[], className?: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)

  // Inertia Form Setup
  const { data, setData, post, processing, reset, errors } = useForm({
    title: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for backend
    time: '',
    location: '',
    type: 'academic',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("events.store"), {
      onSuccess: () => {
        setOpen(false)
        reset()
        toast.success("Event created successfully")

      },
      onError:(error) => {
        console.log(error)
        toast.error("Internal error occurred while creating eventing")

      }
    })
  }

//   const events: SchoolEvent[] = [
//     { id: '1', title: 'Mid-Term Examinations', date: new Date(2026, 2, 25), time: '08:00 AM', location: 'Main Hall', type: 'academic' },
//     { id: '2', title: 'Easter Break', date: new Date(2026, 3, 3), time: 'All Day', location: 'Campus Wide', type: 'holiday' },
//     { id: '3', title: 'Inter-School Sports', date: new Date(2026, 2, 28), time: '10:00 AM', location: 'Athletic Field', type: 'sports' },
//   ]

  const typeColors = {
    academic: "bg-blue-500",
    holiday: "bg-emerald-500",
    meeting: "bg-amber-500",
    sports: "bg-purple-500",
  }

  return (
    <Card className={cn("bg-card text-card-foreground shadow-md overflow-hidden", className)}>
      <CardHeader className="border-b bg-muted/20 py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold tracking-tight">School Calendar</CardTitle>
        </div>

        {/* --- ADD EVENT MODAL START --- */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={submit}>
              <DialogHeader>
                <DialogTitle>Create School Event</DialogTitle>
                <DialogDescription>
                  Add a new event to the campus-wide calendar.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Annual Science Fair" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={data.date} onChange={e => setData('date', e.target.value)} />

                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Category</Label>
                    <Select onValueChange={(value) => setData('type', value)} defaultValue={data.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" value={data.time} onChange={e => setData('time', e.target.value)} placeholder="09:00 AM" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Main Hall" />

                  {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}

                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={processing} className="w-full">
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Event
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* --- ADD EVENT MODAL END --- */}

      </CardHeader>

      <CardContent className="p-0 flex flex-col lg:flex-row">
        <div className="p-4 border-b lg:border-b-0 lg:border-r border-border bg-background/50 lg:w-[30%]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border-none w-full"
            classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-bold text-primary",
            }}
          />
        </div>

        <div className="flex-1 flex flex-col bg-card">
          <div className="p-4 border-b bg-muted/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Upcoming</h3>
            <Badge variant="secondary" className="text-[10px]">{events.length} Planned</Badge>
          </div>

          <ScrollArea className="h-[350px]">
            <div className="p-4 space-y-4">
              {events.map((event) => (
                <div key={event.id} className="group relative pl-4 border-l-2 border-transparent hover:border-primary transition-all">
                  <div className={cn("absolute left-[-2px] top-0 bottom-0 w-[2px] rounded-full", typeColors[event.type])} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </div>
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">{event.title}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" />{event.time}</div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" />{event.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
