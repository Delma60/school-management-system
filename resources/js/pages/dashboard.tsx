import { Can } from '@/components/Can';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AdminDashboardView from './admin-dashboard';
import TeacherDashboardView from './teacher-dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Dashboard(props: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Can role={['teacher']}>
                <TeacherDashboardView teacher={props.teacher} />
            </Can>

            <Can notRole={['teacher', 'student']}>
                <AdminDashboardView {...props} />
            </Can>
        </AppLayout>
    );
}
