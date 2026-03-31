import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Student } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpenCheck, ClipboardList, GraduationCap, Mail, MoreHorizontal, Search, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

export default function TeacherClassroomShow({ classroom }: { classroom: Classroom }) {
    const [search, setSearch] = useState('');

    const occupancy = (classroom?.students?.length / classroom.capacity) * 100;

    // Client-side search filter
    const filteredStudents = classroom?.students?.filter(
        (student) => student.name.toLowerCase().includes(search.toLowerCase()) || student.email.toLowerCase().includes(search.toLowerCase()),
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teacher Dashboard',
            href: '/dashboard', // Adjust to your teacher dashboard route
        },
        {
            title: 'My Classes',
            href: route('teacher.classrooms.index'), // Assuming you have an index route for teacher's classes
        },
        {
            title: classroom.name,
            href: route('teacher.classrooms.show', classroom.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <Head title={`${classroom.name} Roster`} />

                {/* Top Navigation */}
                <div className="flex items-center gap-4">
                    <Link href={route('teacher.classrooms.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{classroom.name} Roster</h1>
                        <p className="text-muted-foreground">
                            {classroom.grade_level} • Room {classroom.room_number || 'Unassigned'}
                        </p>
                    </div>
                </div>

                {/* Classroom Stats Card */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-primary/10 shadow-sm md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Class Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-4">
                                <Avatar className="border-primary/20 h-12 w-12 border-2">
                                    <AvatarFallback>
                                        <BookOpenCheck className="text-primary h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Class Advisor</p>
                                    <p className="text-lg font-semibold">You ({classroom.teacher?.name || 'Assigned Teacher'})</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Class Size</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold">{classroom.students_count || classroom.students?.length || 0}</span>
                                <span className="text-muted-foreground mb-1">Students Enrolled</span>
                            </div>
                            <Progress value={occupancy} className="h-2" />
                            <p className="text-muted-foreground text-right text-xs">Capacity: {classroom.capacity}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Students Table Section */}
                <Card className="shadow-sm">
                    <div className="flex flex-col items-start justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search students..."
                                className="bg-muted/50 pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Teacher specific action: Take Attendance */}
                        <Button className="w-full gap-2 sm:w-auto">
                            <ClipboardList className="h-4 w-4" /> Take Daily Attendance
                        </Button>
                    </div>

                    {classroom.students && classroom.students.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Today's Status</TableHead>
                                    <TableHead className="text-right">Quick Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {/* Linking to the student's academic profile */}
                                                    <Link href={route('students.show', student.id)}>
                                                        <Button variant="link" className="h-auto p-0 font-semibold">
                                                            {student.name}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-muted-foreground flex flex-col gap-1 text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3" />
                                                        {student.email}
                                                    </span>
                                                    {/* If you have parent info in meta, display it here */}
                                                    {student.meta?.parent_name && (
                                                        <span className="text-xs">Parent: {student.meta.parent_name}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* Placeholder for actual attendance logic */}
                                                <Badge variant="outline" className="text-muted-foreground border-dashed">
                                                    Not Recorded Yet
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.get(route('students.show', student.id))}>
                                                            <UserCheck className="mr-2 h-4 w-4" /> View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <ClipboardList className="mr-2 h-4 w-4" /> Mark Present/Absent
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <GraduationCap className="mr-2 h-4 w-4" /> Enter Grades
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                                            No students match your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="border-muted bg-muted/10 flex min-h-[300px] flex-col items-center justify-center rounded-b-lg border-t p-8 text-center">
                            <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <Users className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">Your Roster is Empty</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                                No students are currently assigned to this class. If you believe this is an error, please contact the school administrator.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}