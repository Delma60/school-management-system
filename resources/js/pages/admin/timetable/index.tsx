import { AddSlotModal } from '@/components/add-slot-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Break, Classroom, Subject, Teacher, TimetableEntry } from '@/types';
import { Head, router } from '@inertiajs/react';
import { BookOpen, Calendar, Filter, MoreVertical, Plus, User } from 'lucide-react';
import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['7:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

interface Props {
    classrooms: Classroom[];
    schedule: TimetableEntry[];
    subjects: Subject[];
    teachers: Teacher[];
    breaks: Break[];
    selectedClassroomId: string;
}
export default function TimetableIndex({ classrooms, schedule, subjects, teachers, breaks, selectedClassroomId="1" }: Props) {
    const [selectedClassroom, setSelectedClassroom] = useState<string>(selectedClassroomId ?? "1");
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const [prefilledDay, setPrefilledDay] = useState<string | undefined>();
    const [prefilledTime, setPrefilledTime] = useState<string | undefined>();

    // Helper to find entry for a specific slot
    const getEntry = (day: string, time: string) => {
        return schedule.find((s) => s.day_of_week === day && s.start_time.startsWith(time));
    };

    const handleClassroomChange = (classroomId: string) => {
        setSelectedClassroom(classroomId);
        router.get(
            route('timetables.index'),
            { classroom_id: classroomId },
            {
                preserveState: false,
                replace: true,
            },
        );
    };
    // Helper to calculate duration in hours
    const calculateDuration = (startTime: string, endTime: string) => {
        const [startHour] = startTime.split(':');
        const [endHour] = endTime.split(':');
        return parseInt(endHour) - parseInt(startHour);
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title="Master Timetable" />

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            <Calendar className="text-primary h-6 w-6" /> Timetable Manager
                        </h1>
                        <p className="text-muted-foreground text-sm">Draft and publish weekly schedules for all classes.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={selectedClassroom} onValueChange={handleClassroomChange}>
                            <SelectTrigger className="bg-background w-[200px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Select Classroom" />
                            </SelectTrigger>
                            <SelectContent>
                                {classrooms.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name} ({c.grade_level})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="gap-2" onClick={() => setIsAddSlotOpen(true)}>
                            <Plus className="h-4 w-4" /> Add Slot {selectedClassroom}
                        </Button>
                    </div>
                </div>

                {/* Timetable Grid */}
                <Card className="border-t-primary border-t-4 shadow-none">
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
                                            <td className="bg-muted/20 text-muted-foreground border p-4 align-top text-xs font-semibold">{time}</td>

                                            {/* Day Columns */}
                                            {DAYS.map((day) => {
                                                const entry = getEntry(day, time);
                                                const duration = calculateDuration(String(entry?.start_time), String(entry?.end_time));
                                                const rowSpan = Math.max(1, duration);
                                                const breakColor = entry?.timebreak?.color || '#94a3b8';

                                                return (
                                                    <td
                                                        key={day}
                                                        rowSpan={rowSpan}
                                                        className={`group/cell hover:bg-muted/30 relative w-1/5 border p-2 transition-colors`}
                                                    >
                                                        {/* // Inside your grid mapping in Index.tsx ... */}
                                                        {entry ? (
                                                            <div
                                                                className={`flex h-full w-full flex-col justify-between rounded-lg border p-3 shadow-sm ${
                                                                    entry.entry_type === 'break'
                                                                        ? 'repeating-stripes rounded-none border-none shadow-none'
                                                                        : 'bg-card'
                                                                }`}
                                                            >
                                                                {/* --- RENDER CLASS --- */}
                                                                {entry.entry_type === 'class' && (
                                                                    <>
                                                                        <div>
                                                                            <div className="mb-1 flex items-start justify-between">
                                                                                <span className="text-primary max-w-[80%] truncate text-xs font-bold">
                                                                                    {entry.subject?.name}
                                                                                </span>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="-mt-1 -mr-2 h-6 w-6 opacity-0 transition-opacity group-hover/cell:opacity-100"
                                                                                >
                                                                                    <MoreVertical className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <p className="text-muted-foreground flex items-center gap-1 font-mono text-[10px] tracking-tighter uppercase">
                                                                                    <BookOpen className="h-2.5 w-2.5" /> {entry.subject?.code}
                                                                                </p>
                                                                                <p className="flex items-center gap-1 truncate text-[11px] font-medium">
                                                                                    <User className="h-2.5 w-2.5" /> {entry.teacher?.name}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="mt-2 flex items-center justify-between border-t border-dashed pt-2">
                                                                            <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
                                                                                Room {entry.classroom?.room_number || 'TBD'}
                                                                            </Badge>
                                                                            <span className="text-muted-foreground text-[9px]">
                                                                                {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* --- RENDER BREAK --- */}
                                                                {entry.entry_type === 'break' && (
                                                                    <div
                                                                        className="flex h-full w-full flex-col items-center justify-center rounded-sm border-l-4 p-2 shadow-sm transition-all"
                                                                        style={{
                                                                            backgroundColor: `${breakColor}15`, // 15% opacity background
                                                                            borderColor: breakColor,
                                                                            color: breakColor,
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            {/* Dynamic label based on the Break interface 'type' */}
                                                                            <span className="text-[10px] font-black tracking-tighter uppercase opacity-70">
                                                                                {entry.timebreak?.type.replace('_', ' ')}
                                                                            </span>

                                                                            <span className="text-center text-xs leading-tight font-bold text-slate-900">
                                                                                {entry.timebreak?.name}
                                                                            </span>
                                                                        </div>

                                                                        <span className="mt-1 font-mono text-[9px] font-medium opacity-60">
                                                                            {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                                                                        </span>
                                                                    </div>
                                                                    // <div className="flex h-full flex-col items-center justify-center space-y-2 text-center opacity-80">
                                                                    //     <div className="absolute top-2 right-2 flex w-full justify-between">
                                                                    //         <span /> {/* Spacer */}
                                                                    //         <Button
                                                                    //             variant="ghost"
                                                                    //             size="icon"
                                                                    //             className="h-6 w-6 opacity-0 transition-opacity group-hover/cell:opacity-100"
                                                                    //         >
                                                                    //             <MoreVertical className="h-3 w-3 text-amber-700" />
                                                                    //         </Button>
                                                                    //     </div>
                                                                    //     <Coffee className="mb-1 h-5 w-5 text-amber-600 dark:text-amber-500" />
                                                                    //     <div>
                                                                    //         <span className="block text-xs font-bold text-amber-800 dark:text-amber-400">
                                                                    //             {entry.timebreak?.name || 'Break'}
                                                                    //             {/* {entry.timebreak?.color || 'Break'} */}
                                                                    //             {/* {entry.timebreak?.color || 'Break'} */}
                                                                    //             {/* {JSON.stringify(entry)} */}
                                                                    //         </span>
                                                                    //         <span className="font-mono text-[10px] text-amber-600/80 dark:text-amber-500/80">
                                                                    //             {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                                                                    //         </span>
                                                                    //     </div>
                                                                    // </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            /* ... Empty slot Add Button ... */
                                                            <div className="flex h-full w-full items-center justify-center opacity-0 transition-opacity group-hover/cell:opacity-100">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setPrefilledDay(day);
                                                                        setPrefilledTime(time);
                                                                        setIsAddSlotOpen(true);
                                                                    }}
                                                                    className="border-primary text-primary h-8 w-8 rounded-full border border-dashed"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
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

                {/* Legend / Info */}
                <div className="text-muted-foreground bg-muted/30 flex flex-wrap gap-6 rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary h-3 w-3 rounded-full" /> Classes
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-1 rounded-full" style={{ backgroundColor: '#FFA500' }} /> Breaks & Events
                    </div>
                    {breaks?.map((brk) => (
                        <div key={brk.id} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: brk.color || '#FFA500' }} />
                            {brk.name}
                        </div>
                    ))}
                </div>
            </div>
            <AddSlotModal
                open={isAddSlotOpen}
                onOpenChange={(open) => {
                    setIsAddSlotOpen(open);
                    if (!open) {
                        setPrefilledDay(undefined);
                        setPrefilledTime(undefined);
                    }
                }}
                classroomId={selectedClassroom ? parseInt(selectedClassroom) : classrooms[0]?.id || 0}
                subjects={subjects}
                teachers={teachers}
                breaks={breaks}
                prefilledDay={prefilledDay}
                prefilledTime={prefilledTime}
            />
        </AppLayout>
    );
}
