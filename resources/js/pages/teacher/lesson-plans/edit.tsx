import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Info, Save } from 'lucide-react';
import { toast } from 'sonner';
import { LessonPlan } from './show'; // Reusing the type from your show page

interface Props {
    lessonPlan: LessonPlan;
    classrooms: Classroom[];
    subjects: Subject[];
}

export default function EditLessonPlan({ lessonPlan, classrooms = [], subjects = [] }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Lesson Plans', href: route('lesson-plans.index') },
        { title: 'Edit Plan', href: '#' },
    ];

    // Pre-fill the form with the existing lesson plan data
    // We convert IDs to strings because Shadcn's <Select> expects string values
    // We also slice the date to ensure it fits the 'YYYY-MM-DD' format required by type="date"
    const { data, setData, put, processing, errors } = useForm({
        title: lessonPlan.title || '',
        date: lessonPlan.date ? lessonPlan.date.substring(0, 10) : '',
        classroom_id: lessonPlan.classroom_id?.toString() || '',
        subject_id: lessonPlan.subject_id?.toString() || '',
        objectives: lessonPlan.objectives || '',
        materials: lessonPlan.materials || '',
        content: lessonPlan.content || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use PUT for updating an existing resource
        put(route('lesson-plans.update', lessonPlan.id), {
            onSuccess: () => {
                toast.success('Lesson plan updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update. Please check the highlighted fields.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${lessonPlan.title}`} />

            <div className="space-y-6 p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('lesson-plans.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Lesson Plan</h1>
                            <p className="text-muted-foreground text-sm">Make changes to your existing lesson plan.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('lesson-plans.show', lessonPlan.id)}>
                            <Button variant="ghost">Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <form id="edit-lesson-plan-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-t-primary border-t-4 shadow-sm h-max">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Info className="text-primary h-5 w-5" /> Lesson Details
                                </CardTitle>
                                <CardDescription>Basic information about when and where this lesson occurs.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-2">
                                <div className="grid gap-2 sm:col-span-2 md:col-span-1">
                                    <Label htmlFor="title">
                                        Lesson Title <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className="bg-muted/50" />
                                    {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="date">
                                        Date of Lesson <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="bg-muted/50"
                                    />
                                    {errors.date && <p className="text-destructive text-xs">{errors.date}</p>}
                                </div>

                                <div className="grid gap-2">
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

                                <div className="grid gap-2">
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
                            </CardContent>
                        </Card>

                        {/* ROW 2: Lesson Content Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BookOpen className="text-primary h-5 w-5" /> Instructional Content
                                </CardTitle>
                                <CardDescription>Update the goals, required materials, and step-by-step procedures.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="objectives" className="text-foreground/80 font-semibold">
                                        Learning Objectives
                                    </Label>
                                    <Textarea
                                        id="objectives"
                                        rows={4}
                                        value={data.objectives}
                                        onChange={(e) => setData('objectives', e.target.value)}
                                        className="resize-y"
                                    />
                                    {errors.objectives && <p className="text-destructive text-xs">{errors.objectives}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="materials" className="text-foreground/80 font-semibold">
                                        Required Materials
                                    </Label>
                                    <Textarea
                                        id="materials"
                                        rows={3}
                                        value={data.materials}
                                        onChange={(e) => setData('materials', e.target.value)}
                                        className="resize-y"
                                    />
                                    {errors.materials && <p className="text-destructive text-xs">{errors.materials}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content" className="text-foreground/80 font-semibold">
                                        Procedure & Activities
                                    </Label>
                                    <Textarea
                                        id="content"
                                        rows={10}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="resize-y font-mono text-sm leading-relaxed"
                                    />
                                    {errors.content && <p className="text-destructive text-xs">{errors.content}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* ROW 1: Meta Information Card */}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} size="lg" className="w-full gap-2 sm:w-auto">
                            <Save className="h-4 w-4" /> {processing ? 'Updating Plan...' : 'Update Lesson Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
