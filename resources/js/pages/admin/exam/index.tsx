import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, ClipboardCheck, FileText, MoreHorizontal, Plus, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ExamIndex({ exams, stats }: any) {
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [examToDelete, setExamToDelete] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (exam: any) => {
        setExamToDelete(exam);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = (id: string) => {
        if (!examToDelete) return;
        setIsDeleting(true);
        router.delete(route('exams.destroy', id), {
            onSuccess: () => {
                toast.success('Examination deleted successfully');
            },
            onError() {
                toast.error('Failed to delete examination');
                console.error('Deletion error');
            },
            onFinish: () => {
                setIsDeleting(false);
                setDeleteConfirmOpen(false);
                setExamToDelete(null);
            },
        });
    };
    return (
        <AppLayout>
            <Head title="Examinations" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Examinations</h1>
                        <p className="text-muted-foreground">Manage exam schedules, grading scales, and results.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => router.get(route('grades.index'))}>
                            <Settings2 className="h-4 w-4" /> Grading Scales
                        </Button>
                        <Button className="gap-2" onClick={() => router.get(route('exams.create'))}>
                            <Plus className="h-4 w-4" /> Create Exam
                        </Button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_exams}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
                            <ClipboardCheck className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_results}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                            <FileText className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.subjects_count}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Exams List */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Term / Session</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exams.data.map((exam: any) => (
                                    <TableRow key={exam.id}>
                                        <TableCell className="font-medium">{exam.name}</TableCell>
                                        <TableCell>
                                            {exam.term} - {exam.session}
                                        </TableCell>
                                        <TableCell>{exam.subjects_count} Subjects</TableCell>
                                        <TableCell>
                                            <Badge variant={exam.status === 'ongoing' ? 'default' : 'secondary'}>{exam.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.get(route('exams.edit', exam.id))}>
                                                        Manage Schedule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.get(route('exam_marks.index', { exam_id: exam.id }))}>
                                                        Enter Marks
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(exam)}>
                                                        Delete Exam
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Examination?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold">{examToDelete?.name}</span>? This will permanently remove
                            the exam, all associated subjects, marks, and related data. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => confirmDelete(examToDelete?.id)} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'} {examToDelete?.id}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
