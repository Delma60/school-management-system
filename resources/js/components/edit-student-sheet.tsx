import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Classroom, Student } from '@/types';
import { useForm } from '@inertiajs/react';
// import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Props {
    student: Student;
    classrooms: Classroom[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditStudentSheet({ student, classrooms, open, onOpenChange }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: student.name,
        email: student.email,
        classroom_id: student.classroom_id?.toString() || '',
        phone: student.meta?.phone || '',
        dob: student.meta?.dob || '',
        parent_name: student.meta?.parent_name || '',
        medical_notes: student.meta?.medical_notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('students.update', student.id), {
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Profile updated successfully');
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-[500px]">
                <form onSubmit={submit} className="space-y-6">
                    <SheetHeader>
                        <SheetTitle>Edit Student Profile</SheetTitle>
                        <SheetDescription>Update personal details and academic assignment.</SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input type="date" value={data.dob} onChange={(e) => setData('dob', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="classroom">Assigned Classroom</Label>
                            <Select value={data.classroom_id} onValueChange={(val) => setData('classroom_id', val === 'unassigned' ? '' : val)}>
                                <SelectTrigger className={errors.classroom_id ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Not Assigned</SelectItem>
                                    {classrooms?.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                            {cls.name} ({cls.grade_level})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.classroom_id && <p className="text-destructive text-xs">{errors.classroom_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Parent/Guardian Name</Label>
                            <Input value={data.parent_name} onChange={(e) => setData('parent_name', e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Medical Notes</Label>
                            <Textarea className="h-20" value={data.medical_notes} onChange={(e) => setData('medical_notes', e.target.value)} />
                        </div>
                    </div>

                    <SheetFooter>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
