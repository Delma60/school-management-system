import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowUpRight, Banknote, CheckCircle2, CreditCard, Plus, ReceiptText, Search, TrendingUp, WalletCards } from 'lucide-react';
import { useState } from 'react';

export default function FeeManagement({ stats, feeStructures, recentPayments, defaulters, currentTerm }: any) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDefaulters = defaulters?.filter((d: any) => 
        d.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.fee_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    return (
        <AppLayout>
            <Head title="Fee Management" />

            <div className="space-y-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <WalletCards className="h-4 w-4" /> Academic Term: <span className="text-foreground font-medium">{currentTerm}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        
                        <Button className="gap-2" onClick={() => router.get(route('fees.create'))}>
                            <Plus className="h-4 w-4" /> New Fee Structure
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Total Expected</p>
                                    <p className="text-2xl font-bold">₦{stats.total_expected.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Total Collected</p>
                                    <p className="text-2xl font-bold text-green-600">₦{stats.total_collected.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg bg-green-100 p-2 text-green-700">
                                    <Banknote className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Collection Rate</span>
                                    <span className="font-medium">{stats.collection_rate}%</span>
                                </div>
                                <Progress value={stats.collection_rate} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Outstanding Balance</p>
                                    <p className="text-2xl font-bold text-red-600">₦{stats.total_outstanding.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg bg-red-100 p-2 text-red-700">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="transactions" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                        <TabsTrigger value="structures">Fee Structures</TabsTrigger>
                        <TabsTrigger value="defaulters">Defaulters List</TabsTrigger>
                    </TabsList>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Payments</CardTitle>
                                <CardDescription>Latest fee collections across all classes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Transaction ID</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentPayments.map((payment: any) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-medium text-blue-600">{payment.id}</TableCell>
                                                <TableCell>{payment.student}</TableCell>
                                                <TableCell>{payment.class}</TableCell>
                                                <TableCell>
                                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                        <CreditCard className="h-3 w-3" /> {payment.method}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{payment.date}</TableCell>
                                                <TableCell className="text-right font-medium">₦{payment.amount.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Structures Tab */}
                    <TabsContent value="structures" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Fee Structures</CardTitle>
                                <CardDescription>Defined billable items for the current term.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fee Name</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Assigned Students</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feeStructures.map((fee: any) => (
                                            <TableRow key={fee.id}>
                                                <TableCell className="font-medium">{fee.name}</TableCell>
                                                <TableCell>₦{fee.amount.toLocaleString()}</TableCell>
                                                <TableCell>{fee.assigned_students} students</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                                        {fee.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => router.get(route('fees.show', fee.id))}>
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="defaulters" className="mt-0 space-y-4">
                        <Card className="border-red-100 dark:border-red-900/30">
                            <CardHeader className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-red-400 text-md">
                                        <AlertCircle className="h-5 w-5" /> Action Required: Unpaid Balances
                                    </CardTitle>
                                    <CardDescription>Students with outstanding fees for the current term.</CardDescription>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                    <Input
                                        type="search"
                                        placeholder="Search by student, class, or fee..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredDefaulters.length > 0 ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Class</TableHead>
                                                    <TableHead>Pending Fee</TableHead>
                                                    <TableHead className="text-right">Outstanding Balance</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredDefaulters.map((debt: any) => (
                                                    <TableRow key={debt.id}>
                                                        <TableCell className="font-medium">
                                                            <Link
                                                                href={route('students.show', debt.student_id)}
                                                                className="text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                {debt.student_name}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>{debt.class}</TableCell>
                                                        <TableCell>{debt.fee_name}</TableCell>
                                                        <TableCell className="text-right font-bold text-red-600 dark:text-red-400">
                                                            {formatCurrency(debt.balance)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                asChild
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                            >
                                                                <Link
                                                                    href={route('payments.create', {
                                                                        student_id: debt.student_id,
                                                                        amount: debt.balance,
                                                                        fee_type_id: debt.fee_type_id,
                                                                    })}
                                                                >
                                                                    Collector
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-12 text-center">
                                        <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-500" />
                                        <h3 className="text-foreground text-lg font-medium">Zero Defaulters!</h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {searchTerm ? 'No results found for your search.' : 'All students are fully paid up for this term.'}
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
