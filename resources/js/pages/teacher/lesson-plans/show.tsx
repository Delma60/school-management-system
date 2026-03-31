import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Classroom, Subject } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Edit, MapPin, Printer } from 'lucide-react';

// Define the exact shape of our lesson plan with relationships loaded
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
    lessonPlan: LessonPlan;
}

export default function ShowLessonPlan({ lessonPlan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teacher Dashboard', href: '/dashboard' },
        { title: 'Lesson Plans', href: route('lesson-plans.index') },
        { title: lessonPlan.title, href: '#' },
    ];

    // Simple print handler
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={lessonPlan.title} />

            <div className="space-y-6 p-6">
                {/* Header Actions (Hidden when printing) */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
                    <div className="flex items-center gap-4">
                        <Link href={route('lesson-plans.index')}>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Lesson Plan Overview</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" /> Print Plan
                        </Button>
                        {/* Optional Edit Button for later */}
                        <Link href={route('lesson-plans.edit', lessonPlan.id)}>
                            <Button variant="secondary" className="gap-2">
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* MAIN DOCUMENT CARD */}
                {/* The "print:shadow-none print:border-none" classes ensure it looks like a clean document when printed */}
                <Card className="border-t-primary border-t-8 shadow-sm print:m-0 print:border-none print:shadow-none">
                    <CardContent className="space-y-8 p-8 sm:p-10">
                        {/* Title and Meta Data */}
                        <div className="space-y-4 text-center sm:text-left">
                            <h2 className="text-foreground text-3xl font-extrabold tracking-tight">{lessonPlan.title}</h2>

                            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm sm:justify-start">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="text-primary h-4 w-4" />
                                    <span className="text-foreground font-medium">
                                        {new Date(lessonPlan.date).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <Separator orientation="vertical" className="hidden h-4 sm:block" />
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="text-primary h-4 w-4" />
                                    <Badge variant="secondary" className="font-medium">
                                        {lessonPlan.subject?.name}
                                    </Badge>
                                </div>
                                <Separator orientation="vertical" className="hidden h-4 sm:block" />
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="text-primary h-4 w-4" />
                                    <Badge variant="outline" className="font-medium">
                                        {lessonPlan.classroom?.name}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Separator className="print:block" />

                        {/* Objectives Section */}
                        <section className="space-y-3">
                            <h3 className="text-primary text-lg font-bold tracking-wider uppercase">Learning Objectives</h3>
                            {/* whitespace-pre-wrap preserves the line breaks entered in the textarea */}
                            <div className="bg-muted/30 text-foreground/90 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                                {lessonPlan.objectives || <span className="text-muted-foreground italic">No objectives defined.</span>}
                            </div>
                        </section>

                        {/* Materials Section */}
                        <section className="space-y-3">
                            <h3 className="text-primary text-lg font-bold tracking-wider uppercase">Required Materials</h3>
                            <div className="text-foreground/90 border-primary/30 border-l-2 px-4 leading-relaxed whitespace-pre-wrap">
                                {lessonPlan.materials || <span className="text-muted-foreground italic">No specific materials required.</span>}
                            </div>
                        </section>

                        {/* Procedure/Content Section */}
                        <section className="space-y-3">
                            <h3 className="text-primary text-lg font-bold tracking-wider uppercase">Procedure & Activities</h3>
                            <div className="prose prose-sm sm:prose-base text-foreground/90 max-w-none leading-relaxed whitespace-pre-wrap">
                                {lessonPlan.content || <span className="text-muted-foreground italic">No instructional content defined.</span>}
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
