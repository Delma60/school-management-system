import { AddMultipleStudentsSheet } from '@/components/add-student-to-class';
import { AssignTeacherModal } from '@/components/assign-teachers-to-classroom-modal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Student, Teacher } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit2, GraduationCap, Mail, MoreHorizontal, Search, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ClassroomShow({
    classroom,
    teachers,
    availableStudents,
}: {
    classroom: Classroom;
    teachers: Teacher[];
    availableStudents: Student[];
}) {
    const [search, setSearch] = useState('');
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);
    const [isAssignTeacherOpen, setIsAssignTeacherOpen] = useState(false);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

    const occupancy = ((classroom?.students?.length || 0) / classroom.capacity) * 100;

    // Add state for the new modal

    // Simple client-side search filter
    const filteredStudents = classroom?.students?.filter(
        (student) => student.name.toLowerCase().includes(search.toLowerCase()) || student.email.toLowerCase().includes(search.toLowerCase()),
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Classes',
            href: route('classrooms.index'),
        },
        {
            title: classroom.name,
            href: route('classrooms.show', classroom.id),
        },
    ];

    const handleRemoveClick = (student: User) => {
        setStudentToRemove(student);
        setIsRemoveDialogOpen(true);
    };

    const confirmRemoveStudent = () => {
        if (!studentToRemove) return;

        // Use router.put instead of useForm.put for simpler API calls
        router.put(
            route('students.update', studentToRemove.id),
            {
                name: studentToRemove.name,
                email: studentToRemove.email,
                classroom_id: null,
                phone: studentToRemove.meta?.phone || null,
                dob: studentToRemove.meta?.dob || null,
                parent_name: studentToRemove.meta?.parent_name || null,
            },
            {
                onSuccess: () => {
                    toast.success(`${studentToRemove.name} has been removed from the class.`);
                    setIsRemoveDialogOpen(false);
                    setStudentToRemove(null);
                },
                onError: () => {
                    toast.error('Failed to remove student from class. Please try again.');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <Head title={`${classroom.name} Roster`} />

                {/* Top Navigation */}
                <div className="flex items-center gap-4">
                    <Link href={route('classrooms.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{classroom.name}</h1>
                        <p className="text-muted-foreground">
                            {classroom.grade_level} • Room {classroom.room_number || 'Unassigned'}
                        </p>
                    </div>
                </div>

                {/* Classroom Stats Card */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-primary/10 shadow-sm md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Class Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="border-primary/20 h-12 w-12 border-2">
                                        <AvatarFallback>
                                            <GraduationCap className="text-primary h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-muted-foreground text-sm font-medium">Class Advisor / Teacher</p>
                                        <p className="text-lg font-semibold">{classroom.teacher?.name || 'No Teacher Assigned'}</p>
                                    </div>
                                </div>
                                {/* NEW BUTTON TO TRIGGER MODAL */}
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsAssignTeacherOpen(true)}>
                                    <Edit2 className="h-4 w-4" /> Change
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Capacity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold">{classroom.students_count || 0}</span>
                                <span className="text-muted-foreground mb-1">/ {classroom.capacity} Students</span>
                            </div>
                            <Progress value={occupancy} className={`h-2 ${occupancy > 90 ? 'bg-destructive/20' : ''} border-primary border`} />
                            <p className="text-muted-foreground text-right text-xs">{Math.round(occupancy)}% Full</p>
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
                        <Button className="w-full gap-2 sm:w-auto" onClick={() => setIsAddStudentOpen(true)}>
                            <UserPlus className="h-4 w-4" /> Add Student to Class
                        </Button>
                    </div>

                    {classroom?.students?.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Email / Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents?.length > 0 ? (
                                    filteredStudents?.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <Link href={route('students.show', student.id)}>
                                                        <Button variant="link" className="h-auto p-0">
                                                            {student.name}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                    <Mail className="h-3 w-3" />
                                                    {student.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.get(route('students.show', student.id))}>
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Record Attendance</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveClick(student)}>
                                                            Remove from Class
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
                            <h3 className="text-lg font-semibold tracking-tight">No Students Yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs text-sm">
                                No students have been assigned to this class. Click the button above to add students.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Confirmation Dialog for Remove from Class */}
                <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Remove Student from Class?</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove <span className="font-semibold">{studentToRemove?.name}</span> from{' '}
                                <span className="font-semibold">{classroom.name}</span>? This action will unassign the student from this class, but
                                the student record will remain in the system.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmRemoveStudent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Remove from Class
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <AddMultipleStudentsSheet
                open={isAddStudentOpen}
                onOpenChange={setIsAddStudentOpen}
                classroom={classroom}
                availableStudents={availableStudents}
            />
            <AssignTeacherModal open={isAssignTeacherOpen} onOpenChange={setIsAssignTeacherOpen} classroom={classroom} teachers={teachers} />
        </AppLayout>
    );
}
