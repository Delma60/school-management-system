import { CreateStudentSheet } from '@/components/create-student-sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Download, Filter, MoreHorizontal, Search, UserPlus } from 'lucide-react';
import React, { useState } from 'react';

export default function StudentDirectory(props: any) {
    const { students, filters, classrooms } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Handle Search Input with a small delay (optional debounce)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            route('students.index'),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title="Student Directory" />

                {/* Header & Main Actions */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
                        <p className="text-muted-foreground">Manage and view all enrolled students across the institution.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                        <Button className="shadow-primary/20 gap-2 shadow-lg" onClick={() => setIsModalOpen(!isModalOpen)}>
                            <UserPlus className="h-4 w-4" /> Add New Student
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{students.total || students.length || 0}</div>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Total Enrollment</p>
                        </CardContent>
                    </Card>
                    {/* Add more stats like 'Active Today' or 'Unassigned' here */}
                     <Card className="bg-red-400/5 border-red-400/10">
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{students.data?.filter((student: any) => !student.classroom_id).length || 0}</div>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Total Unassigned</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Bar */}
                <Card className="shadow-sm">
                    <div className="flex flex-col gap-4 p-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search by name, email, or admission ID..."
                                className="pl-9"
                                defaultValue={filters.search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" /> Filters
                            </Button>
                        </div>
                    </div>

                    {/* Directory Table */}
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[300px]">Student</TableHead>
                                <TableHead>Admission No.</TableHead>
                                <TableHead>Class/Grade</TableHead>
                                <TableHead>Parent/Guardian</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.map((student: any) => (
                                <TableRow key={student.id} className="group cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border">
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="group-hover:text-primary font-bold transition-colors">{student.name}</span>
                                                <span className="text-muted-foreground text-xs">{student.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                        {student.admission_no || `STD-${student.id + 1000}`}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{student.classroom?.name || 'Unassigned'}</span>
                                            <span className="text-muted-foreground text-[10px] uppercase">{student.classroom?.grade_level}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{student.meta?.parent_name || '—'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                            Active
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Student Options</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.get(route("students.show", student.id))}>
                                                    View Full Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Academic Records</DropdownMenuItem>
                                                <DropdownMenuItem>Attendance History</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Archive Student</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination placeholder */}
                    {students.links && <div className="flex justify-center border-t p-4">{/* Add your Pagination component here */}</div>}
                </Card>
            </div>
            <CreateStudentSheet classrooms={classrooms} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </AppLayout>
    );
}
