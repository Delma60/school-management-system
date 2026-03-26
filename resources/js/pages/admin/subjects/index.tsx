import { CreateSubjectModal } from '@/components/create-subject-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, BookOpen, CheckCircle2, Edit, Filter, Plus, Search, Users } from 'lucide-react';
import React from 'react';

export default function SubjectsIndex({ subjects, filters }: any) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get(
            '/dashboard/academics/subjects',
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const getDepartmentColor = (dept: string) => {
        switch (dept) {
            case 'Science':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Arts':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Commerce':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title="Subjects & Curricula" />

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subjects & Curricula</h1>
                        <p className="text-muted-foreground">Manage academic subjects, departments, and course syllabi.</p>
                    </div>
                    <Button className="shadow-primary/20 gap-2 shadow-lg" onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-4 w-4" /> Add Subject
                    </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="flex items-center justify-between pt-6">
                            <div>
                                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Total Subjects</p>
                                <div className="text-2xl font-bold">{subjects.total || subjects.data.length}</div>
                            </div>
                            <BookOpen className="text-primary/40 h-8 w-8" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between pt-6">
                            <div>
                                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Missing Syllabi</p>
                                <div className="text-2xl font-bold text-orange-500">3</div>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-500/40" />
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Bar */}
                <Card className="shadow-sm">
                    <div className="flex flex-col gap-4 p-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Search by subject name or code (e.g. MAT101)..."
                                className="pl-9"
                                defaultValue={filters?.search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="flex w-full gap-2 md:w-auto">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    <SelectItem value="science">Science</SelectItem>
                                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                                    <SelectItem value="commerce">Commerce</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Subjects Table */}
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">Code</TableHead>
                                <TableHead>Subject Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Assigned Teachers</TableHead>
                                <TableHead>Syllabus Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.data.map((subject: any) => (
                                <TableRow key={subject.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-muted-foreground font-mono text-xs font-bold">{subject.code}</TableCell>
                                    <TableCell>
                                        <div className="text-foreground font-semibold">{subject.name}</div>
                                        <div className="text-muted-foreground text-[10px] uppercase">
                                            {subject.type} • {subject.credits} Credits
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getDepartmentColor(subject.department)}>
                                            {subject.department}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="text-muted-foreground h-4 w-4" />
                                            <span className="text-sm">{subject.teachers_count || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {subject.has_syllabus ? (
                                            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                                <CheckCircle2 className="h-4 w-4" /> Uploaded
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-xs font-medium text-orange-500">
                                                <AlertCircle className="h-4 w-4" /> Required
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Manage Subject</DropdownMenuLabel>
                                                <DropdownMenuItem className="gap-2" onClick={() => router.get(route("subjects.show", subject?.id))}>
                                                    <BookOpen className="h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Users className="h-4 w-4" /> Assign Teachers
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2">
                                                    <FileText className="h-4 w-4" /> Upload Syllabus
                                                </DropdownMenuItem>
                                                {subject.has_syllabus && (
                                                    <DropdownMenuItem className="gap-2">
                                                        <Download className="h-4 w-4" /> Download PDF
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu> */}
                                        <Button variant="ghost" onClick={() => router.get(route("subjects.show", subject?.id))} >
                                            <Edit />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {subjects.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground h-32 text-center">
                                        No subjects found. Try adjusting your search or filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
            <CreateSubjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </AppLayout>
    );
}
