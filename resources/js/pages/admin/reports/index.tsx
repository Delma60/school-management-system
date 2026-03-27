import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, Banknote, BarChart3, Download, FileText, GraduationCap, Printer, Users, Wallet } from 'lucide-react';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function ReportsDashboard({ financial, chartData, general, currentYear }: any) {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
    };

    // Calculate the highest value in the chart to scale the CSS bars proportionally
    const maxChartValue = Math.max(...chartData.map((d: any) => Math.max(d.income, d.expense))) || 1;

    return (
        <AppLayout>
            <Head title="System Reports" />

            <div className="space-y-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground text-sm">System-wide overview and financial summaries for {currentYear}.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                            <Printer className="h-4 w-4" /> Print
                        </Button>
                        <Button className="gap-2">
                            <Download className="h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="financial" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="financial" className="gap-2">
                            <BarChart3 className="h-4 w-4" /> Financial Overview
                        </TabsTrigger>
                        <TabsTrigger value="academic" className="gap-2">
                            <GraduationCap className="h-4 w-4" /> Academic & Demographics
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="gap-2">
                            <FileText className="h-4 w-4" /> Custom Generator
                        </TabsTrigger>
                    </TabsList>

                    {/* FINANCIAL TAB */}
                    <TabsContent value="financial" className="space-y-6">
                        
                        {/* High-Level Financial Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Gross Income</CardTitle>
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(financial.income)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Total revenue collected</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">{formatCurrency(financial.expenses)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Total outward cash flow</p>
                                </CardContent>
                            </Card>
                            <Card className={financial.net >= 0 ? "bg-emerald-50/50 dark:bg-emerald-950/10" : "bg-red-50/50 dark:bg-red-950/10"}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(financial.net)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Income minus Expenses</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
                                    <Banknote className="h-4 w-4 text-amber-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-amber-600">{formatCurrency(financial.outstanding)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Unpaid student bills</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pure Tailwind CSS Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Income vs Expenses ({currentYear})</CardTitle>
                                <CardDescription>Monthly comparison of revenue and expenditures.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-72 w-full mt-4 flex items-end justify-between gap-2 px-2 pb-6 border-b border-dashed relative">
                                    {/* Chart Legend */}
                                    <div className="absolute top-0 right-4 flex gap-4 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div> 
                                            <span className="text-muted-foreground">Income</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div> 
                                            <span className="text-muted-foreground">Expenses</span>
                                        </div>
                                    </div>

                                    {/* Bars */}
                                    {chartData.map((d: any) => {
                                        const incomeHeight = (d.income / maxChartValue) * 100;
                                        const expenseHeight = (d.expense / maxChartValue) * 100;

                                        return (
                                            <div key={d.name} className="flex flex-col justify-end items-center gap-2 w-full h-full group">
                                                <div className="flex items-end gap-1 w-full h-[200px] relative">
                                                    
                                                    {/* Tooltip on Hover */}
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border shadow-sm rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                                        <div className="text-emerald-500 font-bold">In: {formatCurrency(d.income)}</div>
                                                        <div className="text-red-500 font-bold">Out: {formatCurrency(d.expense)}</div>
                                                    </div>

                                                    {/* Income Bar */}
                                                    <div 
                                                        className="bg-emerald-500 hover:bg-emerald-400 w-1/2 rounded-t-sm transition-all duration-500" 
                                                        style={{ height: `${Math.max(incomeHeight, 2)}%` }} // min 2% to always show a tick
                                                    ></div>
                                                    
                                                    {/* Expense Bar */}
                                                    <div 
                                                        className="bg-red-500 hover:bg-red-400 w-1/2 rounded-t-sm transition-all duration-500" 
                                                        style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-muted-foreground font-medium">{d.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ACADEMIC TAB (Overview) */}
                    <TabsContent value="academic" className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Active Students</CardTitle>
                                    <GraduationCap className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{general.students}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Staff Members</CardTitle>
                                    <Users className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{general.staff}</div>
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="border-dashed bg-muted/20">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <GraduationCap className="h-10 w-10 text-muted-foreground/40 mb-4" />
                                <h3 className="text-lg font-medium">Term Performance Report</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md">
                                    Academic analytics are compiled at the end of the term. Head over to the Examinations module to grade current subjects.
                                </p>
                                <Button variant="outline" asChild>
                                    <a href={route('exams.index')}>Go to Examinations</a>
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CUSTOM GENERATOR TAB */}
                   {/* CUSTOM GENERATOR TAB */}
                    <TabsContent value="custom" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generate Custom Report</CardTitle>
                                <CardDescription>Select parameters to build, filter, and download specific school datasets.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        {/* Report Category */}
                                        <div className="space-y-2">
                                            <Label>Report Category</Label>
                                            <Select defaultValue="finance">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="finance">Financial Transactions</SelectItem>
                                                    <SelectItem value="debtors">Defaulters / Debtors List</SelectItem>
                                                    <SelectItem value="students">Student Enrollment List</SelectItem>
                                                    <SelectItem value="academic">Academic Performance Summaries</SelectItem>
                                                    <SelectItem value="attendance">Student/Staff Attendance</SelectItem>
                                                    <SelectItem value="staff">Staff Directory & Payroll</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Academic Period */}
                                        <div className="space-y-2">
                                            <Label>Academic Session / Term</Label>
                                            <Select defaultValue="current">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select period" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="current">Current Term (Active)</SelectItem>
                                                    <SelectItem value="previous">Previous Term</SelectItem>
                                                    <SelectItem value="year">Full Academic Year</SelectItem>
                                                    <SelectItem value="all">All Time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Date Filters */}
                                        <div className="space-y-2">
                                            <Label>Start Date (Optional)</Label>
                                            <Input type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Date (Optional)</Label>
                                            <Input type="date" />
                                        </div>

                                        {/* Specific Filters */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Additional Options</Label>
                                            <div className="flex flex-wrap gap-6 mt-3">
                                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                                                    <Checkbox defaultChecked /> 
                                                    <span>Include Inactive Students/Staff</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                                                    <Checkbox defaultChecked /> 
                                                    <span>Group records by Classroom</span>
                                                </label>
                                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                                                    <Checkbox /> 
                                                    <span>Include Detailed Notes/Descriptions</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Export Format */}
                                        <div className="space-y-2 mt-2">
                                            <Label>Export Format</Label>
                                            <Select defaultValue="pdf">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select format" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                                                    <SelectItem value="excel">Excel Spreadsheet (.xlsx)</SelectItem>
                                                    <SelectItem value="csv">Comma Separated Values (.csv)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-3 border-t pt-6 mt-6">
                                        <Button type="reset" variant="ghost">Clear Filters</Button>
                                        <Button 
                                            type="button" 
                                            className="gap-2" 
                                            onClick={() => alert('PDF generation process will begin processing. (Requires backend export logic like Laravel Snappy or Excel)')}
                                        >
                                            <Download className="h-4 w-4" /> Generate Report
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}