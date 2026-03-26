import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Classroom, Student } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Activity, ArrowLeft, Banknote, CalendarDays, Loader2, Save, Users } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function EditFeeStructure({ fee, classrooms, students = [] }: { fee: any, classrooms: Classroom[], students?: Student[] }) {
    // Safely extract existing assigned IDs so the checkboxes are pre-checked
    const existingClassroomIds = fee.classroom_fees?.map((cf: any) => cf.classroom_id?.toString()) || [];
    const existingStudentIds = fee.student_fees?.map((sf: any) => sf.user_id?.toString()) || [];

    const initialAssignmentType = existingClassroomIds.length > 0 
        ? 'class' 
        : (existingStudentIds.length > 0 ? 'student' : 'class'); // default to class if empty

    const { data, setData, put, processing, errors } = useForm({
        name: fee.name || '',
        amount: fee.amount || '',
        academic_session: fee.academic_session || '',
        term: fee.term || '',
        status: fee.status || 'active',
        description: fee.meta?.description || '',
        assignment_type: initialAssignmentType,
        classroom_ids: existingClassroomIds,
        student_ids: existingStudentIds,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('fees.update', fee.id), {
            onSuccess: () => toast.success('Fee structure updated successfully.'),
            onError: (error) => {
                toast.error("Error updating fee structure.")
                console.log(error, data)
            }
        });
    };

    const toggleClassroom = (id: string) => {
        setData('classroom_ids', data.classroom_ids.includes(id)
            ? data.classroom_ids.filter((cId) => cId !== id)
            : [...data.classroom_ids, id]
        );
    };

    const toggleStudent = (id: string) => {
        setData('student_ids', data.student_ids.includes(id)
            ? data.student_ids.filter((sId) => sId !== id)
            : [...data.student_ids, id]
        );
    };

    const handleSelectAllClasses = () => {
        if (data.classroom_ids.length === classrooms?.length) {
            setData('classroom_ids', []);
        } else {
            setData('classroom_ids', classrooms.map(c => c.id.toString()));
        }
    };

    const handleSelectAllStudents = () => {
        if (data.student_ids.length === students?.length) {
            setData('student_ids', []);
        } else {
            setData('student_ids', students.map(s => s.id.toString()));
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit ${fee.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('fees.show', fee.id)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Fee Structure</h1>
                        <p className="text-muted-foreground text-sm">Update configuration and assignments for {fee.name}.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Banknote className="text-primary h-5 w-5" />
                                        Basic Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Fee Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount (₦)</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                className={errors.amount ? 'border-destructive' : ''}
                                            />
                                            {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CalendarDays className="h-5 w-5 text-emerald-500" />
                                        Academic Scheduling
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Academic Session</Label>
                                        <Select value={data.academic_session} onValueChange={(v) => setData('academic_session', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select session" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2024/2025">2024/2025</SelectItem>
                                                <SelectItem value="2025/2026">2025/2026</SelectItem>
                                                <SelectItem value="2026/2027">2026/2027</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Term</Label>
                                        <Select value={data.term} onValueChange={(v) => setData('term', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select term" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="First Term">First Term</SelectItem>
                                                <SelectItem value="Second Term">Second Term</SelectItem>
                                                <SelectItem value="Third Term">Third Term</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Manage Assignments
                                </CardTitle>
                                <CardDescription>Update who this fee applies to.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Assign To</Label>
                                    <Select
                                        value={data.assignment_type}
                                        onValueChange={(val) => {
                                            setData(prev => ({
                                                ...prev,
                                                assignment_type: val,
                                                classroom_ids: val === 'student' ? [] : prev.classroom_ids,
                                                student_ids: val === 'class' ? [] : prev.student_ids,
                                            }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="class">Classrooms</SelectItem>
                                            <SelectItem value="student">Specific Students</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* MULTIPLE CLASSROOM SELECTION */}
                                {data.assignment_type === 'class' && (
                                    <div className="space-y-3 rounded-md border p-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Select Classrooms</Label>
                                            <Button type="button" variant="secondary" size="sm" onClick={handleSelectAllClasses}>
                                                {data.classroom_ids.length === classrooms?.length ? 'Deselect All' : 'Select All'}
                                            </Button>
                                        </div>
                                        <ScrollArea className="h-[250px] rounded-md border p-4">
                                            <div className="space-y-4">
                                                {classrooms?.map((cls: any) => (
                                                    <div key={cls.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`class-${cls.id}`}
                                                            checked={data.classroom_ids.includes(cls.id.toString())}
                                                            onCheckedChange={() => toggleClassroom(cls.id.toString())}
                                                        />
                                                        <label htmlFor={`class-${cls.id}`} className="text-sm font-medium leading-none cursor-pointer">
                                                            {cls.name} ({cls.grade_level})
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}

                                {/* MULTIPLE STUDENT SELECTION */}
                                {data.assignment_type === 'student' && (
                                    <div className="space-y-3 rounded-md border p-4">
                                        <div className="flex items-center justify-between">
                                            <Label>Select Students</Label>
                                            <Button type="button" variant="secondary" size="sm" onClick={handleSelectAllStudents}>
                                                {data.student_ids.length === students?.length ? 'Deselect All' : 'Select All'}
                                            </Button>
                                        </div>
                                        <ScrollArea className="h-[250px] rounded-md border p-4">
                                            <div className="space-y-4">
                                                {students?.map((student: any) => (
                                                    <div key={student.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`student-${student.id}`}
                                                            checked={data.student_ids.includes(student.id.toString())}
                                                            onCheckedChange={() => toggleStudent(student.id.toString())}
                                                        />
                                                        <label htmlFor={`student-${student.id}`} className="text-sm font-medium leading-none cursor-pointer">
                                                            {student.name || `${student.first_name} ${student.last_name}`}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="ghost" asChild>
                            <Link href={route('fees.show', fee.id)}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
