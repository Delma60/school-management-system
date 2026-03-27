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

export default function Dashboard({ 
    overviewStats, 
    events, 
    notices, 
    activities, 
    attendanceChartData, 
    staffStatusData 
}: any) {
    
    // Map the real backend data to your specific stat card format
    const stats = [
        {
            title: 'Total Enrollment',
            value: overviewStats?.enrollment?.value || '0',
            icon: GraduationCap,
            trend: overviewStats?.enrollment?.trend || { value: '0', isPositive: true },
            desc: 'new admissions this term',
        },
        {
            title: "Today's Attendance",
            value: overviewStats?.attendance?.value || '0%',
            icon: UserCheck,
            trend: overviewStats?.attendance?.trend || { value: '0%', isPositive: true },
            desc: overviewStats?.attendance?.desc || 'students absent',
        },
        {
            title: 'Fee Collection',
            value: overviewStats?.revenue?.value || '₦0',
            icon: Wallet,
            trend: overviewStats?.revenue?.trend || { value: '0%', isPositive: true },
            desc: 'of total term goal reached',
        },
        {
            title: 'Pending Inquiries', // Or active staff, depending on your DB
            value: overviewStats?.inquiries?.value || '0',
            icon: Clock,
            trend: overviewStats?.inquiries?.trend || { value: '0', isPositive: true },
            desc: 'awaiting follow-up',
        },
    ];

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
                        <div className="">
                        <DailyAttendanceChart data={attendanceChartData || []} />
                        </div>
                        <EventCalendarCard events={events || []} />
                        <StaffStatusCard stats={staffStatusData || []} />
                    </div>
                    <div className="space-y-5">
                        <NoticeBoard notices={notices || []} />
                        <RecentActivity activities={activities || []} />
                        <SocialsCard />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}