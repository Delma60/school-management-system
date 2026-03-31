import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardEdit, Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Assignment } from './index'; // Reuse the interface from your index page

interface Props {
    assignment: Assignment;
    classrooms: Classroom[];
    subjects: Subject[];
}

export default function EditAssignment({ assignment, classrooms = [], subjects = [] }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Assignments', href: route('assignments.index') },
        { title: 'Edit Assignment', href: '#' },
    ];

    // Pre-fill the form.
    // We convert numbers to strings for the Select inputs, and slice the date for the HTML date picker.
    const { data, setData, put, processing, errors } = useForm({
        title: assignment.title || '',
        due_date: assignment.due_date ? assignment.due_date.substring(0, 10) : '',
        max_points: assignment.max_points?.toString() || '100',
        classroom_id: assignment.classroom_id?.toString() || '',
        subject_id: assignment.subject_id?.toString() || '',
        description: assignment.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use PUT for updating
        put(route('assignments.update', assignment.id), {
            onSuccess: () => {
                toast.success('Assignment updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update. Please check the highlighted fields.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${assignment.title}`} />

            <div className="space-y-6 p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('assignments.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Assignment</h1>
                            <p className="text-muted-foreground text-sm">Update instructions, change deadlines, or adjust points.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('assignments.index')}>
                            <Button variant="ghost">Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" /> {processing ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <form id="edit-assignment-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ROW 1: Configuration Card */}
                    <Card className="shadow-sm border-t-4 border-t-primary">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Info className="h-5 w-5 text-primary" /> Assignment Configuration
                            </CardTitle>
                            <CardDescription>Set the core details, deadlines, and point values.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-12">

                            <div className="grid gap-2 sm:col-span-12 md:col-span-8">
                                <Label htmlFor="title">Assignment Title <span className="text-destructive">*</span></Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="bg-muted/50"
                                />
                                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                            </div>

                            <div className="grid gap-2 sm:col-span-6 md:col-span-4">
                                <Label htmlFor="max_points">Maximum Points <span className="text-destructive">*</span></Label>
                                <Input
                                    id="max_points"
                                    type="number"
                                    min="0"
                                    value={data.max_points}
                                    onChange={e => setData('max_points', e.target.value)}
                                    className="bg-muted/50"
                                />
                                {errors.max_points && <p className="text-xs text-destructive">{errors.max_points}</p>}
                            </div>

                            <div className="grid gap-2 sm:col-span-6 md:col-span-4">
                                <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                                <Select value={data.subject_id} onValueChange={val => setData('subject_id', val)}>
                                    <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(sub => <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.subject_id && <p className="text-xs text-destructive">{errors.subject_id}</p>}
                            </div>

                            <div className="grid gap-2 sm:col-span-6 md:col-span-4">
                                <Label htmlFor="classroom">Target Classroom <span className="text-destructive">*</span></Label>
                                <Select value={data.classroom_id} onValueChange={val => setData('classroom_id', val)}>
                                    <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {classrooms.map(cls => <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.classroom_id && <p className="text-xs text-destructive">{errors.classroom_id}</p>}
                            </div>

                            <div className="grid gap-2 sm:col-span-12 md:col-span-4">
                                <Label htmlFor="due_date">Due Date <span className="text-destructive">*</span></Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                    className="bg-muted/50"
                                />
                                {errors.due_date && <p className="text-xs text-destructive">{errors.due_date}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ROW 2: Content/Instructions Card */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ClipboardEdit className="h-5 w-5 text-primary" /> Instructions & Details
                            </CardTitle>
                            <CardDescription>Update the instructions on what the students need to do.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="font-semibold text-foreground/80">Assignment Instructions <span className="text-destructive">*</span></Label>
                                <Textarea
                                    id="description"
                                    rows={10}
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="resize-y"
                                />
                                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                            </div>

                        </CardContent>
                    </Card>

                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} size="lg" className="w-full sm:w-auto gap-2">
                            <Save className="h-4 w-4" /> {processing ? 'Updating...' : 'Update Assignment'}
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
