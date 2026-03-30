import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Users, BookOpen, Bell, AlertCircle, CheckCircle,
    Calendar, Clock, MapPin, FileText, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- TypeScript Interfaces based on our Backend Data ---
interface TeacherProps {
    teacher: {
        overviewStats: {
            classes_today: number;
            total_students: number;
            pending_tasks: number;
            unread_notices: number;
        };
        events: any[];
        todaySchedule: {
            id: number;
            subject: string;
            class_group: string;
            time: string;
            room: string;
            status: 'upcoming' | 'ongoing' | 'completed';
        }[];
        actionItems: {
            id: string;
            title: string;
            type: string;
            is_urgent: boolean;
            link: string;
        }[];
        formClassAttendance: {
            id: number;
            name: string;
            total_students: number;
            present_today: number;
            attendance_percentage: number;
        }[];
        recentLeaves: {
            id: number;
            type: string;
            date_range: string;
            status: 'pending' | 'approved' | 'rejected';
            days: number;
        }[];
        notices: {
            id: number;
            title: string;
            content: string;
            date: string;
            type: string;
            isPinned: boolean;
        }[];
    }
}

export default function TeacherDashboardView({ teacher }: TeacherProps) {
    // Helper functions for UI styling
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ongoing': return <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">Ongoing</Badge>;
            case 'completed': return <Badge variant="secondary">Completed</Badge>;
            default: return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Upcoming</Badge>;
        }
    };

    const getLeaveBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Approved</Badge>;
            case 'rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Rejected</Badge>;
            default: return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Pending</Badge>;
        }
    };

    const getAttendanceColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button>Download Timetable</Button>
                </div>
            </div>

            {/* --- 1. Top Overview Stats --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacher.overviewStats.classes_today}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacher.overviewStats.total_students}</div>
                        <p className="text-xs text-muted-foreground">Across assigned classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacher.overviewStats.pending_tasks}</div>
                        <p className="text-xs text-red-500 font-medium">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">School Notices</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacher.overviewStats.unread_notices}</div>
                        <p className="text-xs text-muted-foreground">Active announcements</p>
                    </CardContent>
                </Card>
            </div>

            {/* --- 2. Middle Row: Schedule & Actions --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Today's Schedule (Takes up 4 columns) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription>Your timetable for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                                {teacher.todaySchedule.length === 0 ? (
                                    <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        No classes scheduled for today. Enjoy your day!
                                    </div>
                                ) : (
                                    teacher.todaySchedule.map((slot) => (
                                        <div key={slot.id} className={`flex items-start justify-between p-4 border rounded-lg transition-colors ${slot.status === 'ongoing' ? 'bg-blue-50/50 border-blue-200' : ''}`}>
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    {slot.subject} - {slot.class_group}
                                                </h4>
                                                <div className="flex items-center text-xs text-muted-foreground gap-4">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {slot.time}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {slot.room}</span>
                                                </div>
                                            </div>
                                            <div>{getStatusBadge(slot.status)}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Priority Action Items (Takes up 3 columns) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Priority Tasks</CardTitle>
                        <CardDescription>Generated based on your schedule</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {teacher.actionItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground">You're all caught up!</p>
                            ) : (
                                teacher.actionItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {item.is_urgent ? <AlertCircle className="text-red-500 w-5 h-5" /> : <Activity className="text-blue-500 w-5 h-5" />}
                                            <span className="text-sm font-medium">{item.title}</span>
                                        </div>
                                        <Button size="sm" variant={item.is_urgent ? "destructive" : "default"} asChild>
                                            <Link href={item.link}>Action</Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- 3. Bottom Row: Homeroom, Leaves, Notices --- */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                {/* Form Class / Homeroom Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Homeroom Attendance</CardTitle>
                        <CardDescription>Live stats for classes you manage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {teacher.formClassAttendance.length === 0 ? (
                            <p className="text-sm text-muted-foreground">You are not assigned as a form teacher for any class.</p>
                        ) : (
                            teacher.formClassAttendance.map((cls) => (
                                <div key={cls.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold">{cls.name}</span>
                                        <span className="text-muted-foreground">{cls.present_today} / {cls.total_students} Present</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Progress value={cls.attendance_percentage} className={`h-2 ${getAttendanceColor(cls.attendance_percentage)}`} />
                                        <span className="text-xs font-bold w-9">{cls.attendance_percentage}%</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* My Leave Requests */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {teacher.recentLeaves.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent leave requests.</p>
                        ) : (
                            teacher.recentLeaves.map((leave) => (
                                <div key={leave.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium">{leave.type}</p>
                                        <p className="text-xs text-muted-foreground">{leave.date_range} ({leave.days} day{leave.days > 1 ? 's' : ''})</p>
                                    </div>
                                    {getLeaveBadge(leave.status)}
                                </div>
                            ))
                        )}
                        <Button variant="outline" className="w-full mt-2">Apply for Leave</Button>
                    </CardContent>
                </Card>

                {/* School Notices */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Notice Board</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {teacher.notices.map((notice) => (
                            <div key={notice.id} className="space-y-1 p-3 bg-secondary/20 rounded-lg relative overflow-hidden">
                                {notice.isPinned && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                <div className="flex justify-between items-start">
                                    <h5 className="text-sm font-bold flex items-center gap-2">
                                        {notice.isPinned && <MapPin className="w-3 h-3 text-primary" />}
                                        {notice.title}
                                    </h5>
                                    <span className="text-[10px] text-muted-foreground">{notice.date}</span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{notice.content}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
