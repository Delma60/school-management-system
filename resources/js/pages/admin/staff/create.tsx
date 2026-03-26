import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save, UserPlus, Briefcase, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateNonAcademicStaff({ roles, type }: any) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role_id: '',
        phone: '',
        department: '',
        base_salary: '',
        joining_date: new Date().toISOString().split('T')[0], // Defaults to today
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("staffs.store"), {
            onSuccess: () => toast.success("Staff member created successfully."),
            onError: () => toast.error("Please check the form for errors.")
        });
    };

    return (
        <AppLayout>
            <Head title="Add Staff Member" />

            <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/staff/others">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Staff Member</h1>
                        <p className="text-sm text-muted-foreground">Register a new administrative or support personnel.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Column 1: Personal Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserPlus className="h-5 w-5 text-primary" />
                                    Personal Details
                                </CardTitle>
                                <CardDescription>Basic contact and identification information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. John Doe"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@school.com"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={errors.email ? 'border-destructive' : ''}
                                    />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+234 800 000 0000"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className={errors.phone ? 'border-destructive' : ''}
                                    />
                                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Column 2: Employment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Briefcase className="h-5 w-5 text-emerald-500" />
                                    Employment Details
                                </CardTitle>
                                <CardDescription>Role, department, and payroll assignments.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role_id">System Role</Label>
                                    <Select value={data.role_id} onValueChange={v => setData('role_id', v)}>
                                        <SelectTrigger className={errors.role_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role: any) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role_id && <p className="text-xs text-destructive">{errors.role_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        placeholder="e.g. Finance, Security, Library"
                                        value={data.department}
                                        onChange={e => setData('department', e.target.value)}
                                        className={errors.department ? 'border-destructive' : ''}
                                    />
                                    {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="base_salary">Base Salary (₦)</Label>
                                        <div className="relative">
                                            <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="base_salary"
                                                type="number"
                                                min="0"
                                                step="1000"
                                                placeholder="150000"
                                                className={`pl-9 ${errors.base_salary ? 'border-destructive' : ''}`}
                                                value={data.base_salary}
                                                onChange={e => setData('base_salary', e.target.value)}
                                            />
                                        </div>
                                        {errors.base_salary && <p className="text-xs text-destructive">{errors.base_salary}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="joining_date">Joining Date</Label>
                                        <Input
                                            id="joining_date"
                                            type="date"
                                            value={data.joining_date}
                                            onChange={e => setData('joining_date', e.target.value)}
                                            className={errors.joining_date ? 'border-destructive' : ''}
                                        />
                                        {errors.joining_date && <p className="text-xs text-destructive">{errors.joining_date}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 border-t pt-6 mt-6">
                        <Button type="button" variant="ghost" asChild>
                            <Link href="/dashboard/staff/others">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Staff Member
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
