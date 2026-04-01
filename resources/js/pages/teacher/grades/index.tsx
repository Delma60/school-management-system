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
import { Calculator, Download, FileText, GraduationCap, CalendarCheck, Save, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Column {
    type: 'assignment' | 'exam' | 'attendance';
    id: number | string;
    title: string;
    max: number;
    readonly: boolean;
}

interface StudentGradeData {
    id: number;
    name: string;
    admission_number: string;
    grades: Record<string, number | null>; // e.g., { "assignment-12": 85, "exam-4": 90, "attendance-att": 100 }
}

interface Props {
    classrooms: Classroom[];
    subjects: Subject[];
    columns: Column[];
    students: StudentGradeData[];
    filters: { classroom_id: string; subject_id: string; };
}

export default function GradebookIndex({ classrooms = [], subjects = [], columns = [], students = [], filters }: Props) {
    const [search, setSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // Store edits: Key format -> "type-itemId-studentId" to make it easy for Laravel to parse
    const [editedGrades, setEditedGrades] = useState<Record<string, number | null>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Comprehensive Gradebook', href: route('grade-books.index') },
    ];

    const handleFilterChange = (key: 'classroom_id' | 'subject_id', value: string) => {
        router.get(route('grades.index'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handleGradeInput = (type: string, itemId: number | string, studentId: number, value: string, maxPoints: number) => {
        const numValue = value === '' ? null : Number(value);
        if (numValue !== null && numValue > maxPoints) {
            toast.error(`Maximum points for this is ${maxPoints}`);
            return;
        }

        const editKey = `${type}-${itemId}-${studentId}`;
        setEditedGrades(prev => ({ ...prev, [editKey]: numValue }));
    };

    // Calculate dynamic total percentage
    const calculateStudentTotal = (student: StudentGradeData) => {
        if (columns.length === 0) return 0;
        
        let totalEarned = 0;
        let totalPossible = 0;

        columns.forEach(col => {
            const editKey = `${col.type}-${col.id}-${student.id}`;
            const stateKey = `${col.type}-${col.id}`;
            
            const editedScore = editedGrades[editKey];
            const originalScore = student.grades[stateKey];
            
            const scoreToUse = editedScore !== undefined ? editedScore : originalScore;
            
            if (scoreToUse !== null && scoreToUse !== undefined) {
                totalEarned += scoreToUse;
                totalPossible += col.max;
            }
        });

        return totalPossible === 0 ? 0 : Math.round((totalEarned / totalPossible) * 100);
    };

    const handleSaveChanges = () => {
        if (Object.keys(editedGrades).length === 0) return;

        setIsSaving(true);
        router.post(route('grades.store'), {
            grades: editedGrades
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Gradebook updated successfully!');
                setEditedGrades({}); 
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
            <Head title="Gradebook" />
            <div className="space-y-6 p-6">
                
                {/* Header Actions */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <GraduationCap className="text-primary h-6 w-6" /> Master Gradebook
                        </h1>
                        <p className="text-muted-foreground text-sm">Manage Exams, Assignments, and view Attendance.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges || isSaving} className="gap-2 transition-all" variant={hasUnsavedChanges ? "default" : "secondary"}>
                            <Save className="h-4 w-4" /> 
                            {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Saved'}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="shadow-sm border-t-4 border-t-primary">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center bg-muted/10">
                        <Select value={filters.classroom_id} onValueChange={(val) => handleFilterChange('classroom_id', val)}>
                            <SelectTrigger className="bg-background sm:w-64"><SelectValue placeholder="Select Classroom" /></SelectTrigger>
                            <SelectContent>{classrooms.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={filters.subject_id} onValueChange={(val) => handleFilterChange('subject_id', val)}>
                            <SelectTrigger className="bg-background sm:w-64"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                            <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <div className="relative w-full sm:ml-auto sm:max-w-xs">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search students..." className="pl-8 bg-background" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </CardContent>
                </Card>

                {/* Matrix */}
                {columns.length === 0 && students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/5 border-dashed">
                        <Calculator className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-muted-foreground">Select a Classroom and Subject to view the matrix.</p>
                    </div>
                ) : (
                    <Card className="shadow-sm overflow-hidden border">
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader className="bg-muted/50 whitespace-nowrap">
                                    <TableRow>
                                        <TableHead className="sticky left-0 z-20 bg-muted/50 min-w-[200px] shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">Student</TableHead>
                                        
                                        {/* Dynamic Columns */}
                                        {columns.map(col => (
                                            <TableHead key={`${col.type}-${col.id}`} className="text-center min-w-[120px] px-2 border-l">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    {/* Visual Indicator for Column Type */}
                                                    {col.type === 'exam' && <Badge variant="destructive" className="text-[9px] h-4 px-1 rounded-sm uppercase tracking-wider">Exam</Badge>}
                                                    {col.type === 'assignment' && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[9px] h-4 px-1 rounded-sm uppercase tracking-wider">Assgn</Badge>}
                                                    {col.type === 'attendance' && <Badge variant="outline" className="text-[9px] h-4 px-1 rounded-sm uppercase tracking-wider bg-white">Attnd</Badge>}
                                                    
                                                    <span className="font-semibold text-foreground truncate max-w-[100px]" title={col.title}>{col.title}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">Max: {col.max}</span>
                                                </div>
                                            </TableHead>
                                        ))}

                                        <TableHead className="sticky right-0 z-20 bg-muted/50 text-center font-bold shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">Total %</TableHead>
                                    </TableRow>
                                </TableHeader>
                                
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => {
                                            const totalPercent = calculateStudentTotal(student);
                                            const gradeColor = totalPercent >= 70 ? 'text-green-600' : totalPercent >= 50 ? 'text-amber-600' : 'text-destructive';

                                            return (
                                                <TableRow key={student.id} className="hover:bg-muted/30 group">
                                                    <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted/30 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{student.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-sm leading-none truncate max-w-[120px]">{student.name}</span>
                                                                <span className="text-[10px] text-muted-foreground mt-1 font-mono">{student.admission_number || '--'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {columns.map(col => {
                                                        const editKey = `${col.type}-${col.id}-${student.id}`; // Identifies pending saves
                                                        const stateKey = `${col.type}-${col.id}`; // Identifies DB values
                                                        
                                                        const isEdited = editedGrades[editKey] !== undefined;
                                                        const currentScore = isEdited ? editedGrades[editKey] : student.grades[stateKey];

                                                        return (
                                                            <TableCell key={stateKey} className="text-center px-2 border-l p-1">
                                                                <div className="relative flex justify-center">
                                                                    {col.readonly ? (
                                                                        // Read Only columns (like Attendance)
                                                                        <span className="font-bold text-muted-foreground">{currentScore !== null ? `${currentScore}%` : '--'}</span>
                                                                    ) : (
                                                                        // Editable columns (Exams, Assignments)
                                                                        <Input
                                                                            type="number"
                                                                            min="0"
                                                                            max={col.max}
                                                                            className={`h-9 w-20 text-center font-medium ${isEdited ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'bg-transparent border-transparent hover:border-input focus:bg-background'}`}
                                                                            value={currentScore === null || currentScore === undefined ? '' : currentScore}
                                                                            onChange={(e) => handleGradeInput(col.type, col.id, student.id, e.target.value, col.max)}
                                                                            placeholder="--"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    })}

                                                    <TableCell className="sticky right-0 z-10 bg-background group-hover:bg-muted/30 text-center shadow-[-1px_0_0_0_rgba(0,0,0,0.1)]">
                                                        <Badge variant="outline" className={`font-bold text-sm ${gradeColor} border-${gradeColor.replace('text-', '')}/30 bg-${gradeColor.replace('text-', '')}/5`}>
                                                            {totalPercent}%
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow><TableCell colSpan={columns.length + 2} className="h-32 text-center text-muted-foreground">No students found.</TableCell></TableRow>
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