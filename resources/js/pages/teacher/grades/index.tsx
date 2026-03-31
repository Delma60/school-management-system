import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calculator, Download, GraduationCap, Save, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Define our specific data shapes for the Gradebook
interface Assignment {
    id: number;
    title: string;
    max_points: number;
    due_date: string;
}

interface StudentGradeData {
    id: number;
    name: string;
    admission_number: string;
    submissions: Record<number, { id?: number; score: number | null }>; // assignment_id -> submission data
}

interface Props {
    classrooms: Classroom[];
    subjects: Subject[];
    assignments: Assignment[];
    students: StudentGradeData[];
    filters: {
        classroom_id: string;
        subject_id: string;
    };
}

export default function GradebookIndex({ classrooms = [], subjects = [], assignments = [], students = [], filters }: Props) {
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // We keep a local state of grades that the teacher has edited in the grid
    const [editedGrades, setEditedGrades] = useState<Record<string, number | null>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Gradebook', href: route('grades.index') },
    ];

    // Filter changes
    const handleFilterChange = (key: 'classroom_id' | 'subject_id', value: string) => {
        router.get(route('grades.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    // Handle typing a new grade into a cell
    const handleGradeInput = (studentId: number, assignmentId: number, value: string, maxPoints: number) => {
        const numValue = value === '' ? null : Number(value);
        
        // Prevent typing numbers higher than the max points
        if (numValue !== null && numValue > maxPoints) {
            toast.error(`Maximum points for this assignment is ${maxPoints}`);
            return;
        }

        setEditedGrades(prev => ({
            ...prev,
            [`${studentId}-${assignmentId}`]: numValue
        }));
    };

    // Calculate the total percentage for a student dynamically including their unsaved edits
    const calculateStudentTotal = (student: StudentGradeData) => {
        if (assignments.length === 0) return 0;
        
        let totalEarned = 0;
        let totalPossible = 0;

        assignments.forEach(assignment => {
            const editKey = `${student.id}-${assignment.id}`;
            const editedScore = editedGrades[editKey];
            const originalScore = student.submissions[assignment.id]?.score;
            
            // Use edited score if it exists, otherwise original. If null, treat as 0 for the total possible
            const scoreToUse = editedScore !== undefined ? editedScore : originalScore;
            
            if (scoreToUse !== null && scoreToUse !== undefined) {
                totalEarned += scoreToUse;
                totalPossible += assignment.max_points;
            }
        });

        return totalPossible === 0 ? 0 : Math.round((totalEarned / totalPossible) * 100);
    };

    // Batch save all edited grades
    const handleSaveChanges = () => {
        if (Object.keys(editedGrades).length === 0) return;

        setIsSaving(true);
        router.post(route('grades.store'), {
            grades: editedGrades,
            classroom_id: filters.classroom_id,
            subject_id: filters.subject_id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Gradebook updated successfully!');
                setEditedGrades({}); // Clear edited state
            },
            onError: () => toast.error('Failed to save some grades.'),
            onFinish: () => setIsSaving(false)
        });
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        (s.admission_number && s.admission_number.toLowerCase().includes(search.toLowerCase()))
    );

    const hasUnsavedChanges = Object.keys(editedGrades).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                
                {/* Header & Global Actions */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <GraduationCap className="text-primary h-6 w-6" /> Master Gradebook
                        </h1>
                        <p className="text-muted-foreground text-sm">View and manage all student grades in a spreadsheet format.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 bg-background">
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                        <Button 
                            onClick={handleSaveChanges} 
                            disabled={!hasUnsavedChanges || isSaving} 
                            className="gap-2 transition-all"
                            variant={hasUnsavedChanges ? "default" : "secondary"}
                        >
                            <Save className="h-4 w-4" /> 
                            {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Saved'}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="shadow-sm border-t-4 border-t-primary">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center bg-muted/10">
                        <div className="w-full sm:w-64">
                            <Select value={filters.classroom_id} onValueChange={(val) => handleFilterChange('classroom_id', val)}>
                                <SelectTrigger className="bg-background"><SelectValue placeholder="Select Classroom" /></SelectTrigger>
                                <SelectContent>
                                    {classrooms.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:w-64">
                            <Select value={filters.subject_id} onValueChange={(val) => handleFilterChange('subject_id', val)}>
                                <SelectTrigger className="bg-background"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                <SelectContent>
                                    {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="relative w-full sm:ml-auto sm:max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                className="pl-8 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* The Gradebook Matrix */}
                {(!filters.classroom_id || !filters.subject_id) ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-muted/5 border-dashed">
                        <Calculator className="h-12 w-12 mb-4 opacity-20" />
                        <p>Please select a Classroom and a Subject to view the gradebook.</p>
                    </div>
                ) : (
                    <Card className="shadow-sm overflow-hidden border">
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader className="bg-muted/50 whitespace-nowrap">
                                    <TableRow>
                                        <TableHead className="sticky left-0 z-20 bg-muted/50 min-w-[250px] shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                            Student Details
                                        </TableHead>
                                        
                                        {assignments.map(assignment => (
                                            <TableHead key={assignment.id} className="text-center min-w-[120px] px-2 border-l">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold text-foreground truncate max-w-[100px]" title={assignment.title}>
                                                        {assignment.title}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground mt-0.5">
                                                        Max: {assignment.max_points}
                                                    </span>
                                                </div>
                                            </TableHead>
                                        ))}

                                        <TableHead className="sticky right-0 z-20 bg-muted/50 text-center font-bold shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
                                            Overall %
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => {
                                            const totalPercent = calculateStudentTotal(student);
                                            
                                            // Determine color based on grade
                                            const gradeColor = totalPercent >= 70 ? 'text-green-600' : totalPercent >= 50 ? 'text-amber-600' : 'text-destructive';

                                            return (
                                                <TableRow key={student.id} className="hover:bg-muted/30 group">
                                                    {/* Sticky Student Column */}
                                                    <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted/30 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                                    {student.name.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-sm leading-none">{student.name}</span>
                                                                <span className="text-[10px] text-muted-foreground mt-1">{student.admission_number || '--'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Assignment Columns */}
                                                    {assignments.map(assignment => {
                                                        const editKey = `${student.id}-${assignment.id}`;
                                                        const isEdited = editedGrades[editKey] !== undefined;
                                                        const currentScore = isEdited 
                                                            ? editedGrades[editKey] 
                                                            : student.submissions[assignment.id]?.score;

                                                        return (
                                                            <TableCell key={assignment.id} className="text-center px-2 border-l p-1">
                                                                <div className="relative flex justify-center">
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        max={assignment.max_points}
                                                                        className={`h-9 w-20 text-center font-medium ${isEdited ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'bg-transparent border-transparent hover:border-input focus:bg-background'}`}
                                                                        value={currentScore === null || currentScore === undefined ? '' : currentScore}
                                                                        onChange={(e) => handleGradeInput(student.id, assignment.id, e.target.value, assignment.max_points)}
                                                                        placeholder="--"
                                                                    />
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    })}

                                                    {/* Sticky Total Column */}
                                                    <TableCell className="sticky right-0 z-10 bg-background group-hover:bg-muted/30 text-center shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
                                                        <Badge variant="outline" className={`font-bold text-sm ${gradeColor} border-${gradeColor.replace('text-', '')}/30 bg-${gradeColor.replace('text-', '')}/5`}>
                                                            {totalPercent}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={assignments.length + 2} className="h-32 text-center text-muted-foreground">
                                                No students found for this class.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}