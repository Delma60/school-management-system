import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Banknote, CalendarDays, CreditCard, FileText, Hash, Loader2, Save, User } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function RecordPayment({ students = [], feeTypes = [] }: { students: any[], feeTypes: any[] }) {
    // State to hold the selected fee's details for UI calculation purposes
    const [selectedFeeAmount, setSelectedFeeAmount] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        fee_type_id: '',
        amount: '',
        payment_method: 'bank_transfer',
        payment_date: new Date().toISOString().split('T')[0], // Defaults to today
        transaction_reference: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: () => toast.success('Payment recorded successfully.'),
        });
    };

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    // Handle fee selection to auto-fill or suggest an amount
    const handleFeeSelection = (feeId: string) => {
        setData('fee_type_id', feeId);
        const fee = feeTypes.find(f => f.id.toString() === feeId);
        if (fee) {
            setSelectedFeeAmount(parseFloat(fee.amount));
        } else {
            setSelectedFeeAmount(null);
        }
    };

    return (
        <AppLayout>
            <Head title="Record Payment" />

            <div className="space-y-6 p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('fees.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Record Payment</h1>
                        <p className="text-muted-foreground text-sm">Log a manual transaction for a student's fee.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Left Column: Payer & Fee Selection */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="text-primary h-5 w-5" />
                                        Payment Details
                                    </CardTitle>
                                    <CardDescription>Select the student and the fee structure they are paying for.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="student_id">Select Student</Label>
                                        <Select value={data.student_id} onValueChange={(val) => setData('student_id', val)}>
                                            <SelectTrigger className={errors.student_id ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Search or select a student..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {students.map((student) => (
                                                    <SelectItem key={student.id} value={student.id.toString()}>
                                                        {student.first_name} {student.last_name} {student.admission_number ? `(${student.admission_number})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.student_id && <p className="text-destructive text-xs">{errors.student_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="fee_type_id">Fee Structure</Label>
                                            {selectedFeeAmount !== null && (
                                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                    Base: {formatCurrency(selectedFeeAmount)}
                                                </span>
                                            )}
                                        </div>
                                        <Select value={data.fee_type_id} onValueChange={handleFeeSelection}>
                                            <SelectTrigger className={errors.fee_type_id ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select the fee being paid..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {feeTypes.map((fee) => (
                                                    <SelectItem key={fee.id} value={fee.id.toString()}>
                                                        {fee.name} ({fee.academic_session} - {fee.term})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.fee_type_id && <p className="text-destructive text-xs">{errors.fee_type_id}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount Paid (₦)</Label>
                                            <div className="relative">
                                                <Banknote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    placeholder="0.00"
                                                    className={`pl-9 ${errors.amount ? 'border-destructive' : ''}`}
                                                    value={data.amount}
                                                    onChange={(e) => setData('amount', e.target.value)}
                                                />
                                            </div>
                                            {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="payment_date">Date of Payment</Label>
                                            <div className="relative">
                                                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="payment_date"
                                                    type="date"
                                                    className={`pl-9 ${errors.payment_date ? 'border-destructive' : ''}`}
                                                    value={data.payment_date}
                                                    onChange={(e) => setData('payment_date', e.target.value)}
                                                />
                                            </div>
                                            {errors.payment_date && <p className="text-destructive text-xs">{errors.payment_date}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Transaction Meta */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CreditCard className="text-blue-500 h-5 w-5" />
                                        Transaction Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_method">Payment Method</Label>
                                        <Select value={data.payment_method} onValueChange={(val) => setData('payment_method', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="pos">POS / Card</SelectItem>
                                                <SelectItem value="cheque">Cheque</SelectItem>
                                                <SelectItem value="online">Online Gateway</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.payment_method && <p className="text-destructive text-xs">{errors.payment_method}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transaction_reference">Reference / Receipt No.</Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="transaction_reference"
                                                placeholder="e.g. TRx-987654321"
                                                className={`pl-9 ${errors.transaction_reference ? 'border-destructive' : ''}`}
                                                value={data.transaction_reference}
                                                onChange={(e) => setData('transaction_reference', e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Optional: Enter bank teller or receipt number.</p>
                                        {errors.transaction_reference && <p className="text-destructive text-xs">{errors.transaction_reference}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes" className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" /> Remarks (Optional)
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any internal notes about this payment..."
                                            className="resize-none h-24"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 border-t pt-6 mt-6">
                        <Button type="button" variant="ghost" asChild>
                            <Link href={route('fees.index')}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Record Payment
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
