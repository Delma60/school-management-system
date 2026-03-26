import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    WalletCards,
    TrendingUp,
    AlertCircle,
    Plus,
    ReceiptText,
    CreditCard,
    ArrowUpRight,
    Banknote
} from 'lucide-react';

export default function FeeManagement({ stats, feeStructures, recentPayments, currentTerm }: any) {
    return (
        <AppLayout>
            <Head title="Fee Management" />

            <div className="p-6 space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <WalletCards className="h-4 w-4" /> Academic Term: <span className="font-medium text-foreground">{currentTerm}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <ReceiptText className="h-4 w-4" /> Record Payment
                        </Button>
                        <Button className="gap-2" onClick={() => router.get(route("fees.create"))}>
                            <Plus className="h-4 w-4" /> New Fee Structure
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Total Expected</p>
                                    <p className="text-2xl font-bold">₦{stats.total_expected.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                                    <p className="text-2xl font-bold text-green-600">₦{stats.total_collected.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
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
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
                                    <p className="text-2xl font-bold text-red-600">₦{stats.total_outstanding.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-red-100 text-red-700 rounded-lg">
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
                                                <TableCell className="font-medium text-blue-600">
                                                    {payment.id}
                                                </TableCell>
                                                <TableCell>{payment.student}</TableCell>
                                                <TableCell>{payment.class}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <CreditCard className="h-3 w-3" /> {payment.method}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{payment.date}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    ₦{payment.amount.toLocaleString()}
                                                </TableCell>
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
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                        {fee.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => router.get(route("fees.show", fee.id))}>
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
                </Tabs>

            </div>
        </AppLayout>
    );
}
