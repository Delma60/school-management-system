import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Users, Download, Filter, Search, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { Classroom, Exam } from '@/types';

interface Props {
    classrooms: Classroom[];
    exams: Exam[];
    logs: {
        data: any[];
        from: number;
        to: number;
        total: number;
        links: any[];
    };
    filters: {
        search: string;
        classroom_id: string | null;
        exam_id: string | null;
    };
    stats: {
        average_score: number;
        total_entries: number;
        pass_rate: number;
    };
}
export default function PerformanceLogs({ logs, filters, classrooms, exams, stats }: Props) {
    
    // Handle filtering updates
    const updateFilter = (key: string, value: string) => {
        router.get(
            '/dashboard/students/performance',
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    const clearFilters = () => {
        router.get('/dashboard/students/performance');
    };

    return (
        <AppLayout>
            <Head title="Performance Logs" />
            
            <div className="p-6 space-y-6">
                
                {/* --- PAGE HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Performance Logs</h1>
                        <p className="text-sm text-muted-foreground">Monitor and analyze student academic records.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {/* --- KPI STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">School Average</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Number(stats.average_score).toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all logged subjects</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Entries Logged</CardTitle>
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_entries}</div>
                            <p className="text-xs text-muted-foreground mt-1">Individual marks recorded</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Overall Pass Rate</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pass_rate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Students scoring above passing mark</p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- FILTERS & DATA TABLE --- */}
                <Card>
                    <CardHeader className="border-b pb-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Filter className="h-5 w-5 text-muted-foreground" />
                                Filter Logs
                            </CardTitle>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search student name..." 
                                        className="pl-9"
                                        defaultValue={filters.search}
                                        onBlur={(e) => updateFilter('search', e.target.value)}
                                    />
                                </div>
                                <Select value={filters.classroom_id || ""} onValueChange={(v) => updateFilter('classroom_id', v)}>
                                    <SelectTrigger className="w-full sm:w-[160px]">
                                        <SelectValue placeholder="All Classes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Classes</SelectItem>
                                        {classrooms.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filters.exam_id || ""} onValueChange={(v) => updateFilter('exam_id', v)}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="All Examinations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Examinations</SelectItem>
                                        {exams.map((exam) => (
                                            <SelectItem key={exam.id} value={exam.id.toString()}>{exam.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(filters.classroom_id || filters.exam_id || filters.search) && (
                                    <Button variant="ghost" onClick={clearFilters} className="text-destructive">Clear</Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Date Recorded</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Examination</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            No performance logs found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => {
                                        // Dynamic checks based on your specific logic
                                        const isPassing = log.marks_obtained >= (log.exam_subject?.pass_marks || 40);
                                        const dateObj = new Date(log.updated_at);
                                        console.log(log)
                                        
                                        return (
                                            <TableRow key={log.id} className="hover:bg-muted/5">
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {log.student?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-normal">
                                                        {log.student?.classroom?.name || 'N/A'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {log.exam_subject?.exam?.name} 
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {log.exam_subject?.subject?.name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="font-mono font-bold">
                                                        {log.marks_obtained} 
                                                        <span className="text-muted-foreground text-xs font-normal"> / {log.exam_subject?.max_marks || 100}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={isPassing ? "secondary" : "destructive"} className="gap-1">
                                                        {isPassing ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                                        {isPassing ? 'Pass' : 'Fail'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination (Assuming you have a standard Pagination component) */}
                {logs.links && logs.links.length > 3 && (
                    <div className="flex justify-center mt-4">
                         {/* Replace with your generic Pagination component if you have one, 
                             or map through logs.links here to create pagination buttons */}
                         <p className="text-sm text-muted-foreground">Showing {logs.from} to {logs.to} of {logs.total} results</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}