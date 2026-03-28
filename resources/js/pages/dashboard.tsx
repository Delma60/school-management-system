import { RecentActivity } from '@/components/activities-board';
import { Can } from '@/components/Can';
import { DailyAttendanceChart } from '@/components/daily-admin-student-attendance-chart';
import { EventCalendarCard } from '@/components/event-calendar';
import { NoticeBoard } from '@/components/notice-board';
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

export default function Dashboard(props: any) {
    const role = props.auth.user.role.name;
    
    const params = props?.[role]
    console.log(params, props, role)
    // Map the real backend data to your specific stat card format
    const adminStats = [
        {
            title: 'Total Enrollment',
            value: params?.overviewStats.admin?.enrollment?.value || '0',
            icon: GraduationCap,
            trend: params?.overviewStats.admin?.enrollment?.trend || { value: '0', isPositive: true },
            desc: 'new admissions this term',
        },
        {
            title: "Today's Attendance",
            value: params?.overviewStats.admin?.attendance?.value || '0%',
            icon: UserCheck,
            trend: params?.overviewStats.admin?.attendance?.trend || { value: '0%', isPositive: true },
            desc: params?.overviewStats.admin?.attendance?.desc || 'students absent',
        },
        {
            title: 'Fee Collection',
            value: params?.overviewStats.admin?.revenue?.value || '₦0',
            icon: Wallet,
            trend: params?.overviewStats.admin?.revenue?.trend || { value: '0%', isPositive: true },
            desc: 'of total term goal reached',
        },
        {
            title: 'Pending Inquiries', // Or active staff, depending on your DB
            value: params?.overviewStats.admin?.inquiries?.value || '0',
            icon: Clock,
            trend: params?.overviewStats.admin?.inquiries?.trend || { value: '0', isPositive: true },
            desc: 'awaiting follow-up',
        },
    ];

    const teacherStats = [
        {
            title: 'Total Classes',
            value: params?.overviewStats?.enrollment?.value || '0',
            icon: GraduationCap,
            // trend: params?.overviewStats?.enrollment?.trend || { value: '0', isPositive: true },
            desc: 'new admissions this term',
        },
        {
            title: "Today's Attendance",
            value: params?.overviewStats?.attendance?.value || '0%',
            icon: UserCheck,
            trend: params?.overviewStats?.attendance?.trend || { value: '0%', isPositive: true },
            desc: params?.overviewStats?.attendance?.desc || 'students absent',
        },
        {
            title: 'Fee Collection',
            value: params?.overviewStats?.revenue?.value || '₦0',
            icon: Wallet,
            trend: params?.overviewStats?.revenue?.trend || { value: '0%', isPositive: true },
            desc: 'of total term goal reached',
        },
        {
            title: 'Pending Inquiries', // Or active staff, depending on your DB
            value: params?.overviewStats?.inquiries?.value || '0',
            icon: Clock,
            trend: params?.overviewStats?.inquiries?.trend || { value: '0', isPositive: true },
            desc: 'awaiting follow-up',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* <Can notRole={['student', 'teacher']}> */}
            <div className="space-y-5 p-4">
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Can notRole={['student', 'teacher']}>
                        
                        {adminStats.map((stat, index) => (
                            <GlassStatCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                trend={stat.trend}
                                description={stat.desc}
                            />
                        ))}
                    </Can>

                    <Can role={['teacher']}>
                        {teacherStats.map((stat, index) => (
                            <GlassStatCard
                                key={index}
                                title={stat.title}
                                value={stat.value}
                                icon={stat.icon}
                                trend={stat.trend}
                                description={stat.desc}
                            />
                        ))}
                    </Can>
                </section>

                <section className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-5">
                        <div className="">
                            <DailyAttendanceChart data={params?.attendanceChartData || []} />
                        </div>
                        <EventCalendarCard events={params?.events || []} />
                        <StaffStatusCard stats={params?.staffStatusData || []} />
                    </div>
                    <div className="space-y-5">
                        <NoticeBoard notices={params?.notices || []} />
                        <RecentActivity activities={params?.activities || []} />
                        <SocialsCard />
                    </div>
                </section>
            </div>
            {/* </Can> */}
        </AppLayout>
    );
}
