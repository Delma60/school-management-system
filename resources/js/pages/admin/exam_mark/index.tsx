import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Classroom, Exam, ExamSubject, GradingScale, Student } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, BookOpen, CheckCircle2, GraduationCap, Save, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EnterMarksProps {
    exams: Exam[];
    selectedExamSubject?: ExamSubject | null;
    students: Student[];
    classroomId?: number | null;
    selectedExamId?: number | null;
    gradingScales?: GradingScale[];
}

export default function EnterMarks({
    exams,
    selectedExamSubject,
    students: initialStudents,
    classroomId,
    selectedExamId,
    gradingScales = [],
}: EnterMarksProps) {
    const [loading, setLoading] = useState(false);
    const [selectedExam, setSelectedExam] = useState<string>(selectedExamId?.toString() || '');
    const [subjects, setSubjects] = useState<ExamSubject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedClassroom, setSelectedClassroom] = useState<string>(classroomId?.toString() || '');
    const [availableClassrooms, setAvailableClassrooms] = useState<Classroom[]>([]);
    const [examSubject, setExamSubject] = useState<ExamSubject | null>(selectedExamSubject || null);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [showMarksTable, setShowMarksTable] = useState(!!selectedExamSubject);
    const grades = gradingScales;

    // Function to calculate grade based on marks
    const calculateGrade = (marks: number): string => {
        const scale = grades.find((g) => marks >= g.min_score && marks <= g.max_score);
        return scale?.grade ?? 'N/A';
    };

    // Function to calculate ranks based on marks
    const calculateRanks = (marks: Array<{ student_id: number; marks_obtained: number }>) => {
        // Sort by marks in descending order and assign ranks
        const sorted = marks.map((m, index) => ({ ...m, originalIndex: index })).sort((a, b) => b.marks_obtained - a.marks_obtained);

        const rankedArray = new Array(marks.length);
        let currentRank = 1;
        let previousMarks: number | null = null;

        sorted.forEach((item, index) => {
            // If this is the first student or marks changed from previous, assign new rank
            if (previousMarks !== null && item.marks_obtained !== previousMarks) {
                // Set rank to current position (skipping tied positions)
                currentRank = index + 1;
            }
            rankedArray[item.originalIndex] = currentRank;
            previousMarks = item.marks_obtained;
        });

        return rankedArray;
    };

    const comment = (marks: number) => {
        const scale = grades.find((g) => marks >= g.min_score && marks <= g.max_score);
        return scale?.remark ?? '';
    };

    // Initialize form with breakdown from the 'meta' JSON field
    const { data, setData, post, processing } = useForm({
        exam_subject_id: examSubject?.id,
        
        marks: students.map((student: Student) => {
            const existingMark = student?.exam_marks?.[0];
            const marksObtained = existingMark?.marks_obtained ?? 0;
            return {
                student_id: student.id,
                student_name: student.name,
                ca_score: existingMark?.meta?.ca_score ?? '',
                exam_score: existingMark?.meta?.exam_score ?? '',
                marks_obtained: marksObtained,
                rank: 0,
                grade: calculateGrade(marksObtained),
                teacher_remark: existingMark?.teacher_remark ?? comment(marksObtained),
            };
        }),
    });

    // Update form when students are fetched
    useEffect(() => {
        const marksData = students.map((student: Student) => {
            const existingMark = student?.exam_marks?.[0];
            const marksObtained = existingMark?.marks_obtained ?? 0;
            return {
                student_id: student.id,
                student_name: student.name,
                ca_score: existingMark?.meta?.ca_score ?? '',
                exam_score: existingMark?.meta?.exam_score ?? '',
                marks_obtained: marksObtained,
                rank: 0,
                grade: calculateGrade(marksObtained),
                teacher_remark: existingMark?.teacher_remark ?? comment(marksObtained),
            };
        });

        // Calculate ranks
        const ranks = calculateRanks(marksData);
        const marksWithRanks = marksData.map((mark, index) => ({
            ...mark,
            rank: ranks[index],
        }));

        setData('marks', marksWithRanks);
    }, [students, grades]);

    // Fetch subjects when exam is selected
    useEffect(() => {
        if (selectedExam) {
            setLoading(true);
            fetch(route('exam_marks.subjects_by_exam', { exam_id: selectedExam }))
                .then((res) => res.json())
                .then((data) => {
                    setSubjects(data.subjects || []);
                    setSelectedSubject('');
                    setShowMarksTable(false);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching subjects:', err);
                    setLoading(false);
                });
        }
    }, [selectedExam]);

    // Fetch classrooms when exam subject is selected
    useEffect(() => {
        if (selectedSubject) {
            setLoading(true);
            fetch(route('exam_marks.classrooms_by_subject', { exam_subject_id: selectedSubject }))
                .then((res) => res.json())
                .then((data) => {
                    setAvailableClassrooms(data.classrooms || []);
                    setSelectedClassroom('');
                    setShowMarksTable(false);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('Error fetching classrooms:', err);
                    setLoading(false);
                });
        }
    }, [selectedSubject]);

    // Fetch students when exam subject is selected
    useEffect(() => {
        if (selectedSubject && selectedClassroom) {
            setLoading(true);
            fetch(
                route('exam_marks.students_by_subject', {
                    exam_subject_id: selectedSubject,
                    classroom_id: selectedClassroom,
                }),
            )
                .then((res) => res.json())
                .then((data) => {
                    // console.log({ data });
                    setExamSubject(data.examSubject);
                    setStudents(data.students || []);

                    // Update form data with ranks
                    const marksData = (data.students || []).map((student: Student) => {
                        const existingMark = student?.exam_marks?.[0];
                        return {
                            student_id: student.id,
                            student_name: student.name,
                            ca_score: existingMark?.meta?.ca_score ?? '',
                            exam_score: existingMark?.meta?.exam_score ?? '',
                            marks_obtained: existingMark?.marks_obtained ?? 0,
                            rank: 0,
                            teacher_remark: existingMark?.teacher_remark ?? '',
                        };
                    });

                    // Calculate and assign ranks
                    const ranks = calculateRanks(marksData);
                    const marksWithRanks = marksData.map((mark: Record<string, unknown>, idx: number) => ({
                        ...mark,
                        rank: ranks[idx],
                    }));

                    setData('exam_subject_id', data.examSubject?.id);
                    setData('marks', marksWithRanks);

                    setShowMarksTable(true);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching students:', err);
                    setLoading(false);
                });
        }
    }, [selectedSubject, selectedClassroom]);

    const handleScoreChange = (index: number, field: 'ca_score' | 'exam_score', value: string) => {
        const newMarks = [...data.marks];
        const numValue = value === '' ? 0 : parseFloat(value);

        newMarks[index][field] = value;

        const ca = field === 'ca_score' ? numValue : parseFloat(newMarks[index].ca_score) || 0;
        const exam = field === 'exam_score' ? numValue : parseFloat(newMarks[index].exam_score) || 0;
        const total = ca + exam;

        if (total > (examSubject?.max_marks || 0)) return;

        newMarks[index].marks_obtained = total;
        newMarks[index].grade = calculateGrade(total);

        // Recalculate ranks for all students
        const ranks = calculateRanks(newMarks);
        const marksWithRanks = newMarks.map((mark, idx) => ({
            ...mark,
            rank: ranks[idx],
        }));

        setData('marks', marksWithRanks);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('exam_marks.store'), {
            onSuccess: () => {
                toast.success('Exam marks saved successfully!');
                // setShowMarksTable(false);
                // setSelectedExam('');
                // setSelectedSubject('');
                // setSelectedClassroom('');
                // setStudents([]);
            },
            onError: () => {
                toast.error('Failed to save exam marks. Please try again.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Enter Exam Marks" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold">
                            <BookOpen className="text-primary h-8 w-8" />
                            Enter Exam Marks
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm">Select exam, subject, and classroom to enter marks</p>
                    </div>
                    {showMarksTable && (
                        <Button onClick={submit} disabled={processing} className="gap-2 shadow-sm">
                            <Save className="h-4 w-4" /> Save Results
                        </Button>
                    )}
                </div>

                {/* Selection Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Exam Selection */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <GraduationCap className="h-4 w-4 text-blue-500" />
                                Select Exam
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedExam} onValueChange={setSelectedExam}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an exam..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.map((exam: Exam) => (
                                        <SelectItem key={exam.id} value={exam.id.toString()}>
                                            {exam.name} ({exam.term})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedExam && (
                                <div className="mt-3 rounded bg-blue-50 p-2 text-xs text-blue-700">{subjects.length} subject(s) available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Subject Selection */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <BookOpen className="h-4 w-4 text-purple-500" />
                                Select Subject
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedExam || loading}>
                                <SelectTrigger>
                                    <SelectValue placeholder={!selectedExam ? 'Select exam first' : loading ? 'Loading...' : 'Choose a subject...'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                            {subject?.subject?.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedSubject && examSubject && (
                                <div className="mt-3 rounded bg-purple-50 p-2 text-xs text-purple-700">
                                    Total: {examSubject.max_marks} | Pass: {examSubject.pass_marks}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Classroom Selection - Optional: Implement based on your structure */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <Users className="h-4 w-4 text-green-500" />
                                Classroom
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={selectedClassroom} onValueChange={setSelectedClassroom} disabled={!selectedSubject || loading}>
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            !selectedSubject
                                                ? 'Select subject first'
                                                : loading
                                                  ? 'Loading...'
                                                  : selectedClassroom || 'Select classroom...'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableClassrooms && availableClassrooms.length > 0 ? (
                                        availableClassrooms.map((classroom) => (
                                            <SelectItem key={classroom.id} value={classroom.id.toString()}>
                                                {classroom.name} ({classroom.grade_level})
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground p-2 text-sm">No classrooms offering this subject</div>
                                    )}
                                </SelectContent>
                            </Select>
                            {students.length > 0 && (
                                <div className="mt-3 rounded bg-green-50 p-2 text-xs text-green-700">{students.length} student(s) found</div>
                            )}
                            {selectedSubject && availableClassrooms.length > 0 && !selectedClassroom && (
                                <div className="mt-3 rounded bg-blue-50 p-2 text-xs text-blue-700">
                                    {availableClassrooms.length} classroom(s) available
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Marks Entry Table */}
                {showMarksTable && examSubject && students.length > 0 ? (
                    <Card className="border-l-primary border-l-4">
                        <CardHeader className="from-primary/5 border-b bg-gradient-to-r to-transparent py-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{examSubject?.subject?.name}</CardTitle>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {examSubject?.exam?.name} • Max: {examSubject?.max_marks} marks • Pass: {examSubject?.pass_marks} marks
                                    </p>
                                </div>
                                <Badge variant="secondary">{students.length} Students</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-x-auto p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="w-[200px] font-semibold">Student Name</TableHead>
                                        <TableHead className="w-[100px] font-semibold">CA Score</TableHead>
                                        <TableHead className="w-[100px] font-semibold">Exam Score</TableHead>
                                        <TableHead className="w-[80px] font-semibold">Total</TableHead>
                                        <TableHead className="w-[80px] font-semibold">Rank</TableHead>
                                        <TableHead className="w-[80px] font-semibold">Grade</TableHead>
                                        <TableHead className="flex-1 font-semibold">Teacher Remarks</TableHead>
                                        <TableHead className="w-[110px] text-right font-semibold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.marks.map((row, index) => {
                                        const isPassing = row.marks_obtained >= (examSubject?.pass_marks || 0);
                                        const isPartiallyFilled = row.ca_score !== '' || row.exam_score !== '';

                                        return (
                                            <TableRow key={row.student_id} className="hover:bg-muted/40 border-b">
                                                <TableCell className="text-foreground font-medium">{row.student_name}</TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-20 text-center"
                                                        value={row.ca_score}
                                                        onChange={(e) => handleScoreChange(index, 'ca_score', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-20 text-center"
                                                        value={row.exam_score}
                                                        onChange={(e) => handleScoreChange(index, 'exam_score', e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`font-mono text-base font-bold ${
                                                            isPartiallyFilled
                                                                ? isPassing
                                                                    ? 'text-green-600'
                                                                    : 'text-destructive'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {row.marks_obtained}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`w-full justify-center text-center font-semibold ${
                                                            row.rank === 1
                                                                ? 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30'
                                                                : row.rank === 2
                                                                  ? 'bg-slate-500/10 text-slate-700 hover:bg-slate-500/30'
                                                                  : row.rank === 3
                                                                    ? 'bg-orange-500/20 text-orange-700 hover:bg-orange-500/30'
                                                                    : 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30'
                                                        }`}
                                                    >
                                                        #{row.rank}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={row.grade === 'N/A' ? 'outline' : 'secondary'}
                                                        className="w-full justify-center text-center font-semibold"
                                                    >
                                                        {row.grade}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        placeholder="Optional notes..."
                                                        className="text-sm"
                                                        value={row.teacher_remark}
                                                        onChange={(e) => {
                                                            const copy = [...data.marks];
                                                            copy[index].teacher_remark = e.target.value;
                                                            setData('marks', copy);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isPartiallyFilled ? (
                                                        <Badge variant={isPassing ? 'default' : 'destructive'} className="ml-auto w-fit gap-1">
                                                            {isPassing ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                                            {isPassing ? 'Pass' : 'Below Pass'}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground ml-auto w-fit">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : showMarksTable ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Users className="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-50" />
                            <p className="text-muted-foreground">No students found in the selected classroom and exam subject.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-50" />
                            <p className="text-muted-foreground">Select an exam, subject, and classroom to begin entering marks</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
