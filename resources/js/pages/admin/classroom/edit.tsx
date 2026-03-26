import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Save, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function ClassroomEdit({ classroom, teachers }: { classroom: any; teachers: any[] }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: classroom.name || '',
        grade_level: classroom.grade_level || '',
        room_number: classroom.room_number || '',
        capacity: classroom.capacity || 30,
        teacher_id: classroom.teacher_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('classrooms.update', classroom.id), {
            onSuccess: () => toast.success("Successfully updated classroom info")
        });
    };

    return (
        <AppLayout>
            <div className="space-y-6 p-6">
                <Head title={`Edit ${classroom.name}`} />

                <div className="flex items-center gap-4">
                    <Link href={route('classrooms.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Classroom Settings</h1>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Update the section name and physical location of this classroom.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Section Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="grade_level">Grade Level</Label>
                                    <Select value={data.grade_level} onValueChange={(val) => setData('grade_level', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Grade 9">Grade 9</SelectItem>
                                            <SelectItem value="Grade 10">Grade 10</SelectItem>
                                            <SelectItem value="Grade 11">Grade 11</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="room">Room Number</Label>
                                    <Input id="room" value={data.room_number} onChange={(e) => setData('room_number', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Student Capacity</Label>
                                    <Input id="capacity" type="number" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} />
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <Label>Assigned Teacher (Advisor)</Label>
                                <Select value={data.teacher_id?.toString()} onValueChange={(val) => setData('teacher_id', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Assign a teacher" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 flex items-center justify-between py-3">
                            <p className="text-muted-foreground text-xs">Last updated {new Date(classroom.updated_at).toLocaleDateString()}</p>
                            <Button type="submit" disabled={processing} className="gap-2">
                                <Save className="h-4 w-4" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-destructive flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" /> Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Deleting this classroom will unassign all {classroom.students_count} students. This action cannot be undone.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 className="h-4 w-4" /> Archive Classroom
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
