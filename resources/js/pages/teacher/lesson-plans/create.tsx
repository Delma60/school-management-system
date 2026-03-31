import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Info, Loader2, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    classrooms: Classroom[];
    subjects: Subject[];
}

export default function CreateLessonPlan({ classrooms = [], subjects = [] }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Lesson Plans', href: route('lesson-plans.index') },
        { title: 'Create Plan', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        date: '',
        classroom_id: '',
        subject_id: '',
        objectives: '',
        materials: '',
        content: '',
    });

    const {
        post: generateAI,
        processing: isGenerating,
        setData: setAiGenData,
    } = useForm({
        topic: '',
        subject: '',
        grade_level: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lesson-plans.store'), {
            onSuccess: () => {
                toast.success('Lesson plan created successfully!');
            },
            onError: () => {
                toast.error('Failed to save. Please check the highlighted fields.');
            },
        });
    };

    const handleAIGenerate = () => {
        // Ensure the user has provided enough context for the AI
        if (!data.title || !data.subject_id || !data.classroom_id) {
            toast.error('Please fill in the Title, Subject, and Classroom first so the AI knows what to write about.');
            return;
        }

        // Find the actual names of the subject and class to send to the AI
        const subjectName = subjects.find((s) => s.id.toString() === data.subject_id.toString())?.name;
        const classroomName = classrooms.find((c) => c.id.toString() === data.classroom_id.toString())?.name;

        // Set the data for the AI generation form
        setAiGenData('topic', data.title);
        setAiGenData('subject', subjectName);
        setAiGenData('grade_level', classroomName);

        // Submit the AI generation request
        generateAI(route('teacher.lesson-plans.ai-generate'), {
            onSuccess: (response: any) => {
                // Auto-fill the form with the AI's response
                setData((prev) => ({
                    ...prev,
                    objectives: response.props.objectives || prev.objectives,
                    materials: response.props.materials || prev.materials,
                    content: response.props.content || prev.content,
                }));
                toast.success('Lesson plan drafted successfully!');
            },
            onError: () => {
                toast.error('Failed to generate lesson plan. Ensure your API keys are configured.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Lesson Plan" />

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
                            <h1 className="text-2xl font-bold tracking-tight">Draft Lesson Plan</h1>
                            <p className="text-muted-foreground text-sm">Create a detailed guide for your upcoming class session.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('lesson-plans.index')}>
                            <Button variant="ghost">Cancel</Button>
                        </Link>
                        <Button onClick={handleSubmit} disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save Plan'}
                        </Button>
                    </div>
                </div>

                <form id="lesson-plan-form" onSubmit={handleSubmit} className="spacey-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* ROW 1: Meta Information Card */}
                        <Card className="border-t-primary h-max border-t-4 shadow-sm">
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
                                    <Input
                                        id="title"
                                        placeholder="e.g., Introduction to Algebraic Fractions"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="bg-muted/50"
                                    />
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
                                <CardDescription>Define the goals, required materials, and step-by-step procedures.</CardDescription>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAIGenerate}
                                    disabled={isGenerating}
                                    className="gap-2 border-indigo-200 bg-indigo-100 text-indigo-700 shadow-sm hover:bg-indigo-200"
                                >
                                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-indigo-600" />}
                                    {isGenerating ? 'Drafting...' : 'Auto-Generate Content'}
                                </Button>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="objectives" className="text-foreground/80 font-semibold">
                                        Learning Objectives
                                    </Label>
                                    <p className="text-muted-foreground mb-1 text-xs">
                                        What should the students know or be able to do by the end of this lesson?
                                    </p>
                                    <Textarea
                                        id="objectives"
                                        placeholder="1. Students will be able to...&#10;2. Students will understand..."
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
                                    <p className="text-muted-foreground mb-1 text-xs">List textbooks, worksheets, props, or digital tools needed.</p>
                                    <Textarea
                                        id="materials"
                                        placeholder="e.g., Chapter 4 Worksheet, Projector, Graph Paper"
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
                                    <p className="text-muted-foreground mb-1 text-xs">
                                        Outline the step-by-step instructional flow (Introduction, Core Activity, Conclusion).
                                    </p>
                                    <Textarea
                                        id="content"
                                        placeholder="Introduction (10 mins): ...&#10;&#10;Main Activity (30 mins): ...&#10;&#10;Conclusion (5 mins): ..."
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

                    {/* Mobile/Bottom Save Button (Visible mainly on smaller screens or end of scroll) */}
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} size="lg" className="w-full gap-2 sm:w-auto">
                            <Save className="h-4 w-4" /> {processing ? 'Saving Plan...' : 'Save Lesson Plan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
