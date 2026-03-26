import { AssignSubjectsModal } from '@/components/assign-subject-to-teacher';
import { EditTeacherSheet } from '@/components/edit-teacher-sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Subject, Teacher, TimetableEntry } from '@/types'; // Using your interfaces
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Briefcase, Calendar, Clock, Edit, GraduationCap, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
    teacher: Teacher;
    subjects: Subject[];
    schedule: TimetableEntry[]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']; // Inside TeacherShow component:

export default function TeacherShow({ teacher, subjects, schedule }: Props) {
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    // Safely extract meta data with fallbacks
    const department = (teacher.meta?.department as string) || 'Unassigned Department';
    const designation = (teacher.meta?.designation as string) || 'Faculty Member';
    const joiningDate = (teacher.meta?.joining_date as string) || 'Unknown';
    const office = (teacher.meta?.office as string) || 'Main Staff Room';

    // Format the date nicely
    const formattedDate = new Date(joiningDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title={`${teacher.name} - Profile`} />

                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/staff/teachers">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Faculty Profile</h1>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
                        <Edit className="h-4 w-4" /> Edit Profile
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: The Identity Card (Sticky) */}
                    <div className="space-y-6 lg:col-span-4">
                        <Card className="sticky top-6 overflow-hidden">
                            <div className="bg-primary/10 h-24 w-full" />
                            <CardContent className="px-6 pt-0 pb-6 text-center">
                                <Avatar className="border-background mx-auto -mt-12 h-24 w-24 border-4 shadow-sm">
                                    <AvatarImage src={teacher.avatar} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                        {teacher.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <h2 className="mt-4 text-xl font-bold">{teacher.name}</h2>
                                <p className="text-primary mt-1 text-sm font-medium">{designation}</p>

                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <Badge variant="secondary" className="font-normal">
                                        {department}
                                    </Badge>
                                    {teacher.email_verified_at && (
                                        <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-600">
                                            <ShieldCheck className="h-3 w-3" /> Active
                                        </Badge>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-4 text-left text-sm">
                                    <div className="text-muted-foreground flex items-center gap-3">
                                        <Mail className="text-foreground/70 h-4 w-4" />
                                        <a href={`mailto:${teacher.email}`} className="hover:text-primary transition-colors">
                                            {teacher.email}
                                        </a>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-3">
                                        <Briefcase className="text-foreground/70 h-4 w-4" />
                                        <span>{department} Department</span>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-3">
                                        <MapPin className="text-foreground/70 h-4 w-4" />
                                        <span>Office: {office}</span>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-3">
                                        <Calendar className="text-foreground/70 h-4 w-4" />
                                        <span>Joined {formattedDate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Dynamic Content Tabs */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="subjects" className="w-full">
                            <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="subjects">Assigned Subjects</TabsTrigger>
                                <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
                            </TabsList>
                            {/* Subjects Tab */}
                            <TabsContent value="subjects" className="space-y-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-bold">
                                            <BookOpen className="text-primary h-5 w-5" /> Teaching Load
                                        </h3>
                                        <p className="text-muted-foreground text-sm">Subjects currently assigned to this faculty member.</p>
                                    </div>
                                </div>

                                {!teacher.subjects || teacher.subjects.length === 0 ? (
                                    <Card className="bg-muted/30 border-dashed shadow-none">
                                        <CardContent className="text-muted-foreground flex h-48 flex-col items-center justify-center">
                                            <GraduationCap className="mb-2 h-8 w-8 opacity-50" />
                                            <p>No subjects assigned yet.</p>
                                            <Button variant="link" className="mt-2" onClick={() => setModalOpen(true)}>
                                                Assign a subject
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {teacher.subjects.map((subject: Subject) => (
                                            <Card key={subject.id} className="group hover:border-primary/50 transition-colors">
                                                <CardContent className="p-5">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div>
                                                            <h4 className="text-lg leading-tight font-bold">{subject.name}</h4>
                                                            <p className="text-muted-foreground mt-1 font-mono text-sm">{subject.code}</p>
                                                        </div>
                                                        <Badge variant={subject.type === 'core' ? 'default' : 'secondary'} className="capitalize">
                                                            {subject.type}
                                                        </Badge>
                                                    </div>

                                                    <div className="text-muted-foreground flex items-center gap-4 border-t pt-4 text-sm">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" /> {subject.credits} Credits
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Briefcase className="h-4 w-4" /> {subject.department}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                            {/* Schedule Tab Placeholder */}

                            <TabsContent value="schedule">
                                <Card className="overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-muted/50">
                                                    <th className="text-muted-foreground w-20 border p-2 text-left text-xs font-medium">Time</th>
                                                    {DAYS.map((day) => (
                                                        <th key={day} className="border p-2 text-center text-xs font-bold tracking-wider uppercase">
                                                            {day.substring(0, 3)}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TIMES.map((time) => (
                                                    <tr key={time}>
                                                        <td className="bg-muted/20 border p-2 text-center font-mono text-[10px] font-bold">{time}</td>
                                                        {DAYS.map((day) => {
                                                            const entry = schedule.find(
                                                                (s) => s.day_of_week === day && s.start_time.startsWith(time),
                                                            );

                                                            if (!entry) return <td key={day} className="border bg-slate-50/30 p-1" />;

                                                            const isBreak = entry.entry_type === 'break';
                                                            const color = isBreak ? entry.timebreak?.color || '#cbd5e1' : '#3b82f6';

                                                            return (
                                                                <td key={day} className="min-w-[120px] border p-1">
                                                                    <div
                                                                        className="flex h-full flex-col justify-center rounded border-l-4 p-2 shadow-sm"
                                                                        style={{
                                                                            backgroundColor: `${color}10`,
                                                                            borderColor: color,
                                                                        }}
                                                                    >
                                                                        <span className="truncate text-[10px] font-bold text-slate-900">
                                                                            {isBreak ? entry.timebreak?.name : entry.subject?.name}
                                                                        </span>
                                                                        <div className="mt-1 flex items-center gap-1">
                                                                            <MapPin className="h-3 w-3 opacity-50" />
                                                                            <span className="text-muted-foreground text-[9px] font-medium">
                                                                                {isBreak ? 'School Wide' : `Room ${entry.classroom?.room_number}`}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            <AssignSubjectsModal onOpenChange={setModalOpen} open={modalOpen} allSubjects={subjects} teacher={teacher} />
            <EditTeacherSheet open={open} onOpenChange={setOpen} teacher={teacher} /> {/* Moved outside of main content for better layering */}
        </AppLayout>
    );
}
