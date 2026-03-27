import { AcademicsTab } from '@/components/academics-tabs';
import { AttendanceTab } from '@/components/attendance-tab-component';
import { EditStudentSheet } from '@/components/edit-student-sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Classroom, Student } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Banknote, Calendar, Clock, CreditCard, Mail, Phone, Printer, Receipt, TrendingUp, UserCog } from 'lucide-react';
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

                            <TabsContent value="fees" className="space-y-6">
                                {/* Summary Cards */}
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
                                            <Receipt className="text-muted-foreground h-4 w-4" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {formatCurrency(
                                                    student.fees?.reduce((sum: number, fee) => sum + parseFloat(fee.amount_due.toString()), 0) || 0,
                                                )}
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-xs">Across all active fees</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                                            <Banknote className="h-4 w-4 text-emerald-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-emerald-600">
                                                {formatCurrency(
                                                    student.fees?.reduce((sum: number, fee) => sum + parseFloat(fee.amount_paid.toString()), 0) || 0,
                                                )}
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-xs">Total lifetime contributions</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                                            <CreditCard className="h-4 w-4 text-amber-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-amber-600">
                                                {formatCurrency(
                                                    (student.fees?.reduce((sum: number, fee) => sum + parseFloat(fee.amount_due.toString()), 0) ||
                                                        0) -
                                                        (student.fees?.reduce(
                                                            (sum: number, fee) => sum + parseFloat(fee.amount_paid.toString()),
                                                            0,
                                                        ) || 0),
                                                )}
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-xs">Requires attention</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* <div className="flex justify-end">
                                    <Button asChild className="gap-2">
                                        <Link href={route('payments.create', { student_id: student.id,  })}>
                                            <CreditCard className="h-4 w-4" />
                                            Record New Payment
                                        </Link>
                                    </Button>
                                </div> */}

                                {/* Fee Structures Breakdown */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fee Structures & Bills</CardTitle>
                                        <CardDescription>Detailed breakdown of all fees assigned to this student.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {student.fees && student.fees.length > 0 ? (
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Fee Name</TableHead>
                                                            <TableHead>Session/Term</TableHead>
                                                            <TableHead>Amount Due</TableHead>
                                                            <TableHead>Amount Paid</TableHead>
                                                            <TableHead>Balance</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {student.fees.map((fee) => {
                                                            const due = parseFloat(fee.amount_due.toString());
                                                            const paid = parseFloat(fee.amount_paid.toString());
                                                            const balance = due - paid;

                                                            return (
                                                                <TableRow key={fee.id}>
                                                                    <TableCell className="font-medium">{fee.fee_type?.name}</TableCell>
                                                                    <TableCell className="text-muted-foreground text-sm">
                                                                        {fee.fee_type?.academic_session} • {fee.fee_type?.term}
                                                                    </TableCell>
                                                                    <TableCell>{formatCurrency(due)}</TableCell>
                                                                    <TableCell className="font-medium text-emerald-600">
                                                                        {formatCurrency(paid)}
                                                                    </TableCell>
                                                                    <TableCell className="font-medium text-amber-600">
                                                                        {formatCurrency(balance)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {balance <= 0 ? (
                                                                            <Badge className="border-emerald-200 bg-emerald-500/10 text-emerald-600">
                                                                                Paid
                                                                            </Badge>
                                                                        ) : paid > 0 ? (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="border-amber-200 bg-amber-500/10 text-amber-600"
                                                                            >
                                                                                Partial
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge
                                                                                variant="destructive"
                                                                                className="border-red-200 bg-red-500/10 text-red-600"
                                                                            >
                                                                                Unpaid
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {balance > 0 && (
                                                                            <Button asChild variant="outline" size="sm" className="gap-2">
                                                                                <Link
                                                                                    href={route('payments.create', {
                                                                                        student_id: student.id,
                                                                                        fee_type_id: fee.fee_type_id,
                                                                                        amount: balance,
                                                                                    })}
                                                                                >
                                                                                    <CreditCard className="h-4 w-4" />
                                                                                    Pay
                                                                                </Link>
                                                                            </Button>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground py-8 text-center text-sm">
                                                No fees have been assigned to this student yet.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Payment History */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment History</CardTitle>
                                        <CardDescription>Log of all recorded transactions for this student.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {student.payments && student.payments.length > 0 ? (
                                            <div className="rounded-md border">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Reference</TableHead>
                                                            <TableHead>Method</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {student.payments.map((payment) => (
                                                            <TableRow key={payment.id}>
                                                                <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                                                <TableCell className="font-mono text-xs">{payment.transaction_reference}</TableCell>
                                                                <TableCell className="capitalize">
                                                                    {payment.payment_method?.replace('_', ' ')}
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium text-emerald-600">
                                                                    +{formatCurrency(parseFloat(payment.amount.toString()))}
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground py-8 text-center text-sm">
                                                No payments have been recorded for this student.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            <EditStudentSheet open={open} onOpenChange={setOpen} student={student} classrooms={classrooms} />
        </AppLayout>
    );
}
