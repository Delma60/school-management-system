import { AcademicsTab } from '@/components/academics-tabs';
import { AttendanceTab } from '@/components/attendance-tab-component';
import { EditStudentSheet } from '@/components/edit-student-sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Classroom, Student } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Mail, Phone, Printer, TrendingUp, UserCog } from 'lucide-react';
import { useState } from 'react';

interface Props {
    student: Student;
    attendanceStats: Record<string, string | number>;
    academicData: {
        examMarks?: Array<Record<string, unknown>>;
        totalMarksObtained?: number;
        examsTaken?: number;
        averageScore?: number;
    };
    classrooms: Classroom[];
}
export default function StudentShow({ student, attendanceStats, academicData, classrooms }: Props) {
    // Extracting data from your JSON meta column
    const meta = (student.meta as Record<string, unknown>) || {};
    const [open, setOpen] = useState(false);

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title={`${student.name}'s Profile`} />

                {/* Top Navigation & Actions */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/students">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Printer className="h-4 w-4" /> Print ID Card
                        </Button>
                        <Button className="gap-2" onClick={() => setOpen(true)}>
                            <UserCog className="h-4 w-4" /> Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Identity Card */}
                    <div className="space-y-6 lg:col-span-4">
                        <Card className="border-t-primary overflow-hidden border-t-4">
                            <CardContent className="flex flex-col items-center pt-8 pb-6 text-center">
                                <Avatar className="border-background mb-4 h-24 w-24 border-4 shadow-xl">
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                        {student.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-bold">{student.name}</h2>
                                <p className="text-muted-foreground mt-1 font-mono text-sm">{String(meta?.admission_no) || 'NO-ID-ASSIGNED'}</p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                        Active
                                    </Badge>
                                    <Badge variant="outline">{student.classroom?.name || 'Unassigned'}</Badge>
                                </div>
                            </CardContent>
                            <Separator />
                            <CardContent className="space-y-4 py-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="text-muted-foreground h-4 w-4" />
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="text-muted-foreground h-4 w-4" />
                                    <span>{String(meta?.phone) || 'No phone added'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="text-muted-foreground h-4 w-4" />
                                    <span>Born: {String(meta?.dob) || 'Not set'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guardian Quick Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-muted-foreground text-sm font-semibold uppercase">Guardian Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-muted-foreground text-xs">Primary Contact</p>
                                    <p className="text-sm font-bold">{String(meta?.parent_name) || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Relationship</p>
                                    <p className="text-sm font-medium">{String(meta?.parent_relation) || 'Parent'}</p>
                                </div>
                                <Button variant="secondary" className="h-8 w-full text-xs">
                                    Message Guardian
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Detailed Tabs */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="mb-4 grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="academic">Academics</TabsTrigger>
                                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                                <TabsTrigger value="fees">Finance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Card className="border-blue-100 bg-blue-50/50">
                                        <CardContent className="flex items-center gap-4 pt-6">
                                            <div className="rounded-lg bg-blue-500 p-2">
                                                <TrendingUp className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">Current GPA</p>
                                                <p className="text-2xl font-bold">{String(meta?.current_gpa) || '0.00'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-orange-100 bg-orange-50/50">
                                        <CardContent className="flex items-center gap-4 pt-6">
                                            <div className="rounded-lg bg-orange-500 p-2">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold tracking-wider text-orange-600 uppercase">Attendance</p>
                                                <p className="text-2xl font-bold">{attendanceStats?.percentage || '0'}%</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Medical & Health Notes</CardTitle>
                                        <CardDescription>Confidential information for staff only.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {String(meta?.medical_notes) || 'No specific medical conditions reported by parents.'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="academic">
                                <AcademicsTab academicData={academicData} />
                            </TabsContent>
                            <TabsContent value="attendance">
                                <AttendanceTab
                                    attendanceStats={Object.fromEntries(Object.entries(attendanceStats).map(([k, v]) => [k, String(v)]))}
                                    attendanceData={student?.attendances || []}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            <EditStudentSheet open={open} onOpenChange={setOpen} student={student} classrooms={classrooms} />
        </AppLayout>
    );
}
