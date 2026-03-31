import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Student } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, FileText, Search, UserX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Assignment } from './index';

// Define the shape of a Submission
export interface Submission {
    id: number;
    assignment_id: number;
    student_id: number;
    content: string; // The student's text answer
    file_path?: string; // If they uploaded a document
    score: number | null;
    feedback: string | null;
    submitted_at: string;
}

// Extend the Student type to include their specific submission for this assignment
export interface StudentWithSubmission extends Student {
    submission?: Submission | null;
}

interface Props {
    assignment: Assignment;
    students: StudentWithSubmission[];
}

export default function GradeAssignment({ assignment, students = [] }: Props) {
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentWithSubmission | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Assignments', href: route('assignments.index') },
        { title: 'Grade', href: '#' },
    ];

    // Filter students by search
    const filteredStudents = students.filter(
        (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    );

    // Stats for the top cards
    const totalStudents = students.length;
    const submittedCount = students.filter(s => s.submission !== null).length;
    const gradedCount = students.filter(s => s.submission?.score !== null && s.submission?.score !== undefined).length;

    // Form logic for the Grading Sheet
    const { data, setData, post, processing, reset } = useForm({
        student_id: '',
        score: '',
        feedback: '',
    });

    // Open sheet and pre-fill form if a grade already exists
    const openGradingSheet = (student: StudentWithSubmission) => {
        setSelectedStudent(student);
        setData({
            student_id: student.id.toString(),
            score: student.submission?.score?.toString() || '',
            feedback: student.submission?.feedback || '',
        });
    };

    const handleSaveGrade = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure points don't exceed max points
        if (Number(data.score) > assignment.max_points) {
            toast.error(`Score cannot exceed the maximum of ${assignment.max_points} points.`);
            return;
        }

        // Post to a dedicated grading route
        post(route('assignments.grade.store', assignment.id), {
            onSuccess: () => {
                toast.success(`Grade saved for ${selectedStudent?.name}`);
                setSelectedStudent(null); // Close sheet
            },
            onError: () => toast.error('Failed to save grade. Check your inputs.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Grading: ${assignment.title}`} />

            <div className="space-y-6 p-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('assignments.index')}>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight line-clamp-1">{assignment.title}</h1>
                        <p className="text-muted-foreground text-sm">
                            Max Points: <strong>{assignment.max_points}</strong> • Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 grid-cols-3">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-b-4 border-b-amber-500">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{submittedCount}</div></CardContent>
                    </Card>
                    <Card className="shadow-sm border-b-4 border-b-green-500">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Graded</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{gradedCount}</div></CardContent>
                    </Card>
                </div>

                {/* Students Table */}
                <Card className="shadow-sm">
                    <div className="flex items-center p-4 border-b">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted On</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => {
                                    const hasSubmitted = !!student.submission;
                                    const isGraded = student.submission?.score !== null && student.submission?.score !== undefined;

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
                                            <TableCell>
                                                {isGraded ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Graded</Badge>
                                                ) : hasSubmitted ? (
                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Review</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground border-dashed">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {hasSubmitted ? new Date(student.submission!.submitted_at).toLocaleString() : '--'}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {isGraded ? `${student.submission!.score} / ${assignment.max_points}` : '--'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant={isGraded ? "outline" : "default"}
                                                    size="sm"
                                                    onClick={() => openGradingSheet(student)}
                                                >
                                                    {isGraded ? 'Update Grade' : 'Review & Grade'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* THE GRADING SHEET */}
                <Sheet open={!!selectedStudent} onOpenChange={(val) => !val && setSelectedStudent(null)}>
                    <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                        {selectedStudent && (
                            <form onSubmit={handleSaveGrade} className="flex flex-col gap-6 pt-6">
                                <SheetHeader>
                                    <SheetTitle>Grading: {selectedStudent.name}</SheetTitle>
                                    <SheetDescription>Review submission and assign points.</SheetDescription>
                                </SheetHeader>

                                {/* Submission Viewer Area */}
                                <div className="bg-muted/30 border rounded-lg p-4 space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2 text-sm text-foreground">
                                        <FileText className="h-4 w-4 text-primary" /> Student's Work
                                    </h4>

                                    {selectedStudent.submission ? (
                                        <div className="space-y-3">
                                            {/* Show text content if they typed an answer */}
                                            {selectedStudent.submission.content && (
                                                <div className="bg-background border rounded p-3 text-sm whitespace-pre-wrap">
                                                    {selectedStudent.submission.content}
                                                </div>
                                            )}

                                            {/* Show download link if they uploaded a file */}
                                            {selectedStudent.submission.file_path && (
                                                <Button type="button" variant="outline" className="w-full gap-2">
                                                    Download Attached File
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                                            <UserX className="h-8 w-8 mb-2 opacity-20" />
                                            <p className="text-sm">No work submitted yet.</p>
                                            <p className="text-xs text-center mt-1">You can still assign a grade (e.g., 0 for missing work).</p>
                                        </div>
                                    )}
                                </div>

                                {/* Grading Inputs */}
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="score">Points Awarded (out of {assignment.max_points})</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="score"
                                                type="number"
                                                min="0"
                                                max={assignment.max_points}
                                                value={data.score}
                                                onChange={e => setData('score', e.target.value)}
                                                className="w-32 text-lg font-bold text-center"
                                                required
                                            />
                                            <span className="text-muted-foreground font-medium">/ {assignment.max_points}</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="feedback">Teacher Feedback (Visible to Student)</Label>
                                        <Textarea
                                            id="feedback"
                                            placeholder="Great job on the conclusion, but check your math in step 2..."
                                            rows={4}
                                            value={data.feedback}
                                            onChange={e => setData('feedback', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <SheetFooter className="mt-4 border-t pt-4">
                                    <Button type="button" variant="outline" onClick={() => setSelectedStudent(null)}>Cancel</Button>
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <CheckCircle className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Grade'}
                                    </Button>
                                </SheetFooter>
                            </form>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
