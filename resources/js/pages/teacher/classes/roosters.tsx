import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpenCheck, ClipboardList, GraduationCap, Mail, MoreHorizontal, Search, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    classrooms: Classroom[];
}

export default function TeacherRosters({ classrooms }: Props) {
    const [search, setSearch] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Class Rosters', href: route('classes.roosters') },
    ];

    // Default to the first classroom's ID for the active tab, if classrooms exist
    const defaultTab = classrooms.length > 0 ? classrooms[0].id.toString() : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <Head title="My Class Rosters" />

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Class Rosters</h1>
                        <p className="text-muted-foreground">Manage students across your assigned classes.</p>
                    </div>
                </div>

                {classrooms.length === 0 ? (
                    <Card className="border-dashed shadow-sm">
                        <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                            <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <BookOpenCheck className="text-primary h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight">No Classes Assigned</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                                You are not currently assigned as the primary teacher for any classes. 
                                Contact the administration if this is a mistake.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <Tabs defaultValue={defaultTab} className="w-full space-y-4">
                        <TabsList className="flex w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
                            {classrooms.map((cls) => (
                                <TabsTrigger key={cls.id} value={cls.id.toString()} className="py-2 px-4">
                                    {cls.name} ({cls.students?.length || 0})
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {classrooms.map((cls) => {
                            // Filter students specifically for the current mapped class
                            const filteredStudents = (cls.students || []).filter(
                                (student) => 
                                    student.name.toLowerCase().includes(search.toLowerCase()) || 
                                    student.email.toLowerCase().includes(search.toLowerCase())
                            );

                            return (
                                <TabsContent key={cls.id} value={cls.id.toString()} className="space-y-4">
                                    <Card className="shadow-sm">
                                        <div className="flex flex-col items-start justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
                                            <div className="relative w-full sm:max-w-xs">
                                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                                <Input
                                                    type="search"
                                                    placeholder={`Search in ${cls.name}...`}
                                                    className="bg-background pl-8"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            </div>
                                            <Button className="w-full gap-2 sm:w-auto">
                                                <ClipboardList className="h-4 w-4" /> Take Attendance
                                            </Button>
                                        </div>

                                        {cls.students && cls.students.length > 0 ? (
                                            <Table>
                                                <TableHeader className="bg-muted/30">
                                                    <TableRow>
                                                        <TableHead>Student Name</TableHead>
                                                        <TableHead>Contact Info</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
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
                                                                            <Mail className="h-3 w-3" /> {student.email}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                                        Enrolled
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
                                                                                <ClipboardList className="mr-2 h-4 w-4" /> Log Behavior
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
                                            <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                                <Users className="mb-4 h-8 w-8 opacity-20" />
                                                <p>No students are currently enrolled in {cls.name}.</p>
                                            </div>
                                        )}
                                    </Card>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                )}
            </div>
        </AppLayout>
    );
}