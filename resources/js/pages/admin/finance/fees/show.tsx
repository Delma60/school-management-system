import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, CircleDashed, Clock, CreditCard, GraduationCap, Mail, MoreHorizontal, Search, Users } from 'lucide-react';
import React, { useState } from 'react';

export default function ShowFeeStructure({ fee, stats }: { fee: any, stats: any }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Format currency to Nigerian Naira

    // Safely get student name (handling both 'name' or 'first_name last_name' conventions)
    const getStudentName = (student: any) => {
        if (!student) return 'Unknown Student';
        if (student.name) return student.name;
        return `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student';
    };

    // Filter students based on search term
    const filteredStudents = fee.student_fees?.filter((sf: any) =>
        getStudentName(sf.student).toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AppLayout>
            <Head title={`${fee.name} - Details`} />

            <div className="space-y-6 p-6">
                {/* 1. Page Header & Actions */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                        <Button variant="ghost" size="icon" className="mt-1" asChild>
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
                            <p className="text-muted-foreground mt-1 text-sm">
                                {fee.academic_session} • {fee.term} • Base Amount: <span className="font-semibold text-foreground">{formatCurrency(fee.amount)}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('fees.edit', fee.id)}>Edit Structure</Link>
                        </Button>
                    </div>
                </div>

                {fee.meta?.description && (
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="pt-6 text-sm text-muted-foreground">
                            <strong>Description:</strong> {fee.meta.description}
                        </CardContent>
                    </Card>
                )}

                {/* 2. Financial Statistics Overview */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            <Progress value={stats.collection_rate} className="mt-2 h-2 [&>div]:bg-emerald-500" />
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
                            <p className="text-xs text-muted-foreground mt-1">Pending collections</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.collection_rate}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Of total expected</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Detailed Data Tabs */}
                <Tabs defaultValue="students" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="students" className="gap-2">
                            <Users className="h-4 w-4" /> Assigned Students
                        </TabsTrigger>
                        <TabsTrigger value="classes" className="gap-2">
                            <GraduationCap className="h-4 w-4" /> Assigned Classes
                        </TabsTrigger>
                    </TabsList>

                    {/* STUDENTS TAB */}
                    <TabsContent value="students" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Student Payment Status</CardTitle>
                                    <CardDescription>Individual tracking of fee compliance.</CardDescription>
                                </div>
                                {/* Search Filter */}
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search students..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredStudents.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Amount Due</TableHead>
                                                    <TableHead>Amount Paid</TableHead>
                                                    <TableHead>Balance</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudents.map((sf: any) => {
                                                    const due = parseFloat(sf.amount_due);
                                                    const paid = parseFloat(sf.amount_paid);
                                                    const balance = due - paid;

                                                    return (
                                                        <TableRow key={sf.id}>
                                                            <TableCell className="font-medium">
                                                                {getStudentName(sf.student)}
                                                            </TableCell>
                                                            <TableCell>{formatCurrency(due)}</TableCell>
                                                            <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                                {formatCurrency(paid)}
                                                            </TableCell>
                                                            <TableCell className="text-amber-600 dark:text-amber-400 font-medium">
                                                                {formatCurrency(balance)}
                                                            </TableCell>
                                                            <TableCell>
                                                                {balance <= 0 ? (
                                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">Fully Paid</Badge>
                                                                ) : paid > 0 ? (
                                                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Partial</Badge>
                                                                ) : (
                                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20">Unpaid</Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuItem onClick={() => router.get(route("payments.create", { student_id: sf.user_id, amount: sf.amount_due, fee_type_id: fee.id }))}>
                                                                            <CreditCard className="mr-2 h-4 w-4" />
                                                                            Record Payment
                                                                        </DropdownMenuItem>
                                                                        {balance > 0 && (
                                                                            <DropdownMenuItem>
                                                                                <Mail className="mr-2 h-4 w-4" />
                                                                                Send Reminder
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem onClick={() => router.get(route("students.show", sf.user_id ))}>View Profile</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                                        <h3 className="text-lg font-medium text-foreground">No students found</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {searchTerm ? 'Try adjusting your search criteria.' : 'No students have been assigned to this fee structure.'}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CLASSES TAB */}
                    <TabsContent value="classes" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Classrooms</CardTitle>
                                <CardDescription>Classrooms where this fee is automatically enforced.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {fee.classroom_fees && fee.classroom_fees.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Class Name</TableHead>
                                                    <TableHead>Total Class Bill</TableHead>
                                                    <TableHead>Assigned On</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {fee.classroom_fees.map((cf: any) => (
                                                    <TableRow key={cf.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                                                {cf.classroom?.name || 'Unknown Class'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(cf.amount_due)}</TableCell>
                                                        <TableCell>{new Date(cf.created_at).toLocaleDateString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                                        <h3 className="text-lg font-medium text-foreground">No classes assigned</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This fee is either assigned to specific students individually or has no assignments yet.
                                        </p>
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

// Add this missing icon at the bottom or import it at the top
function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
