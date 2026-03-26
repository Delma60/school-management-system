import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { Classroom } from '@/types';
import { toast } from 'sonner';

export default function StudentAdmission({ classrooms }: { classrooms: Classroom[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '', // New Field
        classroom_id: '',
        admission_date: new Date().toISOString().split('T')[0],
        dob: '',
        gender: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '', // New Field
        medical_notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('students.store'), {
            onSuccess:() => {
                reset()
                toast.success("Student admitted successfully")
            }
        });
    };

    return (
        <AppLayout>
            <Head title="New Admission" />
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('students.index')}>
                        <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">New Student Admission</h1>
                        <p className="text-muted-foreground text-sm">Create account and enroll student.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* --- Personal & Account --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal & Account</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <Label>Full Name</Label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Full Name" />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Login Email</Label>
                                <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@school.com" />
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Default Password</Label>
                                <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min 8 chars" />
                                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input type="date" value={data.dob} onChange={e => setData('dob', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select value={data.gender} onValueChange={v => setData('gender', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Academic --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Admission Date</Label>
                                <Input type="date" value={data.admission_date} onChange={e => setData('admission_date', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Assign Classroom</Label>
                                <Select value={data.classroom_id} onValueChange={v => setData('classroom_id', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                                    <SelectContent>
                                        {classrooms.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Guardian & Medical (Full Width) --- */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Guardian & Medical</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Guardian Name</Label>
                                    <Input value={data.parent_name} onChange={e => setData('parent_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Guardian Phone</Label>
                                    <Input value={data.parent_phone} onChange={e => setData('parent_phone', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Guardian Email</Label>
                                    <Input type="email" value={data.parent_email} onChange={e => setData('parent_email', e.target.value)} placeholder="parent@example.com" />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Medical Notes</Label>
                                <Textarea className="h-[185px] resize-none" value={data.medical_notes} onChange={e => setData('medical_notes', e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 flex justify-end gap-4">
                        <Button type="submit" disabled={processing} className="w-full md:w-48">
                            {processing ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Admission
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}