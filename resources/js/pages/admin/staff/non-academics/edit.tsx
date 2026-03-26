import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save, UserCheck, Briefcase, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Role, User } from '@/types';

export default function EditStaff({ staff, roles }: { staff:User, roles:Role[] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: staff.name,
        email: staff.email,
        role_id: staff.role_id.toString(),
        phone: staff.meta.phone,
        department: staff.meta.department,
        base_salary: staff.meta.base_salary,
        joining_date: staff.meta.joining_date,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("staff.update", staff), {
            onSuccess: () => toast.success("Changes saved successfully."),
            onError: () => toast.error("Update failed. Please check the form.")
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit - ${staff.name}`} />

            <div className="p-6 space-y-6">

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/staff/others/${staff.id}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Staff Profile</h1>
                        <p className="text-sm text-muted-foreground">Modify employment details for {staff.name}.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserCheck className="h-5 w-5 text-primary" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
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
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Briefcase className="h-5 w-5 text-emerald-500" />
                                    Job & Salary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role_id">System Role</Label>
                                    <Select value={data.role_id} onValueChange={v => setData('role_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role: any) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={data.department}
                                        onChange={e => setData('department', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="base_salary">Salary (₦)</Label>
                                        <div className="relative">
                                            <Wallet className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="base_salary"
                                                type="number"
                                                className="pl-9"
                                                value={data.base_salary}
                                                onChange={e => setData('base_salary', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="joining_date">Joining Date</Label>
                                        <Input
                                            id="joining_date"
                                            type="date"
                                            value={data.joining_date}
                                            onChange={e => setData('joining_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex items-center justify-end gap-4 border-t pt-6">
                        <Button type="button" variant="ghost" asChild>
                            <Link href={`/dashboard/staff/others/${staff.id}`}>Discard Changes</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Update Profile
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
