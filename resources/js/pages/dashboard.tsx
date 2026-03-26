import { ActivityItem, RecentActivity } from '@/components/activities-board';
import { DailyAttendanceChart } from '@/components/daily-admin-student-attendance-chart';
import { EventCalendarCard, SchoolEvent } from '@/components/event-calendar';
import { Notice, NoticeBoard } from '@/components/notice-board';
import { SocialsCard } from '@/components/socials';
import { StaffStatusCard } from '@/components/staff-status';
import { GlassStatCard } from '@/components/stat-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Clock, GraduationCap, UserCheck, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const stats = [
    {
        title: 'Total Enrollment',
        value: '1,240',
        icon: GraduationCap,
        trend: { value: '+12', isPositive: true },
        desc: 'new admissions this term',
    },
    {
        title: "Today's Attendance",
        value: '94.2%',
        icon: UserCheck,
        trend: { value: '-0.8%', isPositive: false },
        desc: '82 students absent',
    },
    {
        title: 'Fee Collection',
        value: '$128,450',
        icon: Wallet,
        trend: { value: '75%', isPositive: true },
        desc: 'of total term goal reached',
    },
    {
        title: 'Pending Inquiries',
        value: '42',
        icon: Clock,
        trend: { value: '+5', isPositive: true },
        desc: 'awaiting follow-up',
    },
];

const sampleNotices: Notice[] = [
    {
        id: 1,
        title: 'Final Exam Schedule',
        content: 'The final exam schedule for the Spring semester has been posted on the student portal.',
        date: 'Oct 24, 2023',
        type: 'urgent',
        isPinned: true,
    },
    {
        id: 2,
        title: 'Annual Sports Day',
        content: 'Join us for the annual sports meet this Friday at the main stadium.',
        date: 'Oct 26, 2023',
        type: 'event',
    },
    {
        id: 3,
        title: 'Library Maintenance',
        content: 'The library will be closed for maintenance from 2 PM to 5 PM tomorrow.',
        date: 'Oct 25, 2023',
        type: 'info',
    },
];

const activityData: ActivityItem[] = [
    {
        id: 1,
        user: { name: 'Sarah Jenkins', initials: 'SJ' },
        type: 'payment',
        description: 'Paid Grade 10 Tuition Fee ($1,200)',
        timestamp: '2 mins ago',
    },
    {
        id: 2,
        user: { name: 'Admin Michael', initials: 'AM' },
        type: 'security',
        description: 'Logged in from a new IP address (Lagos, NG)',
        timestamp: '15 mins ago',
    },
];

export default function Dashboard(props: { events: SchoolEvent[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-5 p-4">
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <GlassStatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            trend={stat.trend}
                            description={stat.desc}
                        />
                    ))}
                </section>

                <section className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-5">
                        <DailyAttendanceChart data={[]} />
                        <EventCalendarCard events={props.events} />
                        <StaffStatusCard stats={[{}]} />
                    </div>
                    <div className="space-y-5">
                        <NoticeBoard notices={sampleNotices} />
                        <RecentActivity activities={activityData} />
                        <SocialsCard />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
