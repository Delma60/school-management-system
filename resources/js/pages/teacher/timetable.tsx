import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { TimetableEntry } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Calendar, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

interface Props {
    schedule: TimetableEntry[];
}

export default function TeacherTimetableIndex({ schedule }: Props) {
    // Helper to find entry for a specific slot
    const getEntry = (day: string, time: string) => {
        return schedule.find((s) => s.day_of_week === day && s.start_time.startsWith(time));
    };

    // Helper to calculate duration in hours for row spanning
    const calculateDuration = (startTime: string, endTime: string) => {
        const [startHour] = startTime.split(':');
        const [endHour] = endTime.split(':');
        return parseInt(endHour) - parseInt(startHour);
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title="My Timetable" />

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            <Calendar className="text-primary h-6 w-6" /> My Weekly Schedule
                        </h1>
                        <p className="text-muted-foreground text-sm">View your assigned classes and room locations.</p>
                    </div>
                </div>

                {/* Timetable Grid */}
                <Card className="border-t-primary shadow-sm border-t-4">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="text-muted-foreground w-24 border p-4 text-left font-medium">Time</th>
                                        {DAYS.map((day) => (
                                            <th key={day} className="border p-4 text-center font-bold tracking-tight">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TIME_SLOTS.map((time) => (
                                        <tr key={time} className="group">
                                            {/* Time Column */}
                                            <td className="bg-muted/20 text-muted-foreground border p-4 align-top text-xs font-semibold">
                                                {time}
                                            </td>

                                            {/* Day Columns */}
                                            {DAYS.map((day) => {
                                                const entry = getEntry(day, time);
                                                
                                                // If an entry starts at this time, calculate how many blocks it takes up
                                                const duration = entry ? calculateDuration(String(entry.start_time), String(entry.end_time)) : 1;
                                                const rowSpan = Math.max(1, duration);

                                                return (
                                                    <td
                                                        key={day}
                                                        rowSpan={rowSpan}
                                                        className="relative w-1/5 border p-2 transition-colors hover:bg-muted/10"
                                                    >
                                                        {entry ? (
                                                            <div className="bg-card flex h-full w-full flex-col justify-between rounded-lg border p-3 shadow-sm border-l-4 border-l-primary">
                                                                <div>
                                                                    <div className="mb-1 flex items-start justify-between">
                                                                        <span className="text-primary max-w-[90%] truncate text-xs font-bold">
                                                                            {entry.subject?.name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-muted-foreground flex items-center gap-1 font-mono text-[10px] tracking-tighter uppercase">
                                                                            <BookOpen className="h-2.5 w-2.5" /> {entry.subject?.code}
                                                                        </p>
                                                                        <p className="flex items-center gap-1 truncate text-[11px] font-medium text-foreground">
                                                                            <MapPin className="h-2.5 w-2.5 text-muted-foreground" /> 
                                                                            {entry.classroom?.name}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-2 flex items-center justify-between border-t border-dashed pt-2">
                                                                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] bg-primary/5">
                                                                        Room {entry.classroom?.room_number || 'TBD'}
                                                                    </Badge>
                                                                    <span className="text-muted-foreground text-[9px] font-medium">
                                                                        {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            /* Empty Read-Only Slot */
                                                            <div className="flex h-full w-full items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                                                                <span className="text-xs text-muted-foreground font-medium">Free</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Simple Legend */}
                <div className="text-muted-foreground bg-muted/30 flex flex-wrap gap-6 rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary h-3 w-3 rounded-full" /> Assigned Class
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-muted h-3 w-3 rounded-full border" /> Free Period
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}