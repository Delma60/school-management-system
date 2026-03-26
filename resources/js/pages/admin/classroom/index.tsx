import { CreateClassroomModal } from '@/components/create-classroom-modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DoorOpen, GraduationCap, Info, MoreVertical, Plus, Search, Users } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Classes',
        href: '/dashboard',
    },
];

interface Classroom {
    id: number;
    name: string; // e.g., "Grade 10-A"
    grade_level: string;
    room_number: string;
    student_count: number;
    capacity: number;
    teacher_name: string;
}

const Index = (props: { classrooms: Classroom[] }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-4 p-4">
                <div className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
                        <p className="text-muted-foreground">Manage school sections, capacity, and assigned teachers.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(!isModalOpen)} className="gap-2">
                        <Plus className="h-4 w-4" /> Add New Class
                    </Button>
                </div>
                <div className="bg-card flex items-center gap-4 rounded-lg border p-4">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input placeholder="Search by class name or teacher..." className="pl-9" />
                    </div>
                    <Button variant="outline">Filter by Grade</Button>
                </div>

                {props?.classrooms.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {props?.classrooms.map((cls) => {
                            const occupancy = (cls.student_count / cls.capacity) * 100;

                            return (
                                <Card key={cls.id} className="group hover:border-primary/50 shadow-sm transition-all">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="mb-1">
                                                {cls.grade_level}
                                            </Badge>
                                            <CardTitle className="group-hover:text-primary text-xl transition-colors">{cls.name}</CardTitle>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => router.get(route('classrooms.edit', cls.id))}>
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.get(route('classrooms.show', cls.id))}>
                                                    View Students
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Archive Class</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <DoorOpen className="h-4 w-4" />
                                                <span>Room {cls.room_number}</span>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4" />
                                                <span className="truncate">{cls.teacher_name}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {cls.student_count} / {cls.capacity} Students
                                                </span>
                                                <span className={occupancy > 90 ? 'text-destructive' : ''}>{Math.round(occupancy)}% Full</span>
                                            </div>
                                            <Progress value={occupancy} className={cn('h-1.5', occupancy > 90 ? 'bg-destructive/20' : '')} />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="bg-muted/30 flex justify-between pt-4">
                                        <Link href={route('classrooms.show', cls.id)} className="w-full">
                                            <Button variant="secondary" className="w-full text-xs">
                                                Manage Roster
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full py-4">
                        <div className="border-muted bg-muted/10 animate-in fade-in zoom-in flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center duration-300">
                            {/* Visual Icon */}
                            <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                                <DoorOpen className="text-primary h-10 w-10" />
                            </div>

                            {/* Text Content */}
                            <h3 className="text-xl font-bold tracking-tight">No Classrooms Found</h3>
                            <p className="text-muted-foreground mt-2 max-w-[350px] text-sm">
                                Your school structure hasn't been set up yet. Start by creating your first grade level and section (e.g., Grade 10-A).
                            </p>

                            {/* Action Button */}
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button onClick={() => setIsModalOpen(true)} className="shadow-primary/20 gap-2 px-8 shadow-lg">
                                    <Plus className="h-4 w-4" />
                                    Create First Classroom
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    Import from CSV
                                </Button>
                            </div>

                            {/* Helpful Tip */}
                            <Alert className="bg-background/50 mt-12 max-w-md border-none shadow-sm">
                                <Info className="text-primary h-4 w-4" />
                                <AlertTitle className="text-left text-xs font-semibold">Pro Tip</AlertTitle>
                                <AlertDescription className="text-muted-foreground text-left text-[11px] leading-relaxed">
                                    You'll need to assign a <strong>Teacher</strong> to each classroom to enable attendance marking and academic
                                    reporting.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                )}
            </div>
            <CreateClassroomModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </AppLayout>
    );
};

export default Index;
