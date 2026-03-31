import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Classroom, Student } from '@/types';
import { useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroom: Classroom;
    availableStudents: Student[];
}

export function AddMultipleStudentsSheet({ open, onOpenChange, classroom, availableStudents }: Props) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        student_ids: [] as string[],
    });

    const filteredStudents = availableStudents.filter(
        (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStudent = (id: string) => {
        const currentIds = [...data.student_ids];
        if (currentIds.includes(id)) {
            setData('student_ids', currentIds.filter(val => val !== id));
        } else {
            setData('student_ids', [...currentIds, id]);
        }
    };

    const toggleAll = () => {
        if (data.student_ids.length === filteredStudents.length) {
            setData('student_ids', []); // Deselect all
        } else {
            setData('student_ids', filteredStudents.map(s => s.id.toString())); // Select all currently filtered
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('classrooms.students.attach', classroom.id), {
            onSuccess: () => {
                toast.success(`${data.student_ids.length} students added successfully.`);
                onOpenChange(false);
            },
            onError: () => toast.error('Failed to add students.'),
            onFinish: () => reset()
        });
    };

    return (
        <Sheet open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) {
                reset();
                setSearch('');
            }
        }}>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <SheetHeader className="pb-4">
                        <SheetTitle>Add Students to {classroom.name}</SheetTitle>
                        <SheetDescription>
                            Select the students you want to enroll in this class.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Sticky Search Bar */}
                    <div className="relative mb-4">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            placeholder="Search available students..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="mb-2 flex items-center justify-between px-1">
                        <span className="text-muted-foreground text-sm">
                            {data.student_ids.length} selected
                        </span>
                        <Button type="button" variant="ghost" size="sm" onClick={toggleAll}>
                            {data.student_ids.length === filteredStudents.length && filteredStudents.length > 0 ? 'Deselect All' : 'Select All Filtered'}
                        </Button>
                    </div>

                    {/* Scrollable Checkbox List */}
                    <ScrollArea className="border-border flex-1 rounded-md border p-2">
                        <div className="flex flex-col gap-1">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <label
                                        key={student.id}
                                        className={`hover:bg-muted flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors ${
                                            data.student_ids.includes(student.id.toString()) ? 'bg-primary/5' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">{student.name}</p>
                                                <p className="text-muted-foreground text-xs">{student.email}</p>
                                            </div>
                                        </div>
                                        <Checkbox
                                            checked={data.student_ids.includes(student.id.toString())}
                                            onCheckedChange={() => toggleStudent(student.id.toString())}
                                        />
                                    </label>
                                ))
                            ) : (
                                <div className="text-muted-foreground py-8 text-center text-sm">
                                    No available students found.
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <SheetFooter className="pt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || data.student_ids.length === 0}>
                            {processing ? 'Adding...' : `Enrol ${data.student_ids.length} Students`}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
