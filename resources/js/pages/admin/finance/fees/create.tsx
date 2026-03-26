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
import { ArrowLeft, Banknote, CalendarDays, Loader2, Save, Users } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function CreateFeeStructure({ classrooms, students = [] }: { classrooms: Classroom[], students?: Student[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        amount: '',
        academic_session: '2025/2026',
        term: 'First Term',
        status: 'active',
        description: '',
        assignment_type: 'class', // 'class' or 'student'
        classroom_ids: [] as string[], // Now an array for multiple classes
        student_ids: [] as string[],   // Now an array for multiple students
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('fees.store'), {
            onSuccess: () => toast.success('Fee structure defined successfully.'),
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
        if (data.classroom_ids.length === classrooms.length) {
            setData('classroom_ids', []); // Deselect all
        } else {
            setData('classroom_ids', classrooms.map(c => c.id.toString())); // Select all
        }
    };

    const handleSelectAllStudents = () => {
        if (data.student_ids.length === students.length) {
            setData('student_ids', []); // Deselect all
        } else {
            setData('student_ids', students.map(s => s.id.toString())); // Select all
        }
    };

    return (
        <AppLayout>
            <Head title="New Fee Structure" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('fees.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Fee Structure</h1>
                        <p className="text-muted-foreground text-sm">Define a new billable item for the academic calendar.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Banknote className="text-primary h-5 w-5" />
                                    Basic Configuration
                                </CardTitle>
                                <CardDescription>Set the name and price for this fee.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Fee Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. JSS1 Tuition Fee"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (₦)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="50000"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className={errors.amount ? 'border-destructive' : ''}
                                        />
                                        {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Briefly explain what this fee covers..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-5">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        Assignment Target
                                    </CardTitle>
                                    <CardDescription>Choose who this fee applies to.</CardDescription>
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
                                                    // Clear the selections when switching contexts
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
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleSelectAllClasses}
                                                >
                                                    {data.classroom_ids.length === classrooms?.length ? 'Deselect All' : 'Select All'}
                                                </Button>
                                            </div>
                                            <ScrollArea className="h-48 rounded-md border p-4">
                                                <div className="space-y-4">
                                                    {classrooms?.map((cls) => (
                                                        <div key={cls.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`class-${cls.id}`}
                                                                checked={data.classroom_ids.includes(cls.id.toString())}
                                                                onCheckedChange={() => toggleClassroom(cls.id.toString())}
                                                            />
                                                            <label
                                                                htmlFor={`class-${cls.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {cls.name} ({cls.grade_level})
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                            {errors.classroom_ids && <p className="text-destructive text-xs">{errors.classroom_ids}</p>}
                                        </div>
                                    )}

                                    {/* MULTIPLE STUDENT SELECTION */}
                                    {data.assignment_type === 'student' && (
                                        <div className="space-y-3 rounded-md border p-4">
                                            <div className="flex items-center justify-between">
                                                <Label>Select Students</Label>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleSelectAllStudents}
                                                >
                                                    {data.student_ids.length === students?.length ? 'Deselect All' : 'Select All'}
                                                </Button>
                                            </div>
                                            <ScrollArea className="h-48 rounded-md border p-4">
                                                <div className="space-y-4">
                                                    {students?.map((student) => (
                                                        <div key={student.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`student-${student.id}`}
                                                                checked={data.student_ids.includes(student.id.toString())}
                                                                onCheckedChange={() => toggleStudent(student.id.toString())}
                                                            />
                                                            <label
                                                                htmlFor={`student-${student.id}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {student.name}  ({student?.meta?.admission_number as string || "No Admission Number" })
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                            {errors.student_ids && <p className="text-destructive text-xs">{errors.student_ids}</p>}
                                        </div>
                                    )}
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
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="ghost" asChild>
                            <Link href={route('fees.index')}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Create Fee Structure
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
