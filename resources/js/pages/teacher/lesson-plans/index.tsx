import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';

// Define the LessonPlan type based on what we will build in the backend
export interface LessonPlan {
    id: number;
    title: string;
    date: string;
    objectives: string;
    materials: string;
    content: string;
    classroom?: Classroom;
    subject?: Subject;
}

interface Props {
    lessonPlans: LessonPlan[];
    classrooms: Classroom[];
    subjects: Subject[];
}

export default function LessonPlansIndex({ lessonPlans = [], classrooms = [], subjects = [] }: Props) {
    const [search, setSearch] = useState('');
    // const [isCreateOpen, setIsCreateOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Lesson Plans', href: route('lesson-plans.index') },
    ];

    // Filter logic
    const filteredPlans = lessonPlans.filter(
        (plan) => plan.title.toLowerCase().includes(search.toLowerCase()) || plan.subject?.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Form logic for the Create Sheet
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        date: '',
        classroom_id: '',
        subject_id: '',
        objectives: '',
        materials: '',
        content: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <Head title="My Lesson Plans" />

                {/* Header & Actions */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <BookOpen className="text-primary h-6 w-6" /> Lesson Plans
                        </h1>
                        <p className="text-muted-foreground text-sm">Design and manage your upcoming class sessions.</p>
                    </div>

                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Search plans..."
                                className="bg-background pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Link href={route('lesson-plans.create')}>
                            <Button className="shrink-0 gap-2">
                                <Plus className="h-4 w-4" /> New Plan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Lesson Plans Grid */}
                {filteredPlans.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPlans.map((plan) => (
                            <Card key={plan.id} className="border-t-primary flex flex-col border-t-4 shadow-sm transition-shadow hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg leading-tight font-bold">{plan.title}</CardTitle>
                                    </div>
                                    <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                                        <Calendar className="h-3 w-3" /> {new Date(plan.date).toLocaleDateString()}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4 text-sm">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                            {plan.subject?.name}
                                        </Badge>
                                        <Badge variant="outline">{plan.classroom?.name}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">Objectives</p>
                                        <p className="text-muted-foreground line-clamp-3">{plan.objectives}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/20 border-t pt-4">
                                    <Link href={route('lesson-plans.show', plan.id)} className="w-full">
                                        <Button variant="ghost" className="text-primary w-full gap-2" size="sm">
                                            <FileText className="h-4 w-4" /> View Full Plan
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="border-muted bg-muted/10 flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                        <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <BookOpen className="text-primary h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight">No Lesson Plans Found</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                            You haven't created any lesson plans yet, or none match your search.
                        </p>
                        <Link href={route('lesson-plans.create')}>
                            <Button className="mt-6 gap-2">
                                <Plus className="h-4 w-4" /> Create Your First Plan
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
