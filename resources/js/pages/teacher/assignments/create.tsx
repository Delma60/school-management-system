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

interface Props {
    classrooms: Classroom[];
    subjects: Subject[];
}

export default function CreateAssignment({ classrooms = [], subjects = [] }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Assignments', href: route('assignments.index') },
        { title: 'Create Assignment', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        due_date: '',
        max_points: '100', // Default to 100 points
        classroom_id: '',
        subject_id: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assignments.store'), {
            onSuccess: () => {
                toast.success('Assignment published successfully!');
            },
            onError: () => {
                toast.error('Failed to publish. Please check the highlighted fields.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Assignment" />

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
                            <h1 className="text-2xl font-bold tracking-tight">Create New Assignment</h1>
                            <p className="text-muted-foreground text-sm">Assign tasks, homework, or projects to your students.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('assignments.index')}>
                            <Button variant="ghost">Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" /> {processing ? 'Publishing...' : 'Publish Assignment'}
                        </Button>
                    </div>
                </div>

                <form id="assignment-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card className="border-t-primary border-t-4 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Info className="text-primary h-5 w-5" /> Assignment Configuration
                                </CardTitle>
                                <CardDescription>Set the core details, deadlines, and point values.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-12">
                                {/* Title takes up full width on mobile, 8 cols on desktop */}
                                <div className="grid gap-2 sm:col-span-12 md:col-span-8">
                                    <Label htmlFor="title">
                                        Assignment Title <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Chapter 4 Reading Reflection"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="bg-muted/50"
                                    />
                                    {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                                </div>

                                {/* Points takes up 4 cols */}
                                <div className="grid gap-2 sm:col-span-6 md:col-span-4">
                                    <Label htmlFor="max_points">
                                        Maximum Points <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="max_points"
                                        type="number"
                                        min="0"
                                        value={data.max_points}
                                        onChange={(e) => setData('max_points', e.target.value)}
                                        className="bg-muted/50"
                                    />
                                    {errors.max_points && <p className="text-destructive text-xs">{errors.max_points}</p>}
                                </div>

                                {/* Second row of inputs: Subject, Class, Date */}
                                <div className="grid gap-2 sm:col-span-6 md:col-span-4">
                                    <Label htmlFor="subject">
                                        Subject <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.subject_id} onValueChange={(val) => setData('subject_id', val)}>
                                        <SelectTrigger className="bg-muted/50">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((sub) => (
                                                <SelectItem key={sub.id} value={sub.id.toString()}>
                                                    {sub.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.subject_id && <p className="text-destructive text-xs">{errors.subject_id}</p>}
                                </div>

                                <div className="grid gap-2 sm:col-span-6 md:col-span-4">
                                    <Label htmlFor="classroom">
                                        Target Classroom <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={data.classroom_id} onValueChange={(val) => setData('classroom_id', val)}>
                                        <SelectTrigger className="bg-muted/50">
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classrooms.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.classroom_id && <p className="text-destructive text-xs">{errors.classroom_id}</p>}
                                </div>

                                <div className="grid gap-2 sm:col-span-12 md:col-span-4">
                                    <Label htmlFor="due_date">
                                        Due Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="bg-muted/50"
                                    />
                                    {errors.due_date && <p className="text-destructive text-xs">{errors.due_date}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* ROW 2: Content/Instructions Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <ClipboardEdit className="text-primary h-5 w-5" /> Instructions & Details
                                </CardTitle>
                                <CardDescription>Provide clear instructions on what the students need to do.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-foreground/80 font-semibold">
                                        Assignment Instructions <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Please read pages 45-60 and answer the following questions..."
                                        rows={10}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="resize-y"
                                    />
                                    {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* ROW 1: Configuration Card */}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} size="lg" className="w-full gap-2 sm:w-auto">
                            <Save className="h-4 w-4" /> {processing ? 'Publishing...' : 'Publish Assignment'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
