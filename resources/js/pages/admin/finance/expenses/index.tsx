import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowDownRight, Briefcase, Calendar, Plus, Search, Settings, ShoppingCart, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function ExpensesIndex({ totalExpenses, categoryBreakdown, expenses, currentMonth }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        amount: '',
        category: '',
        expense_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
    };

    const submitExpense = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('expenses.store'), {
            onSuccess: () => {
                toast.success('Expense recorded successfully');
                setIsSheetOpen(false);
                reset();
            },
        });
    };

    const filteredExpenses = expenses?.filter((exp: any) => 
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Helper to render category icons
    const getCategoryIcon = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'utilities': return <Zap className="h-4 w-4 text-amber-500" />;
            case 'maintenance': return <Settings className="h-4 w-4 text-slate-500" />;
            case 'supplies': return <ShoppingCart className="h-4 w-4 text-blue-500" />;
            case 'payroll': return <Briefcase className="h-4 w-4 text-emerald-500" />;
            default: return <ArrowDownRight className="h-4 w-4 text-red-500" />;
        }
    };

    return (
        <AppLayout>
            <Head title="Expenses" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
                        <p className="text-muted-foreground text-sm">Track school expenditures for {currentMonth}.</p>
                    </div>

                    {/* NEW EXPENSE SLIDE-OUT SHEET */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Record Expense
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-md overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Record New Expense</SheetTitle>
                                <SheetDescription>Log money spent by the institution. This will reflect in your financial reports.</SheetDescription>
                            </SheetHeader>
                            <form onSubmit={submitExpense} className="space-y-5 mt-6">
                                <div className="space-y-2">
                                    <Label>Expense Title/Description</Label>
                                    <Input 
                                        placeholder="e.g. Generator Diesel" 
                                        value={data.title} 
                                        onChange={e => setData('title', e.target.value)} 
                                    />
                                    {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount (₦)</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={data.amount} 
                                        onChange={e => setData('amount', e.target.value)} 
                                    />
                                    {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={data.category} onValueChange={v => setData('category', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Maintenance">Maintenance & Repairs</SelectItem>
                                            <SelectItem value="Utilities">Utilities (Light, Water, Internet)</SelectItem>
                                            <SelectItem value="Supplies">School & Office Supplies</SelectItem>
                                            <SelectItem value="Payroll">Payroll / Salary Advances</SelectItem>
                                            <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Date Incurred</Label>
                                    <Input 
                                        type="date" 
                                        value={data.expense_date} 
                                        onChange={e => setData('expense_date', e.target.value)} 
                                    />
                                    {errors.expense_date && <p className="text-destructive text-xs">{errors.expense_date}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Notes (Optional)</Label>
                                    <Textarea 
                                        placeholder="Add receipt numbers or extra details..." 
                                        value={data.notes} 
                                        onChange={e => setData('notes', e.target.value)} 
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    Save Expense Record
                                </Button>
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* STATS CARDS */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Total Month Expenses</CardTitle>
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Utilities</CardTitle>
                            <Zap className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(categoryBreakdown['Utilities'] || 0)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
                            <Settings className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(categoryBreakdown['Maintenance'] || 0)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Supplies & Office</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(categoryBreakdown['Supplies'] || 0)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* EXPENSES TABLE */}
                <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Expense History</CardTitle>
                            <CardDescription>Recent outward cash flow transactions.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search expenses..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredExpenses.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Recorded By</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredExpenses.map((exp: any) => (
                                            <TableRow key={exp.id}>
                                                <TableCell className="whitespace-nowrap text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" /> {exp.date}
                                                </TableCell>
                                                <TableCell className="font-medium">{exp.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="flex w-fit items-center gap-1.5">
                                                        {getCategoryIcon(exp.category)} {exp.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">{exp.recorded_by}</TableCell>
                                                <TableCell className="text-right font-medium text-red-600 dark:text-red-400">
                                                    -{formatCurrency(exp.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <ArrowDownRight className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                <p>No expenses found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}