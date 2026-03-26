import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    ShieldCheck,
    Wallet,
    Clock,
    User as UserIcon,
    Trash2
} from 'lucide-react';

export default function ShowStaff({ staff }: any) {
    return (
        <AppLayout>
            <Head title={`${staff.name} - Profile`} />()

            <div className="p-6 space-y-6">
                {/* --- TOP NAVIGATION & ACTIONS --- */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-2">
                        <Link href={route("staffs.others")}>
                            <ArrowLeft className="h-4 w-4" /> Back to Staff
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => router.get(route("staff.edit", staff))}>
                            <Edit className="h-4 w-4" /> Edit Profile
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2">
                            <Trash2 className="h-4 w-4" /> Terminate
                        </Button>
                    </div>
                </div>

                {/* --- PROFILE HEADER --- */}
                <div className="bg-card border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <UserIcon className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{staff.name}</h1>
                            <Badge className="w-fit mx-auto md:mx-0 bg-green-100 text-green-700 hover:bg-green-100 border-none capitalize">
                                {staff.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <ShieldCheck className="h-4 w-4" /> {staff.role} • {staff.department}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-3 text-sm px-4 py-2 bg-muted/50 rounded-lg">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Joined {staff.created_at}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* --- LEFT COLUMN: CONTACT & PERSONAL --- */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Information Details</CardTitle>
                            <CardDescription>Official contact and employment records.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Mail className="h-4 w-4 text-primary" /> {staff.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Phone className="h-4 w-4 text-primary" /> {staff.phone}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Briefcase className="h-4 w-4 text-primary" /> {staff.department}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contract Start Date</span>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Calendar className="h-4 w-4 text-primary" /> {staff.joining_date || 'Not set'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- RIGHT COLUMN: FINANCIAL OVERVIEW --- */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg">Payroll Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <span className="text-xs font-medium text-primary uppercase">Base Monthly Salary</span>
                                <div className="text-2xl font-bold flex items-center gap-1 mt-1">
                                    ₦{Number(staff.base_salary).toLocaleString()}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Wallet className="h-4 w-4" /> Payment Method
                                    </span>
                                    <span className="font-medium">Bank Transfer</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Tax ID</span>
                                    <span className="font-medium">Pending</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-2" size="sm">
                                View Salary History
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
