import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Teacher } from '@/types';
import { useForm } from '@inertiajs/react';
import { Loader2, Save, UserCheck, Wallet } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface Props {
    teacher: Teacher;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditTeacherSheet({ teacher, open, onOpenChange }: Props) {
    // We initialize the form with the teacher's current data
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: teacher.name,
        email: teacher.email,
        // Extracting from the meta JSON column
        department: (teacher.meta?.department as string) || '',
        designation: (teacher.meta?.designation as string) || 'Lecturer',
        office: (teacher.meta?.office as string) || '',
        joining_date: (teacher.meta?.joining_date as string) || '',
        base_salary: (teacher.meta?.base_salary as string) || ""
    });

    // Sync form if the teacher prop changes (e.g., if another teacher is selected)
    useEffect(() => {
        if (open) {
            setData({
                name: teacher.name,
                email: teacher.email,
                department: (teacher.meta?.department as string) || '',
                designation: (teacher.meta?.designation as string) || 'Lecturer',
                office: (teacher.meta?.office as string) || '',
                joining_date: (teacher.meta?.joining_date as string) || '',
                base_salary: (teacher.meta?.base_salary as string) || '',
            });
        }
    }, [teacher, open]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('teachers.update', teacher.id), {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Teacher profile updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update profile. Please check the form for errors.');
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <form onSubmit={submit} className="space-y-6">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <UserCheck className="text-primary h-5 w-5" />
                            Edit Faculty Profile
                        </SheetTitle>
                        <SheetDescription>Update personal details and departmental assignments for {teacher.name}.</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Full Name</Label>
                            <Input id="edit-name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input id="edit-email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={data.department} onValueChange={(val) => setData('department', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Designation</Label>
                                <Select value={data.designation} onValueChange={(val) => setData('designation', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Head of Dept">Head of Dept</SelectItem>
                                        <SelectItem value="Senior Teacher">Senior Teacher</SelectItem>
                                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

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
                            <Label htmlFor="edit-office">Office Location</Label>
                            <Input
                                id="edit-office"
                                value={data.office}
                                onChange={(e) => setData('office', e.target.value)}
                                placeholder="e.g. Block B, Room 204"
                            />
                        </div>
                    </div>

                    <SheetFooter className="border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
