import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Banknote,
    CalendarClock,
    Download,
    FileText,
    CheckCircle2,
    Clock,
    Wallet,
    PlusCircle,
    MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

export default function PayrollLeave({ payroll, leaveRequests, stats, currentMonth }: any) {
    return (
        <AppLayout>
            <Head title="Payroll & Leave" />

            <div className="p-6 space-y-6">
                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Staff Operations</h1>
                        <p className="text-sm text-muted-foreground">Manage monthly salaries and attendance exceptions for {currentMonth}.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" /> Export Report
                        </Button>
                    </div>
                </div>

                {/* --- QUICK STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Payout</CardTitle>
                            <Wallet className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{stats.total_payroll}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total for {currentMonth}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Staff on Leave</CardTitle>
                            <CalendarClock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.staff_on_leave}</div>
                            <p className="text-xs text-muted-foreground mt-1">Currently out of office</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_leaves}</div>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="payroll" className="w-full">
                    <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                        <TabsTrigger value="payroll">Monthly Payroll</TabsTrigger>
                        <TabsTrigger value="leave">Leave Requests</TabsTrigger>
                    </TabsList>

                    {/* --- PAYROLL SECTION --- */}
                    <TabsContent value="payroll" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Payroll Directory</CardTitle>
                                    <CardDescription>Salary breakdown and disbursement status.</CardDescription>
                                </div>
                                <Button className="gap-2" onClick={() => router.post(route("payroll.run"), undefined, {
                                    onSuccess: () => toast.success("Payout made")
                                })}>
                                    <Banknote className="h-4 w-4" /> Run Payroll
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Staff Name</TableHead>
                                            <TableHead>Base Salary</TableHead>
                                            <TableHead>Allowances</TableHead>
                                            <TableHead>Net Pay</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payroll.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground">{item.role}</div>
                                                </TableCell>
                                                <TableCell>₦{item.base_salary.toLocaleString()}</TableCell>
                                                <TableCell className="text-green-600">+₦{item.allowances.toLocaleString()}</TableCell>
                                                <TableCell className="font-bold">₦{item.net_pay.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700">Paid</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="gap-2">
                                                        <FileText className="h-4 w-4" /> Payslip
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- LEAVE SECTION --- */}
                    <TabsContent value="leave" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Leave Applications</CardTitle>
                                    <CardDescription>Manage staff absences and leave balances.</CardDescription>
                                </div>
                                <Button variant="outline" className="gap-2">
                                    <PlusCircle className="h-4 w-4" /> New Request
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Staff Member</TableHead>
                                            <TableHead>Leave Type</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Reason</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaveRequests.map((request: any) => (
                                            <TableRow key={request.id}>
                                                <TableCell className="font-medium">{request.staff_name}</TableCell>
                                                <TableCell>{request.type}</TableCell>
                                                <TableCell className="text-sm">
                                                    {request.start_date} <br/>
                                                    <span className="text-muted-foreground text-xs">to {request.end_date}</span>
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate text-sm">
                                                    {request.reason}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize flex w-fit gap-1 items-center">
                                                        <Clock className="h-3 w-3 text-blue-500" /> {request.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">Approve</Button>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
