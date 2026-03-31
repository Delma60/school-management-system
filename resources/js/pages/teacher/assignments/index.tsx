import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarClock, CheckCircle, ClipboardList, Clock, FileEdit, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

export interface Assignment {
    id: number;
    title: string;
    description: string;
    due_date: string;
    max_points: number;
    classroom?: Classroom;
    subject?: Subject;
    submissions_count?: number; // Backend will pass this
}

interface Props {
    assignments: Assignment[];
}

export default function AssignmentsIndex({ assignments = [] }: Props) {
    const [search, setSearch] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Assignments', href: route('assignments.index') },
    ];

    const filteredAssignments = assignments.filter(
        (assignment) =>
            assignment.title.toLowerCase().includes(search.toLowerCase()) || assignment.subject?.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Helper to determine if an assignment is past due
    const isPastDue = (dateString: string) => new Date(dateString) < new Date();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <Head title="My Assignments" />

                {/* Header & Actions */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <ClipboardList className="text-primary h-6 w-6" /> Class Assignments
                        </h1>
                        <p className="text-muted-foreground text-sm">Create tasks, set deadlines, and track student submissions.</p>
                    </div>

                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Search assignments..."
                                className="bg-background pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Link href={route('assignments.create')}>
                            <Button className="shrink-0 gap-2">
                                <Plus className="h-4 w-4" /> New Assignment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Assignments Grid */}
                {filteredAssignments.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredAssignments.map((assignment) => {
                            const pastDue = isPastDue(assignment.due_date);
                            // Mocking submission progress for the UI (e.g., 15 out of 30 students)
                            const submissionCount = assignment.submissions_count || 0;
                            const totalStudents = assignment.classroom?.students_count || 1; // Prevent division by zero
                            const progress = (submissionCount / totalStudents) * 100;

                            return (
                                <Card
                                    key={assignment.id}
                                    className="border-t-primary flex flex-col border-t-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <CardTitle className="line-clamp-2 text-lg leading-tight font-bold">{assignment.title}</CardTitle>
                                            <Badge variant={pastDue ? 'destructive' : 'default'} className="shrink-0">
                                                {pastDue ? 'Past Due' : 'Active'}
                                            </Badge>
                                        </div>
                                        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs font-medium">
                                            {pastDue ? (
                                                <CalendarClock className="text-destructive h-3.5 w-3.5" />
                                            ) : (
                                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                            )}
                                            <span className={pastDue ? 'text-destructive' : ''}>
                                                Due:{' '}
                                                {new Date(assignment.due_date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-5 text-sm">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                                {assignment.subject?.name}
                                            </Badge>
                                            <Badge variant="outline">{assignment.classroom?.name}</Badge>
                                            <Badge variant="outline" className="bg-muted text-muted-foreground border-dashed">
                                                {assignment.max_points} Pts
                                            </Badge>
                                        </div>

                                        {/* Submission Progress Bar */}
                                        <div className="bg-muted/30 border-border/50 space-y-1.5 rounded-lg border p-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                                                    <Users className="h-3.5 w-3.5" /> Submissions
                                                </span>
                                                <span className="text-foreground font-bold">
                                                    {submissionCount} / {assignment.classroom?.students_count || '?'}
                                                </span>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="bg-muted/10 grid grid-cols-2 gap-2 border-t pt-4">
                                        <Link href={route('assignments.edit', assignment.id)}>
                                            <Button variant="outline" className="w-full gap-2 text-xs" size="sm">
                                                <FileEdit className="h-3.5 w-3.5" /> Edit
                                            </Button>
                                        </Link>
                                        <Link href={route('assignments.grade', assignment.id)}>
                                            <Button variant="default" className="w-full gap-2 text-xs" size="sm">
                                                <CheckCircle className="h-3.5 w-3.5" /> Grade
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border-muted bg-muted/5 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                        <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <ClipboardList className="text-primary h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight">No Assignments Found</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm text-sm">You haven't assigned any tasks to your classes yet.</p>
                        <Link href={route('assignments.create')}>
                            <Button className="mt-6 gap-2">
                                <Plus className="h-4 w-4" /> Create First Assignment
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
