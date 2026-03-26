import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Classroom, TimetableEntry } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Loader2, Save, Trash2, Users } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'sonner';

export default function EditSchedule({ exam, allSubjects, classrooms }: any) {
    const { data, setData, put, processing, errors } = useForm({
        // Extract existing classroom IDs from the relationship
        classroom_ids: exam.classrooms?.map((c: any) => c.id) || ([] as number[]),

        // Map existing subjects into the form state
        schedules:
            exam.subjects?.map((s: any) => ({
                id: s.id,
                subject_id: s.subject_id,
                name: s.subject?.name,
                code: s.subject?.code,
                exam_date: s.exam_date,
                start_time: s.start_time,
                end_time: s.meta?.end_time || '',
            })) || [],
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

    const addSubjectRow = (subjectId: string) => {
        // Search in availableSubjects instead of allSubjects
        const sub = availableSubjects.find((s: any) => s.id === parseInt(subjectId));

        if (!sub || data.schedules.some((s: any) => s.subject_id === sub.id)) return;

        setData('schedules', [
            ...data.schedules,
            {
                id: null,
                subject_id: sub.id,
                name: sub.name,
                code: sub.code,
                exam_date: '',
                start_time: '',
                end_time: '',
            },
        ]);
    };

    const removeRow = (index: number) => {
        const newSchedules = [...data.schedules];
        newSchedules.splice(index, 1);
        setData('schedules', newSchedules);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('exams.update', exam.id), {
            onSuccess: () => {
                toast.success('Exam updated successfully');
            },
            onError: () => {
                toast.error('Please check the form for errors.');
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
            <Head title={`Manage Schedule - ${exam.name}`} />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('exams.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Manage Schedule</h1>
                            <p className="text-muted-foreground text-sm">
                                {exam.name} • {exam.term}
                            </p>
                        </div>
                    </div>
                    <Button onClick={submit} disabled={processing} className="gap-2">
                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* --- Left Column: Summary, Classes & Add Subject --- */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-muted-foreground text-sm font-medium uppercase">Exam Range</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span>
                                        {exam.start_date} to {exam.end_date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="capitalize">
                                        {exam.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* --- Participating Classes --- */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-green-500" />
                                    Participating Classes
                                </CardTitle>
                                <CardDescription className="text-xs">Adjust which classes take this exam.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {classrooms?.map((cls: any) => (
                                        <div key={cls.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`cls-${cls.id}`}
                                                checked={data.classroom_ids.includes(cls.id)}
                                                onCheckedChange={() => toggleClassroom(cls.id)}
                                            />
                                            <Label htmlFor={`cls-${cls.id}`} className="cursor-pointer text-sm font-medium">
                                                {cls.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.classroom_ids && <p className="text-destructive mt-2 text-xs">Select at least one class.</p>}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Add Subject</CardTitle>
                                <CardDescription className="text-xs">Add a subject not in the timetable.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select onValueChange={(e) => addSubjectRow(e)} value="">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject.." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSubjects.map((s) => (
                                            <SelectItem key={s.id} value={s.id.toString()}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Right Column: The Interactive Timetable --- */}
                    <div className="space-y-4 lg:col-span-3">
                        {data.schedules.length === 0 ? (
                            <div className="text-muted-foreground rounded-lg border-2 border-dashed p-12 text-center">
                                No subjects scheduled for this exam yet.
                            </div>
                        ) : (
                            data.schedules.map((item: any, index: number) => {
                                const isSubjectStillValid = availableSubjects.some((as) => as.id === item.subject_id);
                                return (
                                    <Card key={index} className="overflow-hidden border-l-4 border-l-indigo-500">
                                        <CardContent className="p-4">
                                            {!isSubjectStillValid && (
                                                <p className="text-destructive mb-2 text-[10px] font-bold uppercase">
                                                    Warning: This subject is not in the timetable of the selected classes.
                                                </p>
                                            )}
                                            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
                                                <div className="md:col-span-4">
                                                    <Label className="text-muted-foreground mb-1 block text-xs">Subject</Label>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-muted-foreground text-xs">{item.code}</div>
                                                </div>

                                                <div className="md:col-span-3">
                                                    <Label className="mb-1 block text-xs">Exam Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={item.exam_date}
                                                        min={exam.start_date}
                                                        max={exam.end_date}
                                                        onChange={(e) => {
                                                            const copy = [...data.schedules];
                                                            copy[index].exam_date = e.target.value;
                                                            setData('schedules', copy);
                                                        }}
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <Label className="mb-1 block text-xs">Start Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={item.start_time}
                                                        onChange={(e) => {
                                                            const copy = [...data.schedules];
                                                            copy[index].start_time = e.target.value;
                                                            setData('schedules', copy);
                                                        }}
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <Label className="mb-1 block text-xs">End Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={item.end_time}
                                                        onChange={(e) => {
                                                            const copy = [...data.schedules];
                                                            copy[index].end_time = e.target.value;
                                                            setData('schedules', copy);
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex justify-end md:col-span-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive"
                                                        onClick={() => removeRow(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                        {errors.schedules && <p className="text-destructive mt-4 text-sm">Make sure all dates and times are filled correctly.</p>}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
