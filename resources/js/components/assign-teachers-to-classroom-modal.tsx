import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Classroom, Teacher } from '@/types'; // Adjust imports based on your types
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroom: Classroom;
    teachers: Teacher[]; // Pass the list of teachers here
}

export function AssignTeacherModal({ open, onOpenChange, classroom, teachers }: Props) {
    // Initialize form with the current teacher's ID if one exists
    const { data, setData, put, processing, reset, errors } = useForm({
        teacher_id: classroom.teacher?.id?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Assuming your update route handles the teacher_id
        put(route('classrooms.update', classroom.id), {
            onSuccess: () => {
                toast.success('Class advisor updated successfully.');
                onOpenChange(false);
            },
            onError: () => {
                toast.error('Failed to assign teacher. Please check your inputs.');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) reset(); // Reset form when closed
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Assign Class Advisor</DialogTitle>
                        <DialogDescription>
                            Select a teacher to manage <strong>{classroom.name}</strong>. This will replace the current teacher if one is already assigned.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="teacher">Select Teacher</Label>
                            <Select
                                value={data.teacher_id}
                                onValueChange={(value) => setData('teacher_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a teacher..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers && teachers.length > 0 ? (
                                        teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                {teacher.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="none" disabled>No teachers available</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.teacher_id && <p className="text-sm text-destructive">{errors.teacher_id}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Assignment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
