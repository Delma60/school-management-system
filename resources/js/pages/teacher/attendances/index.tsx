// import { TakeAttendanceSheet } from '@/components/take-attendance-sheet'; // Reusing your existing component!
import { TakeAttendanceSheet } from '@/components/attendance-sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, CheckCircle, ChevronLeft, ChevronRight, Clock, Search, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
    classrooms: Classroom[];
    selectedDate: string;
}

export default function TeacherAttendanceIndex({ classrooms = [], filters }: Props) {
    const [search, setSearch] = useState('');
    const [isAttendanceSheetOpen, setIsAttendanceSheetOpen] = useState(false);
    const [activeClassroom, setActiveClassroom] = useState<Classroom | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Attendance Log', href: route('attendances.index') },
    ];

    const defaultTab = classrooms.length > 0 ? classrooms[0].id.toString() : '';

    // Handle date navigation
    const handleDateChange = (newDate: string) => {
        router.get(route('attendances.index'), { date: newDate }, { preserveState: true, preserveScroll: true });
    };

    const changeDateByDays = (days: number) => {
        const dateObj = new Date(filters?.date);
        dateObj.setDate(dateObj.getDate() + days);
        handleDateChange(dateObj.toISOString().split('T')[0]);
    };

    const openTakeAttendance = (classroom: Classroom) => {
        setActiveClassroom(classroom);
        setIsAttendanceSheetOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Log" />
            <div className="space-y-6 p-6">
                {/* Header & Date Controls */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <CalendarIcon className="text-primary h-6 w-6" /> Daily Attendance
                        </h1>
                        <p className="text-muted-foreground text-sm">View and manage attendance records for your classes.</p>
                    </div>

                    {/* Date Navigator */}
                    <div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDateByDays(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Input
                            type="date"
                            value={filters?.date}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="h-8 w-[140px] border-none bg-transparent font-medium shadow-none"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => changeDateByDays(1)}
                            disabled={filters?.date === new Date().toISOString().split('T')[0]}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {classrooms.length === 0 ? (
                    <Card className="text-muted-foreground flex flex-col items-center justify-center border-dashed p-12 text-center shadow-sm">
                        <CalendarIcon className="mb-4 h-12 w-12 opacity-20" />
                        <p>You are not assigned to any classrooms.</p>
                    </Card>
                ) : (
                    <Tabs defaultValue={defaultTab} className="w-full space-y-4">
                        <TabsList className="bg-muted/50 flex h-auto w-full justify-start overflow-x-auto p-1">
                            {classrooms.map((cls) => (
                                <TabsTrigger key={cls.id} value={cls.id.toString()} className="px-4 py-2">
                                    {cls.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {classrooms.map((cls) => {
                            const students = cls.students || [];
                            const filteredStudents = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

                            // Calculate Stats for this specific class
                            const presentCount = students.filter((s) => s.attendances?.[0]?.status === 'present')?.length;
                            const absentCount = students.filter((s) => s.attendances?.[0]?.status === 'absent')?.length;
                            const lateCount = students.filter((s) => s.attendances?.[0]?.status === 'late')?.length;
                            const isRecorded = students.some((s) => s.attendances && s.attendances?.length > 0);

                            return (
                                <TabsContent key={cls.id} value={cls.id.toString()} className="space-y-4">
                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                        <Card className="border-t-primary border-t-4 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-muted-foreground text-xs uppercase">Total Students</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{students.length}</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-t-4 border-t-green-500 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-muted-foreground flex items-center gap-1 text-xs uppercase">
                                                    <CheckCircle className="h-3 w-3" /> Present
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-t-destructive border-t-4 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-muted-foreground flex items-center gap-1 text-xs uppercase">
                                                    <XCircle className="h-3 w-3" /> Absent
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-destructive text-2xl font-bold">{absentCount}</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-t-4 border-t-amber-500 shadow-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-muted-foreground flex items-center gap-1 text-xs uppercase">
                                                    <Clock className="h-3 w-3" /> Late
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-amber-600">{lateCount}</div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Table Card */}
                                    <Card className="shadow-sm">
                                        <div className="flex flex-col items-start justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
                                            <div className="relative w-full sm:max-w-xs">
                                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                                <Input
                                                    placeholder="Search students..."
                                                    className="bg-muted/50 pl-8"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            </div>

                                            <Button
                                                variant={isRecorded ? 'outline' : 'default'}
                                                className="w-full gap-2 sm:w-auto"
                                                onClick={() => openTakeAttendance(cls)}
                                            >
                                                {isRecorded ? 'Edit Attendance' : 'Take Attendance Now'}
                                            </Button>
                                        </div>

                                        <Table>
                                            <TableHeader className="bg-muted/30">
                                                <TableRow>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Admission No.</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Remarks</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map((student) => {
                                                        // Extract the attendance record for this specific day
                                                        const record = student.attendances?.find(
                                                            (att) => new Date(att.date).getTime() === new Date(filters.date).getTime(),
                                                        );

                                                        return (
                                                            <TableRow key={student.id}>
                                                                <TableCell className="font-medium">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                                                {student.name.substring(0, 2).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        {student.name}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-muted-foreground font-mono text-xs">
                                                                    {student?.meta?.admission_number || '--'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {!record ? (
                                                                        <Badge variant="outline" className="text-muted-foreground border-dashed">
                                                                            Not Recorded
                                                                        </Badge>
                                                                    ) : record.status === 'present' ? (
                                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                                            Present
                                                                        </Badge>
                                                                    ) : record.status === 'absent' ? (
                                                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>
                                                                    ) : (
                                                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                                            Late
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-muted-foreground text-sm">
                                                                    {record?.remarks || '--'}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                                                            No students found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Card>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                )}
            </div>

            {/* Mount the Sheet we built earlier! */}
            <TakeAttendanceSheet
                open={isAttendanceSheetOpen}
                onOpenChange={setIsAttendanceSheetOpen}
                classroom={activeClassroom}
                selectedDate={filters.date}
            />
        </AppLayout>
    );
}
