// import { RecentActivity } from '@/components/activities-board';
// import { Can } from '@/components/Can';
// import { DailyAttendanceChart } from '@/components/daily-admin-student-attendance-chart';
// import { EventCalendarCard } from '@/components/event-calendar';
// import { NoticeBoard } from '@/components/notice-board';
// import { SocialsCard } from '@/components/socials';
// import { StaffStatusCard } from '@/components/staff-status';
// import { GlassStatCard } from '@/components/stat-card';

// import { Clock, GraduationCap, UserCheck, Wallet } from 'lucide-react';

// const AdminDashboard = (params) => {

//     return (
//         <div>
//             <div className="space-y-5 p-4">
//                 <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <Can notRole={['student', 'teacher']}>

//                     </Can>
//                 </section>

//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

import { RecentActivity } from '@/components/activities-board';
import { DailyAttendanceChart } from '@/components/daily-admin-student-attendance-chart';
import { EventCalendarCard } from '@/components/event-calendar';
import { NoticeBoard } from '@/components/notice-board';
import { SocialsCard } from '@/components/socials';
import { StaffStatusCard } from '@/components/staff-status';
import { GlassStatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, GraduationCap, UserCheck, Wallet } from 'lucide-react';

interface AdminProps {
    admin: {
        overviewStats: {
            total_students: number;
            total_staff: number;
            monthly_revenue: number;
            attendance_rate: number;
        };
        revenueData: { name: string; total: number }[];
        recentActivities: {
            id: number;
            user: { name: string; initials: string };
            action: string;
            timestamp: string;
            type: string;
        }[];
        recentPayments: {
            id: number;
            student: string;
            amount: number;
            reference: string;
            date: string;
            status: string;
        }[];
        events: any[];
    };
}

export default function AdminDashboardView({ admin }: AdminProps) {
    // Format currency properly

    const adminStats = [
        {
            title: 'Total Enrollment',
            value: admin?.overviewStats?.enrollment?.value || '0',
            icon: GraduationCap,
            trend: admin?.overviewStats?.enrollment?.trend || { value: '0', isPositive: true },
            desc: 'new admissions this term',
        },
        {
            title: "Today's Attendance",
            value: admin?.overviewStats?.attendance?.value || '0%',
            icon: UserCheck,
            trend: admin?.overviewStats?.attendance?.trend || { value: '0%', isPositive: true },
            desc: admin?.overviewStats?.attendance?.desc || 'students absent',
        },
        {
            title: 'Fee Collection',
            value: admin?.overviewStats?.revenue?.value || '₦0',
            icon: Wallet,
            trend: admin?.overviewStats?.revenue?.trend || { value: '0%', isPositive: true },
            desc: 'of total term goal reached',
        },
        {
            title: 'Pending Inquiries', // Or active staff, depending on your DB
            value: admin?.overviewStats?.inquiries?.value || '0',
            icon: Clock,
            trend: admin?.overviewStats?.inquiries?.trend || { value: '0', isPositive: true },
            desc: 'awaiting follow-up',
        },
    ];

    const getPaymentBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'successful':
                return <Badge className="border-none bg-green-100 text-green-800">Paid</Badge>;
            case 'pending':
                return <Badge className="border-none bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'failed':
                return <Badge className="border-none bg-red-100 text-red-800">Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Portal</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Generate Report</Button>
                </div>
            </div>

            {/* --- 1. Top Overview Stats --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {adminStats.map((stat, index) => (
                    <GlassStatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} trend={stat.trend} description={stat.desc} />
                ))}
            </div>
            <section className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-5">
                    <div className="">
                        <DailyAttendanceChart data={admin?.attendanceChartData || []} />
                    </div>
                    <StaffStatusCard stats={admin?.staffStatusData || []} />

                    <EventCalendarCard events={admin?.events || []} />
                </div>
                <div className="space-y-5">
                    {/* Teacher Only Action Items */}

                    {/* Noticeboard (Everyone sees this) */}
                    <NoticeBoard notices={admin?.notices || []} />

                    {/* Admin Only Activity Board */}
                    <RecentActivity activities={admin?.activities || []} />

                    <SocialsCard />
                </div>
            </section>
        </div>
    );
}
