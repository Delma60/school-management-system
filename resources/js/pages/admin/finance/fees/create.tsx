import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Classroom } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Banknote, CalendarDays, Loader2, Save } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function CreateFeeStructure({ classrooms }: { classrooms: Classroom[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        amount: '',
        academic_session: '2025/2026',
        term: 'First Term',
        status: 'active',
        description: '',
        classroom_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('fees.store'), {
            onSuccess: () => toast.success('Fee structure defined successfully.'),
        });
    };

    return (
        <AppLayout>
            <Head title="New Fee Structure" />

            <div className="space-y-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('fees.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Fee Structure</h1>
                        <p className="text-muted-foreground text-sm">Define a new billable item for the academic calendar.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Banknote className="text-primary h-5 w-5" />
                                    Basic Configuration
                                </CardTitle>
                                <CardDescription>Set the name and price for this fee.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Fee Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. JSS1 Tuition Fee"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (₦)</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="50000"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className={errors.amount ? 'border-destructive' : ''}
                                        />
                                        {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Assign Classroom</Label>
                                    <Select value={data.classroom_id} onValueChange={(val) => setData('classroom_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classrooms.map((cls: any) => (
                                                <SelectItem key={cls.id} value={cls.id.toString()}>
                                                    {cls.name} ({cls.grade_level})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.classroom_id && <p className="text-destructive text-xs">{errors.classroom_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Briefly explain what this fee covers..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CalendarDays className="h-5 w-5 text-emerald-500" />
                                    Academic Scheduling
                                </CardTitle>
                                <CardDescription>Determine when this fee is applicable.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Academic Session</Label>
                                    <Select value={data.academic_session} onValueChange={(v) => setData('academic_session', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select session" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024/2025">2024/2025</SelectItem>
                                            <SelectItem value="2025/2026">2025/2026</SelectItem>
                                            <SelectItem value="2026/2027">2026/2027</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Term</Label>
                                    <Select value={data.term} onValueChange={(v) => setData('term', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select term" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="First Term">First Term</SelectItem>
                                            <SelectItem value="Second Term">Second Term</SelectItem>
                                            <SelectItem value="Third Term">Third Term</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="ghost" asChild>
                            <Link href={route('fees.index')}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Create Fee Structure
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
