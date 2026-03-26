import { Progress } from '@/components/ui/progress';
import { Award, BarChart3, BookOpen, Download, ExternalLink, FileCheck, Trophy } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Classroom, ExamMark } from '@/types';

interface AcademicsTabProps {
    academicData: {
        examsTaken: number;
        averageScore: number;
        examMarks: ExamMark[],
        classroom: Classroom | null,
        class_rank: number,
    };
}
export function AcademicsTab({ academicData }: AcademicsTabProps) {
    // Use real data from the database, with fallbacks to empty arrays
    const examMarks = academicData?.examMarks 
    const classroom = academicData?.classroom;

    // Transform exam marks into subject performance data
    const subjects = examMarks.map((mark) => {
        const examSubject = mark.exam_subject ;
        const subject = examSubject?.subject;
        const exam = examSubject?.exam;
        const teacher = mark.teacher;
        const marksObtained = (mark.marks_obtained as number) || 0;
        const maxMarks = (examSubject?.max_marks as number) || 100;

        return {
            id: (mark.id as number) || 0,
            name: String(subject?.name || 'Unknown Subject'),
            teacher: String(teacher?.name || 'Unassigned'),
            grade: String(mark.grade || 'N/A'),
            score: marksObtained,
            maxScore: maxMarks,
            status: marksObtained >= 80 ? 'Exceeding' : marksObtained >= 60 ? 'On Track' : 'Needs Attention',
            examName: String(exam?.name || 'Unknown Exam'),
            examDate: String(examSubject?.exam_date || new Date().toISOString().split('T')[0]),
            remark: String(mark.teacher_remark || ''),
        };
    });

    // Calculate statistics
    const examsTaken = (academicData?.examsTaken as number) || 0;
    const averageScore = (academicData?.averageScore as number) || 0;
    const classRank = (academicData?.class_rank as number) || 0; 
    const maxClassSize =classroom?.capacity; 

    return (
        <div className="animate-in fade-in space-y-6 duration-500">
            {/* 1. Academic Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-primary text-[10px] font-bold tracking-widest uppercase">Class Rank</p>
                            <h3 className="text-2xl font-black">
                                {classRank} <span className="text-muted-foreground text-sm font-normal">/ {maxClassSize}</span>
                            </h3>
                        </div>
                        <Trophy className="text-primary/40 h-8 w-8" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Exams Taken</p>
                            <h3 className="text-2xl font-black">{examsTaken}</h3>
                        </div>
                        <BookOpen className="text-muted-foreground/40 h-8 w-8" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">Average Score</p>
                            <h3 className="text-2xl font-black">{averageScore.toFixed(1)}%</h3>
                        </div>
                        <Award className="h-8 w-8 text-yellow-500/40" />
                    </CardContent>
                </Card>
            </div>

            {/* 2. Subject-wise Performance Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Exam Results</CardTitle>
                        <CardDescription>
                            {subjects.length > 0 ? `Performance across ${examsTaken} examination(s)` : 'No exam marks recorded yet'}
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3 w-3" /> Export Result
                    </Button>
                </CardHeader>
                {subjects.length > 0 ? (
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Instructor</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Standing</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-bold">{sub.name}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{sub.teacher}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs">
                                                {sub.score}/{sub.maxScore}
                                            </span>
                                            <Progress value={(sub.score / sub.maxScore) * 100} className="h-1.5 w-16" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            {sub.grade}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`text-[10px] font-bold uppercase ${
                                                sub.status === 'Exceeding'
                                                    ? 'text-purple-600'
                                                    : sub.status === 'On Track'
                                                      ? 'text-green-600'
                                                      : 'text-red-600'
                                            }`}
                                        >
                                            {sub.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" title={sub.remark}>
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <CardContent className="text-muted-foreground pt-6 text-center">
                        No exam marks recorded yet. Marks will appear after exams are conducted and grades are entered.
                    </CardContent>
                )}
            </Card>

            {/* 3. Teacher Remarks / Behavioral Logic */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                            <FileCheck className="text-primary h-4 w-4" /> Latest Teacher Remark
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed italic">
                            {subjects.length > 0 && subjects[0].remark ? subjects[0].remark : 'No teacher remarks available yet.'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-bold">
                            <BarChart3 className="text-primary h-4 w-4" /> Performance Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-[100px] items-end justify-between gap-1">
                        {/* Render score distribution for exams taken */}
                        {subjects.length > 0
                            ? subjects
                                  .slice(0, 6)
                                  .map((sub, i: number) => (
                                      <div
                                          key={i}
                                          className="bg-primary/20 hover:bg-primary w-full cursor-help rounded-t-sm transition-colors"
                                          style={{ height: `${(sub.score / sub.maxScore) * 100}%` }}
                                          title={`${sub.name}: ${sub.score}%`}
                                      />
                                  ))
                            : [45, 60, 55, 80, 75, 90].map((height, i) => (
                                  <div key={i} className="bg-muted w-full rounded-t-sm" style={{ height: `${height}%` }} title={`No data`} />
                              ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
