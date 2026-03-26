import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Classroom, Student } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, Save, Users, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    students: Student[];
    classrooms: Classroom[];
    selectedClassroom: Classroom;
    filters: { classroom_id: string; date: string };
    stats: Record<string, string>;
}

export default function AttendanceIndex({ students, classrooms, selectedClassroom, stats, filters }: Props) {
    const [date, setDate] = useState(filters.date);

    // Initialize attendance data with actual loaded attendance or default to 'present'
    const [attendanceData, setAttendanceData] = useState<Record<number, string>>(() => {
        return students.reduce(
            (acc, s) => ({
                ...acc,
                [s.id]: s.attendances && s.attendances.length > 0 ? s.attendances[0].status : 'present',
            }),
            {},
        );
    });

    const updateStatus = (studentId: number, status: string) => {
        setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
    };

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        router.get(
            route('attendances.index'),
            { classroom_id: selectedClassroom.id, date: newDate },
            {
                preserveState: false,
                replace: true,
            },
        );
    };

    const handleSearch = (value: string) => {
        const classroom = classrooms.find((c) => String(c.id) === value);
        if (classroom) {
            router.get(
                route('attendances.index'),
                { classroom_id: classroom.id, date: date },
                {
                    preserveState: false,
                    replace: true,
                },
            );
        }
    };
    const submitAttendance = () => {
        router.post(
            route('attendances.store'),
            {
                date,
                classroom_id: selectedClassroom.id,
                data: attendanceData,
            },
            {
                onSuccess: () => toast.success('Attendance saved successfully'),
                onError: () => toast.error('Failed to save attendance. Please try again.'),
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Mark Attendance" />
            <div className="space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daily Attendance</h1>
                        <p className="text-muted-foreground">
                            Class: {selectedClassroom.name} ({selectedClassroom.grade_level})
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Input type="date" value={date} onChange={(e) => handleDateChange(e.target.value)} className="w-40" />
                        <Select defaultValue={String(selectedClassroom.id)} onValueChange={handleSearch}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {classrooms.map((classroom) => (
                                    <SelectItem key={classroom.id} value={String(classroom.id)}>
                                        {classroom.name} ({classroom.grade_level})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={submitAttendance} className="gap-2">
                            <Save className="h-4 w-4" /> Save All
                        </Button>
                    </div>
                </div>

                {/* /?/ Inside your AttendanceIndex component, before the main Student List Card: */}
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-muted-foreground text-xs">Enrolled in this class</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Present Today</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                            <div className="mt-1 flex items-center gap-2">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full bg-green-500" style={{ width: `${stats.percentage}%` }} />
                                </div>
                                <span className="text-[10px] font-bold">{stats.percentage}%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Absent</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                            <p className="text-muted-foreground text-xs">Requires follow-up</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-muted-foreground text-sm font-medium">Late / Tardy</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
                            <p className="text-muted-foreground text-xs">Arrived after start time</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="bg-muted/20 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Student List ({students.length})</CardTitle>
                            <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="h-3 w-3" /> Present
                                </span>
                                <span className="flex items-center gap-1 text-red-600">
                                    <XCircle className="h-3 w-3" /> Absent
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {students.map((student) => (
                                <div key={student.id} className="hover:bg-muted/5 flex items-center justify-between p-4 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold">{student.name}</p>
                                            <p className="text-muted-foreground text-xs">ID: STU-00{student.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {[
                                            {
                                                id: 'present',
                                                icon: CheckCircle2,
                                                color: 'text-green-600',
                                                bg: 'bg-green-50',
                                                active: 'bg-green-600 text-white',
                                            },
                                            { id: 'absent', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', active: 'bg-red-600 text-white' },
                                            {
                                                id: 'late',
                                                icon: Clock,
                                                color: 'text-amber-600',
                                                bg: 'bg-amber-50',
                                                active: 'bg-amber-600 text-white',
                                            },
                                            {
                                                id: 'excused',
                                                icon: AlertCircle,
                                                color: 'text-blue-600',
                                                bg: 'bg-blue-50',
                                                active: 'bg-blue-600 text-white',
                                            },
                                        ].map((status) => (
                                            <button
                                                key={status.id}
                                                onClick={() => updateStatus(student.id, status.id)}
                                                className={`rounded-md border p-2 transition-all ${
                                                    attendanceData[student.id] === status.id
                                                        ? status.active
                                                        : `border-transparent hover:${status.bg} ${status.color}`
                                                }`}
                                            >
                                                <status.icon className="h-5 w-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
