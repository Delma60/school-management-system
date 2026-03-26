import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, CircleDashed, Clock, GraduationCap, Users } from 'lucide-react';
import React from 'react';

export default function ShowFeeStructure({ fee, stats }: { fee: any, stats: any }) {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    return (
        <AppLayout>
            <Head title={`${fee.name} - Details`} />
            {JSON.stringify(fee.classroom_fee)}

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('fees.index')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">{fee.name}</h1>
                                <Badge variant={fee.status === 'active' ? 'default' : 'secondary'}>
                                    {fee.status.toUpperCase()}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                {fee.academic_session} • {fee.term} • Base Amount: {formatCurrency(fee.amount)}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('fees.edit', fee.id)}>Edit Fee</Link>
                        </Button>
                    </div>
                </div>

                {fee.meta?.description && (
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6 text-sm text-muted-foreground">
                            {fee.meta.description}
                        </CardContent>
                    </Card>
                )}

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
                            <CircleDashed className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.expected)}</div>
                            <p className="text-xs text-muted-foreground mt-1">From {fee.student_fees?.length || 0} students</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(stats.collected)}
                            </div>
                            <Progress value={stats.collection_rate} className="mt-2 h-2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {formatCurrency(stats.outstanding)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Pending payments</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.collection_rate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Of total expected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Assignments */}
                <Tabs defaultValue="students" className="w-full">
                    <TabsList>
                        <TabsTrigger value="students" className="gap-2">
                            <Users className="h-4 w-4" /> Assigned Students
                        </TabsTrigger>
                        <TabsTrigger value="classes" className="gap-2">
                            <GraduationCap className="h-4 w-4" /> Assigned Classes
                        </TabsTrigger>
                    </TabsList>

                    {/* Students Tab */}
                    <TabsContent value="students" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student Payment Status</CardTitle>
                                <CardDescription>View all students assigned to this fee and their individual payment progress.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {fee.student_fees && fee.student_fees.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student Name</TableHead>
                                                <TableHead>Amount Due</TableHead>
                                                <TableHead>Amount Paid</TableHead>
                                                <TableHead>Balance</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fee.student_fees.map((sf: any) => {
                                                const balance = parseFloat(sf.amount_due) - parseFloat(sf.amount_paid);
                                                return (
                                                    <TableRow key={sf.id}>
                                                        <TableCell className="font-medium">
                                                            {sf.student?.name} {sf.student?.last_name}
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(sf.amount_due)}</TableCell>
                                                        <TableCell className="text-emerald-600 dark:text-emerald-400">
                                                            {formatCurrency(sf.amount_paid)}
                                                        </TableCell>
                                                        <TableCell className="text-amber-600 dark:text-amber-400">
                                                            {formatCurrency(balance)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {balance <= 0 ? (
                                                                <Badge className="bg-emerald-500 hover:bg-emerald-600">Paid</Badge>
                                                            ) : sf.amount_paid > 0 ? (
                                                                <Badge variant="outline" className="text-amber-600 border-amber-600">Partial</Badge>
                                                            ) : (
                                                                <Badge variant="destructive">Unpaid</Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No students have been assigned to this fee yet.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Classes Tab */}
                    <TabsContent value="classes" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Classrooms</CardTitle>
                                <CardDescription>Classes where every student is automatically billed for this fee.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {fee.classroom_fees && fee.classroom_fees.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Class Name</TableHead>
                                                <TableHead>Grade Level</TableHead>
                                                <TableHead>Assigned On</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fee.classroom_fees.map((cf: any) => (
                                                <TableRow key={cf.id}>
                                                    <TableCell className="font-medium">{cf.classroom?.name}</TableCell>
                                                    <TableCell>{cf.classroom?.grade_level}</TableCell>
                                                    <TableCell>{new Date(cf.created_at).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No specific classes have been bulk-assigned to this fee.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
