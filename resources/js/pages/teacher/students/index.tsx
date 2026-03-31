import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Student } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Mail, Phone, Search, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    students: Student[];
    classrooms: Classroom[];
}

export default function StudentDirectory({ students = [], classrooms = [] }: Props) {
    console.log(students)
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState<string>('all');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Student Directory', href: route('students.index') },
    ];

    // Filter students based on search query and selected classroom
    const filteredStudents = students?.filter((student) => {
        const matchesSearch = 
            student.name.toLowerCase().includes(search.toLowerCase()) || 
            student.email.toLowerCase().includes(search.toLowerCase()) ||
            (student.meta?.admission_number && student.meta.admission_number.toLowerCase().includes(search.toLowerCase()));
            
        const matchesClass = classFilter === 'all' || student.classroom_id?.toString() === classFilter;

        return matchesSearch && matchesClass;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Directory" />

            <div className="space-y-6 p-6">
                
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Users className="text-primary h-6 w-6" /> Student Directory
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Browse and search through all students in your assigned classes.
                        </p>
                    </div>
                </div>

                {/* Filters and Search */}
                <Card className="p-4 shadow-sm border-t-4 border-t-primary flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or admission number..."
                            className="pl-9 bg-muted/50"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <Select value={classFilter} onValueChange={setClassFilter}>
                            <SelectTrigger className="bg-muted/50">
                                <SelectValue placeholder="Filter by Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All My Classes</SelectItem>
                                {classrooms.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id.toString()}>
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Students Directory Table */}
                <Card className="shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Student Details</TableHead>
                                    <TableHead>Classroom</TableHead>
                                    <TableHead>Contact Information</TableHead>
                                    <TableHead>Parent/Guardian</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Name & Avatar */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground font-mono">
                                                            ID: {student.meta?.admission_number || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            
                                            {/* Classroom */}
                                            <TableCell>
                                                {student.classroom ? (
                                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                        {student.classroom.name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                                )}
                                            </TableCell>

                                            {/* Contact Info */}
                                            <TableCell>
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3.5 w-3.5" /> 
                                                        <a href={`mailto:${student.email}`} className="hover:text-primary hover:underline">
                                                            {student.email}
                                                        </a>
                                                    </div>
                                                    {student.meta?.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3.5 w-3.5" /> 
                                                            <a href={`tel:${student.meta.phone}`} className="hover:text-primary hover:underline">
                                                                {student.meta.phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Parent Info */}
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-medium text-foreground">
                                                        {student.meta?.parent_name || <span className="text-muted-foreground italic">Not provided</span>}
                                                    </p>
                                                    {student.meta?.parent_phone && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <Phone className="h-3 w-3" /> {student.meta.parent_phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                <Link href={route('students.show', student.id)}>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <UserCheck className="h-4 w-4" /> View Profile
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users className="h-8 w-8 mb-2 opacity-20" />
                                                <p>No students found matching your search.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}