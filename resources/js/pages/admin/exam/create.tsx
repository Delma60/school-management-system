import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Classroom, Subject, TimetableEntry } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Clock, Loader2, Save, Users } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'sonner';

interface ScheduleEntry {
    subject_id: number;
    date: string;
    start_time: string;
    end_time: string;
}

interface FormValue {
    name: string;
    term: string;
    session: string;
    start_date: string;
    end_date: string;
    classroom_ids: number[];
    schedules: ScheduleEntry[];
}
// Added 'classrooms' to the props
export default function CreateExam({ subjects, terms, sessions, classrooms }: { subjects: Subject[]; terms: string[]; classrooms: Classroom[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<FormValue>({
        name: '',
        term: '',
        session: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
        start_date: '',
        end_date: '',
        classroom_ids: [] as number[], // New state for classrooms
        schedules: [] as ScheduleEntry[],
    });

    // Toggle classroom inclusion
    const toggleClassroom = (classroomId: number) => {
        const exists = data.classroom_ids.includes(classroomId);
        if (exists) {
            setData(
                'classroom_ids',
                data.classroom_ids.filter((id) => id !== classroomId),
            );
        } else {
            setData('classroom_ids', [...data.classroom_ids, classroomId]);
        }
    };

    // Toggle subject inclusion
    const toggleSubject = (subjectId: number) => {
        const exists = data.schedules?.find((s) => s.subject_id === subjectId);
        if (exists) {
            setData(
                'schedules',
                data.schedules?.filter((s) => s.subject_id !== subjectId),
            );
        } else {
            setData('schedules', [...data.schedules, { subject_id: subjectId, date: '', start_time: '', end_time: '' }]);
        }
    };

    const updateSchedule = (subjectId: number, field: keyof ScheduleEntry, value: string) => {
        setData(
            'schedules',
            data.schedules?.map((s) => (s.subject_id === subjectId ? { ...s, [field]: value } : s)),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('exams.store'), {
            onSuccess: () => {
                toast.success('Examination successfully created');
                reset();
            },
            onError: () => {
                toast.error('Please fill in all required fields correctly.');
            },
        });
    };

    const selectedClassroomObjects = useMemo(() => {
        return classrooms.filter((cls: Classroom) => data.classroom_ids.includes(cls.id));
    }, [data.classroom_ids, classrooms]);

    // 2. Extract unique subjects from those classrooms' timetables
    const availableSubjects = useMemo(() => {
        if (selectedClassroomObjects.length === 0) return [];

        // Collect all subjects from all timetable entries across selected classes
        const subjectsMap = new Map();

        selectedClassroomObjects.forEach((cls: Classroom) => {
            cls.timetable?.forEach((entry: TimetableEntry) => {
                if (entry.subject && !subjectsMap.has(entry.subject.id)) {
                    subjectsMap.set(entry.subject.id, entry.subject);
                }
            });
        });

        return Array.from(subjectsMap.values());
    }, [selectedClassroomObjects]);

    return (
        <AppLayout>
            <Head title="Create Exam & Timetable" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={route('exams.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Exam & Timetable</h1>
                        <p className="text-muted-foreground text-sm">Setup the cycle, classes, and subjects.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    {/* --- COLUMN 1: Exam Settings (Left Side) --- */}
                    <div className="space-y-6 xl:col-span-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CalendarDays className="h-5 w-5 text-blue-500" />
                                    Exam Parameters
                                </CardTitle>
                                <CardDescription>Define the overarching timeframe.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Examination Name</Label>
                                    <Input
                                        placeholder="e.g. 2026 First Term Finals"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Term</Label>
                                        <Select onValueChange={(v) => setData('term', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {terms.map((t: string) => (
                                                    <SelectItem key={t} value={t}>
                                                        {t}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.term && <p className="text-destructive text-xs">{errors.term}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Session</Label>
                                        <Input value={data.session} onChange={(e) => setData('session', e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                                        {errors.start_date && <p className="text-destructive text-xs">{errors.start_date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                                        {errors.end_date && <p className="text-destructive text-xs">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* --- NEW SECTION: Participating Classes --- */}
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-green-500" />
                                    Participating Classes
                                </CardTitle>
                                <CardDescription>Select which classes will take this exam.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    {classrooms.map((cls: any) => (
                                        <div key={cls.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`cls-${cls.id}`}
                                                checked={data?.classroom_ids?.includes(cls.id)}
                                                onCheckedChange={() => toggleClassroom(cls.id)}
                                            />
                                            <Label htmlFor={`cls-${cls.id}`} className="cursor-pointer font-medium">
                                                {cls.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.classroom_ids && <p className="text-destructive mt-3 text-xs">Select at least one class.</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- COLUMN 2: Timetable Builder (Right Side) --- */}
                    <div className="xl:col-span-8">
                        {/* ... (Keep your exact same Right Column code here) ... */}
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Clock className="h-5 w-5 text-indigo-500" />
                                        Timetable Builder
                                    </CardTitle>
                                    <CardDescription>Select subjects and assign their exam slots.</CardDescription>
                                </div>
                                <Button type="submit" disabled={processing} className="min-w-[150px]">
                                    {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Publish Timetable
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Header Row for large screens */}
                                    <div className="text-muted-foreground hidden gap-4 border-b px-3 pb-2 text-sm font-medium md:grid md:grid-cols-12">
                                        <div className="col-span-4">Subject</div>
                                        <div className="col-span-3">Date</div>
                                        <div className="col-span-2">Start Time</div>
                                        <div className="col-span-3">End Time</div>
                                    </div>

                                    {/* Subject List */}
                                    {availableSubjects.map((subject: any) => {
                                        const schedule = data.schedules?.find((s) => s.subject_id === subject.id);
                                        const isSelected = !!schedule;

                                        return (
                                            <div
                                                key={subject.id}
                                                className={`rounded-lg border p-3 transition-all ${isSelected ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-800 dark:bg-indigo-950/20' : 'bg-background hover:bg-muted/50'}`}
                                            >
                                                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                                                    {/* Subject Toggle */}
                                                    <div className="col-span-1 flex items-center space-x-3 md:col-span-4">
                                                        <Checkbox
                                                            id={`sub-${subject.id}`}
                                                            checked={isSelected}
                                                            onCheckedChange={() => toggleSubject(subject.id)}
                                                        />
                                                        <Label htmlFor={`sub-${subject.id}`} className="flex-1 cursor-pointer font-medium">
                                                            {subject.name}{' '}
                                                            <span className="text-muted-foreground ml-1 text-xs">({subject.code})</span>
                                                        </Label>
                                                    </div>

                                                    {/* Schedule Inputs (Only visible if selected) */}
                                                    {isSelected && (
                                                        <>
                                                            <div className="col-span-1 md:col-span-3">
                                                                <Input
                                                                    type="date"
                                                                    // size={"sm"}
                                                                    value={schedule.date}
                                                                    onChange={(e) => updateSchedule(subject.id, 'date', e.target.value)}
                                                                    min={data.start_date}
                                                                    max={data.end_date}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                            <div className="col-span-1 md:col-span-2">
                                                                <Input
                                                                    type="time"
                                                                    value={schedule.start_time}
                                                                    onChange={(e) => updateSchedule(subject.id, 'start_time', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                            <div className="col-span-1 flex items-center gap-2 md:col-span-3">
                                                                <Input
                                                                    type="time"
                                                                    value={schedule.end_time}
                                                                    onChange={(e) => updateSchedule(subject.id, 'end_time', e.target.value)}
                                                                    className="h-8 text-sm"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.schedules && (
                                    <p className="text-destructive mt-4 text-sm">Please complete all date and time fields for selected subjects.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
